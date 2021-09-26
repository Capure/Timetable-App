<template>
  <DayPicker @newCurrent="setCurrentIdx" />
  <div v-if="!lessons" class="loader" :style="injectCss"></div>
  <div class="lessons-wrapper" v-else-if="current.length > 0">
    <div class="lessons">
      <Lesson
        v-for="(lesson, idx) in current"
        :key="idx"
        :name="
          lesson.change
            ? lesson.change.change.type === 2
              ? lesson.change.subject
                ? lesson.change.subject.name
                : 'Substitution'
              : lesson.name
            : lesson.name.length < 16
            ? lesson.name
            : lesson.short
        "
        :time="lesson.time"
        :room="lesson.room ? lesson.room.code : ' '"
        :current="lesson.current"
        :sub="lesson.change ? lesson.change.change.type === 2 : false"
        :cancelled="lesson.change ? lesson.change.change.type === 1 : false"
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
    const currentOffset = ref(0);
    const currentWeekStart = ref(1);
    const currentInterval = ref(0);
    const fetchLessons = () => {
      getLessons(currentWeekStart.value, currentOffset.value).then((data) => {
        if (settings) {
          filterLessons(data, settings.angInf, settings.wf, settings.lang);
        }
        markCurrent(data); // Initial check
        const timetableData = reactive(data);
        lessons.value = timetableData;
        current.value =
          timetableData[getDayByIdx(currentIdx.value) as keyof TimetableData];
        currentInterval.value = setInterval(() => {
          markCurrent(timetableData);
        }, 5000);
      });
    };
    onMounted(() => {
      const now = new Date(new Date().toISOString().split("T")[0]);
      const startDay = 1; // 0=sunday, 1=monday etc.
      const d = now.getDay(); // get the current day
      const weekStart = new Date(
        now.valueOf() - (d <= 0 ? 7 - startDay : d - startDay) * 86400000
      );
      currentWeekStart.value = weekStart.getTime();
      fetchLessons();
    });
    const setCurrentIdx = (idx: number, offset: number, weekStart: number) => {
      currentIdx.value = idx;
      if (currentOffset.value !== offset) {
        currentOffset.value = offset;
        currentWeekStart.value = weekStart;
        lessons.value = null;
        fetchLessons();
        return;
      }
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

@media (max-width: 512px) {
  .no-lessons {
    margin-top: 60px;
  }
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
