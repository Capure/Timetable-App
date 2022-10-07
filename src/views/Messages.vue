<template>
  <div v-if="displayMessage" :style="mainCss" class="open-message">
    <ion-icon name="close" class="open-message-close" @click="closeMessage" />
    <div class="open-message-sender">From: {{ messageToDisplay.sender }}</div>
    <div class="open-message-title">
      Subject: {{ messageToDisplay.subject }}
    </div>
    <div class="open-message-date">Date: {{ messageToDisplay.sent_date }}</div>
    <div v-html="messageToDisplay.content" class="open-message-content"></div>
  </div>
  <header class="custom-home-header">
    <span>Timetable</span>
  </header>
  <div class="container" :style="mainCss">
    <div v-if="!ready" class="loader"></div>
    <div class="messages">
      <template v-for="message in messages" :key="message.id">
        <div @click="() => openMessage(message)" class="message">
          <div
            :class="`message-title ${
              message.read_date ? '' : 'message-title-not-read'
            }`"
          >
            {{ message.subject }}
          </div>
          <div class="message-sender">
            {{ message.sender }}
          </div>
          <div class="message-date">
            {{ message.sent_date.split(" ")[0] }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Settings } from "@/models/settings";
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const settings: Settings | undefined = inject("settings");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = ref([] as any[]);
    const ready = ref(false);
    const displayMessage = ref(false);
    const messageToDisplay = ref({
      sender: "",
      subject: "",
      content: "",
      sent_date: "",
    });

    const router = useRouter();

    onMounted(async () => {
      const auth = localStorage.getItem("relay-auth");
      if (!auth) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }
      const request = await fetch("https://relay.vlo.software/messages", {
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages.value = data.messages.sort((a: any, b: any) => {
        return (
          new Date(b.sent_date).getTime() - new Date(a.sent_date).getTime()
        );
      });

      ready.value = true;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openMessage = (message: any) => {
      messageToDisplay.value = message;
      displayMessage.value = true;
    };

    const mainCss = computed(() => ({
      "--background-color": settings?.mainColor,
      "--secondary-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
    }));

    return {
      settings,
      messages,
      openMessage,
      closeMessage: () => (displayMessage.value = false),
      displayMessage,
      messageToDisplay,
      ready,
      mainCss,
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

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 1024px) {
  .container {
    width: 512px;
    margin-left: calc(50% - 256px);
  }
}

.messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.message {
  width: calc(100% - 40px);
  height: 110px;
  background-color: var(--secondary-color);
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}

.message-title {
  font-size: 20px;
  font-weight: 500;
  margin: 20px 20px 0px 20px;
  width: calc(100% - 40px);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0.97;
}

.message-title-not-read {
  font-weight: 800;
  opacity: 1;
}

.message-date {
  font-size: 20px;
  margin: 0px 20px;
  opacity: 0.9;
}

.message-sender {
  font-size: 18px;
  margin: 0px 20px;
  text-transform: capitalize;
  opacity: 0.7;
  width: calc(100% - 40px);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.open-message {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.67);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  z-index: 100;
  padding: 30px;
  box-sizing: border-box;
}

.open-message-sender {
  max-width: calc(100% - 20px);
}

.open-message-date {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--font-color);
}

.open-message-content {
  overflow-y: auto;
  height: 100%;
}

.open-message-close {
  position: absolute;
  right: 25px;
  top: 25px;
  font-size: 30px;
}

.loader {
  background-color: var(--font-color);
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
