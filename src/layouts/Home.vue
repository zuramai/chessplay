<template>
  <div id="home">
    <Header />
    <router-view />
  </div>
</template>
<script setup>
import Header from "@/components/layouts/Header.vue";
</script>
<style lang="scss">
#home {
  background-color: #171010;
  min-height: 100vh;
}
</style>
