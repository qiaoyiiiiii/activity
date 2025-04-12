<template>
  <v-md-editor
    :model-value="modelValue"
    :height="height + 'px'"
    :disable-menus="[]"
    :include-level="[1, 2, 3, 4, 5, 6]"
    @upload-image="uploadImageHandler"
    @change="change"
  >
  </v-md-editor>
</template>

<script setup>
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// highlightjs
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式

import { getCurrentInstance } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const content = ref(props.modelValue);
const previewContent = ref("");
const textareaRef = ref(null);

// 监听内容变化
watch(
  () => props.modelValue,
  (newVal) => {
    content.value = newVal;
    // updatePreview();
  },
  { immediate: true }
);

// 更新预览内容
const updatePreview = () => {
  previewContent.value = marked(content.value || "");
};

// 处理输入
const handleInput = () => {
  emit("update:modelValue", content.value);
  emit("change", content.value);
  updatePreview();
};

// 插入文本
const insertText = (prefix, suffix = "") => {
  const textarea = textareaRef.value.$el.querySelector("textarea");
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.value.substring(start, end);

  const newText =
    content.value.substring(0, start) +
    prefix +
    selected +
    suffix +
    content.value.substring(end);

  content.value = newText;
  emit("update:modelValue", content.value);
  updatePreview();

  // 恢复焦点并设置光标位置
  textarea.focus();
  const newCursorPos = start + prefix.length + selected.length + suffix.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);
};

// 插入链接
const insertLink = () => {
  ElMessage.prompt("请输入链接地址", "插入链接", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    inputErrorMessage: "请输入有效的URL",
  }).then(({ value }) => {
    insertText("[链接文字](", ")");
  });
};

// 插入图片
const insertImage = () => {
  ElMessage.prompt("请输入图片地址", "插入图片", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    inputErrorMessage: "请输入有效的URL",
  }).then(({ value }) => {
    insertText("![图片描述](", ")");
  });
};

// 初始化预览
updatePreview();
</script>

<style scoped>
.markdown-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.toolbar {
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.editor-container {
  display: flex;
  min-height: 400px;
}

.editor-wrapper {
  flex: 1;
  border-right: 1px solid #dcdfe6;
  padding: 15px;
}

.preview-wrapper {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.preview-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-textarea__inner) {
  border: none;
  resize: none;
  min-height: 360px !important;
}

:deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

.markdown-preview {
  font-size: 14px;
  line-height: 1.6;
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
