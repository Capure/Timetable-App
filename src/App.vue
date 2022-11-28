<template>
  <ThemeProvider @change="setSettings">
    <Header v-if="relayActive" />
    <div :style="theme" class="router-body custom-router-body">
      <router-view />
    </div>
    <Footer />
  </ThemeProvider>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import Footer from "./components/shared/Footer.vue";
import Header from "./components/shared/Header.vue";
import ThemeProvider from "./contexts/ThemeProvider.vue";
import { defaultSettings, Settings } from "./models/settings";

export default defineComponent({
  name: "App",
  components: { Footer, Header, ThemeProvider },
  setup() {
    const settings = reactive({ ...defaultSettings });

    const setBodyBackgroundColor = () => {
        document.body.style.backgroundColor = settings.mainColor;
    };

    const setSettings = (newSettings: Settings) => {
      settings.mainColor = newSettings.mainColor;
      settings.secondaryColor = newSettings.secondaryColor;
      settings.accentColor = newSettings.accentColor;
      settings.fontColor = newSettings.fontColor;
      settings.preferredView = newSettings.preferredView;
      settings.angInf = newSettings.angInf;
      settings.wf = newSettings.wf;
      settings.lang = newSettings.lang;
      settings.customCss = newSettings.customCss;
      setBodyBackgroundColor();

      // injects custom css
      const customStyle = document.createElement("style");
      customStyle.type = "text/css";
      customStyle.innerText = settings.customCss || "";
      document.head.appendChild(customStyle);
    };
    const theme = computed(() => ({
      color: settings.fontColor,
      backgroundColor: settings.mainColor,
    }));

    setBodyBackgroundColor();

    return {
      settings,
      setSettings,
      relayActive: localStorage.getItem("relay-auth") !== null,
      theme,
    };
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

* {
  scrollbar-width: none;
}

.router-body {
  min-height: calc(100vh - 80px);
}

@media (max-width: 1368px) {
  .router-body {
    min-height: calc(100vh - 100px);
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
