<template>
  <div v-if="!lessons" class="loader" :style="injectCss"></div>
  <div v-else class="compact-wrapper">
    <Column title="monday" :lessons="lessons.monday" />
    <Column title="tuesday" :lessons="lessons.tuesday" />
    <Column title="wednesday" :lessons="lessons.wednesday" />
    <Column title="thursday" :lessons="lessons.thursday" />
    <Column title="friday" :lessons="lessons.friday" />
  </div>
</template>

<script lang="ts">
import Column from "./Column.vue";
import { filterLessons, getLessons, markCurrent } from "@/api";
import { Settings } from "@/models/settings";
import { TimetableData } from "@/models/timetableData";
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
} from "vue";

export default defineComponent({
  name: "Compact",
  components: {
    Column,
  },
  setup() {
    const settings: Settings | undefined = inject("settings");
    const lessons = ref<TimetableData | null>(null);
    onMounted(() =>
      getLessons(0, 0).then((data) => {
        if (settings) {
          filterLessons(data, settings.angInf, settings.wf, settings.lang);
        }
        markCurrent(data); // Initial check
        const timetableData = reactive(data);
        lessons.value = timetableData;
        setInterval(() => {
          markCurrent(timetableData);
        }, 5000);
      })
    );
    const injectCss = computed(() => ({
      "--font-color": settings?.fontColor,
    }));

    return { lessons, injectCss };
  },
});
</script>

<style scoped>
.compact-wrapper {
  width: 100%;
  min-height: calc(100vh - 230px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.loader {
  background-color: var(--font-color);
  height: 40px;
  width: 40px;
  border-radius: 100%;
  animation: fade 1s ease infinite;
  margin-top: 50px;
  margin-left: calc(50% - 20px);
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
