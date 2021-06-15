interface Distribution {
  shortcut: string;
}

export interface LessonDTO {
  time: string;
  name: string;
  short: string;
  current?: boolean;
  distribution?: Distribution;
  change?: {
    Type: number;
  };
  room?: {
    code: string;
  };
  timestamp?: string;
}
