<template>
  <header
    v-if="!relayActive"
    @dblclick="() => router.push('/debug')"
    class="custom-home-header"
  >
    <span>Timetable</span>
  </header>
  <Minimalistic />
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Minimalistic from "../components/home/minimalistic/index.vue";

export default defineComponent({
  components: {
    Minimalistic,
  },
  setup() {
    const settings = inject("settings");
    const router = useRouter();
    const relayActive = ref(false);

    onMounted(() => {
      if (localStorage.getItem("relay-auth")) {
        relayActive.value = true;
      }
    });

    return { settings, router, relayActive };
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
  margin-top: 50px;
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

function useRef(arg0: boolean) { throw new Error("Function not implemented."); }
function useRef(arg0: boolean) { throw new Error("Function not implemented."); }
