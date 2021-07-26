<template>
    <div class="game-stats w-full bg-[#2b2b2b] p-12 text-center rounded-lg">
        <h1 class='text-6xl text-white '>{{ capitalizeFirstLetter(turn) }}</h1>
        <p class='text-xl text-light-800'>turn</p>
    </div>
    <div class="game-stats w-full bg-[#2b2b2b] p-8 rounded-lg mt-5">
        <h3 class='text-lg text-white font-bold'>Moves history</h3>
        <div class="moves-history">
            <ul>
                <li class='flex'>
                    
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";

const store = useStore()

let turn = computed(() => store.state.turn)

const capitalizeFirstLetter = (string) =>  string[0].toUpperCase() + string.slice(1)
</script>
<style lang="scss">
    .moves-history {
        min-height: 300px;
        max-height: 400px;
        overflow-y: hidden;
    }
</style>