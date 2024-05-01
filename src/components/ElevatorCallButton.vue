<script setup lang="ts">
import { useElevatorStore } from '@/stores/elevatorStore'

const prop = defineProps<{
  floor: {
    pressed: boolean
    id: number
  }
  level: number
}>()

const elevatorStore = useElevatorStore()

const callElevator = () => {
  if (prop.floor.pressed) {
    return
  }
  elevatorStore.handleBtnClick(prop.level)
}
</script>

<template>
  <button
    type="button"
    class="floor__button"
    @click="callElevator()"
    :class="{
      floor__button_pressed: floor.pressed
    }"
  >
    {{ level + 1 }}
  </button>
</template>
