<template>
  <div class="messages-page">
    <message-center />
  </div>
</template>

<script setup>
import MessageCenter from '../components/MessageCenter.vue';
</script>

<style scoped>
.messages-page {
  padding: 20px 0;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}
</style>
