import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import type { IElevators, ILevels } from "@/types/elevatorStor";

export const useElevatorStore = defineStore("elevator", () => {
  const elevators = ref<IElevators[]>([]);
  const levels = ref<ILevels[]>([]);

  const levelsCount = ref<number>(8);
  const elevatorsCount = ref<number>(1);

  const test = computed(() => {
    return;
  });

  // settings
  const speed = ref<number>(1);
  const restTime = ref<number>(3);

  const handleBtnClick = (destLevel: number) => {
    const closestElevator = findElevator(destLevel);
    if (closestElevator) {
      levels.value[destLevel].pressed = true;
      closestElevator.tasks.push(destLevel);
      if (closestElevator.ready) {
        moveElevator(closestElevator, destLevel);
      }
    }
  };

  const findElevator = (destLevel: number) => {
    const freeElevators = elevators.value.filter((elev) => elev.ready); // найдем все свободные лифты
    if (freeElevators.find((elev) => elev.level === destLevel)) {
      return false;
    } else if (freeElevators.length > 0) {
      return findClosestFreeElevator(freeElevators, destLevel);
    } else {
      const occupancyOfElevators = elevators.value.map((el) => {
        const tasks = el.tasks.slice(0);
        tasks.unshift(el.level);
        let duration = 0;
        if (tasks.length === 0) {
          return 0;
        }
        for (let i = 0; i < tasks.length - 1; i++) {
          duration += Math.abs(tasks[i] - tasks[i + 1]);
        }
        return duration;
      });
      return elevators.value[
        occupancyOfElevators.indexOf(Math.min(...occupancyOfElevators))
      ];
    }
  };

  const findClosestFreeElevator = (
    elevArr: IElevators[],
    destLevel: number
  ) => {
    const min = {
      diff: Math.abs(elevArr[0].level - destLevel),
      index: 0,
    };
    for (let i = 1; i < elevArr.length; i++) {
      const diff = Math.abs(elevArr[i].level - destLevel);
      if (diff < min.diff) {
        min.diff = diff;
        min.index = i;
      }
    }
    return elevators.value.find((elev) => elevArr[min.index] === elev);
  };

  const moveElevator = (elevator: IElevators, destLvl: number) => {
    elevator.ready = false;
    elevator.inMove = true;
    if (elevator.level === destLvl) {
      elevator.inMove = false;
      elevator.rest = true;
      elevator.down = false;
      elevator.up = false;
      setTimeout(() => {
        finishRest(elevator, destLvl);
        saveAppCondition();
      }, restTime.value * 1000);
    } else if (elevator.level < destLvl) {
      elevator.level++;
      elevator.up = true;
      setTimeout(() => {
        moveElevator(elevator, destLvl);
        saveAppCondition();
      }, speed.value * 1000);
    } else if (elevator.level > destLvl) {
      elevator.level--;
      elevator.down = true;
      setTimeout(() => {
        moveElevator(elevator, destLvl);
        saveAppCondition();
      }, speed.value * 1000);
    }
    saveAppCondition();
  };

  const finishRest = (elevator: IElevators, destLvl: number) => {
    elevator.rest = false;
    elevator.ready = true;
    elevator.tasks.shift();
    levels.value[destLvl].pressed = false;
    if (elevator.tasks.length > 0) {
      moveElevator(elevator, elevator.tasks[0]);
    }
    saveAppCondition();
  };

  const createLevels = (count: number) => {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
      resultArr.push({
        id: i,
        pressed: false,
      });
    }
    return resultArr;
  };

  const createElevators = (count: number) => {
    const resultArr = [];
    for (let i = 0; i < count; i++) {
      resultArr.push({
        id: i,
        rest: false,
        inMove: false,
        ready: true,
        level: 0,
        tasks: [],
        down: false,
        up: false,
      });
    }
    return resultArr;
  };

  const saveAppCondition = () => {
    localStorage.setItem("elevators", JSON.stringify(elevators.value));
    localStorage.setItem("levels", JSON.stringify(levels.value));
  };

  watch(
    () => [elevatorsCount.value, levelsCount.value],
    ([newval1, newval2]) => {
      elevators.value = createElevators(newval1);
      levels.value = createLevels(newval2);
      saveAppCondition();
    }
  );

  return {
    elevators,
    levels,
    speed,
    levelsCount,
    elevatorsCount,
    restTime,
    handleBtnClick,
    findElevator,
    findClosestFreeElevator,
    moveElevator,
    finishRest,
    createLevels,
    createElevators,
    saveAppCondition,
  };
});
