<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useElevatorStore } from "@/stores/elevatorStore";
import ElevatorCab from "./ElevatorCab.vue";
import ElevatorCallButton from "./ElevatorCallButton.vue";

const elevatorStore = useElevatorStore();
const minFloors = ref<number>(2);
const maxFloors = ref<number>(15);

onMounted(() => {
  const elevators = JSON.parse(localStorage.getItem("elevators") as string);
  const levels = JSON.parse(localStorage.getItem("levels") as string);
  if (elevators && levels) {
    elevatorStore.elevators = elevators;
    elevatorStore.levels = levels;
    elevatorStore.levelsCount = levels.length;
    elevatorStore.elevatorsCount = elevators.length;
    const restingElevators = elevatorStore.elevators.filter((el) => el.rest); // нашли "отдыхающие" лифты
    restingElevators.forEach((el) => elevatorStore.finishRest(el, el.level)); // завершили их "отдых"

    const movingElevators = elevatorStore.elevators.filter((el) => el.inMove);
    movingElevators.forEach((el) =>
      elevatorStore.moveElevator(el, el.tasks[0])
    );
  } else {
    elevatorStore.elevators = elevatorStore.createElevators(
      elevatorStore.elevatorsCount
    );
    elevatorStore.levels = elevatorStore.createLevels(
      elevatorStore.levelsCount
    );
    elevatorStore.saveAppCondition();
  }
});

const floorStyles = computed(() => {
  return { height: `${100 / elevatorStore.levels.length}%` };
});
</script>

<template>
  <div class="main-content">
    <div class="building">
      <div class="elevators">
        <ElevatorCab
          v-for="data in elevatorStore.elevators"
          :key="data.id"
          :data="data"
          :levelsCount="elevatorStore.levels.length"
        />
      </div>
      <div class="floors">
        <div
          class="floor"
          v-for="(floor, index) in elevatorStore.levels"
          :key="index"
          :style="floorStyles"
        >
          <span class="floor__sign">{{ index + 1 + " этаж" }}</span>
          <ElevatorCallButton :floor="floor" :level="index" />
        </div>
      </div>
    </div>

    <div class="control-panel">
      <h3>Настройка лифта</h3>
      <div class="control-panel-wrapper">
        <div class="control__item">
          <h4>Этажей</h4>
          <button
            @click="elevatorStore.levelsCount--"
            type="button"
            class="button-conrtol"
            aria-label="Убрать один этаж"
          >
            <svg width="10" height="10" fill="white">
              <path d="M8.287 2.574H.7V.765h7.587v1.809z"></path>
            </svg>
          </button>

          <input
            class="input-control"
            type="text"
            v-model="elevatorStore.levelsCount"
          />

          <button
            @click="elevatorStore.levelsCount++"
            class="button-conrtol"
            type="button"
            aria-label="Добавить один этаж"
          >
            <svg width="12" height="12" fill="white">
              <path
                d="M6.524 11.086h-1.43v-4.51H.54V5.102h4.554V.57h1.43v4.532h4.554v1.474H6.524v4.51z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="control__item">
          <h4>Лифты</h4>
          <button
            @click="elevatorStore.elevatorsCount--"
            type="button"
            class="button-conrtol"
            aria-label="Убрать один этаж"
          >
            <svg width="10" height="10" fill="white">
              <path d="M8.287 2.574H.7V.765h7.587v1.809z"></path>
            </svg>
          </button>

          <input
            class="input-control"
            type="text"
            v-model="elevatorStore.elevatorsCount"
          />

          <button
            @click="elevatorStore.elevatorsCount++"
            class="button-conrtol"
            type="button"
            aria-label="Добавить один этаж"
          >
            <svg width="12" height="12" fill="white">
              <path
                d="M6.524 11.086h-1.43v-4.51H.54V5.102h4.554V.57h1.43v4.532h4.554v1.474H6.524v4.51z"
              ></path>
            </svg>
          </button>
        </div>
        <div class="control__item">
          <h4>Время стоянки (сек)</h4>
          <button
            @click="elevatorStore.restTime--"
            type="button"
            class="button-conrtol"
            aria-label="Убрать один этаж"
          >
            <svg width="10" height="10" fill="white">
              <path d="M8.287 2.574H.7V.765h7.587v1.809z"></path>
            </svg>
          </button>

          <input
            class="input-control"
            type="text"
            v-model="elevatorStore.restTime"
          />

          <button
            @click="elevatorStore.restTime++"
            class="button-conrtol"
            type="button"
            aria-label="Добавить один этаж"
          >
            <svg width="12" height="12" fill="white">
              <path
                d="M6.524 11.086h-1.43v-4.51H.54V5.102h4.554V.57h1.43v4.532h4.554v1.474H6.524v4.51z"
              ></path>
            </svg>
          </button>
        </div>
        <div
          class="control__item"
          style="flex-direction: column; align-items: flex-start"
        >
          <span
            >Скорость лифта в секундах (время прохождение одного этажа)</span
          >
          <div style="display: flex; align-items: center; gap: 10px">
            <h4>Скорость этажа:</h4>
            <button
              @click="elevatorStore.speed--"
              type="button"
              class="button-conrtol"
              aria-label="Убрать один этаж"
            >
              <svg width="10" height="10" fill="white">
                <path d="M8.287 2.574H.7V.765h7.587v1.809z"></path>
              </svg>
            </button>

            <input
              class="input-control"
              type="text"
              v-model="elevatorStore.speed"
            />

            <button
              @click="elevatorStore.speed++"
              class="button-conrtol"
              type="button"
              aria-label="Добавить один этаж"
            >
              <svg width="12" height="12" fill="white">
                <path
                  d="M6.524 11.086h-1.43v-4.51H.54V5.102h4.554V.57h1.43v4.532h4.554v1.474H6.524v4.51z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-panel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.control__item {
  display: flex;
  gap: 10px;
  align-items: center;
}
.button-conrtol {
  margin: 0;
  padding: 0;
  font: inherit;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #ffffff;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.button-conrtol:hover {
  background-color: #6e6e6e;
  border-color: rgb(0, 0, 0);
}
.input-control {
  padding: 5px 5px;
  height: 30px;
  width: 40px;
  border-radius: 0;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  box-shadow: none;
  color: #222;
  font: inherit;
  line-height: 1;
  text-align: center;
}
.input-control:focus-visible {
  outline: 1px solid black;
}
</style>
