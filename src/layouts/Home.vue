<template>
    <div id="home">
        <Header/>
        <router-view/>
    </div>
</template>
<script setup>
import Header from "@/components/layouts/Header.vue"
</script>
<style lang="scss">
#home {
    background-color: rgba(#deecff,.5);
    min-height: 100vh;
}
</style>