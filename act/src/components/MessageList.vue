<template>
  <div class="message-list">
    <el-empty 
      v-if="messages.length === 0 && !loading" 
      description="暂无消息" 
    />
    
    <el-skeleton 
      v-if="loading" 
      :rows="3" 
      animated 
      :count="3"
    />
    
    <template v-else>
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-item"
        :class="{ 'unread': !message.read }"
      >
        <div class="message-dot" v-if="!message.read"></div>
        
        <div class="message-content">
          <div class="message-header">
            <span class="message-type" :class="getTypeClass(message.type)">
              {{ getTypeLabel(message.type) }}
            </span>
            <span class="message-time">{{ formatTime(message.createdAt) }}</span>
          </div>
          
          <div class="message-title">{{ message.title }}</div>
          
          <div class="message-body">{{ message.content }}</div>
          
          <div class="message-footer">
            <el-button 
              v-if="!message.read" 
              type="primary" 
              size="small" 
              text
              @click="markAsRead(message.id)"
            >
              标为已读
            </el-button>
            
            <el-button 
              v-if="message.actionUrl" 
              type="primary" 
              size="small" 
              @click="handleAction(message)"
            >
              {{ message.actionText || '查看详情' }}
            </el-button>
          </div>
        </div>
      </div>
    </template>
    
    <div class="pagination-container" v-if="messages.length > 0">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
        hide-on-single-page
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['mark-read', 'page-change']);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  emit('page-change', page);
};

// 标记消息为已读
const markAsRead = (messageId) => {
  emit('mark-read', messageId);
};

// 处理消息操作
const handleAction = (message) => {
  if (message.actionUrl) {
    if (message.actionUrl.startsWith('http')) {
      window.open(message.actionUrl, '_blank');
    } else {
      router.push(message.actionUrl);
    }
    
    // 如果消息未读，标记为已读
    if (!message.read) {
      markAsRead(message.id);
    }
  }
};

// 获取消息类型样式类
const getTypeClass = (type) => {
  const typeMap = {
    'system': 'type-system',
    'activity': 'type-activity',
    'comment': 'type-comment',
    'private': 'type-private'
  };
  return typeMap[type] || 'type-system';
};

// 获取消息类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    'system': '系统通知',
    'activity': '活动通知',
    'comment': '评论通知',
    'private': '私信'
  };
  return typeMap[type] || '通知';
};

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // 一小时内
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
  }
  
  // 一天内
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // 一周内
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}天前`;
  }
  
  // 超过一周
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style scoped>
.message-list {
  padding: 10px 0;
}

.message-item {
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.unread {
  background-color: #f0f9ff;
}

.message-dot {
  position: absolute;
  top: 20px;
  left: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
}

.message-content {
  margin-left: 10px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-type {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  color: #fff;
}

.type-system {
  background-color: #909399;
}

.type-activity {
  background-color: #67c23a;
}

.type-comment {
  background-color: #409eff;
}

.type-private {
  background-color: #e6a23c;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #303133;
}

.message-body {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
