<script setup>
import Navbar from './components/navbar.vue'
</script>

<template>
<div>
  <header>
    <Navbar/>
  </header>
  <main>
    <router-view />
  </main>
</div>

</template>

<style scoped>
main {
  min-height: calc(100vh - 80px);
}
</style>
