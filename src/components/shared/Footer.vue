<template>
  <div
    v-if="relayActive"
    :style="{ ...mainCss, opacity: undefined }"
    class="navbar"
  >
    <div
      :class="`navbar-item ${path === '/grades' ? 'navbar-item-active' : ''}`"
      @click="() => router.push('/grades')"
    >
      <ion-icon
        :style="{ ...iconCss('/grades') }"
        name="school-outline"
      ></ion-icon>
    </div>
    <div
      :class="`navbar-item ${path === '/exams' ? 'navbar-item-active' : ''}`"
      @click="() => router.push('/exams')"
    >
      <ion-icon
        :style="{ ...iconCss('/exams') }"
        name="clipboard-outline"
      ></ion-icon>
    </div>
    <div
      :class="`navbar-item navbar-item-home ${
        path === '/' ? 'navbar-item-active' : ''
      }`"
      @click="() => router.push('/')"
    >
      <ion-icon name="home-outline"></ion-icon>
    </div>
    <div
      :class="`navbar-item ${path === '/messages' ? 'navbar-item-active' : ''}`"
      @click="() => router.push('/messages')"
    >
      <ion-icon
        :style="{ ...iconCss('/messages') }"
        name="mail-outline"
      ></ion-icon>
    </div>
    <div
      :class="`navbar-item ${path === '/lucky' ? 'navbar-item-active' : ''}`"
      @click="() => router.push('/lucky')"
    >
      <ion-icon
        :style="{ ...iconCss('/lucky') }"
        name="happy-outline"
      ></ion-icon>
    </div>
  </div>
  <div class="main custom-footer-main" :style="mainCss">
    <small style="line-height: 70px"
      >© Copyright 2022,
      <a target="_blank" href="https://github.com/Capure" class="github"
        >Capure</a
      ></small
    >
    <router-link
      class="link custom-footer-navigation"
      :to="path === '/' ? 'settings' : '/'"
      ><ion-icon v-if="path === '/'" name="settings-outline" />
      <ion-icon v-else name="home-outline"
    /></router-link>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { RouteLocationNormalized, useRoute, useRouter } from "vue-router";
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
export default defineComponent({
  name: "Footer",
  setup() {
    const settings: Settings | undefined = inject("settings");
    const router = useRouter();
    const route = useRoute();
    const path = ref(route.path);
    const relayActive = ref(false);

    onMounted(() => {
      const auth = localStorage.getItem("relay-auth");
      if (auth) {
        relayActive.value = true;
      }
    });

    const mainCss = computed(() => ({
      "--main-color": settings?.mainColor,
      "--accent-color": settings?.accentColor,
      "--bg-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
      "--navbar-shadow-color": `${settings?.fontColor}10`,
      "--padding": "25px",
      "--gaps": "50px",
      opacity: relayActive.value ? "0" : 1,
    }));

    const iconCss = (iconPath: string) => ({
      transition: "color 200ms, opacity 200ms",
      color:
        path.value === iconPath ? "var(--accent-color)" : "var(--font-color)",
      opacity: path.value === iconPath ? 1 : 0.8,
    });

    watch(route, (newRoute: RouteLocationNormalized) => {
      path.value = newRoute.path;
    });

    return { path, router, relayActive, mainCss, iconCss };
  },
});
</script>

<style scoped>
.main {
  width: calc(100% - var(--gaps));
  height: 70px;
  margin: 0px var(--padding) 10px var(--padding);
  background-color: var(--bg-color);
  color: var(--font-color);
  text-align: center;
  position: relative;
  border-radius: 10px;
}

@media (max-width: 1368px) {
  .main {
    margin: 0px var(--padding) 30px var(--padding);
  }
}

.link {
  background-color: transparent;
  outline: none;
  border: none;
  color: inherit;
  position: absolute;
  bottom: 0px;
  right: 2vw;
  height: 70px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  cursor: pointer;
}

.github {
  text-decoration: none;
  color: inherit;
}

.navbar {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background-color: var(--bg-color);
  color: var(--font-color);
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 50;
  box-shadow: 0px 0px 20px 0px var(--main-color);
}

.navbar-item {
  margin-top: 5px;
  width: 15vw;
  height: 15vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  font-size: 6vw;
}

.navbar-item-home {
  font-size: 7vw;
  width: 18vw;
  height: 18vw;
  margin-top: calc(-5px + -0.5vw);
  background: var(--bg-color);
  transition: background 200ms;
  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.4);
}

.navbar-item-home.navbar-item-active {
  background: var(--accent-color);
}

@media (min-width: 550px) {
  .navbar {
    justify-content: center;
  }

  .navbar-item {
    width: 70px;
    height: 70px;
    font-size: 40px;
    margin: 5px 10px;
  }

  .navbar-item-home {
    width: 80px;
    height: 80px;
    font-size: 50px;
    margin-top: -5px;
  }
}
</style>
