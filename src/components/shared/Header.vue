<template>
  <div class="header-spacer"></div>
  <div :style="mainCss" class="header-main">
    <div @click="() => router.push('/debug')" class="header-avatar">
      <ion-icon name="hammer-outline"></ion-icon>
    </div>
    <div class="header-logo">Timetable</div>
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
      };
    });
    return { router, mainCss };
  },
});
</script>

<style scoped>
.header-spacer {
  height: 70px;
  width: 100%;
  background: transparent;
}
.header-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: var(--secondary-color);
  z-index: 50;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 0px 20px 0px var(--main-color);
}

.header-avatar {
  font-size: 2rem;
  color: var(--font-color);
  margin-left: 20px;
}

.header-logo {
  font-size: 2rem;
  font-weight: 700;
  color: var(--font-color);
}

.header-settings {
  font-size: 2rem;
  color: var(--font-color);
  margin-right: 20px;
}
</style>
