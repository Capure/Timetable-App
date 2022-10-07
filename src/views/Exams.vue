<template>
  <div class="container" :style="mainCss">
    <div v-if="!ready" class="loader"></div>
    <div class="exams">
      <template v-for="exam in exams" :key="exam.id">
        <div class="exam">
          <div class="exam-title">
            {{ exam.subject.name }}
          </div>
          <div class="exam-date">
            {{ exam.deadline.split(" ")[0] }}
          </div>
          <div class="exam-details">{{ exam.type }} {{ exam.topic }}</div>
          <div class="exam-creator">
            {{ exam.creator.toLowerCase() }}
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
    const exams = ref([] as any[]);
    const ready = ref(false);
    const router = useRouter();

    onMounted(async () => {
      const auth = localStorage.getItem("relay-auth");
      if (!auth) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }
      const request = await fetch("https://relay.vlo.software/exams", {
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
      exams.value = data.exams.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (exam: any) => new Date(exam.deadline) > new Date()
      );

      ready.value = true;
    });

    const mainCss = computed(() => ({
      "--background-color": settings?.mainColor,
      "--secondary-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
    }));

    return { settings, exams, ready, mainCss };
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

.exams {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.exam {
  width: calc(100% - 40px);
  height: 130px;
  background-color: var(--secondary-color);
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
}

.exam-title {
  font-size: 20px;
  font-weight: 700;
  margin: 20px 20px 0px 20px;
}

.exam-date {
  font-size: 20px;
  margin: 0px 20px;
}

.exam-details {
  font-size: 18px;
  margin: 0px 20px;
}

.exam-creator {
  font-size: 18px;
  margin: 0px 20px;
  text-transform: capitalize;
  opacity: 0.7;
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
