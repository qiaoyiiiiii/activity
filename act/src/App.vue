<script setup>
import Navbar from './components/navbar.vue'
import Index from'./views/index.vue'
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

</style>
