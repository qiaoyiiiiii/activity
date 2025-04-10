<template>
  <div class="home">
    <!-- 轮播图区域 -->
    <div class="carousel">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(activity, index) in featuredActivities" :key="index">
          <img :src="activity.image" :alt="activity.name" />
          <div class="carousel-caption">
            <h3>{{ activity.name }}</h3>
            <p>{{ activity.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 最新活动列表 -->
    <div class="latest-activities">
      <h2 class="section-title">最新活动</h2>
      <div class="activity-grid">
        <div v-for="(activity, index) in latestActivities" :key="index" class="activity-card" @click="viewDetails(activity.id)">
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.name">
            <div class="activity-date">{{ activity.time }}</div>
          </div>
          <div class="activity-content">
            <h3 class="activity-title">{{ activity.name }}</h3>
            <p class="activity-location"><el-icon><Location /></el-icon> {{ activity.location }}</p>
            <p class="activity-participants"><el-icon><User /></el-icon> 已有 {{ activity.participants }} 人报名</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐活动区域 -->
    <div class="recommended-activities">
      <h2 class="section-title">推荐活动</h2>
      <div class="activity-grid">
        <div v-for="(activity, index) in recommendedActivities" :key="index" class="activity-card" @click="viewDetails(activity.id)">
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.name">
            <div class="activity-date">{{ activity.time }}</div>
          </div>
          <div class="activity-content">
            <h3 class="activity-title">{{ activity.name }}</h3>
            <p class="activity-location"><el-icon><Location /></el-icon> {{ activity.location }}</p>
            <p class="activity-participants"><el-icon><User /></el-icon> 已有 {{ activity.participants }} 人报名</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动分类区域 -->
    <div class="activity-categories-section">
      <h2 class="section-title">活动分类</h2>
      <div class="category-grid">
        <div v-for="(category, index) in categories" :key="index" class="category-card" @click="filterByCategory(category)">
          <div class="category-icon">
            <el-icon v-if="index === 0"><Reading /></el-icon>
            <el-icon v-else-if="index === 1"><Football /></el-icon>
            <el-icon v-else-if="index === 2"><Film /></el-icon>
            <el-icon v-else><UserFilled /></el-icon>
          </div>
          <h3 class="category-title">{{category}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 轮播图数据
const featuredActivities = ref([
  { name: '活动1', description: '这是活动1的简介', image: '	https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover' },
  { name: '活动2', description: '这是活动2的简介', image: '	https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover' },
  { name: '活动3', description: '这是活动3的简介', image: '	https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover' }
]);

// 最新活动数据
const latestActivities = ref([
  {
    id: 1,
    name: '好游戏的基石：连接、创意与创新',
    time: '2025.03.20',
    location: '旧金山湾区',
    participants: 520,
    image: '	https://static.www.tencent.com/uploads/2025/03/24/571ae629ece530a801b7092ab3e63f73.jpg!article.cover'
  },
  {
    id: 2,
    name: '人工智能与教育的融合',
    time: '2025.04.15',
    location: '线上直播',
    participants: 1024,
    image: 'https://via.placeholder.com/400x250/6cb2eb/ffffff?text=AI教育峰会'
  },
  {
    id: 3,
    name: '2025春季校园音乐节',
    time: '2025.05.01',
    location: '中央广场',
    participants: 768,
    image: 'https://via.placeholder.com/400x250/ff6b6b/ffffff?text=校园音乐节'
  },
  {
    id: 4,
    name: '创新创业大赛',
    time: '2025.05.20',
    location: '创业中心',
    participants: 256,
    image: 'https://via.placeholder.com/400x250/a7e8e2/333333?text=创新创业大赛'
  },
  {
    id: 5,
    name: '环保志愿者招募',
    time: '2025.06.05',
    location: '生态公园',
    participants: 128,
    image: 'https://via.placeholder.com/400x250/b8d8f5/333333?text=环保志愿者招募'
  },
  {
    id: 6,
    name: '摄影艺术展',
    time: '2025.06.15',
    location: '艺术中心',
    participants: 384,
    image: 'https://via.placeholder.com/400x250/5edfd7/ffffff?text=摄影艺术展'
  },
  {
    id: 7,
    name: '国际文化交流周',
    time: '2025.07.01',
    location: '国际会议中心',
    participants: 512,
    image: 'https://via.placeholder.com/400x250/7fc1f4/ffffff?text=文化交流周'
  },
  {
    id: 8,
    name: '夏季运动会',
    time: '2025.07.15',
    location: '体育场',
    participants: 896,
    image: 'https://via.placeholder.com/400x250/ff9f7f/ffffff?text=夏季运动会'
  }
]);

// 活动分类数据
const categories = ref(['学术讲座', '体育赛事', '文艺活动', '社团活动']);

// 推荐活动数据
const recommendedActivities = ref([
  {
    id: 101,
    name: '全球创新科技展',
    time: '2025.08.10',
    location: '科技馆',
    reason: '热门活动',
    image: 'https://via.placeholder.com/400x250/4ecdc4/ffffff?text=创新科技展'
  },
  {
    id: 102,
    name: '青年创业论坛',
    time: '2025.08.20',
    location: '创业中心',
    reason: '根据您的兴趣推荐',
    image: 'https://via.placeholder.com/400x250/6cb2eb/ffffff?text=创业论坛'
  },
  {
    id: 103,
    name: '国际电影节',
    time: '2025.09.01',
    location: '艺术中心',
    reason: '热门活动',
    image: 'https://via.placeholder.com/400x250/ff6b6b/ffffff?text=国际电影节'
  },
  {
    id: 104,
    name: '人工智能大会',
    time: '2025.09.15',
    location: '国际会议中心',
    reason: '热门活动',
    image: 'https://via.placeholder.com/400x250/a7e8e2/333333?text=AI大会'
  }
]);


// 查看活动详情
const viewDetails = (activityId) => {
  // 跳转到活动详情页
  console.log('查看活动详情:', activityId);
};

// 根据分类筛选活动
const filterByCategory = (category) => {
  // 跳转到活动列表页并筛选对应分类的活动
  console.log('筛选分类:', category);
};
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

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading);
  font-size: 2rem;
  position: relative;
  padding-bottom: 1rem;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
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

.activity-location, .activity-participants {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.activity-location .el-icon, .activity-participants .el-icon {
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
