<template>
  <div class="personal-center">
    <el-row :gutter="20">
      <!-- 左侧个人信息 -->
      <el-col :span="8">
        <Personal :iswrite="false" />
      </el-col>

      <!-- 右侧活动列表 -->
      <el-col :span="16">
        <activity-tabs
          :created-activities="createdActivities"
          :participated-activities="participatedActivities"
          @refresh="handleRefresh"
          @tab-change="handleTabChange"
        />
        <!-- 分页器 -->
        <div class="pagination-container">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="[6, 12, 24, 36]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            hide-on-single-page
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import Personal from "../components/personal.vue";
import ActivityTabs from "../components/personal/ActivityTabs.vue";

const proxy = getCurrentInstance().proxy;

// 当前活动标签
const activeTab = ref("created");

// 分页相关
const currentPage = ref(1);
const pageSize = ref(6);
const total = ref(0);

// 用户信息
const user = ref(null);

// 创建的活动和参与的活动
const createdActivities = ref([]);
const participatedActivities = ref([]);

// 处理标签切换
const handleTabChange = (tab) => {
  activeTab.value = tab;
  currentPage.value = 1; // 切换标签时重置到第一页
  fetchActivities();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchActivities();
};

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
  fetchActivities();
};

// 处理刷新请求
const handleRefresh = () => {
  fetchActivities();
};

// 获取活动列表
const fetchActivities = () => {
  const params = {
    page: currentPage.value,
    size: pageSize.value,
  };

  // 根据当前标签加载相应数据
  if (activeTab.value === "created") {
    // 获取创建的活动
    proxy.$request
      .get("/api/activities/my-activities", { params })
      .then((res) => {
        if (res.data.code === 200) {
          createdActivities.value = res.data.created || [];
          total.value = res.data.totalSize || 0;
        }
      })
      .catch((error) => {
        ElMessage.error("获取创建的活动失败");
        console.error(error);
      });
  } else if (activeTab.value === "participated") {
    // 获取参加的活动
    proxy.$request
      .get("/api/activities/my-registrations", { params })
      .then((res) => {
        if (res.data.code === 200) {
          participatedActivities.value = res.data.participated || [];
          total.value = res.data.totalSize || 0;
        }
      })
      .catch((error) => {
        ElMessage.error("获取参加的活动失败");
        console.error(error);
      });
  }
};

// 获取用户信息
const fetchUserInfo = () => {
  const userData = localStorage.getItem("userid");
  if (userData) {
    user.value = JSON.parse(userData);
  } else {
    ElMessage.warning("请先登录");
    window.location.href = "/login";
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchUserInfo();
  fetchActivities(); // 默认加载创建的活动
});
</script>

<style scoped>
.personal-center {
  max-width: var(--content-width);
  margin: 20px auto;
  padding: 0 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .personal-center {
    padding: 0 10px;
  }
}
</style>
