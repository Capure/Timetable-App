<template>
  <header class="custom-home-header">
    <span>Timetable</span>
  </header>
  <div class="container" :style="mainCss">
    <div v-if="!ready" class="loader"></div>
    <template v-for="cat in grades" :key="cat.subject">
      <div class="category">
        <div class="category-title">
          {{ cat.subject }}
        </div>
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
    const grades = ref([] as { subject: string; grades: any[] }[]);
    const ready = ref(false);
    const router = useRouter();

    onMounted(async () => {
      const auth = localStorage.getItem("relay-auth");
      if (!auth) {
        alert("Relay not connected!");
        router.push("/");
        return;
      }
      const request = await fetch("https://relay.vlo.software/grades", {
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
        gradesArray.push({
          subject,
          grades: subjects[subject],
        });
      }

      grades.value = gradesArray;
      ready.value = true;
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
