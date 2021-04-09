<template>
  <div @click="setToNext" class="viewmode-main" :style="mainCss">
    <div class="viewmode-title">Pick the view mode</div>
    <div class="viewmode-current">{{ current }}</div>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";
export default defineComponent({
  name: "ViewMode",
  setup(props, ctx) {
    const settings: Settings | undefined = inject("settings");
    const current = ref(settings?.preferredView);

    const mainCss = computed(() => ({
      "--bg-color": settings?.secondaryColor,
      "--color-on-hover": `${settings?.secondaryColor}99`,
    }));

    function setToNext() {
      const newValue =
        current.value === "minimalistic" ? "compact" : "minimalistic";
      current.value = newValue;
      if (settings) {
        settings.preferredView = newValue;
      }
    }

    return { mainCss, current, setToNext };
  },
});
</script>

<style scoped>
.viewmode-main {
  margin: 10px;
  width: 400px;
  height: 200px;
  background-color: var(--bg-color);
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.6s;
}

.viewmode-main:hover {
  background-color: var(--color-on-hover);
}

@media (max-width: 840px) {
  .viewmode-main {
    width: 100%;
  }
}

.viewmode-title {
  text-align: center;
  width: 100%;
  font-size: 22px;
  padding-top: 12px;
}

.viewmode-current {
  text-align: center;
  width: 100%;
  font-size: 40px;
  font-weight: 700;
  padding-top: 30px;
  text-transform: capitalize;
}
</style>
