<template>
  <header @click="goToDebug" class="custom-home-header">
    <span>Timetable</span>
  </header>
  <Minimalistic />
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import Minimalistic from "../components/home/minimalistic/index.vue";

export default defineComponent({
  components: {
    Minimalistic,
  },
  setup() {
    const settings = inject("settings");

    let debugCounter = 0;

    const goToDebug = () => {
      debugCounter++;
      if (debugCounter === 5) {
        window.location.assign("/debug");
      }
    };

    return { settings, goToDebug };
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

header span {
  cursor: pointer;
  user-select: none;
}

@media (max-width: 512px) {
  header {
    font-size: 38px;
    height: 110px;
  }
}

.compact {
  height: 100px;
  line-height: 100px;
  width: 100%;
  text-align: center;
  font-size: 22px;
}
</style>
