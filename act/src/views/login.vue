<template>
  <div class="auth-container">
    <div class="auth-illustration">
      <div class="illustration-content">
        <h2>加入我们的活动社区</h2>
        <p>发现精彩活动，结交志同道合的朋友，创造难忘回忆</p>
        <div class="illustration-image">
          <!-- 这里可以放置一个SVG插图 -->
          <div class="activity-icons">
            <el-icon class="icon"><Calendar /></el-icon>
            <el-icon class="icon"><User /></el-icon>
            <el-icon class="icon"><Location /></el-icon>
            <el-icon class="icon"><Star /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-container">
          <logo />
        </div>
        <h2 class="auth-title">{{ isLogin ? "欢迎回来" : "创建新账号" }}</h2>
        <p class="auth-subtitle">
          {{ isLogin ? "登录您的账号以继续" : "填写以下信息以创建您的账号" }}
        </p>
      </div>

      <!-- 登录表单 -->
      <el-form
        v-if="isLogin"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="auth-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="邮箱地址"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码</el-link>
        </div>

        <el-button
          type="primary"
          class="submit-button"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <div class="auth-switch">
          <span>还没有账号?</span>
          <el-link type="primary" :underline="false" @click="isLogin = !isLogin"
            >去注册</el-link
          >
        </div>
      </el-form>

      <!-- 注册表单 -->
      <el-form
        v-else
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="auth-form"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱地址"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="agreement">
          <el-checkbox v-model="registerForm.agreement"></el-checkbox>
          我已阅读并同意
          <el-link
            type="primary"
            @click="handlePolicy('terms_of_service')"
            :underline="false"
            >服务条款</el-link
          >
          和
          <el-link
            type="primary"
            @click="handlePolicy('privacy_policy')"
            :underline="false"
            >隐私政策</el-link
          >
        </el-form-item>

        <el-button
          type="primary"
          class="submit-button"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>

        <div class="auth-switch">
          <span>已有账号?</span>
          <el-link type="primary" :underline="false" @click="isLogin = !isLogin"
            >去登录</el-link
          >
        </div>
      </el-form>
    </div>
    <Dialog :title="dialogTitle" :dialogVisible="dialogVisible" width="50%">
      <div class="policy-container">
        <div
          v-for="section in sectionGroup.sections"
          :key="section"
          class="section"
        >
          <h3>{{ section.title }}</h3>
          <p>{{ section.content }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import logo from "../components/logo.vue";
import Dialog from "../components/dialog.vue";
import policy from "../static/policy.json";
import CryptoJS from 'crypto-js';

const router = useRouter();
const { proxy } = getCurrentInstance();

const isLogin = ref(true);
const loading = ref(false);
const loginFormRef = ref(null);
const registerFormRef = ref(null);
// 政策
const sectionGroup = ref(null);
const dialogVisible = ref(false);
const dialogTitle = ref("");

// 登录表单数据
const loginForm = reactive({
  email: "",
  password: "",
  remember: false,
});

// 注册表单数据
const registerForm = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

// 验证邮箱格式
const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    callback(new Error("请输入邮箱地址"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("请输入有效的邮箱地址"));
  } else {
    callback();
  }
};

// 验证密码强度
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能少于6个字符"));
  } else {
    callback();
  }
};

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请确认密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

// 验证协议同意
const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请阅读并同意服务条款和隐私政策"));
  } else {
    callback();
  }
};

// 登录表单验证规则
const loginRules = {
  email: [{ validator: validateEmail, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
};

// 注册表单验证规则
const registerRules = {
  email: [{ validator: validateEmail, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
  agreement: [{ validator: validateAgreement, trigger: "change" }],
};

//展示政策
const handlePolicy = (section) => {
  dialogTitle.value = policy[section].title;
  sectionGroup.value = policy[section];
  dialogVisible.value = true;
};

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const params = {
        username: loginForm.email,
        password: loginForm.password,
      };
      proxy.$request
        .post("/api/auth/login", params)
        .then((res) => {
          // 直接存储token字符串，不要用JSON.stringify
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userid", res.data.id);
          ElMessage.success("登录成功");
          router.push("/");
          loading.value = false;
        })
        .catch((error) => {
          ElMessage.error("登录失败，邮箱或密码输入错误!");
          loading.value = false;
        });
    }
  });
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      const encryptedPassword = CryptoJS.AES.encrypt(registerForm.password, 'YourSecretKey').toString();
      const userdata = {
        username: registerForm.email,
        password: encryptedPassword,
        nickname: '',
        interests: [],
        description: '',
      };
      proxy.$request
        .post("/api/auth/register", userdata)
        .then((res) => {
          if(res.data.code === 200){
            localStorage.setItem("id", res.data.id);
            ElMessage.success("注册成功");
            router.push('/registerinfo');
          }
        })
        .catch((error) => { 
          ElMessage.error("注册失败");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

</script>

<style scoped>
.auth-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background-color: var(--color-background);
}

.auth-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.auth-illustration {
  flex: 1;
  background: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    var(--color-secondary-light) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.illustration-content {
  max-width: 500px;
  color: var(--vt-c-black);
  text-align: center;
}

.illustration-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.illustration-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.illustration-image {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icons {
  display: flex;
  gap: 2rem;
}

.activity-icons .icon {
  font-size: 3rem;
  color: var(--vt-c-black-soft);
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo {
  font-size: 2.5rem;
  font-weight: bold;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--color-text-light);
  font-size: 1rem;
}

.auth-form {
  width: 100%;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.auth-switch {
  text-align: center;
  color: var(--color-text-light);
}

.terms-link {
  padding: 0;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .auth-container {
    flex-direction: column-reverse;
  }

  .auth-card,
  .auth-illustration {
    max-width: 100%;
  }

  .auth-illustration {
    padding: 3rem 1rem;
  }

  .illustration-content h2 {
    font-size: 2rem;
  }

  .illustration-content p {
    font-size: 1rem;
  }

  .illustration-image {
    height: 200px;
  }

  .activity-icons .icon {
    font-size: 2rem;
    padding: 0.75rem;
  }
}

@media (max-width: 600px) {
  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .activity-icons {
    gap: 1rem;
  }

  .activity-icons .icon {
    font-size: 1.5rem;
    padding: 0.5rem;
  }

  .policy-container {
    padding: 20px;
    line-height: 1.6;
  }
  .section {
    margin-bottom: 20px;
  }
}
</style>
