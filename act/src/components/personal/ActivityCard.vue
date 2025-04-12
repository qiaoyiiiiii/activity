<template>
  <el-card class="activity-card" shadow="hover">
    <!-- 活动状态标签 -->
    <div class="status-badge" :class="statusClass">
      {{ statusText }}
    </div>
    
    <!-- 活动图片 -->
    <div class="activity-image">
      <el-image 
        :src="activity.image || defaultImage" 
        fit="cover"
        @click="$emit('view', activity)"
      >
        <template #error>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
      </el-image>
    </div>
    
    <!-- 活动信息 -->
    <div class="activity-info">
      <h3 class="activity-title" @click="$emit('view', activity)">
        {{ activity.title }}
      </h3>
      
      <div class="activity-meta">
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ activity.date }}</span>
        </div>
        
        <div class="meta-item">
          <el-icon><Location /></el-icon>
          <span>{{ activity.location }}</span>
        </div>
        
        <div class="meta-item" v-if="type === 'created'">
          <el-icon><User /></el-icon>
          <span>{{ activity.participants || 0 }} 人参与</span>
        </div>
        
        <div class="meta-item" v-if="type === 'participated'">
          <el-icon><User /></el-icon>
          <span>主办方: {{ activity.organizer }}</span>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="activity-actions">
      <el-button 
        type="primary" 
        size="small" 
        plain
        @click="$emit('view', activity)"
      >
        查看详情
      </el-button>
      
      <!-- 创建的活动操作 -->
      <template v-if="type === 'created'">
        <el-button 
          type="danger" 
          size="small" 
          plain
          @click="$emit('delete', activity)"
        >
          删除
        </el-button>
      </template>
      
      <!-- 参加的活动操作 -->
      <template v-else-if="type === 'participated'">
        <el-button 
          type="danger" 
          size="small" 
          plain
          @click="$emit('cancel', activity)"
          :disabled="activity.status === 'completed'"
        >
          取消参与
        </el-button>
      </template>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
import { Calendar, Location, User, Picture } from '@element-plus/icons-vue';

// 接收活动数据和类型
const props = defineProps({
  activity: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'created',
    validator: (value) => ['created', 'participated'].includes(value)
  }
});

// 定义事件
defineEmits(['view', 'edit', 'delete', 'cancel']);

// 默认图片
const defaultImage = '/images/default-activity.jpg';

// 状态文本
const statusText = computed(() => {
  switch (props.activity.status) {
    case 'active':
      return '进行中';
    case 'upcoming':
      return '即将开始';
    case 'completed':
      return '已结束';
    default:
      return '未知状态';
  }
});

// 状态样式类
const statusClass = computed(() => {
  return {
    'status-active': props.activity.status === 'active',
    'status-upcoming': props.activity.status === 'upcoming',
    'status-completed': props.activity.status === 'completed'
  };
});
</script>

<style scoped>
.activity-card {
  position: relative;
  transition: transform 0.3s;
  height: 100%;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
  z-index: 1;
}

.status-active {
  background-color: #67c23a;
}

.status-upcoming {
  background-color: #409eff;
}

.status-completed {
  background-color: #909399;
}

.activity-image {
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 12px;
  cursor: pointer;
}

.activity-image .el-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 24px;
}

.activity-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.activity-title:hover {
  color: #409eff;
}

.activity-meta {
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 13px;
  color: #606266;
}

.meta-item .el-icon {
  margin-right: 5px;
  font-size: 14px;
}

.activity-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
