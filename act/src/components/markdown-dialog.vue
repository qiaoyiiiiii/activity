<template>
  <div>
    <el-input
      :type="inputType"
      :rows="inputRows"
      v-model="displayContent"
      :placeholder="placeholder"
      @click="openMarkdownDialog"
      readonly
    ></el-input>
    
    <Dialog
      :dialogVisible="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :loading="loading"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <div class="markdown-preview" v-html="previewContent"></div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { marked } from "marked";
import { ElMessage } from "element-plus";
import Dialog from "./dialog.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "点击查看详情",
  },
  dialogTitle: {
    type: String,
    default: "详情内容",
  },
  dialogWidth: {
    type: [String, Number],
    default: "80%",
  },
  inputType: {
    type: String,
    default: "textarea",
  },
  inputRows: {
    type: Number,
    default: 4,
  }
});

const emit = defineEmits(["update:modelValue"]);

const displayContent = ref(props.modelValue);
const dialogVisible = ref(true);
const loading = ref(false);

// 计算预览内容
const previewContent = computed(() => {
  return marked(displayContent.value || "");
});

// 监听内容变化
watch(
  () => props.modelValue,
  (newVal) => {
    displayContent.value = newVal;
  }
);

// 打开Markdown对话框
const openMarkdownDialog = () => {
  dialogVisible.value = true;
};

// 确认
const handleConfirm = () => {
  dialogVisible.value = false;
};

// 取消
const handleCancel = () => {
  dialogVisible.value = false;
};
</script>

<style scoped>
.markdown-preview {
  font-size: 14px;
  line-height: 1.6;
  padding: 15px;
}

.markdown-preview :deep(h1) {
  font-size: 24px;
  margin: 16px 0;
}

.markdown-preview :deep(h2) {
  font-size: 20px;
  margin: 14px 0;
}

.markdown-preview :deep(h3) {
  font-size: 18px;
  margin: 12px 0;
}

.markdown-preview :deep(p) {
  margin: 12px 0;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 20px;
  margin: 12px 0;
}

.markdown-preview :deep(code) {
  background-color: #f6f6f6;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-preview :deep(pre) {
  background-color: #f6f6f6;
  padding: 12px;
  border-radius: 4px;
  margin: 12px 0;
  overflow-x: auto;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #dcdfe6;
  padding: 0 12px;
  color: #606266;
  margin: 12px 0;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid #dcdfe6;
  padding: 8px;
  text-align: left;
}

.markdown-preview :deep(th) {
  background-color: #f5f7fa;
}
</style>
