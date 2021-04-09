<template>
  <div class="lesson-main" :style="mainCss">
    <div class="lesson-content">
      <div class="lesson-name">
        {{ name }}
      </div>
      <div class="lesson-time">
        {{ time }}
      </div>
    </div>
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
    current: Boolean,
  },
  setup(props) {
    const settings: Settings | undefined = inject("settings");
    const mainCss = computed(() => ({
      "--bg-color": props.current
        ? settings?.accentColor
        : settings?.secondaryColor,
    }));
    return { mainCss };
  },
});
</script>

<style scoped>
.lesson-main {
  height: 140px;
  width: 320px;
  margin: 10px;
  background-color: var(--bg-color);
  border-radius: 10px;
  user-select: none;
}

.lesson-content {
  width: calc(100% - 40px);
  margin-left: 20px;
  height: calc(100% - 40px);
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

.lesson-name {
  font-size: 22px;
  font-weight: 700;
}

.lesson-time {
  font-size: 18px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
