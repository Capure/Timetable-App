import { DAYS } from "@/consts";
import { LessonDTO } from "@/models/lesson";
import { TimetableData } from "@/models/timetableData";

export const getToday = (): number => {
  const today = new Date().getDay();
  return today > 0 && today ? today - 1 : 6;
};

export const getDayByIdx = (idx: number): string => DAYS[idx];

export const filterLessons = (
  data: TimetableData,
  angInf: "gr1" | "gr2",
  wf: "CH" | "DZ",
  lang: "gr1n" | "gr2n" | "gr3n" | "gr4r"
): void => {
  const filteredData = Object.keys(data).map((key) =>
    data[key as keyof TimetableData].filter(
      (lesson) =>
        lesson.distribution === null ||
        lesson.distribution === wf ||
        lesson.distribution === lang ||
        lesson.distribution === angInf
    )
  );
  data.monday = filteredData[0];
  data.tuesday = filteredData[1];
  data.wednesday = filteredData[2];
  data.thursday = filteredData[3];
  data.friday = filteredData[4];
  data.saturday = filteredData[5];
  data.sunday = filteredData[6];
};

export const getLessons = async (weekStart: number): Promise<TimetableData> => {
  const rawRes = await fetch("https://api.openvulcan.pl/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      variables: null,
      query: `{
        lessons(dateFrom: "${
          new Date(weekStart).toISOString().split("T")[0]
        }", dateTo: "${
        new Date(weekStart + 6 * 86400000).toISOString().split("T")[0]
      }") {
          time
          teacher
          subject {
            short
            name
          }
          room
          order
          distribution
          date
          change {
            room
            subject {
              name
              short
            }
            teacher
            type
          }
        }
      }
      `,
    }),
  });
  const data = (await rawRes.json()).data.lessons;
  data.forEach((day: Array<LessonDTO>) =>
    day.forEach((lesson: LessonDTO) => (lesson.current = false))
  );
  const days: TimetableData = {
    monday: data[0],
    tuesday: data[1],
    wednesday: data[2],
    thursday: data[3],
    friday: data[4],
    saturday: data[5],
    sunday: data[6],
  };
  return days;
};

export const markCurrent = (data: TimetableData): void => {
  const today = DAYS[getToday()].toLocaleLowerCase();
  Object.keys(data).forEach((dayKey) =>
    data[dayKey as keyof TimetableData].forEach(
      (lesson) => (lesson.current = false)
    )
  ); // Sets all lessons to not current
  const lessonsToday = data[today as keyof TimetableData];
  let activeIdx = -1;
  lessonsToday.forEach((lesson, idx) => {
    const start = lesson.time.split(" - ")[0];
    const end = lesson.time.split(" - ")[1];
    const today = new Date();
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parseInt(start.split(":")[0]),
      parseInt(start.split(":")[1]),
      0
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      parseInt(end.split(":")[0]),
      parseInt(end.split(":")[1]),
      0
    );
    if (
      startDate.getTime() < today.getTime() &&
      today.getTime() < endDate.getTime()
    ) {
      activeIdx = idx;
    }
  });
  if (activeIdx !== -1) {
    data[today as keyof TimetableData][activeIdx].current = true;
  }
};
