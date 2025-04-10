<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-divider"></div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>
      <div class="error-suggestions">
        <p>您可以尝试以下操作：</p>
        <ul>
          <li>检查网址是否正确</li>
          <li>返回上一页</li>
          <li>访问首页</li>
        </ul>
      </div>
      <div class="error-actions">
        <el-button type="primary" @click="goBack" class="action-button">
          <el-icon><Back /></el-icon>
          返回上一页
        </el-button>
        <el-button @click="goHome" class="action-button">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
    <div class="not-found-illustration">
      <div class="illustration-container">
        <div class="character">
          <div class="character-face">
            <div class="character-eyes">
              <div class="eye left"></div>
              <div class="eye right"></div>
            </div>
            <div class="character-mouth"></div>
          </div>
          <div class="character-body"></div>
        </div>
        <div class="lost-sign">
          <div class="sign-post"></div>
          <div class="sign-board">
            <span>迷路了？</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Back, HomeFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background-mute) 100%);
}

.not-found-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  max-width: 600px;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
  text-shadow: 4px 4px 0 var(--color-primary-light);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-divider {
  width: 100px;
  height: 5px;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  border-radius: 2.5px;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 2rem;
}

.error-suggestions {
  margin-bottom: 2rem;
  color: var(--color-text-light);
}

.error-suggestions ul {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.error-suggestions li {
  margin-bottom: 0.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.not-found-illustration {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-container {
  position: relative;
  width: 300px;
  height: 300px;
}

/* 卡通人物 */
.character {
  position: absolute;
  bottom: 20px;
  left: 50px;
  width: 100px;
  height: 150px;
  animation: float 3s ease-in-out infinite;
}

.character-face {
  width: 80px;
  height: 80px;
  background-color: var(--color-primary-light);
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.character-eyes {
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 30px;
  width: 100%;
  padding: 0 15px;
}

.eye {
  width: 12px;
  height: 12px;
  background-color: var(--vt-c-black);
  border-radius: 50%;
  animation: blink 3s ease-in-out infinite;
}

.character-mouth {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 10px;
  border-radius: 0 0 15px 15px;
  background-color: var(--vt-c-black-soft);
}

.character-body {
  width: 60px;
  height: 80px;
  background-color: var(--color-secondary-light);
  border-radius: 20px 20px 10px 10px;
  margin: -10px auto 0;
  position: relative;
  z-index: -1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 迷路标志 */
.lost-sign {
  position: absolute;
  bottom: 20px;
  right: 50px;
  animation: tilt 5s ease-in-out infinite;
}

.sign-post {
  width: 10px;
  height: 100px;
  background-color: var(--color-border);
  margin: 0 auto;
}

.sign-board {
  width: 100px;
  height: 50px;
  background-color: var(--color-accent);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transform: rotate(-5deg);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes blink {
  0%, 45%, 55%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

@keyframes tilt {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .not-found-container {
    flex-direction: column;
  }
  
  .not-found-content {
    max-width: 100%;
    padding: 1rem;
  }
  
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .not-found-illustration {
    margin-top: 2rem;
  }
}

@media (max-width: 600px) {
  .error-actions {
    flex-direction: column;
  }
  
  .error-code {
    font-size: 5rem;
  }
  
  .illustration-container {
    transform: scale(0.8);
  }
}
</style>
