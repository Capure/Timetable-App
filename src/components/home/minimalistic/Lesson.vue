<template>
  <div class="lesson-main" :style="mainCss">
    <div class="lesson-content">
      <div class="lesson-name">
        {{ name }}
      </div>
      <div class="lesson-time">
        {{ time }}
      </div>
      <div class="lesson-room">{{ room }}</div>
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
    room: String,
    current: Boolean,
    sub: Boolean,
  },
  setup(props) {
    const settings: Settings | undefined = inject("settings");
    const mainCss = computed(() => ({
      "--bg-color": props.current
        ? props.sub
          ? `${settings?.accentColor}99`
          : settings?.accentColor
        : props.sub
        ? `${settings?.secondaryColor}99`
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
  position: relative;
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

.lesson-room {
  position: absolute;
  right: 10px;
  top: 0px;
  bottom: 0px;
  width: 70px;
  font-size: 28px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 360px) {
  .lesson-room {
    font-size: 25px;
    width: 40px;
    right: 5px;
  }
}
</style>
