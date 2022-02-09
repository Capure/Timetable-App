<template>
  <div @click="setToNext" class="option-main" :style="mainCss">
    <div class="option-name">
      {{ name }}
    </div>
    {{ label }}
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";
export default defineComponent({
  name: "Option",
  props: {
    available: Array,
    labels: Array,
    name: String,
    dataField: String,
  },
  setup(props) {
    const settings: Settings | undefined = inject("settings");
    if (!settings || !props.available) {
      return {};
    }
    const current = ref(settings[props.dataField as keyof Settings]);
    const label = props.labels
      ? ref(props.labels[props.available?.indexOf(current.value)])
      : null;

    function setToNext() {
      if (!props.available || !props.dataField || !settings) {
        return;
      }
      const currentIdx = props.available.indexOf(current.value);
      if (currentIdx !== -1) {
        const newValue = (currentIdx === props.available.length - 1
          ? props.available[0]
          : props.available[currentIdx + 1]) as string;
        current.value = newValue;
        if (label) {
          label.value = props.labels?.[props.available?.indexOf(newValue)];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((settings as any)[props.dataField] as string) = newValue;
      }
    }

    const mainCss = computed(() => ({
      "--color-on-hover": `${settings.secondaryColor}99`,
      "--bg-color": settings.secondaryColor,
    }));

    return { current, label, setToNext, mainCss };
  },
});
</script>

<style scoped>
.option-main {
  height: 70px;
  width: calc(100% - 20px);
  margin: 10px 25px;
  border-radius: 10px;
  background-color: var(--bg-color);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.4s ease 0s;
}

.option-main:hover {
  background-color: var(--color-on-hover);
}

.option-name {
  padding: 15px;
  font-size: 22px;
  font-weight: 700;
}
</style>
