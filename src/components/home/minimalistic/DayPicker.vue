<template>
  <div class="main" :style="mainCss">
    <div class="switcher">
      <button @click="setPrev" class="btn arrow">
        <ion-icon name="chevron-back-outline" />
      </button>
      <div class="date-container">
        <button @click="setToday" class="btn">{{ currentDay }}</button>
        <div class="date">{{ currentDate }}</div>
      </div>
      <button @click="setNext" class="btn arrow">
        <ion-icon name="chevron-forward-outline" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { getToday } from "@/api";
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref, watch } from "vue";
import { DAYS } from "../../../consts";

export default defineComponent({
  name: "DayPicker",
  emits: ["newCurrent"],
  setup(_, ctx) {
    const settings: Settings | undefined = inject("settings");
    const currentIdx = ref(getToday());
    const currentOffset = ref(0);
    const currentDay = ref(DAYS[currentIdx.value]);
    const currentDate = ref(new Date().toISOString().split("T")[0]);

    const setPrev = () => {
      currentIdx.value = currentIdx.value === 0 ? 6 : currentIdx.value - 1;
      if (currentIdx.value === 6) {
        currentOffset.value = currentOffset.value - 7;
      }
    };

    const setNext = () => {
      currentIdx.value = currentIdx.value === 6 ? 0 : currentIdx.value + 1;
      if (currentIdx.value === 0) {
        currentOffset.value = currentOffset.value + 7;
      }
    };

    watch(currentIdx, (newIdx) => {
      currentDay.value = DAYS[newIdx];
      currentDate.value = new Date(
        new Date().getTime() +
          (currentOffset.value - (6 - currentIdx.value)) * 86400000
      )
        .toISOString()
        .split("T")[0];
      const startDate = new Date(currentDate.value);
      const startDay = 1; // 0=sunday, 1=monday etc.
      const d = startDate.getDay(); // get the current day
      const weekStart = new Date(
        startDate.valueOf() - (d <= 0 ? 7 - startDay : d - startDay) * 86400000
      );
      ctx.emit(
        "newCurrent",
        currentIdx.value,
        currentOffset.value,
        weekStart.getTime()
      );
    });

    function setToday() {
      const today = getToday();
      currentIdx.value = today;
      currentOffset.value = 0;
      currentDate.value = new Date().toISOString().split("T")[0];
    }

    const mainCss = computed(() => ({
      "--font-color": settings?.fontColor,
    }));

    return { currentDay, currentDate, mainCss, setPrev, setNext, setToday };
  },
});
</script>

<style scoped>
.main {
  width: 100%;
  height: 20vh;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  color: var(--font-color);
}

@media (max-width: 512px) {
  .main {
    height: 70px;
  }
}

.switcher {
  height: 50px;
  width: 250px;
  font-size: 22px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
}

.btn {
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: inherit;
  text-transform: capitalize;
}

.arrow {
  font-size: 30px;
  padding-top: 8px;
}

.date-container {
  text-align: center;
}

.date {
  font-size: 16px;
}
</style>
