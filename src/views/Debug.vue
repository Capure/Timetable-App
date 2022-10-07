<template>
  <header v-if="!relayActive" class="custom-debug-header">Timetable</header>
  <div class="layout custom-debug-layout" :style="mainCss">
    <div class="center custom-debug-center">
      <div class="alert custom-debug-alert">WARNING: This is a debug page!</div>
      <div class="info custom-css custom-debug-custom-css">
        <input v-model="customCssValue" type="text" placeholder="Custom css" />
        <button @click="updateCustomCss">Set</button>
      </div>
      <div class="info custom-debug-info">
        The Timetable Relay is a service that allows you to access the
        e-registry with your own account. The server is stateless, so it does
        not store any data. Nobody can access your account, except you. The
        keystore is stored in your browser's local storage. The feature is
        currently experimental and may not work properly. The timetable it self
        is still accesed via the original api.
      </div>
      <div class="info info-column custom-css custom-debug-custom-css">
        <div style="display: flex">
          Timetable Relay:
          <div style="font-weight: 800; margin-left: 10px">
            {{ relayActive ? "active" : "not active" }}
          </div>
        </div>
        <button
          style="margin-top: 20px"
          v-if="!relayActive"
          @click="logInToRelay"
        >
          Sign In
        </button>
      </div>
      <div
        v-if="relayActive"
        class="info info-links custom-css custom-debug-custom-css"
      >
        <button @click="() => router.push('/grades')">Grades</button>
        <button @click="() => router.push('/exams')">Exams</button>
        <button @click="() => router.push('/messages')">Messages</button>
        <button @click="() => router.push('/lucky')">Lucky</button>
      </div>
      <div v-if="relayActive" class="info custom-debug-info">
        <button @click="() => router.push('/settings')">Settings</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const settings: Settings | undefined = inject("settings");
    const customCssValue = ref(settings ? settings.customCss || "" : "");
    const mainCss = computed(() => ({
      "--bg-color": settings?.mainColor,
      "--secondary-color": settings?.secondaryColor,
      "--secondary-color-on-hover": `${settings?.secondaryColor}99`,
    }));
    const relayActive = ref(localStorage.getItem("relay-auth") !== null);
    const router = useRouter();

    const updateCustomCss = () => {
      if (!settings) return;
      settings.customCss = customCssValue.value;
      alert("You might have to reload the page.");
    };

    const logInToRelay = async () => {
      const token = window.prompt("Token", "");
      const symbol = window.prompt("Symbol", "gdansk");
      const pin = window.prompt("Pin", "");
      if (!token || !symbol || !pin) {
        alert("Invalid input");
        return;
      }

      const response = await fetch(`https://relay.vlo.software/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          symbol,
          pin,
        }),
      });

      if (response.status !== 200) {
        alert("Invalid creds");
        return;
      }

      const data = await response.json();
      localStorage.setItem("relay-auth", btoa(JSON.stringify(data)));
      relayActive.value = true;
    };

    return {
      relayActive,
      mainCss,
      customCssValue,
      updateCustomCss,
      logInToRelay,
      router,
    };
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

.layout {
  width: calc(100% - 40px);
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 600px) {
  .layout {
    width: 512px;
    margin-left: calc(50% - 256px);
  }
}

.center {
  grid-area: main;
}

.alert {
  height: 50px;
  border-radius: 10px;
  background: rgb(255, 26, 64);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 2px solid var(--secondary-color);
  color: white;
  margin: 20px 0px;
}

button {
  height: 60px;
  width: 100%;
  border-radius: 10px;
  background: var(--secondary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  outline: none;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background: var(--secondary-color-on-hover);
}

@media (max-width: 400px) {
  input {
    width: 150px;
  }
}

.info {
  width: 100%;
  border-radius: 10px;
  background: var(--secondary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.info-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-links button {
  margin: 8px !important;
  border: none !important;
  background: var(--bg-color);
}

.custom-css {
  justify-content: space-between;
}

.custom-css button {
  height: 40px;
  width: 100px;
  border: 1px solid rgb(255, 26, 64);
  margin: 0px 10px 0px 0px;
}

.custom-css input {
  outline: none;
  color: inherit;
  background: inherit;
  border: 1px solid rgb(255, 26, 64);
  border-radius: 10px;
  height: 40px;
  box-sizing: border-box;
  margin-left: 10px;
  padding: 10px;
}
</style>
