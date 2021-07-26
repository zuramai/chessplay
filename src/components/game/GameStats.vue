<template>
  <div class="game-stats w-full bg-[#2b2b2b] p-12 text-center rounded-lg">
    <h1 class="text-6xl text-white">{{ capitalizeFirstLetter(turn) }}</h1>
    <p class="text-xl text-light-800">turn</p>
  </div>
  <div class="game-stats w-full bg-[#2b2b2b] p-8 rounded-lg mt-5">
    <h3 class="text-lg text-white font-bold">Moves history</h3>
    <div class="moves-history">
      <table class="w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>White</th>
            <th>Black</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(move, index) in movesHistory" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ helper.notationsFromObject(move.white) }}</td>
            <td>{{ helper.notationsFromObject(move.black) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import helper from "./GameHelper";

const store = useStore();

let turn = computed(() => store.state.turn);

const capitalizeFirstLetter = (string) =>
  string[0].toUpperCase() + string.slice(1);

let movesHistory = computed(() => store.state.movesHistory);
</script>
<style lang="scss">
.moves-history {
  overflow-y: hidden;
  max-height: 400px;
  min-height: 300px;
  table {
    display: table;
    color: #ccc;
    thead {
      text-align: left;
    }
    tbody {
      max-height: 400px;
    }
    td:first-child,
    th:first-child {
      max-width: 1rem;
    }
    th,
    td {
      padding: 0.5rem;
    }
  }
}
</style>
