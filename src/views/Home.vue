<template>
    <div class="page-home">
        <div class="container mx-auto py-12">
            <div class="flex flex-wrap">
                <div class="w-full px-5 md:w-2/3">
                    <Game/>
                </div>
                <div class="w-full px-5 md:w-1/3">
                    <GameStats/>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Game from "@/components/game/Game.vue"
import GameStats from "@/components/game/GameStats.vue"
</script>