import { DAYS } from "@/consts";
import { LessonDTO } from "@/models/lesson";
import { TimetableData } from "@/models/timetableData";
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "https://timetable-api.vloapp.pl/graphql",
});

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
        lesson.distribution!.shortcut === wf ||
        lesson.distribution!.shortcut === lang ||
        lesson.distribution!.shortcut === angInf
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

interface LessonCache {
  data: TimetableData;
}

const cacheLessons = (data: TimetableData): void => {
  localStorage.setItem("data", JSON.stringify({ data }));
  localStorage.setItem("lastFetch", new Date().getTime().toString());
};

const getLessonsFromCache = async (): Promise<TimetableData | null> => {
  const prev = localStorage.getItem("data");
  if (!prev) {
    return null;
  }
  try {
    const lessonCache: LessonCache = JSON.parse(prev);
    return lessonCache.data;
  } catch {
    return null;
  }
};

export const getLessons = async (): Promise<TimetableData> => {
  const cache = await getLessonsFromCache();
  let data: TimetableData;
  const query = gql`
    query {
      monday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      tuesday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      wednesday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      thirsday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      friday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      saturday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
      sunday {
        time
        name
        short
        distribution {
          shortcut
        }
        change {
          Type
        }
        room {
          code
        }
        timestamp
      }
    }
  `;
  if (!cache) {
    data = (await client.query({ query })).data;
    cacheLessons(data);
  } else {
    data = cache;
    client
      .query({ query })
      .then((data) => data.data)
      .then(cacheLessons);
  }
  Object.keys(data).forEach((key) =>
    data[key as keyof TimetableData].forEach(
      (lesson) => (lesson.current = false)
    )
  );

  return data;
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
