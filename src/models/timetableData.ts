import { LessonDTO } from "./lesson";

export interface TimetableData {
    'monday': LessonDTO[],
    'tuesday': LessonDTO[],
    'wednesday': LessonDTO[],
    'thursday': LessonDTO[],
    'friday': LessonDTO[],
    'saturday': LessonDTO[],
    'sunday': LessonDTO[]
}