type Group = "gr1" | "gr2" | "gr1n" | "gr2n" | "gr3n" | "gr4r" | "DZ" | "CH";

interface Subject {
  id: number;
  key: string;
  name: string;
  code: string;
  position: number;
}

interface ChangedLesson {
  room?: string;
  subject?: Subject;
  teacher?: string;
  type: 0 | 1 | 2 | 3;
}

interface Subject {
  short: string;
  name: string;
}
export interface LessonDTO {
  time: string;
  teacher: string;
  subject: Subject;
  current?: boolean;
  distribution?: Group;
  change?: ChangedLesson;
  room?: string;
  order: number;
}
