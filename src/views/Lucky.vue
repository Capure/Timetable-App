<template>
  <div :style="mainCss" class="container">
    <div v-if="!ready" class="loader"></div>
    <template v-else>
      <div class="title">Lucky Number</div>
      <div class="number">{{ number }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const settings: Settings | undefined = inject("settings");
    const number = ref(0);
    const ready = ref(false);
    const router = useRouter();

    onMounted(async () => {
      const auth = localStorage.getItem("relay-auth");
      if (!auth) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }
      const request = await fetch("https://relay.openvulcan.pl/luckynumber", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });

      if (request.status !== 200) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }

      const data = await request.json();
      number.value = data.number;
      ready.value = true;
    });

    const mainCss = computed(() => {
      return {
        "--text-color": settings?.fontColor,
      };
    });

    return { settings, mainCss, ready, number };
  },
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  font-size: 40px;
  color: var(--text-color);
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
}

.number {
  font-size: 100px;
  color: var(--text-color);
  text-align: center;
  margin-top: 20px;
  font-weight: 500;
}

.loader {
  background-color: var(--text-color);
  height: 40px;
  width: 40px;
  border-radius: 100%;
  animation: fade 1s ease infinite;
  margin-top: 50px;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
