<template>
  <div class="column-main" :style="mainCss">
    <div class="column-title">{{ title }}</div>
    <Lesson
      v-for="(lesson, idx) in lessons"
      :key="idx"
      :name="lesson.short"
      :time="lesson.time"
      :active="lesson.current"
    />
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject } from "vue";
import Lesson from "./Lesson.vue";

export default defineComponent({
  name: "Column",
  components: {
    Lesson,
  },
  props: {
    title: String,
    lessons: Array,
  },
  setup() {
    const settings: Settings | undefined = inject("settings");
    const mainCss = computed(() => ({
      "--secondary-color": settings?.secondaryColor,
    }));
    return { mainCss };
  },
});
</script>

<style scoped>
.column-main {
  height: 100%;
  width: 20vw;
  min-width: 350px;
  margin-bottom: 20px;
}

.column-title {
  width: calc(100% - 20px);
  height: 50px;
  margin-left: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: var(--secondary-color);
  font-size: 22px;
  text-transform: capitalize;
}

@media (max-width: 450px) {
  .column-main {
    width: 100%;
  }
  .column-title {
    width: 100%;
    margin-left: 0px;
    border-radius: 0px;
  }
}
</style>
