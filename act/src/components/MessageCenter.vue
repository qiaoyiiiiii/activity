<template>
  <div class="message-center">
    <div class="message-header">
      <h2 class="message-title">消息中心</h2>
      <div class="message-actions">
        <el-button
          type="primary"
          size="small"
          @click="markAllAsRead"
          :disabled="unreadMessages.length === 0"
        >
          全部标为已读
        </el-button>
      </div>
    </div>

    <div class="message-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="全部消息" name="all">
          <message-list
            :messages="messages"
            :loading="loading"
            @mark-read="markAsRead"
          />
        </el-tab-pane>
        <el-tab-pane label="未读消息" name="unread">
          <message-list
            :messages="unreadMessages"
            :loading="loading"
            @mark-read="markAsRead"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import MessageList from "./MessageList.vue";

const proxy = getCurrentInstance().proxy;

// 状态变量
const loading = ref(false);
const messages = ref([]);
const activeTab = ref("all");

// 计算未读消息
const unreadMessages = computed(() => {
  return messages.value.filter((msg) => !msg.read);
});

// 处理标签切换
const handleTabChange = (tab) => {
  console.log("切换到标签:", tab.props.name);
};

// 获取消息列表
const fetchMessages = async () => {
  loading.value = true;
  try {
    const response = await proxy.$request.get("/api/messages");
    if (response.data.code === 200) {
      messages.value = response.data.data || [];
    } else {
      ElMessage.error("获取消息失败");
    }
  } catch (error) {
    console.error("获取消息失败:", error);
    ElMessage.error("获取消息失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 标记单条消息为已读
const markAsRead = async (messageId) => {
  try {
    const response = await proxy.$request.put(
      `/api/messages/${messageId}/read`
    );
    if (response.data.code === 200) {
      // 更新本地消息状态
      const message = messages.value.find((msg) => msg.id === messageId);
      if (message) {
        message.read = true;
      }
      ElMessage.success("已标记为已读");
    } else {
      ElMessage.error("标记已读失败");
    }
  } catch (error) {
    console.error("标记已读失败:", error);
    ElMessage.error("标记已读失败，请重试");
  }
};

// 标记所有消息为已读
const markAllAsRead = async () => {
  if (unreadMessages.value.length === 0) return;

  try {
    const response = await proxy.$request.put("/api/messages/read-all");
    if (response.data.code === 200) {
      // 更新所有未读消息的状态
      messages.value.forEach((msg) => {
        msg.read = true;
      });
      ElMessage.success("已将所有消息标记为已读");
    } else {
      ElMessage.error("标记全部已读失败");
    }
  } catch (error) {
    console.error("标记全部已读失败:", error);
    ElMessage.error("标记全部已读失败，请重试");
  }
};

// 组件挂载时获取消息
onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.message-center {
  margin: 0 auto;
  padding: 20px;
  width: var(--content-width);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.message-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: #303133;
}

.message-actions {
  display: flex;
  gap: 10px;
}

.message-tabs {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
