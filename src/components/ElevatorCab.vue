<script setup lang="ts">
import { useElevatorStore } from "@/stores/elevatorStore";
import { computed } from "vue";

const prop = defineProps<{
  data: {
    rest: boolean;
    inMove: boolean;
    ready: boolean;
    level: number;
    tasks: Array<number>;
    up: boolean;
    down: boolean;
  };
  levelsCount: number;
}>();
const elevatorStore = useElevatorStore();

const elevStyles = computed(() => {
  return {
    height: `${100 / prop.levelsCount}%`,
    transform: `translateY(${-(prop.data.level * 100)}%)`,
    transition: `transform ${elevatorStore.speed}s linear`,
  };
});
</script>

<template>
  <div
    class="elevator-cab"
    :style="elevStyles"
    :class="{
      'elevator-cab_up': data.up,
      'elevator-cab_down': data.down,
      'elevator-cab_rest': data.rest,
    }"
  >
    <img
      v-if="data.inMove"
      class="elevator-cab__direction"
      src="../../public/arrow-sm-down-svgrepo-com.svg"
      alt="direction icon"
      :class="{ 'elevator-cab__direction_up': data.up }"
    />
    <span v-if="data.inMove" class="elevator-cab__destination">{{
      data.tasks[0] + 1
    }}</span>
  </div>
</template>
