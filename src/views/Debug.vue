<template>
  <header class="custom-debug-header">Timetable</header>
  <div class="layout custom-debug-layout" :style="mainCss">
    <div class="center custom-debug-center">
      <div class="alert custom-debug-alert">WARNING: This is a debug page!</div>
      <button @click="clearCache">Clear cache</button>
      <div class="info custom-debug-info">Last fetch: {{ lastFetch }}</div>
      <div class="info custom-css custom-debug-custom-css">
        <input v-model="customCssValue" type="text" placeholder="Custom css" />
        <button @click="updateCustomCss">Set</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";

export default defineComponent({
  setup() {
    const settings: Settings | undefined = inject("settings");
    const customCssValue = ref(settings ? settings.customCss || "" : "");
    const mainCss = computed(() => ({
      "--secondary-color": settings?.secondaryColor,
      "--secondary-color-on-hover": `${settings?.secondaryColor}99`,
    }));
    const clearCache = () => {
      localStorage.removeItem("timetable-cache");
      alert("Cache has been cleared!");
    };
    const lastFetchRaw = localStorage.getItem("lastFetch");
    const lastFetch = lastFetchRaw
      ? new Date(+lastFetchRaw).toISOString()
      : "N/A";

    const updateCustomCss = () => {
      if (!settings) return;
      settings.customCss = customCssValue.value;
      alert("You might have to reload the page.");
    };

    return {
      mainCss,
      clearCache,
      lastFetch,
      customCssValue,
      updateCustomCss,
    };
  },
});
</script>

<style scoped>
header {
  width: 100%;
  height: 150px;
  text-align: center;
  font-size: 45px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-weight: 700;
}

.layout {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". main .";
}

@media (max-width: 1000px) {
  .layout {
    grid-template-columns: 1fr 3fr 1fr;
  }
}

@media (max-width: 600px) {
  .layout {
    grid-template-columns: 20px 1fr 20px;
  }
}

.center {
  grid-area: main;
}

.alert {
  height: 50px;
  border-radius: 10px;
  background: rgb(255, 26, 64);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 2px solid var(--secondary-color);
  color: white;
  margin-bottom: 20px;
}

button {
  height: 60px;
  width: 100%;
  border-radius: 10px;
  background: var(--secondary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background: var(--secondary-color-on-hover);
}

.info {
  height: 60px;
  width: 100%;
  border-radius: 10px;
  background: var(--secondary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.custom-css {
  justify-content: space-between;
}

.custom-css button {
  height: 40px;
  width: 100px;
  border: 1px solid rgb(255, 26, 64);
  margin: 0px 10px 0px 0px;
}

.custom-css input {
  outline: none;
  color: inherit;
  background: inherit;
  border: 1px solid rgb(255, 26, 64);
  border-radius: 10px;
  height: 40px;
  box-sizing: border-box;
  margin-left: 10px;
  padding: 10px;
}
</style>
