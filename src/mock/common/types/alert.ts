import type {
    TimetableConflictType,
} from "./timetable";


export type AlertRefType =
    | "timetable"
    | "timetable_conflict"
    | "class"
    | "teacher"
    | "room"
    | "assignment"
    | "document"
    | "facility"
    | "student"
    | "report";


export interface AlertItem {
    id: string;

    campusId?: string;

    title: string;

    description: string;

    level: "info" | "warning" | "danger";

    createdAt: string;

    status: "new" | "processing" | "resolved";

    refType?: AlertRefType;

    refId?: string;

    timetableIds?: readonly string[];

    conflictType?: TimetableConflictType;

    cause?: string;

    resolution?: string;
}
