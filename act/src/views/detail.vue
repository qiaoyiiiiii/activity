<template>
  <div class="activity-detail-container">
    <!-- 活动封面和基本信息 -->
    <div class="activity-header">
      <div class="activity-cover">
        <img :src="activity.coverImage" alt="活动封面" />
        <div class="activity-status">{{ activity.status }}</div>
      </div>

      <div class="activity-info-card">
        <h1 class="activity-title">{{ activity.title }}</h1>

        <div class="activity-meta">
          <div class="meta-item">
            <el-icon><Calendar />报名时间</el-icon>
            <span>{{ activity.startTime }} ~ {{ activity.endTime }}</span>
          </div>

          <div class="meta-item">
            <el-icon><Calendar />活动时间</el-icon>
            <span>{{ activity.runTime }} ~ {{ activity.dieTime }}</span>
          </div>

          <div class="meta-item">
            <el-icon><Location /></el-icon>
            <span>{{ activity.location }}</span>
          </div>

          <div class="meta-item organizer">
            <div class="organizer-avatar">
              <img
                src="https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover"
                alt="主办方"
              />
            </div>
            <span>{{ activity.creatorName }}</span>
          </div>
          <div class="registration-section" v-auth>
            <el-button
              v-if="activity.status === 'pending'"
              :type="isRegistered ? 'danger' : 'success'"
              size="large"
              class="register-button"
              @click="handleRegistration"
              :loading="registrationLoading"
              :disabled="
                activity.maxParticipants <= activity.number && !isRegistered
              "
            >
              {{ isRegistered ? "取消报名" : "我要报名" }}
            </el-button>
            <el-button
              v-if="activity.status === 'published' && isRegistered"
              :type="ischecked ? 'success' : 'info'"
              size="large"
              class="register-button"
              @click.once="handlechecked"
              :loading="checkLoading"
            >
              {{ ischecked ? "签到" : "已签到" }}
            </el-button>
            <div v-if="activity.creatorId === localStorage.getItem('token').id">
              <el-button
                size="large"
                class="register-button"
                @click="$router.push(`/table?id=${activity.id}/check`)"
              >
                获取签到列表
              </el-button>
              <el-button
                size="large"
                class="register-button"
                @click="$router.push(`/table?id=${activity.id}/uncheck`)"
              >
                获取未签到列表
              </el-button>
            </div>
            <div class="stat-item">
              <el-icon><Avatar /></el-icon>
              <span
                >还剩 {{ activity.maxParticipants - activity.number }}名额</span
              >
            </div>
            <div class="stat-item" @click="toggleFavorite">
              <el-icon :class="{ favorited: isFavorited }"><Star /></el-icon>
              <span
                >{{ isFavorited ? "已收藏" : "收藏" }}
                {{ activity.favoriteCount || 0 }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动详情 -->
    <div class="activity-content-section">
      <h2 class="section-title">活动详情</h2>

      <div class="activity-content">
        {{ activity.description }}
      </div>
    </div>

    <!-- 评论区 -->
    <div class="activity-comments-section">
      <h2 class="section-title">活动评论</h2>

      <!-- 评论表单 -->
      <div class="comment-form-container" v-if="isLoggedIn()">
        <div class="comment-form-header">
          <el-avatar :size="40" :src="user.avatar">{{ user.name }}</el-avatar>
          <span class="comment-user-name">{{ user.name }}</span>
        </div>
        <div class="comment-form">
          <div class="rating-container">
            <span class="rating-label">评分：</span>
            <el-rate
              v-model="commentRating"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              :texts="['1星', '2星', '3星', '4星', '5星']"
              show-text
            />
          </div>
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="3"
            placeholder="分享您对这个活动的看法..."
            maxlength="500"
            show-word-limit
          />
          <div class="comment-form-actions">
            <el-button
              type="primary"
              @click="submitComment"
              :loading="commentSubmitting"
              >发表评论</el-button
            >
          </div>
        </div>
      </div>
      <div class="login-to-comment" v-else>
        <el-alert
          title="请先登录后再发表评论"
          type="info"
          :closable="false"
          center
          show-icon
        >
          <template #default>
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/login')"
              >去登录</el-button
            >
          </template>
        </el-alert>
      </div>

      <!-- 评论列表 -->
      <div class="comments-list">
        <div v-if="comments.length === 0" class="no-comments">
          <el-empty description="暂无评论，快来发表第一条评论吧！" />
        </div>
        <div v-else>
          <div
            v-for="(comment, index) in comments"
            :key="comment.id || index"
            class="comment-item"
          >
            <div class="comment-avatar">
              <el-avatar :size="40" :src="comment.avatar">{{
                comment.userName ? comment.userName.charAt(0) : "U"
              }}</el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <div class="comment-user-info">
                  <span class="comment-username">{{ comment.userName }}</span>
                  <el-rate
                    v-if="comment.rating"
                    v-model="comment.rating"
                    disabled
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <span class="action-item">
                  <span class="material-icons" style="font-size: 1em"
                    >thumb_up</span
                  >
                  <span>{{ comment.likes || 0 }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- 评论分页器 -->
          <div class="comments-pagination">
            <el-pagination
              v-if="commentPagination.total > commentPagination.pageSize"
              :current-page="commentPagination.currentPage"
              :page-size="commentPagination.pageSize"
              :total="commentPagination.total"
              layout="prev, pager, next"
              @current-change="handleCommentPageChange"
              hide-on-single-page
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { isLoggedIn } from "./utils/auth";

const proxy = getCurrentInstance();
const activityId = ref(proxy.$route.params.id);

// 活动数据
const activity = ref({});

// 收藏状态
const isFavorited = ref(false);
const favoriteLoading = ref(false);

// 报名状态
const isRegistered = ref(false);
const registrationLoading = ref(false);

//签到状态
const ischecked = ref(false);
const checkLoading = ref(false);

// 评论内容
const commentContent = ref("");
const commentSubmitting = ref(false);
const commentRating = ref(5); // 默认为5星

// 评论列表
const comments = ref([]);

// 评论分页
const commentPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const getComment = () => {
  // 显示加载中状态
  const loading = ElMessage.loading({
    message: "加载评论中...",
    duration: 0,
  });

  proxy.$request
    .get(`/api/activity-reviews/activity/${activityId.value}`, {
      page: commentPagination.currentPage,
      size: commentPagination.pageSize,
    })
    .then((res) => {
      if (res.code === 200) {
        comments.value = res.data.data || [];
        commentPagination.total = res.data.total || 0;
      }
    })
    .catch((error) => {
      console.error("获取评论失败:", error);
      ElMessage.error("获取评论失败，请重试");
    })
    .finally(() => {
      // 关闭加载中提示
      loading.close();
    });
};

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning("评论内容不能为空");
    return;
  }

  commentSubmitting.value = true;

  const params = {
    userId: localStorage.getItem("token").id,
    activityId: activityId.value,
    content: commentContent.value,
    createdAt: new Date().toISOString(),
    username: localStorage.getItem("token").username,
    userAvatar: localStorage.getItem("token").avatar,
    likecount: 0,
    hasLiked: false,
    rating: commentRating.value,
  };

  // 发送评论到服务器
  proxy.$request
    .post(`/api/activity-reviews/${activityId.value}`, commentData)
    .then((res) => {
      if (res.code === 200) {
        // 清空评论框并重置评分
        commentContent.value = "";
        commentRating.value = 5; // 重置为默认5星
        ElMessage.success("评论发表成功");

        // 重新加载第一页评论
        commentPagination.currentPage = 1;
        getComment();
      } else {
        ElMessage.error(res.data.message || "评论发表失败");
      }
    })
    .catch((error) => {
      console.error("评论发表失败:", error);
      ElMessage.error("评论发表失败，请重试");
    })
    .finally(() => {
      commentSubmitting.value = false;
    });
};

//获取活动内容
const getactivity = () => {
  proxy.$request.get(`/api/activities/${activityId.value}`).then((res) => {
    if (res.code === 200) {
      activity.value = res.data;
      // 获取活动详情后检查收藏状态和报名状态
      checkFavoriteStatus();
      checkRegistrationStatus();
    }
  });
};

// 检查收藏状态
const checkFavoriteStatus = () => {
  proxy.$request
    .get(`/api/activity-favorites/${activityId.value}/has-favorited`)
    .then((res) => {
      if (res.code === 200) {
        isFavorited.value = res.data || false;
      }
    })
    .catch((error) => {
      console.error("检查收藏状态失败:", error);
    });
};

// 切换收藏状态
const toggleFavorite = () => {
  if (favoriteLoading.value) return;

  favoriteLoading.value = true;

  if (isFavorited.value) {
    // 取消收藏
    proxy.$request
      .delete(`/api/activity-favorites/${activityId.value}/unfavorite`)
      .then((res) => {
        if (res.code === 200) {
          isFavorited.value = false;
          if (activity.value.favoriteCount > 0) {
            activity.value.favoriteCount--;
          }
          ElMessage.success("取消收藏成功");
        } else {
          ElMessage.error(res.data.message || "取消收藏失败");
        }
      })
      .catch((error) => {
        console.error("取消收藏失败:", error);
        ElMessage.error("取消收藏失败，请重试");
      })
      .finally(() => {
        favoriteLoading.value = false;
      });
  } else {
    // 添加收藏
    proxy.$request
      .post(`/api/activity-favorites/${activityId.value}/favorite`)
      .then((res) => {
        if (res.code === 200) {
          isFavorited.value = true;
          activity.value.favoriteCount =
            (activity.value.favoriteCount || 0) + 1;
          ElMessage.success("收藏成功");
        } else {
          ElMessage.error(res.data.message || "收藏失败");
        }
      })
      .catch((error) => {
        console.error("收藏失败:", error);
        ElMessage.error("收藏失败，请重试");
      })
      .finally(() => {
        favoriteLoading.value = false;
      });
  }
};

// 检查报名状态
const checkRegistrationStatus = () => {
  proxy.$request
    .get(`/api/activity-registrations/${activityId.value}/has-registered`)
    .then((res) => {
      if (res.code === 200) {
        isRegistered.value = res.data.data || false;
      }
    })
    .catch((error) => {
      console.error("检查报名状态失败:", error);
    });
};

const checkCode = ref("");
//处理签到
const handlechecked = () => {
  checkLoading.value = true;
  proxy
    .$post(`/api/activities/${activityId.value}/generate-code`)
    .then((res) => {
      if (res.code === 200) {
        checkCode.value = res.data.number;
        ischecked.value = true;
        ElMessage.success("签到成功");
      } else {
        ElMessage.error(res.data.message || "签到失败");
      }
    });
};

// 处理报名或取消报名
const handleRegistration = () => {
  if (registrationLoading.value) return;

  registrationLoading.value = true;

  if (isRegistered.value) {
    // 已报名，执行取消报名
    cancelRegistration();
  } else {
    // 未报名，执行报名
    registerActivity();
  }
};

// 报名活动
const registerActivity = () => {
  // 检查活动名额
  if (activity.value.maxParticipants <= activity.value.number) {
    ElMessage.warning("活动人数已满，无法报名");
    registrationLoading.value = false;
    return;
  }

  proxy.$request
    .post(`/api/activity-registrations/${activityId.value}/register`)
    .then((res) => {
      if (res.code === 200) {
        isRegistered.value = true;
        activity.value.number++;
        ElMessage.success("报名成功");
      } else {
        ElMessage.error(res.data.message || "报名失败");
      }
    })
    .catch((error) => {
      console.error("报名失败:", error);
      ElMessage.error("报名失败，请重试");
    })
    .finally(() => {
      registrationLoading.value = false;
    });
};

// 取消报名
const cancelRegistration = () => {
  proxy.$request
    .delete(`/api/activity-registrations/${activityId.value}/cancel`)
    .then((res) => {
      if (res.code === 200) {
        isRegistered.value = false;
        if (activity.value.number > 0) {
          activity.value.number--;
        }
        ElMessage.success("取消报名成功");
      } else {
        ElMessage.error(res.data.message || "取消报名失败");
      }
    })
    .catch((error) => {
      console.error("取消报名失败:", error);
      ElMessage.error("取消报名失败，请重试");
    })
    .finally(() => {
      registrationLoading.value = false;
    });
};

// 处理评论分页变化
const handleCommentPageChange = (page) => {
  commentPagination.currentPage = page;
  getComment();
};

// 页面加载时获取活动信息、收藏状态和评论
onMounted(() => {
  getactivity();
  getComment();
});
</script>

<style scoped>
.activity-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 活动头部区域 */
.activity-header {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.activity-cover {
  position: relative;
  width: 100%;
  height: 400px;
}

.activity-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 500;
}

.activity-info-card {
  padding: 2rem;
}

.activity-title {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.meta-item .el-icon {
  color: var(--vt-c-primary);
}

.organizer {
  display: flex;
  align-items: center;
}

.organizer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.organizer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 5px;
  height: 70%;
  width: 4px;
  background-color: var(--vt-c-primary);
  border-radius: 2px;
}

/* 报名区域 */
.registration-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.register-button {
  padding: 0 3rem;
  height: 50px;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.register-button[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}

.activity-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;
}

.stat-item:hover {
  color: var(--vt-c-primary);
}

.stat-item .el-icon.favorited {
  color: #ff9900;
}

.stat-item:hover .el-icon.favorited {
  color: #ff6600;
}

.share-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.share-button {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wechat {
  background-color: #07c160;
  color: white;
  border: none;
}

.tiktok {
  background-color: #000;
  color: white;
  border: none;
}

.tiktok-icon {
  width: 16px;
  height: 16px;
}

/* 活动详情区域 */
.activity-content-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.activity-content {
  color: #333;
  line-height: 1.6;
}

.activity-content p {
  margin-bottom: 1rem;
}

.activity-content ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.activity-content li {
  margin-bottom: 0.5rem;
}

/* 评论区域 */
.activity-comments-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.comment-form-container {
  margin-bottom: 2rem;
}

.comment-form-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.comment-user-name {
  margin-left: 1rem;
  font-weight: 500;
}

.comment-form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.rating-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-label {
  margin-right: 10px;
  font-weight: 500;
  color: #606266;
}

.login-to-comment {
  margin-bottom: 2rem;
}

.comments-list {
  margin-top: 2rem;
}

.comment-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  margin-right: 1rem;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-username {
  font-weight: 500;
  color: #333;
}

.comment-time {
  color: #999;
  font-size: 0.9rem;
}

.comment-text {
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: #333;
}

.comment-actions {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}

.action-item:hover {
  color: var(--vt-c-primary);
}

.no-comments {
  padding: 2rem 0;
  text-align: center;
}

.comments-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-detail-container {
    padding: 1rem;
  }

  .activity-title {
    font-size: 1.5rem;
  }

  .activity-cover {
    height: 250px;
  }
}
</style>
