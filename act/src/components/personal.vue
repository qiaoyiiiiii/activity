<template>
  <div class="personal-container">
    <div class="personal-card">
      <div class="card-header">
        <h2>个人信息</h2>
        <el-button
          type="primary"
          size="small"
          @click="write = !write"
          v-if="!write"
        >
          编辑
        </el-button>
      </div>

      <el-form
        ref="formRef"
        :model="userForm"
        :rules="write ? rules : {}"
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
            v-if="write"
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
          <el-input
            v-model="userForm.nickname"
            :readonly="!write"
            placeholder="请输入昵称"
          />
        </el-form-item>

        <!-- 兴趣标签 -->
        <el-form-item label="兴趣标签" prop="interests">
          <el-select
            v-model="userForm.interests"
            multiple
            filterable
            allow-create
            default-first-option
            :reserve-keyword="false"
            placeholder="选择或输入兴趣标签"
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
        <el-form-item label="个人简介" prop="description">
          <el-input
            v-model="userForm.description"
            type="textarea"
            :rows="4"
            :readonly="!write"
            placeholder="请输入个人简介"
          />
        </el-form-item>

        <!-- 创建时间 -->
        <el-form-item label="创建时间">
          <el-input v-model="userForm.createdAt" disabled />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item v-if="write" label-width="0">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { interestOption } from "../static/category";

const { proxy } = getCurrentInstance();

// Props定义
const props = defineProps({
  iswrite: {
    type: Boolean,
    default: true,
  },
});

const write = ref(props.iswrite);
const loading = ref(false);
const formRef = ref(null);

// 表单数据
const userForm = reactive({
  username: "",
  nickname: "",
  avatar: "",
  interests: [],
  description: "",
  createdAt: "",
});

// 兴趣标签选项
const interestOptions = interestOption;

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  description: [{ max: 200, message: "不能超过200个字符", trigger: "blur" }],
};

// 初始化用户数据
const initUserData = (data) => {
  Object.assign(userForm, {
    email: data.email || "",
    nickname: data.nickname || "",
    avatar: data.avatar || "",
    interests: [...(data.interests || [])],
    description: data.description || "",
    createdAt: data.createdAt || new Date().toLocaleString(),
  });
};

const getuser = () => {
  const id = localStorage.getItem("userid");
  proxy.$request.get("/api/users/profile", { id }).then((res) => {
    initUserData(res.data);
  });
};

// 组件挂载时初始化数据
onMounted(() => {
  getuser();
});

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJpgOrPng) {
    ElMessage.error("头像只能是 JPG 或 PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("头像大小不能超过 2MB!");
    return false;
  }
  return true;
};

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    // 这里应该调用实际的上传API
    // 模拟上传成功
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      userForm.avatar = e.target.result;
    };
    fileReader.readAsDataURL(options.file);
  } catch (error) {
    ElMessage.error("头像上传失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      proxy.$request
        .put("/api/users/profile", userForm)
        .then((res) => {
          ElMessage.success("个人信息更新成功");
          write.value = !write.value;
          loading.value = false;
        })
        .catch((err) => {
          ElMessage.error("更新失败");
          loading.value = false;
        });
    }
  });
};
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

:deep(.el-form-item__content) {
  justify-content: center;
}

:deep(.input-tag-full) {
  width: 100%;
}

:deep(.el-input-tag__input) {
  min-width: 100px;
}
</style>
