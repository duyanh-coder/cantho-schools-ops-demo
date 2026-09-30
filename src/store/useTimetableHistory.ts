import {
    useMemo,
} from "react";

import {
    canThoTimetableHistory,
} from "@/mock/canTho";

import type {
    TimetableHistoryEntry,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const TIMETABLE_HISTORY_STORAGE_KEY = "can-tho-timetable-history";

export interface TimetableHistoryApi extends CrudApi<TimetableHistoryEntry> {
    byEntry: TimetableHistoryEntry[];

    byClass: TimetableHistoryEntry[];

    byTerm: TimetableHistoryEntry[];
}

export function useTimetableHistory(
    filters?: {
        entryId?: string;

        classId?: string;

        academicYearId?: string;

        semesterId?: string;
    },
): TimetableHistoryApi {
    const base = useCrud<TimetableHistoryEntry>(
        TIMETABLE_HISTORY_STORAGE_KEY,
        canThoTimetableHistory,
    );

    const {
        entryId,
        classId,
        academicYearId,
        semesterId,
    } = filters ?? {};

    const sorted = useMemo(
        () => base.items
            .slice()
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        [base.items],
    );

    const byEntry = useMemo(
        () => (entryId
            ? sorted.filter((item) => item.entryId === entryId)
            : sorted),
        [sorted, entryId],
    );

    const byClass = useMemo(
        () => (classId
            ? sorted.filter((item) => item.classId === classId)
            : sorted),
        [sorted, classId],
    );

    const byTerm = useMemo(
        () => sorted.filter((item) =>
            (academicYearId
                ? item.academicYearId === academicYearId
                : true) &&
            (semesterId
                ? item.semesterId === semesterId
                : true)),
        [sorted, academicYearId, semesterId],
    );

    const api = useMemo<TimetableHistoryApi>(
        () => ({
            ...base,
            byEntry,
            byClass,
            byTerm,
        }),
        [base, byEntry, byClass, byTerm],
    );

    return api;
}
