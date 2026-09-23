import {
    useMemo,
} from "react";

import {
    canThoTimetables,
} from "@/mock/canTho";

import type {
    TimetableEntry,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const TIMETABLES_STORAGE_KEY = "can-tho-timetables";

export interface TimetablesApi extends CrudApi<TimetableEntry> {
    byId: Map<string, TimetableEntry>;

    byCampus: TimetableEntry[];

    byClass: TimetableEntry[];

    byTeacher: TimetableEntry[];

    byRoom: TimetableEntry[];

    bySubject: TimetableEntry[];

    byAcademicYearAndSemester: TimetableEntry[];
}

export function useTimetables(
    filters?: {
        campusId?: string;

        classId?: string;

        teacherId?: string;

        roomId?: string;

        subjectId?: string;

        academicYearId?: string;

        semesterId?: string;
    },
): TimetablesApi {
    const base = useCrud<TimetableEntry>(
        TIMETABLES_STORAGE_KEY,
        canThoTimetables,
    );

    const items = base.items;

    const byId = useMemo(
        () => new Map<string, TimetableEntry>(
            items.map((entry) => [entry.id, entry]),
        ),
        [items],
    );

    const byCampus = useMemo(
        () => filters?.campusId
            ? items.filter((entry) => entry.campusId === filters.campusId)
            : items,
        [items, filters?.campusId],
    );

    const byClass = useMemo(
        () => filters?.classId
            ? items.filter((entry) => entry.classId === filters.classId)
            : items,
        [items, filters?.classId],
    );

    const byTeacher = useMemo(
        () => filters?.teacherId
            ? items.filter((entry) => entry.teacherId === filters.teacherId)
            : items,
        [items, filters?.teacherId],
    );

    const byRoom = useMemo(
        () => filters?.roomId
            ? items.filter((entry) => entry.roomId === filters.roomId)
            : items,
        [items, filters?.roomId],
    );

    const bySubject = useMemo(
        () => filters?.subjectId
            ? items.filter((entry) => entry.subjectId === filters.subjectId)
            : items,
        [items, filters?.subjectId],
    );

    const byAcademicYearAndSemester = useMemo(
        () => items.filter((entry) =>
            (filters?.academicYearId
                ? entry.academicYearId === filters.academicYearId
                : true) &&
            (filters?.semesterId
                ? entry.semesterId === filters.semesterId
                : true)),
        [items, filters?.academicYearId, filters?.semesterId],
    );

    const api = useMemo<TimetablesApi>(
        () => ({
            ...base,
            items,
            byId,
            byCampus,
            byClass,
            byTeacher,
            byRoom,
            bySubject,
            byAcademicYearAndSemester,
        }),
        [
            base,
            items,
            byId,
            byCampus,
            byClass,
            byTeacher,
            byRoom,
            bySubject,
            byAcademicYearAndSemester,
        ],
    );

    return api;
}