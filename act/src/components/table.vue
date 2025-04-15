<template>
  <el-table
    :data="data"
    style="width: 100%"
    :stripe="true"
    :border="true"
    :highlight-current-row="true"
    class="themed-table"
  >
    <el-table-column label="序号" type="index" width="100"></el-table-column>
    <el-table-column prop="nickname" label="姓名" width="180"></el-table-column>
    <el-table-column prop="username" label="账号"></el-table-column>
  </el-table>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { route } from "vue-router";

const proxy = getCurrentInstance();
const type = ref(proxy.$route.type);
const data = ref([]);

onMounted(() => {
  fetchUsers(type.value);
});
const fetchUsers = async (type) => {
  const activityId = proxy.$route.params.id;
  const res = await proxy.$request.get(
    `/api/activity-registrations/${activityId}/${type}`
  );
  data.value = res.data.user;
};
</script>

<style scoped>
/* 表格主题样式 */
:deep(.el-table) {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--color-border);
}

/* 表头样式 */
:deep(.el-table__header-wrapper th) {
  background: linear-gradient(
    to right,
    var(--color-primary-light),
    var(--color-secondary-light)
  );
  color: var(--color-heading);
  font-weight: 500;
  padding: 12px 0;
}

/* 表格行样式 */
:deep(.el-table__row) {
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: rgba(
    78,
    205,
    196,
    0.1
  ) !important; /* 使用主题色的透明版本 */
}

/* 斑马纹样式 */
:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: var(--color-background-soft);
}

/* 表格单元格样式 */
:deep(.el-table__cell) {
  padding: 12px 0;
  color: var(--color-text);
}

/* 表格边框样式 */
:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid var(--color-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-table) {
    width: 100% !important;
    overflow-x: auto;
  }

  :deep(.el-table__header-wrapper),
  :deep(.el-table__body-wrapper) {
    overflow-x: auto;
  }
}
</style>
