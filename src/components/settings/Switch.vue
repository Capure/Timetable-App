<template>
  <div :style="mainCss" class="switch-body">{{ options[current] }}</div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";

export default defineComponent({
  props: {
    options: Array,
    value: Number,
  },
  setup(props) {
    const settings: Settings | undefined = inject("settings");

    const mainCss = computed(() => ({
      "--bg-color": settings?.mainColor,
      "--font-color": `${settings?.fontColor}99`,
    }));

    const current = ref(0);

    // TODO: Finish this

    return { mainCss, current };
  },
});
</script>

<style scoped>
.switch-body {
  height: 30px;
  width: 75px;
  background: var(--bg-color);
  border-radius: 10px;
  color: var(--font-color);
  font-size: 13px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 10px;
}
</style>
