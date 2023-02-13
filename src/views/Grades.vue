<template>
  <div class="container" :style="mainCss">
    <div v-if="!ready" class="loader"></div>
    <template v-for="cat in grades" :key="cat.subject">
      <div class="category">
        <div v-if="!isNaN(cat.avg)" class="category-title">
          {{ cat.subject }} ({{ cat.avg }})
        </div>
        <div v-else class="category-title">{{ cat.subject }}</div>
        <div class="grades">
          <div v-for="grade in cat.grades" :key="grade.id" class="grade">
            <div class="grade-value">{{ grade.content }}</div>
            <div class="grade-details">
              <div class="grade-details-title">{{ grade.column.name }}</div>
              <div class="grade-details-date-weight">
                {{ grade.date_modified.split(" ")[0] }} Waga
                {{ grade.column.weight }}
              </div>
              <div class="grade-details-category">
                {{ grade.column.category.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grades = ref([] as { subject: string; grades: any[]; avg: number }[]);
    const ready = ref(false);
    const router = useRouter();

    onMounted(async () => {
      const auth = localStorage.getItem("relay-auth");
      if (!auth) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }
      if (localStorage.getItem("relay-grades") !== null) {
        const gradesFromStorage = JSON.parse(
          localStorage.getItem("relay-grades") || ""
        );
        if (new Date().getTime() - gradesFromStorage.lastSync < 48 * 3600000) {
          grades.value = gradesFromStorage.grades;
          ready.value = true;
          if (settings) {
            settings.loading = true;
          }
        }
      }
      const request = await fetch("https://relay.openvulcan.pl/grades", {
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
      const subjects: any = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.grades.forEach((grade: any) => {
        if (!subjects[grade.column.subject.name]) {
          subjects[grade.column.subject.name] = [];
        }
        subjects[grade.column.subject.name].push(grade);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gradesArray: any = [];

      for (const subject in subjects) {
        const avgData = subjects[subject]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((g: any) => ({
            weight: parseInt(g.column.weight),
            grade: parseInt(g.content),
          }))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((g: any) => !isNaN(g.grade) && !isNaN(g.weight))
          .reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: { top: number; bottom: number }, value: any) => ({
              top: acc.top + value.grade * value.weight,
              bottom: acc.bottom + value.weight,
            }),
            { top: 0, bottom: 0 }
          );
        gradesArray.push({
          subject,
          grades: subjects[subject],
          avg: (avgData.top / avgData.bottom).toFixed(2),
        });
      }
      grades.value = gradesArray;

      localStorage.setItem(
        "relay-grades",
        JSON.stringify({
          grades: grades.value,
          lastSync: new Date().getTime(),
        })
      );

      ready.value = true;
      if (settings) settings.loading = false;
    });

    const mainCss = computed(() => ({
      "--background-color": settings?.mainColor,
      "--secondary-color": settings?.secondaryColor,
      "--font-color": settings?.fontColor,
    }));

    return { settings, grades, ready, mainCss };
  },
});
</script>

<style scoped>
.container {
  margin-top: 20px;
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

.category {
  width: calc(100% - 40px);
  color: var(--font-color);
  background-color: var(--secondary-color);
  border-radius: 10px;
  margin-bottom: 20px;
}

.category-title {
  font-size: 30px;
  padding: 5px 20px 0px 20px;
  text-align: center;
}

.grades {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}

.grade {
  width: calc(100% - 20px);
  height: 85px;
  background-color: var(--background-color);
  border-radius: 10px;
  margin: 5px 0;
  display: flex;
}

.grade-value {
  height: 100%;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

@media (max-width: 400px) {
  .grade-value {
    width: 80px;
    font-size: 30px;
  }
}

.grade-details {
  width: calc(100% - 120px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  white-space: nowrap;
  margin: 10px 0px;
}

.grade-details-title {
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
}

.grade-details-date-weight {
  text-overflow: ellipsis;
  overflow: hidden;
}

.grade-details-category {
  text-overflow: ellipsis;
  overflow: hidden;
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
