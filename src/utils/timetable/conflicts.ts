import type {
    TimetableEntry,
} from "@/mock/common/types";

import {
    WEEKDAY_ORDER,
} from "@/mock/common/types";


export type TimetableConflictType =
    | "teacher_conflict"
    | "class_conflict"
    | "room_conflict"
    | "quota_conflict";

export interface TimetableConflict {
    type: TimetableConflictType;

    dayOfWeek: string;

    period: number;

    week: number;

    rows: TimetableEntry[];

    message: string;
}

export interface TimetableQuota {
    teacherId: string;

    classId: string;

    subjectId: string;

    standard: number;

    assigned: number;
}

const weeksOverlap = (
    a: number,
    b: number,
): boolean => a === 0 || b === 0 || a === b;

export const detectConflicts = (
    entries: TimetableEntry[],
): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    const teacherKey = (entry: TimetableEntry): string =>
        [
            entry.teacherId,
            entry.dayOfWeek,
            entry.period,
        ].join("|");

    const classKey = (entry: TimetableEntry): string =>
        [
            entry.classId,
            entry.dayOfWeek,
            entry.period,
        ].join("|");

    const roomKey = (entry: TimetableEntry): string =>
        [
            entry.roomId,
            entry.dayOfWeek,
            entry.period,
        ].join("|");

    const seen = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const key = teacherKey(entry);

        const group = seen.get(key) ?? [];

        group.push(entry);

        seen.set(key, group);
    }

    for (const [
        key,
        group,
    ] of seen) {
        if (group.length < 2) {
            continue;
        }

        for (let i = 0; i < group.length; i += 1) {
            for (let j = i + 1; j < group.length; j += 1) {
                const [a, b] = [group[i], group[j]];

                if (!weeksOverlap(a.week, b.week)) {
                    continue;
                }

                const [day, period] = key.split("|");

                conflicts.push({
                    type: "teacher_conflict",
                    dayOfWeek: day,
                    period: Number.parseInt(period, 10),
                    week: a.week,
                    rows: [a, b],
                    message:
                        "Trùng giáo viên cùng buổi/ca trong tuần",
                });
            }
        }
    }

    const seenClass = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const key = classKey(entry);

        const group = seenClass.get(key) ?? [];

        group.push(entry);

        seenClass.set(key, group);
    }

    for (const [
        key,
        group,
    ] of seenClass) {
        if (group.length < 2) {
            continue;
        }

        for (let i = 0; i < group.length; i += 1) {
            for (let j = i + 1; j < group.length; j += 1) {
                const [a, b] = [group[i], group[j]];

                if (!weeksOverlap(a.week, b.week)) {
                    continue;
                }

                const [day, period] = key.split("|");

                conflicts.push({
                    type: "class_conflict",
                    dayOfWeek: day,
                    period: Number.parseInt(period, 10),
                    week: a.week,
                    rows: [a, b],
                    message:
                        "Cùng lớp dạy 2 môn trong một buổi/ca",
                });
            }
        }
    }

    const seenRoom = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const key = roomKey(entry);

        const group = seenRoom.get(key) ?? [];

        group.push(entry);

        seenRoom.set(key, group);
    }

    for (const [
        key,
        group,
    ] of seenRoom) {
        if (group.length < 2) {
            continue;
        }

        for (let i = 0; i < group.length; i += 1) {
            for (let j = i + 1; j < group.length; j += 1) {
                const [a, b] = [group[i], group[j]];

                if (!weeksOverlap(a.week, b.week)) {
                    continue;
                }

                const [day, period] = key.split("|");

                conflicts.push({
                    type: "room_conflict",
                    dayOfWeek: day,
                    period: Number.parseInt(period, 10),
                    week: a.week,
                    rows: [a, b],
                    message:
                        "Trùng phòng học cùng buổi/ca",
                });
            }
        }
    }

    return conflicts;
};

export const sortConflicts = (
    conflicts: TimetableConflict[],
): TimetableConflict[] =>
    [...conflicts].sort((a, b) => {
        const dayDiff = WEEKDAY_ORDER.indexOf(
            a.dayOfWeek as (typeof WEEKDAY_ORDER)[number],
        ) - WEEKDAY_ORDER.indexOf(
            b.dayOfWeek as (typeof WEEKDAY_ORDER)[number],
        );

        if (dayDiff !== 0) {
            return dayDiff;
        }

        return a.period - b.period;
    });

export const computeQuotaUsage = (
    entries: TimetableEntry[],
    quotas: Array<{
        teacherId: string;

        classId: string;

        subjectId: string;

        periodsPerWeek: number;
    }>,
): TimetableQuota[] =>
    quotas.map((quota) => {
        const assigned = entries.filter((entry) =>
            entry.teacherId === quota.teacherId &&
            entry.classId === quota.classId &&
            entry.subjectId === quota.subjectId).length;

        return {
            teacherId: quota.teacherId,
            classId: quota.classId,
            subjectId: quota.subjectId,
            standard: quota.periodsPerWeek,
            assigned,
        };
    });