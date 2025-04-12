<template>
  <div class="activity">
    <div class="activity-header">
      <div class="search-section">
        <el-input
          v-model="formData.title"
          placeholder="搜索活动..."
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
        <el-select
          v-model="formData.category"
          placeholder="排序方式"
          class="custom-select"
          style="width: 120px"
          width="120px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="empty" v-if="!activity.length">
      <el-empty description="暂无活动"></el-empty>
    </div>
    <div class="activity-container" v-else>
      <el-card
        v-for="dept in activity"
        :key="dept.id"
        class="activity-card"
      >
        <div class="card-content">
          <div class="image-container">
            <el-image
              :src="dept.image"
              fit="cover"
              class="activity-image"
            ></el-image>
            <div class="date-badge">
              <div class="day">{{ dept.day }}</div>
              <div class="month-year">{{ dept.monthYear }}</div>
            </div>
          </div>

          <div class="activity-info">
            <h2 class="activity-title">{{ dept.title }}</h2>
            <p class="activity-description">{{ dept.description }}</p>

            <el-button class="learn-more-btn" size="small" round @click="goDetail(dept)">
              了解更多>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        current-page="currentPage"
        page-size="pageSize"
        hide-on-single-page
        :page-sizes="[6, 12, 24, 36]"
        :total="activity.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { Search } from "@element-plus/icons-vue";

const currentPage = ref(1);
const pageSize = ref(6);
const proxy=getCurrentInstance().proxy;

// 分页数据计算属性
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return activity.value.slice(start, end);
});

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

const activity = ref([
  {
    id: 1,
    title: "体育科学学院: 跃动青春，理琢学海之韵",
    description:
      "体育科学学院成立于2018年4月，其前身体育教育中心成立于2015年5月。体育科学学院现设有体育教育专业、休闲...",
    image: "/images/sports-activity.jpg",
    day: "25",
    monthYear: "2024-06",
  },
  {
    id: 2,
    title: "健康学院: 乘南粤湾区发展大势 育健康中国未来人才",
    description:
      "健康学院于2017年6月揭牌成立，是我校重点建设的新医科学院。学院下设健康管理系和护理学系共4个教研...",
    image: "/images/health-activity.jpg",
    day: "22",
    monthYear: "2024-06",
  },
]);
const options = ref([
  { label: "综合排序", value: "1" },
  { label: "最新发布", value: "2" },
  { label: "最多参与", value: "3" },
]);
const formData = ref({
  title: "",
  category: "综合排序",
});

const goDetail = (dept) => {
    proxy.$router.push(`/activity/${dept.id}`);
};
</script>
<style scoped>
/* 搜索区域样式 */
.search-section {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
}

.search-input :deep(.el-input__wrapper) {
  background-color: var(--vt-c-white);
  border-radius: 20px;
  box-shadow: none;
  max-width: 300px;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--color-border) inset;
}

/* Select样式 */
.custom-select :deep(.el-input__wrapper) {
  background-color: transparent;
  box-shadow: none !important;
  padding-left: 0;
}

.custom-select :deep(.el-input__wrapper:hover),
.custom-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: none !important;
}

/* 分页器样式 */
.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: 100%;
  }

  .custom-select {
    width: 100% !important;
  }
}

.activity {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 20px 20px 20px;
}

.activity-card {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-background-soft);
}

.activity-card:hover {
  background-color: var(--vt-c-white);
}

.card-content {
  display: flex;
  align-items: flex-start;
}

.image-container {
  position: relative;
  width: 40%;
  min-width: 300px;
}

.activity-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.date-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  border-top: 3px solid #e74c3c;
  width: 60px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.day {
  font-size: 24px;
  font-weight: bold;
  padding: 5px;
  color: #333;
}

.month-year {
  font-size: 12px;
  color: #999;
  padding-bottom: 5px;
}

.activity-info {
  padding: 20px;
  flex: 1;
}

.activity-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 500;
}

.activity-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.learn-more-btn {
  background-color: #ccc;
  border-radius: 20px 0 20px 0;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.activity-card:hover .learn-more-btn {
  background-color: #c72348;
  color: white;
}

@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
  }

  .image-container {
    width: 100%;
  }

  .activity-info {
    padding: 15px;
  }
}
:deep(.el-select__wrapper) {
  border: 0px;
  background: var(--color-background-soft);
  box-shadow: none;
}

:deep(.el-select__wrapper.is-focused) {
  border: 0px;
  background: var(--color-background-soft);
  box-shadow: none;
}
</style>
