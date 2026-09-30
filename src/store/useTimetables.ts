import {
    useMemo,
} from "react";

import {
    canThoTimetables,
} from "@/mock/canTho";

import type {
    TimetableEntry,
    TimetableEntryStatus,
    WeekDay,
} from "@/mock/common/types";

import {
    canTransit,
    isEditableStatus,
} from "@/utils/timetable";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


/**
 * Đổi khóa lưu trữ ở phase 05 vì seed thời khóa biểu được dựng lại:
 * dữ liệu cache của bản cũ không còn khớp với cấu trúc `version`.
 */
export const TIMETABLES_STORAGE_KEY = "can-tho-timetables-v2";

export interface TimetableSlotKey {
    dayOfWeek: WeekDay;

    period: number;
}

export const slotKeyOf = (
    dayOfWeek: WeekDay,
    period: number,
): string => `${dayOfWeek}|${period}`;

export interface TimetablesFilters {
    campusId?: string;

    classId?: string;

    teacherId?: string;

    roomId?: string;

    subjectId?: string;

    academicYearId?: string;

    semesterId?: string;

    week?: number;

    status?: TimetableEntryStatus;
}

export interface TimetablesApi extends CrudApi<TimetableEntry> {
    byId: Map<string, TimetableEntry>;

    byCampus: TimetableEntry[];

    byClass: TimetableEntry[];

    byTeacher: TimetableEntry[];

    byRoom: TimetableEntry[];

    bySubject: TimetableEntry[];

    byAcademicYearAndSemester: TimetableEntry[];

    /**
     * Lọc theo toàn bộ tiêu chí đang chọn, dùng cho KPI và bảng tổng quan.
     */
    filtered: TimetableEntry[];

    /**
     * Giữ lại bản có số version cao nhất trong từng chuỗi phiên bản
     * (bản ADJUSTING thay cho bản PUBLISHED cùng gốc), mọi tiết đều
     * hiện đúng một lần trên lưới.
     */
    effective: TimetableEntry[];

    bySlot: Map<string, TimetableEntry[]>;

    effectiveBySlot: Map<string, TimetableEntry[]>;

    applyTransition: (
        id: string,
        status: TimetableEntryStatus,
    ) => void;

    createAdjustment: (
        id: string,
        patch: Partial<TimetableEntry>,
    ) => TimetableEntry | null;
}

const matchesFilters = (
    entry: TimetableEntry,
    filters: TimetablesFilters,
): boolean => {
    if (filters.campusId && entry.campusId !== filters.campusId) {
        return false;
    }

    if (filters.classId && entry.classId !== filters.classId) {
        return false;
    }

    if (filters.teacherId && entry.teacherId !== filters.teacherId) {
        return false;
    }

    if (filters.roomId && entry.roomId !== filters.roomId) {
        return false;
    }

    if (filters.subjectId && entry.subjectId !== filters.subjectId) {
        return false;
    }

    if (
        filters.academicYearId &&
        entry.academicYearId !== filters.academicYearId
    ) {
        return false;
    }

    if (filters.semesterId && entry.semesterId !== filters.semesterId) {
        return false;
    }

    if (
        filters.week !== undefined &&
        filters.week > 0 &&
        entry.week > 0 &&
        entry.week !== filters.week
    ) {
        return false;
    }

    if (filters.status && entry.status !== filters.status) {
        return false;
    }

    return true;
};

const groupBySlot = (
    entries: TimetableEntry[],
): Map<string, TimetableEntry[]> => {
    const grouped = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const key = slotKeyOf(entry.dayOfWeek, entry.period);

        const bucket = grouped.get(key) ?? [];

        bucket.push(entry);

        grouped.set(key, bucket);
    }

    return grouped;
};

export function useTimetables(
    filters?: TimetablesFilters,
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

    const filtered = useMemo(
        () => (filters
            ? items.filter((entry) => matchesFilters(entry, filters))
            : items),
        [items, filters],
    );

    const effective = useMemo(() => {
        const winners = new Map<string, TimetableEntry>();

        for (const entry of filtered) {
            const rootId = entry.supersedesId ?? entry.id;

            const current = winners.get(rootId);

            if (!current || entry.version > current.version) {
                winners.set(rootId, entry);
            }
        }

        return [...winners.values()];
    }, [filtered]);

    const bySlot = useMemo(
        () => groupBySlot(filtered),
        [filtered],
    );

    const effectiveBySlot = useMemo(
        () => groupBySlot(effective),
        [effective],
    );

    const api = useMemo<TimetablesApi>(() => {
        const applyTransition = (
            id: string,
            status: TimetableEntryStatus,
        ): void => {
            const current = byId.get(id);

            if (!current || !canTransit(current.status, status)) {
                return;
            }

            base.update({
                ...current,
                status,
                version: current.version + 1,
                updatedAt: new Date().toISOString(),
            });
        };

        /**
         * Yêu cầu 11: không ghi đè tiết đã xuất bản.
         * Mọi thay đổi sau khi công bố đều tạo một phiên bản điều chỉnh mới.
         */
        const createAdjustment = (
            id: string,
            patch: Partial<TimetableEntry>,
        ): TimetableEntry | null => {
            const source = byId.get(id);

            if (!source || !isEditableStatus(source.status)) {
                return null;
            }

            const next: TimetableEntry = {
                ...source,
                ...patch,
                id: `${source.id}-v${source.version + 1}`,
                status: "ADJUSTING",
                version: source.version + 1,
                supersedesId: source.id,
                updatedAt: new Date().toISOString(),
            };

            base.create(next);

            return next;
        };

        return {
            ...base,
            items,
            byId,
            byCampus,
            byClass,
            byTeacher,
            byRoom,
            bySubject,
            byAcademicYearAndSemester,
            filtered,
            effective,
            bySlot,
            effectiveBySlot,
            applyTransition,
            createAdjustment,
        };
    }, [
        base,
        items,
        byId,
        byCampus,
        byClass,
        byTeacher,
        byRoom,
        bySubject,
        byAcademicYearAndSemester,
        filtered,
        effective,
        bySlot,
        effectiveBySlot,
    ]);

    return api;
}
