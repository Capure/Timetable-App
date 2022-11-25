<template>
  <div class="header-spacer"></div>
  <div :style="mainCss" class="header-main">
    <div @click="() => router.push('/debug')" class="header-avatar">
      <ion-icon name="hammer-outline"></ion-icon>
    </div>
    <div :class="`header-logo ${loading ? 'header-logo-animation' : ''}`">
      Timetable
    </div>
    <div @click="() => router.push('/settings')" class="header-settings">
      <ion-icon name="settings-outline" />
    </div>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Header",
  setup() {
    const settings: Settings | undefined = inject("settings");
    const router = useRouter();

    const mainCss = computed(() => {
      return {
        "--main-color": settings?.mainColor,
        "--secondary-color": settings?.secondaryColor,
        "--font-color": settings?.fontColor,
        "--font-color-transparent": `${settings?.fontColor}69`,
      };
    });
    return {
      router,
      mainCss,
      loading: computed(() => settings?.loading),
    };
  },
});
</script>

<style scoped>
.header-spacer {
  height: calc(70px + env(safe-area-inset-top));
  width: 100%;
  background: transparent;
}
.header-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(70px + env(safe-area-inset-top));
  background-color: var(--secondary-color);
  z-index: 50;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  box-shadow: 0px 0px 20px 0px var(--main-color);
}

.header-avatar {
  font-size: 2rem;
  color: var(--font-color);
  margin-left: 20px;
  margin-bottom: 15px;
}

.header-logo {
  font-size: 2rem;
  font-weight: 700;
  color: var(--font-color);
  margin-bottom: 15px;
}

.header-logo-animation {
  animation: glow 0.5s alternate infinite;
}

@keyframes glow {
  from {
    text-shadow: 0px 0px 7px var(--font-color-transparent);
  }
  to {
    text-shadow: 0px 0px 12px var(--font-color-transparent);
  }
}

.header-settings {
  font-size: 2rem;
  color: var(--font-color);
  margin-right: 20px;
  margin-bottom: 15px;
}
</style>
