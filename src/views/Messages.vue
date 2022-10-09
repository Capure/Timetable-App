<template>
  <div v-if="displayMessage" :style="mainCss" class="open-message">
    <div class="open-message-background">
      <div class="open-message-info">
        <ion-icon
          name="close"
          class="open-message-close"
          @click="closeMessage"
        />
        <div class="open-message-info-content">
          <div class="open-message-title">
            {{ messageToDisplay.subject }}
          </div>
          <div class="open-message-sender">{{ messageToDisplay.sender }}</div>
          <div class="open-message-date">{{ messageToDisplay.sent_date }}</div>
        </div>
      </div>
      <div v-html="messageToDisplay.content" class="open-message-content"></div>
    </div>
  </div>
  <div class="container" :style="mainCss">
    <template v-if="!ready">
      <div v-for="i in [...Array(3).keys()]" :key="i" class="messages">
        <div class="message fade-in">
          <div class="message-sender">
            <div class="message-sender-name">
              <div class="message-loading"></div>
            </div>
            <div class="message-sender-date">
              <div style="animation-delay: 100ms" class="message-loading"></div>
            </div>
            <div class="message-subject">
              <div style="animation-delay: 200ms" class="message-loading"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
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
import linkifyHtml from "linkify-html";

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
      if (localStorage.getItem("relay-messages") !== null) {
        const messagesFromStorage = JSON.parse(
          localStorage.getItem("relay-messages") || ""
        );
        if (
          new Date().getTime() - messagesFromStorage.lastSync <
          48 * 3600000
        ) {
          messages.value = messagesFromStorage.messages;
          ready.value = true;
        }
      }
      const request = await fetch("https://relay.vlo.software/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
      });

      if (request.status !== 200) {
        alert("Relay failed to fetch!");
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

      localStorage.setItem(
        "relay-messages",
        JSON.stringify({
          messages: messages.value,
          lastSync: new Date().getTime(),
        })
      );

      ready.value = true;
    });

    const closeMessage = () => {
      displayMessage.value = false;
      document.body.style.overflow = "visible";
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openMessage = (message: any) => {
      document.body.style.overflow = "hidden";
      messageToDisplay.value = {
        sender: message.sender.replace(" - P - (V LO)", ""),
        subject: message.subject,
        content: linkifyHtml(message.content.replaceAll("<p><br></p>", ""), {
          defaultProtocol: "https",
          target: "_blank",
          validate: {
            url: (value: string) => value !== "m.in",
          },
          truncate: 40,
          attributes: {
            style: `color: ${settings?.accentColor};`,
          },
        }),
        sent_date: message.sent_date,
      };
      displayMessage.value = true;
    };

    const mainCss = computed(() => ({
      "--background-color": settings?.mainColor,
      "--secondary-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
      "--loader-color": `${settings?.fontColor}44`,
    }));

    return {
      settings,
      messages,
      openMessage,
      closeMessage,
      displayMessage,
      messageToDisplay,
      ready,
      mainCss,
    };
  },
});
</script>

<style scoped>
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
  padding: 15px;
  box-sizing: border-box;
}

.open-message-background {
  /* background: var(--background-color); */
  /* border-radius: 20px; */
  padding: 15px;
  height: 100%;
  background: transparent;
}

.open-message-info {
  margin-top: env(safe-area-inset-top);
  height: 120px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.open-message-info-content {
  width: calc(100% - 50px);
}

.open-message-sender {
  margin: 10px 0 8px 0;
  opacity: 0.7;
}

.open-message-date {
  padding-bottom: 10px;
}

.open-message-content {
  overflow-y: auto;
  height: calc(100% - 135px);
  padding-bottom: 35px;
  word-wrap: break-word;
}

.open-message-close {
  position: absolute;
  right: 25px;
  top: calc(25px + env(safe-area-inset-top));
  font-size: 30px;
  background-color: var(--secondary-color);
  border-radius: 50%;
  padding: 5px;
}

.fade-in {
  animation: fade-in 1.7s ease;
}

.message-loading {
  width: 100%;
  height: 25px;
  background-color: var(--loader-color);
  animation: fade 1.5s ease-in-out infinite;
  border-radius: 5px;
  margin: 9px 0px;
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

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
