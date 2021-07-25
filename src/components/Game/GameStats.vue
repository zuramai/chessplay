<template>
  <div class="game-stats w-full bg-[#2b2b2b] p-12 text-center rounded-lg">
    <h1 class="text-6xl text-white">{{ capitalizeFirstLetter(turn) }}</h1>
    <p class="text-xl text-light-800">turn</p>
  </div>
</template>
<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

const store = useStore();

let turn = computed(() => store.state.turn);

const capitalizeFirstLetter = (string) =>
  string[0].toUpperCase() + string.slice(1);
</script>
