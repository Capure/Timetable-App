<template>
  <slot />
</template>

<script land="ts">
import { defineComponent, onMounted, provide, reactive, watch } from "vue";
import { defaultSettings } from "@/models/settings";

export default defineComponent({
  emits: ["change"],
  setup(_, ctx) {
    const settings = reactive({ ...defaultSettings });
    onMounted(() => {
      if (localStorage.getItem("settings")) {
        const newSettings = JSON.parse(localStorage.getItem("settings"));
        settings.mainColor = newSettings.mainColor;
        settings.secondaryColor = newSettings.secondaryColor;
        settings.accentColor = newSettings.accentColor;
        settings.fontColor = newSettings.fontColor;
        settings.angInf = newSettings.angInf;
        settings.wf = newSettings.wf;
        settings.lang = newSettings.lang;
        settings.customCss = newSettings.customCss;
        settings.loading = newSettings.loading;
      }
    });
    watch(settings, (newSettings) => {
      ctx.emit("change", newSettings);
      localStorage.setItem("settings", JSON.stringify(newSettings));
    });
    provide("settings", settings);
  },
});
</script>
