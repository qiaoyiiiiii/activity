<template>
  <div class="personal-container">
    <div class="personal-card">
      <h2 class="page-title">个人信息</h2>
      
      <el-form 
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="personal-form"
      >
        <!-- 头像上传 -->
        <div class="avatar-upload">
          <el-avatar 
            :size="100" 
            :src="userForm.avatar" 
            class="avatar-preview"
          />
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="handleAvatarUpload"
          >
            <el-button type="primary" class="upload-btn">更换头像</el-button>
          </el-upload>
        </div>

        <!-- 登录账号 -->
        <el-form-item label="登录账号" prop="email">
          <el-input v-model="userForm.email" disabled />
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <!-- 兴趣标签 -->
        <el-form-item label="兴趣标签" prop="interests">
          <el-select
            v-model="userForm.interests"
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

        <!-- 个人简介 -->
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="userForm.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介"
          />
        </el-form-item>

        <!-- 创建时间 -->
        <el-form-item label="创建时间">
          <el-input v-model="userForm.createdAt" disabled />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item label-width="0">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const formRef = ref(null)

// 表单数据
const userForm = reactive({
  email: '',
  nickname: '',
  avatar: '',
  interests: [],
  bio: '',
  createdAt: ''
})

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
]

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '不能超过200个字符', trigger: 'blur' }
  ]
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJpgOrPng) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    // 这里应该调用实际的上传API
    // 模拟上传成功
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      userForm.avatar = e.target.result
    }
    fileReader.readAsDataURL(options.file)
  } catch (error) {
    ElMessage.error('头像上传失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 这里应该调用实际的更新API
        // 模拟更新成功
        setTimeout(() => {
          localStorage.setItem('user', JSON.stringify(userForm))
          ElMessage.success('个人信息更新成功')
          loading.value = false
        }, 1000)
      } catch (error) {
        ElMessage.error('更新失败，请稍后重试')
        loading.value = false
      }
    }
  })
}

// 页面加载时获取用户信息
onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    userForm.email = user.email
    userForm.nickname = user.name || user.email.split('@')[0]
    userForm.avatar = user.avatar
    userForm.interests = user.interests || []
    userForm.bio = user.bio || ''
    userForm.createdAt = user.createdAt || new Date().toLocaleString()
  }
})
</script>

<style scoped>
.personal-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.personal-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--el-text-color-primary);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.avatar-preview {
  border: 2px solid var(--el-border-color);
}

.upload-btn {
  margin-top: 1rem;
}

.personal-form {
  max-width: 600px;
  margin: 0 auto;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: var(--el-fill-color-lighter);
}

:deep(.el-form-item__content){
    justify-content: center;
}
</style>