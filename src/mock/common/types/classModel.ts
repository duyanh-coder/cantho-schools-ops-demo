export type AcademicYearStatus =
    | "DRAFT"
    | "ACTIVE"
    | "CLOSED";

export interface AcademicYear {
    id: string;

    schoolId: string;

    code: string;

    name: string;

    startDate: string;

    endDate: string;

    status: AcademicYearStatus;
}

export type SemesterStatus =
    | "ACTIVE"
    | "CLOSED";

export interface Semester {
    id: string;

    academicYearId: string;

    code: string;

    name: string;

    startDate: string;

    endDate: string;

    status: SemesterStatus;
}

export interface Grade {
    id: string;

    schoolId: string;

    code: string;

    name: string;

    sortOrder: number;

    status: "active" | "inactive";
}

export type ClassType =
    | "REGULAR"
    | "TWO_SESSION"
    | "BOARDING"
    | "SPECIAL";

export type ClassStatus =
    | "active"
    | "inactive"
    | "suspended"
    | "closed";

export type ClassHistoryEventType =
    | "created"
    | "updated"
    | "status_changed"
    | "teacher_changed"
    | "room_changed";

export interface ClassHistoryEntry {
    id: string;

    classId: string;

    type: ClassHistoryEventType;

    actor: string;

    content: string;

    createdAt: string;
}

export interface SchoolRoom {
    id: string;

    schoolId: string;

    campusId: string;

    code: string;

    category: "classroom" | "function_room";

    capacity: number;

    condition: "good" | "normal" | "repair";
}