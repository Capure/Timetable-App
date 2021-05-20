<template>
  <div class="title">Settings</div>
  <div class="settings-main">
    <div class="settings-wrapper">
      <ColorPicker />
      <ViewMode />
      <Option
        name="English/CS"
        dataField="angInf"
        :available="ANG_INF_KEYS"
        :labels="ANG_INF_LABELS"
      />
      <Option
        name="WF"
        dataField="wf"
        :available="WF_KEYS"
        :labels="WF_LABELS"
      />
      <Option
        name="Lang"
        dataField="lang"
        :available="LANG_KEYS"
        :labels="LANG_LABELS"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { inject } from "vue";
import Option from "@/components/settings/Option.vue";
import ViewMode from "@/components/settings/ViewMode.vue";
import ColorPicker from "@/components/settings/ColorPicker.vue";
import {
  ANG_INF_KEYS,
  WF_KEYS,
  LANG_KEYS,
  ANG_INF_LABELS,
  WF_LABELS,
  LANG_LABELS,
} from "@/consts";
export default {
  components: {
    Option,
    ViewMode,
    ColorPicker,
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const settings = inject("settings");
    return {
      settings,
      ANG_INF_KEYS,
      WF_KEYS,
      LANG_KEYS,
      ANG_INF_LABELS,
      WF_LABELS,
      LANG_LABELS,
    };
  },
};
</script>

<style scoped>
.title {
  width: 100%;
  height: 200px;
  text-align: center;
  font-size: 64px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  font-weight: 700;
  user-select: none;
}

.settings-main {
  min-height: calc(100vh - 280px);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;
  user-select: none;
}

.settings-wrapper {
  max-width: 840px;
  flex-wrap: wrap;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
}

.sp {
  width: 800px;
  height: 40px;
  background-color: green;
}
</style>
