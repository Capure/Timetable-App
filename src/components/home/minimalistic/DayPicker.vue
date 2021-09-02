<template>
  <div class="main" :style="mainCss">
    <div class="switcher">
      <button @click="setPrev" class="btn arrow">
        <ion-icon name="chevron-back-outline" />
      </button>
      <button @click="setToday" class="btn">{{ currentDay }}</button>
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
    const currentDay = ref(DAYS[currentIdx.value]);

    const setPrev = () => {
      currentIdx.value = currentIdx.value === 0 ? 6 : currentIdx.value - 1;
    };

    const setNext = () => {
      currentIdx.value = currentIdx.value === 6 ? 0 : currentIdx.value + 1;
    };

    watch(currentIdx, (newIdx) => {
      ctx.emit("newCurrent", currentIdx.value);
      currentDay.value = DAYS[newIdx];
    });

    function setToday() {
      const today = getToday();
      currentIdx.value = today;
    }

    const mainCss = computed(() => ({
      "--font-color": settings?.fontColor,
    }));

    return { currentDay, mainCss, setPrev, setNext, setToday };
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
</style>
