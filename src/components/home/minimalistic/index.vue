<template>
  <DayPicker @newCurrent="setCurrentIdx" />
  <div v-if="!lessons" class="loader" :style="injectCss"></div>
  <div class="lessons-wrapper" v-else-if="current.length > 0">
    <div class="lessons">
      <Lesson
        v-for="(lesson, idx) in current"
        :key="idx"
        :name="lesson.name.length < 16 ? lesson.name : lesson.short"
        :time="lesson.time"
        :current="lesson.current"
      />
    </div>
  </div>
  <div class="no-lessons" v-else>There are no lessons that day!</div>
</template>

<script lang="ts">
import {
  filterLessons,
  getDayByIdx,
  getLessons,
  getToday,
  markCurrent,
} from "@/api";
import { LessonDTO } from "@/models/lesson";
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
import DayPicker from "./DayPicker.vue";
import Lesson from "./Lesson.vue";

export default defineComponent({
  name: "Minimalistic",
  components: {
    DayPicker,
    Lesson,
  },
  setup() {
    const settings: Settings | undefined = inject("settings");
    const lessons = ref<TimetableData | null>(null);
    const current = ref<LessonDTO[] | null>(null);
    const currentIdx = ref(getToday());
    onMounted(() =>
      getLessons().then((data) => {
        if (settings) {
          filterLessons(data, settings.angInf, settings.wf, settings.lang);
        }
        markCurrent(data); // Initial check
        const timetableData = reactive(data);
        lessons.value = timetableData;
        current.value =
          timetableData[getDayByIdx(currentIdx.value) as keyof TimetableData];
        setInterval(() => {
          markCurrent(timetableData);
        }, 5000);
      })
    );
    const setCurrentIdx = (idx: number) => {
      currentIdx.value = idx;
      if (lessons.value) {
        current.value = lessons.value[getDayByIdx(idx) as keyof TimetableData];
      }
    };

    const injectCss = computed(() => ({
      "--font-color": settings?.fontColor,
    }));
    return { lessons, current, setCurrentIdx, injectCss };
  },
});
</script>

<style scoped>
.lessons-wrapper {
  min-height: calc(80vh - 230px);
  width: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
}

.lessons {
  max-width: min(80%, 1400px);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.no-lessons {
  width: 100%;
  font-size: 22px;
  text-align: center;
  user-select: none;
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
