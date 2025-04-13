<template>
  <div class="activity-tabs">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>我的活动</h2>
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/create')"
          >
            创建活动
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <!-- 创建的活动 -->
        <el-tab-pane label="创建的活动" name="created">
          <div class="tab-content">
            <div class="filter-bar">
              <el-input
                v-model="createdSearchText"
                placeholder="搜索活动"
                prefix-icon="Search"
                clearable
                @clear="handleCreatedSearch"
                @input="handleCreatedSearch"
              />
              <el-select
                v-model="createdStatusFilter"
                placeholder="活动状态"
                clearable
                @change="handleCreatedSearch"
              >
                <el-option label="进行中" value="active" />
                <el-option label="即将开始" value="upcoming" />
                <el-option label="已结束" value="completed" />
              </el-select>
            </div>

            <div
              v-if="filteredCreatedActivities.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无创建的活动" />
            </div>

            <div v-else class="activity-list">
              <activity-card
                v-for="activity in filteredCreatedActivities"
                :key="activity.id"
                :activity="activity"
                type="created"
                @view="viewActivity"
                @edit="editActivity"
                @delete="confirmDeleteActivity"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 参加的活动 -->
        <el-tab-pane label="参加的活动" name="participated">
          <div class="tab-content">
            <div class="filter-bar">
              <el-input
                v-model="participatedSearchText"
                placeholder="搜索活动"
                prefix-icon="Search"
                clearable
                @clear="handleParticipatedSearch"
                @input="handleParticipatedSearch"
              />
              <el-select
                v-model="participatedStatusFilter"
                placeholder="活动状态"
                clearable
                @change="handleParticipatedSearch"
              >
                <el-option label="进行中" value="active" />
                <el-option label="即将开始" value="upcoming" />
                <el-option label="已结束" value="completed" />
              </el-select>
            </div>

            <div
              v-if="filteredParticipatedActivities.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无参加的活动" />
            </div>

            <div v-else class="activity-list">
              <activity-card
                v-for="activity in filteredParticipatedActivities"
                :key="activity.id"
                :activity="activity"
                type="participated"
                @view="viewActivity"
                @cancel="confirmCancelParticipation"
              />
            </div>
          </div>
        </el-tab-pane>

        <!-- 收藏的活动 -->
        <el-tab-pane label="收藏的活动" name="favorites">
          <div class="tab-content">
            <div class="filter-bar">
              <el-input
                v-model="favoritesSearchText"
                placeholder="搜索活动"
                prefix-icon="Search"
                clearable
                @clear="handleFavoritesSearch"
                @input="handleFavoritesSearch"
              />
              <el-select
                v-model="favoritesStatusFilter"
                placeholder="活动状态"
                clearable
                @change="handleFavoritesSearch"
              >
                <el-option label="进行中" value="active" />
                <el-option label="即将开始" value="upcoming" />
                <el-option label="已结束" value="completed" />
              </el-select>
            </div>

            <div
              v-if="filteredFavoriteActivities.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无收藏的活动" />
            </div>

            <div v-else class="activity-list">
              <activity-card
                v-for="activity in filteredFavoriteActivities"
                :key="activity.id"
                :activity="activity"
                type="favorite"
                @view="viewActivity"
                @cancel-favorite="confirmCancelFavorite"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 删除活动确认对话框 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%">
      <span
        >确定要删除活动"{{ currentActivity?.title }}"吗？此操作不可恢复。</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deleteActivity" :loading="loading">
            确认删除
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 取消参与确认对话框 -->
    <el-dialog v-model="cancelDialogVisible" title="确认取消参与" width="30%">
      <span>确定要取消参与活动"{{ currentActivity?.title }}"吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="cancelParticipation"
            :loading="loading"
          >
            确认取消
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 取消收藏确认对话框 -->
    <el-dialog
      v-model="cancelFavoriteDialogVisible"
      title="取消收藏"
      width="30%"
    >
      <span>确定要取消收藏活动"{{ currentActivity?.title }}"吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelFavoriteDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="cancelFavorite" :loading="loading">
            确认取消
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import ActivityCard from "./ActivityCard.vue";

// 路由
const router = useRouter();

// 接收活动数据
const props = defineProps({
  createdActivities: {
    type: Array,
    default: () => [],
  },
  participatedActivities: {
    type: Array,
    default: () => [],
  },
  favoriteActivities: {
    type: Array,
    default: () => [],
  },
});

// 定义事件
const emit = defineEmits(["refresh", "tab-change"]);

// 当前活动标签
const activeTab = ref("created");

// 搜索和筛选
const createdSearchText = ref("");
const createdStatusFilter = ref("");
const participatedSearchText = ref("");
const participatedStatusFilter = ref("");
const favoritesSearchText = ref("");
const favoritesStatusFilter = ref("");

// 对话框状态
const deleteDialogVisible = ref(false);
const cancelDialogVisible = ref(false);
const cancelFavoriteDialogVisible = ref(false);
const loading = ref(false);
const currentActivity = ref(null);

// 过滤后的创建活动列表
const filteredCreatedActivities = computed(() => {
  return props.createdActivities.filter((activity) => {
    // 标题搜索
    const titleMatch =
      !createdSearchText.value ||
      activity.title
        .toLowerCase()
        .includes(createdSearchText.value.toLowerCase());

    // 状态筛选
    const statusMatch =
      !createdStatusFilter.value ||
      activity.status === createdStatusFilter.value;

    return titleMatch && statusMatch;
  });
});

// 过滤后的参与活动列表
const filteredParticipatedActivities = computed(() => {
  return props.participatedActivities.filter((activity) => {
    // 标题搜索
    const titleMatch =
      !participatedSearchText.value ||
      activity.title
        .toLowerCase()
        .includes(participatedSearchText.value.toLowerCase());

    // 状态筛选
    const statusMatch =
      !participatedStatusFilter.value ||
      activity.status === participatedStatusFilter.value;

    return titleMatch && statusMatch;
  });
});

// 过滤后的收藏活动列表
const filteredFavoriteActivities = computed(() => {
  return props.favoriteActivities.filter((activity) => {
    // 标题搜索
    const titleMatch =
      !favoritesSearchText.value ||
      activity.title
        .toLowerCase()
        .includes(favoritesSearchText.value.toLowerCase());

    // 状态筛选
    const statusMatch =
      !favoritesStatusFilter.value ||
      activity.status === favoritesStatusFilter.value;

    return titleMatch && statusMatch;
  });
});

// 处理标签切换
const handleTabClick = (tab) => {
  console.log("切换到标签:", tab.props.name);
  emit("tab-change", tab.props.name);
};

// 处理创建活动搜索
const handleCreatedSearch = () => {
  console.log(
    "搜索创建的活动:",
    createdSearchText.value,
    createdStatusFilter.value
  );
};

// 处理参与活动搜索
const handleParticipatedSearch = () => {
  console.log(
    "搜索参与的活动:",
    participatedSearchText.value,
    participatedStatusFilter.value
  );
};

// 处理收藏活动搜索
const handleFavoritesSearch = () => {
  console.log(
    "搜索收藏的活动:",
    favoritesSearchText.value,
    favoritesStatusFilter.value
  );
};

// 查看活动详情
const viewActivity = (activity) => {
  router.push(`/activity/${activity.id}`);
};

// 编辑活动
const editActivity = (activity) => {
  router.push({
    path: "/create",
    query: { id: activity.id, edit: true },
  });
};

// 确认删除活动
const confirmDeleteActivity = (activity) => {
  currentActivity.value = activity;
  deleteDialogVisible.value = true;
};

// 删除活动
const deleteActivity = async () => {
  if (!currentActivity.value) return;

  loading.value = true;

  try {
    // 在实际项目中，这里应该调用API删除活动
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    ElMessage.success(`活动"${currentActivity.value.title}"已删除`);
    deleteDialogVisible.value = false;

    // 刷新活动列表
    emit("refresh");
  } catch (error) {
    ElMessage.error("删除失败，请重试");
    console.error("删除活动失败:", error);
  } finally {
    loading.value = false;
  }
};

// 确认取消参与活动
const confirmCancelParticipation = (activity) => {
  currentActivity.value = activity;
  cancelDialogVisible.value = true;
};

// 取消参与活动
const cancelParticipation = async () => {
  if (!currentActivity.value) return;

  loading.value = true;

  try {
    // 在实际项目中，这里应该调用API取消参与
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    ElMessage.success(`已取消参与活动"${currentActivity.value.title}"`);
    cancelDialogVisible.value = false;

    // 刷新活动列表
    emit("refresh");
  } catch (error) {
    ElMessage.error("操作失败，请重试");
    console.error("取消参与活动失败:", error);
  } finally {
    loading.value = false;
  }
};

// 确认取消收藏活动
const confirmCancelFavorite = (activity) => {
  currentActivity.value = activity;
  cancelFavoriteDialogVisible.value = true;
};

// 取消收藏活动
const cancelFavorite = async () => {
  if (!currentActivity.value) return;

  loading.value = true;

  try {
    // 在实际项目中，这里应该调用API取消收藏
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    ElMessage.success(`已取消收藏活动"${currentActivity.value.title}"`);
    cancelFavoriteDialogVisible.value = false;

    // 刷新活动列表
    emit("refresh");
  } catch (error) {
    ElMessage.error("操作失败，请重试");
    console.error("取消收藏活动失败:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.tab-content {
  min-height: 400px;
}

.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 10px;
  }

  .activity-list {
    grid-template-columns: 1fr;
  }
}
</style>
