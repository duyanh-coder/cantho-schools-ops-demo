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

    const {
        campusId,
        classId,
        teacherId,
        roomId,
        subjectId,
        academicYearId,
        semesterId,
    } = filters ?? {};

    const byId = useMemo(
        () => new Map<string, TimetableEntry>(
            items.map((entry) => [entry.id, entry]),
        ),
        [items],
    );

    const byCampus = useMemo(
        () => campusId
            ? items.filter((entry) => entry.campusId === campusId)
            : items,
        [items, campusId],
    );

    const byClass = useMemo(
        () => classId
            ? items.filter((entry) => entry.classId === classId)
            : items,
        [items, classId],
    );

    const byTeacher = useMemo(
        () => teacherId
            ? items.filter((entry) => entry.teacherId === teacherId)
            : items,
        [items, teacherId],
    );

    const byRoom = useMemo(
        () => roomId
            ? items.filter((entry) => entry.roomId === roomId)
            : items,
        [items, roomId],
    );

    const bySubject = useMemo(
        () => subjectId
            ? items.filter((entry) => entry.subjectId === subjectId)
            : items,
        [items, subjectId],
    );

    const byAcademicYearAndSemester = useMemo(
        () => items.filter((entry) =>
            (academicYearId
                ? entry.academicYearId === academicYearId
                : true) &&
            (semesterId
                ? entry.semesterId === semesterId
                : true)),
        [items, academicYearId, semesterId],
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