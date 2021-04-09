<template>
  <div class="colorpicker-main" :style="mainCss">
    <div class="colorpicker-title">Choose your theme</div>
    <div class="colorpicker-labels">
      <div class="colorpicker-label">Main</div>
      <div class="colorpicker-label">Sec</div>
      <div class="colorpicker-label">Accent</div>
      <div class="colorpicker-label">Font</div>
    </div>
    <div class="colorpicker-pickers">
      <input
        @change="
          (e) => {
            settings.mainColor = e.target.value;
          }
        "
        type="color"
        class="colorpicker-picker"
        :value="settings.mainColor"
      />
      <input
        @change="
          (e) => {
            settings.secondaryColor = e.target.value;
          }
        "
        type="color"
        class="colorpicker-picker"
        :value="settings.secondaryColor"
      />
      <input
        @change="
          (e) => {
            settings.accentColor = e.target.value;
          }
        "
        type="color"
        class="colorpicker-picker"
        :value="settings.accentColor"
      />
      <input
        @change="
          (e) => {
            settings.fontColor = e.target.value;
          }
        "
        type="color"
        class="colorpicker-picker"
        :value="settings.fontColor"
      />
    </div>
    <button @click="restoreToDefaults" class="colorpicker-default">
      Restore defaults
    </button>
  </div>
</template>

<script lang="ts">
import { defaultSettings, Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";
export default defineComponent({
  name: "ColorPicker",
  setup(props, ctx) {
    const settings: Settings | undefined = inject("settings");

    const mainCss = computed(() => ({
      "--bg-color": settings?.secondaryColor,
      "--color-on-hover": `${settings?.secondaryColor}99`,
      "--font-color": settings?.fontColor,
      "--accent-color": settings?.accentColor,
      "--accent-color-on-hover": `${settings?.accentColor}cc`,
    }));

    function restoreToDefaults() {
      if (!settings) {
        return;
      }
      settings.mainColor = defaultSettings.mainColor;
      settings.secondaryColor = defaultSettings.secondaryColor;
      settings.accentColor = defaultSettings.accentColor;
      settings.fontColor = defaultSettings.fontColor;
    }

    return { mainCss, settings, restoreToDefaults };
  },
});
</script>

<style scoped>
.colorpicker-main {
  height: 200px;
  width: 400px;
  margin: 10px;
  border-radius: 10px;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 840px) {
  .colorpicker-main {
    width: 100%;
  }
}

.colorpicker-title {
  text-align: center;
  width: 100%;
  font-size: 22px;
  padding-top: 12px;
}

.colorpicker-labels {
  height: 50px;
  width: calc(100% - 40px);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.colorpicker-label {
  width: 50px;
  line-height: 50px;
  text-align: center;
}

.colorpicker-pickers {
  height: 50px;
  width: calc(100% - 40px);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.colorpicker-picker {
  height: 50px;
  width: 50px;
  padding: 0px;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 0px;
  box-sizing: border-box;
}

.colorpicker-default {
  background-color: var(--accent-color);
  outline: none;
  border-radius: 5000px;
  color: var(--font-color);
  border: none;
  line-height: 30px;
  margin-top: 12px;
  margin-bottom: 10px;
  width: 200px;
  font-size: 16px;
  transition: 0.4s ease;
}

.colorpicker-default:hover {
  background-color: var(--accent-color-on-hover);
}
</style>
