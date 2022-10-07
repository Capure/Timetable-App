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
      if (
        [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod",
        ].includes(navigator.platform)
      ) {
        // https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
        const c = settings.mainColor.substring(1); // strip #
        const rgb = parseInt(c, 16); // convert rrggbb to decimal
        const r = (rgb >> 16) & 0xff; // extract red
        const g = (rgb >> 8) & 0xff; // extract green
        const b = (rgb >> 0) & 0xff; // extract blue

        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        if (luma > 128) {
          document.body.style.backgroundColor = `#${Math.round(r / 2).toString(
            16
          )}${Math.round(g / 2).toString(16)}${Math.round(b / 2).toString(16)}`;
        } else {
          document.body.style.backgroundColor = settings.mainColor;
        }
      } else {
        document.body.style.backgroundColor = settings.mainColor;
      }
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
