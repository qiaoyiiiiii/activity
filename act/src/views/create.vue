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
      <el-form-item label="活动地址" required>
        <div class="location-inputs">
          <el-select
            v-model="formData.province"
            placeholder="省份/直辖市"
            style="width: 250px"
          >
            <el-option label="北京市" value="beijing" />
          </el-select>
          <el-select
            v-model="formData.city"
            placeholder="地区"
            style="width: 200px"
          >
            <el-option label="北京市" value="haidian" />
          </el-select>
          <el-select
            v-model="formData.city"
            placeholder="地区"
            style="width: 200px"
          >
            <el-option label="海淀区" value="haidian" />
          </el-select>
          <el-input
            v-model="formData.address"
            placeholder="请先选择省市，然后输入详细地址"
          />
        </div>
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
          value-key="label"
          clearable
        >
          <el-option
            v-for="item in categories.category"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
            <el-tag type="success">{{ item.label }}</el-tag>
          </el-option>
          <template #tag>
            <el-tag type="success">{{ formData.type }}</el-tag>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item label="活动详情">
        <el-input
          type="textarea"
          :rows="4"
          v-model="formData.description"
          placeholder="点击编辑活动详情（支持Markdown格式）"
          @click="openMarkdownEditor"
          readonly
        ></el-input>
      </el-form-item>
    </el-form>
    <Dialog
      :dialogVisible="dialogVisible"
      title="编辑活动详情（Markdown格式）"
      width="80%"
      :loading="loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <Markdown v-model="markdownContent" @change="handleChange" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import categories from "../static/category.js";
import Dialog from "../components/dialog.vue";
import Markdown from "../components/markdown.vue";

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
  description: "ao",
});

const dialogVisible = ref(true);
const loading = ref(false);
const markdownContent = ref("");

// 打开Markdown编辑器
const openMarkdownEditor = () => {
  // 将当前活动详情内容设置到Markdown编辑器
  markdownContent.value = formData.value.description;
  dialogVisible.value = true;
};

// 确认编辑
const handleConfirm = () => {
  loading.value = true;
  try {
    // 将Markdown编辑器的内容保存到活动详情
    formData.value.description = markdownContent.value;
    ElMessage.success("活动详情已更新");
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error("保存失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 取消编辑
const handleCancel = () => {
  // 不保存更改，直接关闭对话框
  dialogVisible.value = false;
  ElMessage.info("已取消编辑");
};

// 处理Markdown内容变化
const handleChange = (value) => {
  markdownContent.value = value;
};

// 处理活动海报上传
const beforePosterUpload = (file) => {
  // 处理图片上传逻辑
  const isImage = file.type.startsWith("image/");
  const isLt4M = file.size / 1024 / 1024 < 4;

  if (!isImage) {
    ElMessage.error("活动海报只能是图片格式!");
    return false;
  }
  if (!isLt4M) {
    ElMessage.error("活动海报大小不能超过 4MB!");
    return false;
  }
  return true;
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
  width: 100%;
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
