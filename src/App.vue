<template>
  <ThemeProvider @change="setSettings">
    <div :style="theme" class="router-body">
      <router-view />
    </div>
    <Footer />
  </ThemeProvider>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Footer from "./components/shared/Footer.vue";
import ThemeProvider from "./contexts/ThemeProvider.vue";
import { defaultSettings, Settings } from "./models/settings";

export default defineComponent({
  name: "App",
  components: { Footer, ThemeProvider },
  setup() {
    const settings = reactive({ ...defaultSettings });
    const setSettings = (newSettings: Settings) => {
      settings.mainColor = newSettings.mainColor;
      settings.secondaryColor = newSettings.secondaryColor;
      settings.accentColor = newSettings.accentColor;
      settings.fontColor = newSettings.fontColor;
      settings.preferredView = newSettings.preferredView;
      settings.angInf = newSettings.angInf;
      settings.wf = newSettings.wf;
      settings.lang = newSettings.lang;
    };
    // const theme = reactive({
    //   color: settings.fontColor,
    //   backgroundColor: settings.mainColor,
    // });

    // watch(settings, (newSettings) => {
    //   theme.color = newSettings.fontColor;
    //   theme.backgroundColor = newSettings.mainColor;
    // });
    const theme = computed(() => ({
      color: settings.fontColor,
      backgroundColor: settings.mainColor,
    }));

    return { settings, setSettings, theme };
  },
});
</script>

<style>
@font-face {
  font-family: "Raleway";
  src: url(./assets/raleway.ttf);
}

body {
  margin: 0;
  font-family: "Raleway", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #000;
  color: white;
}

.router-body {
  min-height: calc(100vh - 80px);
}

::-webkit-scrollbar {
  display: none;
}
</style>
