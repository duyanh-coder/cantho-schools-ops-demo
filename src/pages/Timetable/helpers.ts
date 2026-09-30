import {
    DAY_LABELS,
    PERIOD_TIME,
} from "@/mock/common/types";

import type {
    Campus,
    Personnel,
    SchoolClass,
    SchoolRoom,
    TimetableConflict,
    TimetableEntry,
    WeekDay,
} from "@/mock/common/types";

import type {
    Subject,
} from "@/mock/common/subjects";


export interface TimetableLookups {
    subjectName: (id: string) => string;

    className: (id: string) => string;

    teacherName: (id: string) => string;

    campusName: (id: string) => string;

    roomCode: (id: string) => string;

    classroomByCampus: Map<string, SchoolClass[]>;

    subjectById: Map<string, Subject>;

    classById: Map<string, SchoolClass>;

    personnelById: Map<string, Personnel>;

    campusById: Map<string, Campus>;

    roomById: Map<string, SchoolRoom>;
}

export const buildLookups = (
    subjects: Subject[],
    classes: SchoolClass[],
    personnel: Personnel[],
    campuses: Campus[],
    rooms: SchoolRoom[],
): TimetableLookups => {
    const subjectById = new Map(subjects.map((item) => [item.id, item]));
    const classById = new Map(classes.map((item) => [item.id, item]));
    const personnelById = new Map(personnel.map((item) => [item.id, item]));
    const campusById = new Map(campuses.map((item) => [item.id, item]));
    const roomById = new Map(rooms.map((item) => [item.id, item]));

    const classroomByCampus = new Map<string, SchoolClass[]>();

    for (const classItem of classes) {
        const bucket = classroomByCampus.get(classItem.campusId) ?? [];

        bucket.push(classItem);

        classroomByCampus.set(classItem.campusId, bucket);
    }

    return {
        subjectName: (id) => subjectById.get(id)?.name ?? id,
        className: (id) => classById.get(id)?.name ?? id,
        teacherName: (id) => personnelById.get(id)?.fullName ?? id,
        campusName: (id) => campusById.get(id)?.name ?? id,
        roomCode: (id) => roomById.get(id)?.code ?? id,
        classroomByCampus,
        subjectById,
        classById,
        personnelById,
        campusById,
        roomById,
    };
};

export const dayLabel = (
    day: WeekDay,
): string => DAY_LABELS[day] ?? day;

export const periodLabel = (
    period: number,
): string => {
    const item = PERIOD_TIME.find((value) => value.period === period);

    return item
        ? `Tiết ${period} · ${item.startTime}-${item.endTime}`
        : `Tiết ${period}`;
};

export const slotLabel = (
    day: WeekDay,
    period: number,
): string => `${dayLabel(day)} · ${periodLabel(period)}`;

export const shortTeacher = (
    fullName: string,
): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const hasAnyConflict = (
    conflicts: TimetableConflict[],
    entry: TimetableEntry,
): boolean =>
    conflicts.some((conflict) =>
        conflict.rows.some((row) => row.id === entry.id));

export const formatDateTime = (
    value: string | undefined,
): string => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const SUBJECT_TONES: Record<string, string> = {
    math: "blue",
    literature: "pink",
    english: "purple",
    physics: "geekblue",
    chemistry: "orange",
    biology: "green",
    history: "gold",
    geography: "lime",
    civic_education: "cyan",
    informatics: "teal",
    technology: "volcano",
    physical_education: "magenta",
    music: "geekblue",
    art: "gold",
};