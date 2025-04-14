<template>
  <div class="message-badge">
    <el-badge :value="unreadCount" :max="99" :hidden="unreadCount === 0">
      <el-button 
        :icon="Bell" 
        circle 
        @click="navigateToMessageCenter"
        class="message-button"
      />
    </el-badge>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { Bell } from '@element-plus/icons-vue';

const router = useRouter();
const proxy = getCurrentInstance().proxy;

// 未读消息数量
const unreadCount = ref(0);

// 轮询间隔（毫秒）
const POLL_INTERVAL = 60000; // 1分钟
let pollTimer = null;

// 获取未读消息数量
const fetchUnreadCount = async () => {
  try {
    const response = await proxy.$request.get('/api/messages/unread-count');
    if (response.data.code === 200) {
      unreadCount.value = response.data.data || 0;
    }
  } catch (error) {
    console.error('获取未读消息数量失败:', error);
  }
};

// 导航到消息中心
const navigateToMessageCenter = () => {
  router.push('/messages');
};

// 开始轮询
const startPolling = () => {
  // 立即获取一次
  fetchUnreadCount();
  
  // 设置定时获取
  pollTimer = setInterval(fetchUnreadCount, POLL_INTERVAL);
};

// 停止轮询
const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

// 组件挂载时开始轮询
onMounted(() => {
  startPolling();
  
  // 监听消息更新事件
  window.addEventListener('message-updated', fetchUnreadCount);
});

// 组件卸载时停止轮询
onUnmounted(() => {
  stopPolling();
  
  // 移除事件监听
  window.removeEventListener('message-updated', fetchUnreadCount);
});
</script>

<style scoped>
.message-badge {
  margin: 0 10px;
}

.message-button {
  transition: transform 0.3s;
}

.message-button:hover {
  transform: scale(1.1);
}
</style>
