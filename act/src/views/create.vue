<template>
  <div class="create-activity">
    <div>
      <h1 class="base-info__title">基本信息</h1>
    </div>

    <el-form :model="formData" label-position="top" class="activity-form">
      <!-- 活动标题 -->
      <el-form-item label="活动标题" required>
        <el-input
          v-model="formData.title"
          placeholder="不少于5个字，最多50个字"
        />
      </el-form-item>

      <!-- 举办时间 -->
      <el-form-item label="举办时间" required>
        <div class="time-range">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="开始时间"
          />
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="结束时间"
          />
        </div>
      </el-form-item>

      <!-- 活动地址 -->
      <el-form-item label="活动地址" required style="flex-direction: row">
        <div class="location-inputs">
          <el-select
            v-model="formData.country"
            placeholder="国家"
            width="100px"
          >
            <el-option label="中国" value="china" />
          </el-select>
          <el-select
            v-model="formData.province"
            placeholder="省份/直辖市"
            width="100px"
          >
            <el-option label="北京市" value="beijing" />
          </el-select>
          <el-select
            v-model="formData.city"
            placeholder="城市/地区"
            width="100px"
          >
            <el-option label="海淀区" value="haidian" />
          </el-select>
        </div>
           <el-input
            v-model="formData.address"
            placeholder="请先选择省市，然后输入详细地址"
          />
      </el-form-item>

      <!-- 活动海报 -->
      <el-form-item label="活动海报" required>
        <div class="poster-upload">
          <div class="upload-area">
            <el-upload
              class="poster-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforePosterUpload"
            >
              <div class="upload-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传海报</span>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="upload-tips">
                      <el-button type="success" class="poster-library-btn"
            >海报图库</el-button
          >
          <p>温馨提示：</p>
          <p>1、图片尺寸 1080*640，jpg 或 .png格式，不超过 4M</p>
          <p>2、精美海报有助于增加报名量，并有机会获得力推荐！</p>
        </div>
      </el-form-item>

      <!-- 活动类型 -->
      <el-form-item label="活动类型" required>
        <el-select
          v-model="formData.type"
          placeholder="请选择活动类型，仅支持1个"
        >
          <el-option label="讲座" value="lecture" />
          <el-option label="展览" value="exhibition" />
          <el-option label="音乐会" value="concert" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

const formData = ref({
  title: "",
  startTime: "",
  endTime: "",
  country: "中国",
  province: "",
  city: "",
  address: "",
  hideLocation: false,
  hasLiveStream: false,
  type: "",
});

const beforePosterUpload = (file) => {
  // 处理图片上传逻辑
};
</script>

<style scoped>
.create-activity {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 20px;
}

.base-info__title {
  line-height: calc(1.3rem+var(--section-gap));
  padding-left: 30px;
  border-bottom: 1px solid #03b349;
  color: #03b349;
  font-weight: bold;
  margin-right: -30px;
  font-size: 1.3rem;
  margin-bottom: 1em;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--color-border);
}

.form-header h2 {
  color: var(--color-heading);
  font-size: 18px;
  font-weight: 500;
}

.usage-guide {
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
}

.activity-form {
  max-width: 800px;
}

.time-range {
  display: flex;
  gap: 20px;
}

.location-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.location-inputs :deep(.el-select) {
  flex: 1;
}

.location-checkbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.location-help {
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
}

.poster-upload {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.upload-area {
  width: 300px;
  height: 180px;
  border: 1px dashed var(--color-border);
  border-radius: 4px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  cursor: pointer;
}

.upload-placeholder .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.poster-library-btn {
  height: 40px;
  align-self: flex-start;
}

.upload-tips {
  color: #999;
  font-size: 14px;
  line-height: 1.5;
  margin-left: 3rem;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-radio__label) {
  white-space: normal;
}
</style>
