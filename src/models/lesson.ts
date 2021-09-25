interface TeamVirtual {
  id: number;
  key: string;
  shortcut: string;
  name: string;
  partType: string;
}

interface DateTime {
  timestamp: number;
  date: string;
  time: string;
}

interface TimeSlot {
  id: number;
  start: string;
  end: string;
  display: string;
  position: number;
}

interface LessonRoom {
  id: number;
  code: string;
}

interface Subject {
  id: number;
  key: string;
  name: string;
  code: string;
  position: number;
}

interface LessonChanges {
  id: number;
  type: number;
  separation: boolean;
}

interface ChangedLesson {
  id?: number;
  unitId?: number;
  scheduleId?: number;
  lessonDate?: DateTime;
  note?: string;
  reason?: string;
  time?: TimeSlot;
  room?: LessonRoom;
  subject?: Subject;
  event?: string;
  change?: LessonChanges;
  changeDate?: DateTime;
  distribution?: TeamVirtual;
}

export interface LessonDTO {
  time: string;
  name: string;
  short: string;
  current?: boolean;
  distribution?: TeamVirtual;
  change?: ChangedLesson;
  room?: {
    id: number;
    code: string;
  };
  timestamp?: number;
}
