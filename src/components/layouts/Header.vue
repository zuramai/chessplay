<template>
  <div
    id="header"
    class="header | shadow-md w-full h-16 px-5 py-2 flex items-center"
  >
    <nav class="header__navbar | container mx-auto flex justify-between">
      <div class="navbar__logo">
        <Logo />
      </div>
    </nav>
  </div>
</template>
<script setup>
import Logo from "@/components/Logo/Logo.vue";
</script>
<style lang="postcss">
.header {
  background-color: #2b2b2b;
}
</style>
