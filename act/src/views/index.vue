<template>
  <div class="home">
    <!-- 轮播图区域 -->
    <div class="carousel">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item
          v-for="activity in featuredActivities"
          :key="activity.id"
          @click="$router.push(`/detail/${activity.id}`)"
        >
          <img :src="activity.coverImg" :alt="activity.title" />
          <div class="carousel-caption">
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 最新活动列表 -->
    <div class="latest-activities">
      <h2 class="section-title">最新活动</h2>
      <div class="activity-grid">
        <div
          v-for="activity in latestActivities"
          :key="activity.id"
          class="activity-card"
          @click="$router.push(`/detail/${activity.id}`)"
        >
          <div class="activity-image">
            <img :src="activity.coverImg" :alt="activity.name" />
            <div class="activity-date">{{ activity.endTime }}</div>
          </div>
          <div class="activity-content">
            <h3 class="activity-title">{{ activity.title }}</h3>
            <p class="activity-location">
              <el-icon><Location /></el-icon> {{ activity.location }}
            </p>
            <p class="activity-participants">
              <el-icon><User /></el-icon> 已有 {{ activity.number }} 人报名
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动分类区域 -->
    <div class="activity-categories-section">
      <h2 class="section-title">活动分类</h2>
      <div class="category-grid">
        <div
          v-for="(item, index) in categories.category"
          :key="index"
          class="category-card"
          @click="$router.push(`/activity?category=${item.label}`)"
        >
          <div class="category-icon">
            <el-icon :icon="getIcon(item.icon)">
              <component :is="getIcon(item.icon)" />
            </el-icon>
          </div>
          <h3 class="category-title">{{ item.label }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import categories from "../static/category.js";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const getIcon = (iconName) => {
  return ElementPlusIconsVue[iconName]; // 动态获取图标组件
};

// 最新活动数据
const latestActivities = ref([]);
const getlastest = () => {
  proxy.$axios.get("/api/activities?page=1&size=8").then((res) => {
    latestActivities.value = res.data;
  });
};

const featuredActivities = computed(() => {
  return latestActivities.slice(0, 3);
});
</script>

<style scoped>
/* 轮播图样式 */
.carousel {
  width: 100%;
  height: 600px;
}

/* 这是关键样式，确保只定义一次 */
.carousel :deep(.el-carousel__container) {
  height: 600px !important;
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: var(--radius-md);
  max-width: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel {
    height: 400px;
  }

  .carousel :deep(.el-carousel__container) {
    height: 400px !important;
  }
}

/* 最新活动样式 */
.latest-activities {
  padding: 2rem 0;
  background-color: var(--color-background-soft);
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(
    to right,
    var(--color-primary),
    var(--color-secondary)
  );
  border-radius: 2px;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 0 1.5rem;
  max-width: var(--content-width);
  margin: 0 auto;
}

.activity-card {
  background-color: var(--vt-c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
}

.activity-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-border-hover);
}

.activity-image {
  position: relative;
  overflow: hidden;
  height: 350px;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-card:hover .activity-image img {
  transform: scale(1.05);
}

.activity-date {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--color-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.activity-content {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.activity-title {
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  color: var(--color-heading);
  line-height: 1.3;
}

.activity-location,
.activity-participants {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.activity-location .el-icon,
.activity-participants .el-icon {
  margin-right: 0.5rem;
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .activity-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }

  .activity-image {
    height: 180px;
  }
}

/* 推荐活动样式 */
.recommended-activities {
  padding: 2rem 0;
  background-color: var(--color-background-soft);
}

/* 活动分类样式 */
.activity-categories-section {
  padding: 2rem 0;
  background-color: var(--color-background);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 0 1.5rem;
  max-width: var(--content-width);
  margin: 0 auto;
}

.category-card {
  background-color: var(--vt-c-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 2rem 1rem;
  text-align: center;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-border-hover);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.category-icon .el-icon {
  font-size: 2.5rem;
}

.category-title {
  font-size: 1.2rem;
  color: var(--color-heading);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
