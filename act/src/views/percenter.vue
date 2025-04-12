<template>
  <div class="personal-center">
    <el-row :gutter="20">
      <!-- 左侧个人信息 -->
      <el-col :span="8">
        <personal-info :user="user" @update="handleUserUpdate" />
      </el-col>

      <!-- 右侧活动列表 -->
      <el-col :span="16">
        <activity-tabs
          :created-activities="createdActivities"
          :participated-activities="participatedActivities"
          @refresh="fetchActivities"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import PersonalInfo from "../components/personal/PersonalInfo.vue";
import ActivityTabs from "../components/personal/ActivityTabs.vue";

// 用户信息
const user = ref(null);

// 创建的活动
const createdActivities = ref([]);

// 参加的活动
const participatedActivities = ref([]);

// 获取用户信息
const fetchUserInfo = () => {
  // 从本地存储获取用户信息（实际项目中应该从API获取）
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  } else {
    // 如果没有用户信息，重定向到登录页
    ElMessage.warning("请先登录");
    window.location.href = "/login";
  }
};

// 获取活动列表
const fetchActivities = () => {
  // 模拟从API获取数据
  // 在实际项目中，这里应该调用后端API

  // 模拟创建的活动
  createdActivities.value = [
    {
      id: 1,
      title: "校园歌唱比赛",
      date: "2024-06-15",
      location: "大学音乐厅",
      status: "active",
      participants: 45,
      image: "/images/singing-contest.jpg",
    },
    {
      id: 2,
      title: "编程马拉松",
      date: "2024-07-10",
      location: "计算机科学楼",
      status: "upcoming",
      participants: 32,
      image: "/images/coding-marathon.jpg",
    },
    {
      id: 3,
      title: "环保志愿者活动",
      date: "2024-05-22",
      location: "校园中心广场",
      status: "completed",
      participants: 78,
      image: "/images/eco-volunteer.jpg",
    },
  ];

  // 模拟参加的活动
  participatedActivities.value = [
    {
      id: 4,
      title: "校园篮球联赛",
      date: "2024-06-20",
      location: "体育馆",
      status: "active",
      organizer: "体育部",
      image: "/images/basketball-league.jpg",
    },
    {
      id: 5,
      title: "文学讲座",
      date: "2024-06-05",
      location: "图书馆报告厅",
      status: "upcoming",
      organizer: "文学院",
      image: "/images/literature-lecture.jpg",
    },
    {
      id: 6,
      title: "校园摄影展",
      date: "2024-05-15",
      location: "艺术中心",
      status: "completed",
      organizer: "摄影协会",
      image: "/images/photo-exhibition.jpg",
    },
    {
      id: 7,
      title: "创新创业大赛",
      date: "2024-07-25",
      location: "创业中心",
      status: "upcoming",
      organizer: "创业学院",
      image: "/images/innovation-contest.jpg",
    },
  ];
};

// 处理用户信息更新
const handleUserUpdate = (updatedUser) => {
  // 更新本地用户信息
  user.value = updatedUser;

  // 保存到本地存储（实际项目中应该调用API）
  localStorage.setItem("user", JSON.stringify(updatedUser));

  ElMessage.success("个人信息已更新");
};

// 组件挂载时获取数据
onMounted(() => {
  fetchUserInfo();
  fetchActivities();
});
</script>

<style scoped>
.personal-center {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .personal-center {
    padding: 0 10px;
  }
}
</style>
