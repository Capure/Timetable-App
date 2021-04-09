interface TeamVirtual {
    id: number;
    key: string;
    shortcut: string;
    name: string;
    partType: string;
}

export interface LessonDTO {
    time: string,
    name: string,
    short: string,
    current?: boolean,
    distribution?: TeamVirtual,
    change?: string,
    timestamp?: number,
}