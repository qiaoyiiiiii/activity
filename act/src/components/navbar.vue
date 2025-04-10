<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <a href="/" class="navbar-logo">
        <span style="color:#A3F0D4;">A</span>
        <span style="color:#A3F0D4;">c</span>
        <span style="color:#66DFB0;">t</span>
        <span style="color:#66DFB0;">i</span>
        <span style="color:#9BE1FF;">v</span>
        <span style="color:#9BE1FF;">i</span>
        <span style="color:#C7EEFF;">t</span>
        <span style="color:#C7EEFF;">y</span>
      </a>
    </div>
    <ul class="navbar-menu">
      <li class="navbar-item">
        <a href="/" class="navbar-link">首页</a>
      </li>
      <li class="navbar-item">
        <a href="/activities" class="navbar-link">活动列表</a>
      </li>
      <li class="navbar-item">
        <a href="/create" class="navbar-link">创建活动</a>
      </li>
    </ul>
    <div class="avatar">
        <div v-if="user">
            <el-avatar :size="50" :src="user.avatar" :alt="user.name">{{ user.name }}</el-avatar>
        </div>
        <div v-else>
            <el-button type="info" plain round @click="$router.push('/login')" style="align-item:center">登录</el-button>
        </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { ElAvatar, ElButton } from 'element-plus';

const user=ref(null);

onMounted(() => {
  if (localStorage.getItem('user')) {
    user.value = JSON.parse(localStorage.getItem('user'));
  }
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(34, 139, 94, 0.8); 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  z-index: 1000;
}

.navbar-logo {
  text-decoration: none;
  font-size: 2rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
}

.navbar-item {
  margin-left: 1rem;
}

.navbar-link {
  text-decoration: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 1.5rem;
  font-weight: 400;
}

.navbar-link:hover {
  background-color: #e9ecef;
}

.avatar {
  height: 100%;
}

:deep(.el-button) {
  background-color: var(--color-primary);
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
}
</style>
