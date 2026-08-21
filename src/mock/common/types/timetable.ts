export type WeekDay =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export interface TimetableItem {
    id: string;

    campusId: string;
    classId: string;
    teacherId: string;
    subjectId: string;

    day: WeekDay;

    period: number;

    room: string;

    startTime: string;
    endTime: string;
}