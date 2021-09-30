<template>
  <div class="main" :style="mainCss">
    <small style="line-height: 70px"
      >© Copyright 2021,
      <a target="_blank" href="https://github.com/Capure" class="github"
        >Capure</a
      ></small
    >
    <router-link class="link" :to="path === '/' ? 'settings' : '/'"
      ><ion-icon v-if="path === '/'" name="settings-outline" />
      <ion-icon v-else name="home-outline"
    /></router-link>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { RouteLocationNormalized, useRoute } from "vue-router";
import { computed, defineComponent, inject, ref, watch } from "vue";
export default defineComponent({
  name: "Footer",
  setup() {
    const settings: Settings | undefined = inject("settings");
    const route = useRoute();
    const path = ref(route.path);

    const mainCss = computed(() => ({
      "--bg-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
      "--padding": path.value === "/" ? "25px" : "10px",
      "--gaps": path.value === "/" ? "50px" : "20px",
    }));

    watch(route, (newRoute: RouteLocationNormalized) => {
      path.value = newRoute.path;
    });
    return { path, mainCss };
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

@media (max-width: 512px) {
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
</style>
