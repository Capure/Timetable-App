<template>
  <div :class="['lesson-main', active ? 'lesson-active' : '']" :style="mainCss">
    <p class="lesson-text">{{ name }}</p>
    <p class="lesson-text">{{ time }}</p>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject } from "vue";
export default defineComponent({
  name: "Lesson",
  props: {
    name: String,
    time: String,
    active: Boolean,
  },
  setup() {
    const settings: Settings | undefined = inject("settings");
    const mainCss = computed(() => ({
      "--secondary-color": settings?.secondaryColor,
      "--accent-color": settings?.accentColor,
    }));
    return { mainCss };
  },
});
</script>

<style scoped>
.lesson-main {
  width: calc(100% - 20px);
  height: 70px;
  margin: 10px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: var(--secondary-color);
  font-size: 22px;
  text-transform: capitalize;
  user-select: none;
}

.lesson-active {
  background-color: var(--accent-color);
}

@media (max-width: 450px) {
  .lesson-main {
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
    border-radius: 0px;
  }
}

.lesson-text {
  padding: 20px;
}
</style>
