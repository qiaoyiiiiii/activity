<template>
  <div class="personal-info-card">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>个人信息</h2>
          <el-button 
            type="primary" 
            size="small" 
            @click="startEditing" 
            v-if="!isEditing"
          >
            编辑
          </el-button>
        </div>
      </template>
      
      <!-- 个人信息展示 -->
      <div v-if="!isEditing" class="info-display">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfo.avatar">
            {{ userInfo.nickname?.charAt(0) || userInfo.email?.charAt(0) }}
          </el-avatar>
        </div>
        
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userInfo.email }}</span>
        </div>
        
        <div class="info-item">
          <span class="label">昵称：</span>
          <span class="value">{{ userInfo.nickname || '未设置' }}</span>
        </div>
        
        <div class="info-item">
          <span class="label">兴趣标签：</span>
          <div class="tags-container">
            <el-tag 
              v-for="tag in userInfo.interests" 
              :key="tag" 
              size="small" 
              class="interest-tag"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!userInfo.interests || userInfo.interests.length === 0">
              未设置
            </span>
          </div>
        </div>
        
        <div class="info-item">
          <span class="label">个人简介：</span>
          <p class="bio">{{ userInfo.bio || '未设置个人简介' }}</p>
        </div>
        
        <div class="info-item">
          <span class="label">注册时间：</span>
          <span class="value">{{ userInfo.createdAt || '未知' }}</span>
        </div>
      </div>
      
      <!-- 个人信息编辑表单 -->
      <el-form 
        v-else 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        label-position="top"
      >
        <el-form-item label="头像">
          <div class="avatar-upload">
            <el-avatar :size="80" :src="form.avatar">
              {{ form.nickname?.charAt(0) || form.email?.charAt(0) }}
            </el-avatar>
            <el-button size="small" type="primary" class="upload-btn">
              更换头像
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" disabled />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        
        <el-form-item label="兴趣标签" prop="interests">
          <el-select
            v-model="form.interests"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入兴趣标签"
          >
            <el-option
              v-for="item in interestOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="form-actions">
            <el-button @click="cancelEditing">取消</el-button>
            <el-button type="primary" @click="saveChanges" :loading="loading">
              保存
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';

// 接收用户信息
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['update']);

// 表单引用
const formRef = ref(null);

// 编辑状态
const isEditing = ref(false);

// 加载状态
const loading = ref(false);

// 兴趣标签选项
const interestOptions = [
  '阅读',
  '运动',
  '音乐',
  '电影',
  '摄影',
  '旅行',
  '美食',
  '游戏',
  '编程',
  '艺术'
];

// 用户信息（带默认值）
const userInfo = computed(() => {
  return props.user || {
    email: '',
    nickname: '',
    avatar: '',
    interests: [],
    bio: '',
    createdAt: new Date().toLocaleString()
  };
});

// 表单数据
const form = reactive({
  email: '',
  nickname: '',
  avatar: '',
  interests: [],
  bio: '',
  createdAt: ''
});

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '不能超过200个字符', trigger: 'blur' }
  ]
};

// 监听用户信息变化，更新表单数据
watch(() => props.user, (newUser) => {
  if (newUser) {
    resetForm();
  }
}, { immediate: true });

// 重置表单数据
const resetForm = () => {
  if (props.user) {
    form.email = props.user.email || '';
    form.nickname = props.user.nickname || '';
    form.avatar = props.user.avatar || '';
    form.interests = [...(props.user.interests || [])];
    form.bio = props.user.bio || '';
    form.createdAt = props.user.createdAt || new Date().toLocaleString();
  }
};

// 开始编辑
const startEditing = () => {
  resetForm();
  isEditing.value = true;
};

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false;
  ElMessage.info('已取消编辑');
};

// 保存更改
const saveChanges = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        // 在实际项目中，这里应该调用API保存数据
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 创建更新后的用户对象
        const updatedUser = {
          ...props.user,
          nickname: form.nickname,
          avatar: form.avatar,
          interests: form.interests,
          bio: form.bio
        };
        
        // 触发更新事件
        emit('update', updatedUser);
        
        // 退出编辑模式
        isEditing.value = false;
      } catch (error) {
        ElMessage.error('保存失败，请重试');
        console.error('保存用户信息失败:', error);
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.personal-info-card {
  height: 100%;
}

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

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.info-item {
  margin-bottom: 15px;
}

.label {
  font-weight: 500;
  color: #606266;
  margin-right: 5px;
}

.value {
  color: #303133;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.interest-tag {
  margin-right: 5px;
}

.bio {
  margin-top: 5px;
  white-space: pre-line;
  color: #303133;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 15px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
