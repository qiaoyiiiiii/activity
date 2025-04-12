<template>
  <div class="activity-detail-container">
    <!-- 活动封面和基本信息 -->
    <div class="activity-header">
      <div class="activity-cover">
        <img
          src="https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover"
          alt="活动封面"
        />
        <div class="activity-status">报名中</div>
      </div>

      <div class="activity-info-card">
        <h1 class="activity-title">第五届新茶咖大会</h1>

        <div class="activity-meta">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>2025年4月11日 8:30 ~ 2025年4月11日 18:30</span>
          </div>

          <div class="meta-item">
            <el-icon><Location /></el-icon>
            <span>广东广州流花路120号东方宾馆2号楼(东方国际会展中心)</span>
          </div>

          <div class="meta-item organizer">
            <div class="organizer-avatar">
              <img
                src="https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover"
                alt="主办方"
              />
            </div>
            <span>智慧餐饮Talk</span>
            <el-tag size="small" type="info" class="verified-tag"
              >已认证</el-tag
            >
          </div>
          <div class="registration-section">
            <el-button type="success" size="large" class="register-button">
              我要报名
            </el-button>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>已收藏 272</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动详情 -->
    <div class="activity-content-section">
      <h2 class="section-title">活动详情</h2>

      <div class="activity-content">
        <p>
          第五届新茶咖大会是一场汇聚茶文化与咖啡文化的盛会，旨在促进两种文化的交流与融合。
        </p>
        <p>
          本次大会将邀请来自全球的茶叶和咖啡专家，分享最新的行业趋势、创新技术和可持续发展实践。
        </p>
        <p>活动亮点：</p>
        <ul>
          <li>国际茶咖展览区，展示全球顶级茶叶和咖啡品牌</li>
          <li>大师工作坊，学习专业冲泡技巧</li>
          <li>品鉴会，体验稀有茶种和精品咖啡</li>
          <li>行业论坛，探讨茶咖产业未来发展</li>
          <li>跨界合作交流，促进茶咖文化融合创新</li>
        </ul>
        <p>
          无论您是行业专业人士，还是茶咖爱好者，都能在这里找到属于自己的精彩内容。
        </p>
        <p>期待您的参与！</p>
      </div>
    </div>

    <!-- 评论区 -->
    <div class="activity-comments-section">
      <h2 class="section-title">活动评论</h2>

      <!-- 评论表单 -->
      <div class="comment-form-container" v-if="user">
        <div class="comment-form-header">
          <el-avatar :size="40" :src="user.avatar">{{ user.name }}</el-avatar>
          <span class="comment-user-name">{{ user.name }}</span>
        </div>
        <div class="comment-form">
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
            :key="index"
            class="comment-item"
          >
            <div class="comment-avatar">
              <el-avatar :size="40" :src="comment.avatar">{{
                comment.userName.charAt(0)
              }}</el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.userName }}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

// 用户信息
const user = ref(null);

// 评论内容
const commentContent = ref("");
const commentSubmitting = ref(false);

// 评论列表
const comments = ref([
  {
    id: 1,
    userName: "张三",
    avatar: "https://via.placeholder.com/40",
    content: "这个活动看起来很有意思，期待参加！",
    time: "2025-03-25 14:30",
    likes: 5,
  },
  {
    id: 2,
    userName: "李四",
    avatar: "https://via.placeholder.com/40/ff6b6b/ffffff",
    content: "上次参加过类似的活动，收获很大，推荐大家报名。",
    time: "2025-03-26 09:15",
    likes: 3,
  },
]);

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning("评论内容不能为空");
    return;
  }

  commentSubmitting.value = true;

  // 模拟提交评论到服务器
  setTimeout(() => {
    // 创建新评论对象
    const newComment = {
      id: comments.value.length + 1,
      userName: user.value.name,
      avatar: user.value.avatar,
      content: commentContent.value,
      time: new Date().toLocaleString(),
      likes: 0,
    };

    // 添加到评论列表
    comments.value.unshift(newComment);

    // 清空评论框
    commentContent.value = "";

    ElMessage.success("评论发表成功");
    commentSubmitting.value = false;
  }, 500);
};

// 页面加载时获取用户信息
onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }
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

.verified-tag {
  margin-left: 10px;
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
