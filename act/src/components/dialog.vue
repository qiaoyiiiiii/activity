<template>
  <el-dialog
    v-model="Visible"
    :title="title"
    :width="width"
    destroy-on-close
    class="base-dialog"
    v-bind="$attrs"
  >
    <div class="dialog-content">
      <slot></slot>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: "30%",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const Visible = ref(props.dialogVisible);

watch(
  () => props.dialogVisible,
  (newValue) => {
    Visible.value = newValue;
  }
);
const emit = defineEmits(["cancel", "confirm"]);

const handleCancel = () => {
  emit("cancel");
  Visible.value = false;
};

const handleConfirm = () => {
  emit("confirm");
  Visible.value = false;
};
</script>

<style scoped>
.base-dialog {
  border-radius: 8px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  background: var(--color-background-soft);
  box-shadow: var(--box-shadow);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.el-dialog__title) {
  font-size: 1.2rem;
  color: var(--color-heading);
  font-weight: 500;
}

:deep(.el-dialog__body) {
  padding: 20px;
  color: var(--color-text);
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-button) {
  padding: 8px 20px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

:deep(.el-button--primary:hover) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }
}
</style>
