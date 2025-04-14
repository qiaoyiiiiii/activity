<template>
  <nav class="navbar">
    <logo></logo>
    <ul class="navbar-menu">
      <li class="navbar-item">
        <router-link to="/" class="navbar-link" active-class="active"
          >首页</router-link
        >
      </li>
      <li class="navbar-item">
        <router-link to="/activity" class="navbar-link" active-class="active"
          >活动列表</router-link
        >
      </li>
      <li class="navbar-item">
        <router-link to="/create" class="navbar-link" active-class="active"
          >创建活动</router-link
        >
      </li>
    </ul>
    <div class="avatar">
      <el-icon style="font-size: 1.5rem;color: #fff" @click="$router.push('/notice')" v-auth><Bell /></el-icon>
      <div v-if="user">
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <el-avatar
              :size="50"
              :src="user.avatar"
              :alt="user.name"
              @click="$router.push('/personal')"
              >{{ user.name }}</el-avatar
            >
          </template>
          <template #default>
            <div class="btn-group">
              <el-button
                @click="$router.push('/personal')"
                v-if="$route.path !== '/personal'"
                >个人中心</el-button
              >
              <el-button @click="handleLogout">退出登录</el-button>
            </div>
          </template>
        </el-popover>
      </div>
      <div v-else>
        <el-button
          type="info"
          plain
          round
          @click="$router.push('/login')"
          style="align-item: center"
          >登录</el-button
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import logo from "./logo.vue";
import { ElAvatar, ElButton } from "element-plus";
import { logout } from '../Utils/auth';

const user = ref(null);

onMounted(() => {
  if (localStorage.getItem("user")) {
    user.value = JSON.parse(localStorage.getItem("user"));
    console.log(user.value);
  }
});

const handleLogout = () => {
  logout();
};
</script>

<style scoped>
* {
  cursor: pointer;
}

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
  font-size: 1.3rem;
  font-weight: 400;
}

.navbar-link.active {
  color: #fff;
  border-bottom: 2px solid #fff;
}

.avatar {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;
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

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}
</style>
