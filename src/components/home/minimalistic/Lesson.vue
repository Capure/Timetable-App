<template>
  <div class="lesson-main" :style="mainCss">
    <div class="lesson-content">
      <div class="lesson-name">
        <span v-if="sub">
          <ion-icon name="repeat-outline"></ion-icon>
        </span>
        <span v-if="cancelled">
          <ion-icon name="trash-outline"></ion-icon>
        </span>
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
    cancelled: Boolean,
  },
  setup(props) {
    const settings: Settings | undefined = inject("settings");
    const mainCss = computed(() => ({
      "--bg-color": props.current
        ? props.sub || props.cancelled
          ? `${settings?.accentColor}99`
          : settings?.accentColor
        : props.sub || props.cancelled
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

@media (max-width: 512px) {
  .lesson-main {
    height: 80px;
    width: 100%;
  }
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

@media (max-width: 512px) {
  .lesson-content {
    height: calc(100% - 30px);
    margin-top: 15px;
  }

  .lesson-name {
    font-size: 18px;
  }

  .lesson-time {
    font-size: 16px;
  }
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
