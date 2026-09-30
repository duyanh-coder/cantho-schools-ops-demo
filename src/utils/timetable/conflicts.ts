import type {
    SchoolClass,
    TimetableConflict,
    TimetableConflictType,
    TimetableEntry,
    TimetableQuota,
    TimetableSession,
    TimetableSuggestion,
    WeekDay,
} from "@/mock/common/types";

import {
    DAY_LABELS,
    PERIOD_TIME,
    SESSION_LABELS,
    WEEKDAY_ORDER,
    periodSession,
} from "@/mock/common/types";


export type {
    TimetableConflict,
    TimetableConflictType,
    TimetableQuota,
    TimetableSuggestion,
} from "@/mock/common/types";


const SCHOOL_DAYS: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export const weeksOverlap = (
    a: number,
    b: number,
): boolean => a === 0 || b === 0 || a === b;

export const isSameVersionLine = (
    a: TimetableEntry,
    b: TimetableEntry,
): boolean =>
    a.id === b.id ||
    a.supersedesId === b.id ||
    b.supersedesId === a.id;

const pairKey = (
    value: string,
    entry: TimetableEntry,
): string => `${value}|${entry.dayOfWeek}|${entry.period}`;

const splitKey = (
    key: string,
): {
    dayOfWeek: WeekDay;
    period: number;
} => {
    const parts = key.split("|");

    return {
        dayOfWeek: parts[1] as WeekDay,
        period: Number.parseInt(parts[2] ?? "0", 10),
    };
};

const groupBySlot = (
    entries: TimetableEntry[],
    keyOf: (entry: TimetableEntry) => string,
): Map<string, TimetableEntry[]> => {
    const seen = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const key = keyOf(entry);

        const group = seen.get(key) ?? [];

        group.push(entry);

        seen.set(key, group);
    }

    return seen;
};

interface PairConflictRule {
    type: TimetableConflictType;

    keyOf: (entry: TimetableEntry) => string;

    message: string;

    cause: (a: TimetableEntry, b: TimetableEntry) => string;

    resolution: string;
}

const PAIR_CONFLICT_RULES: PairConflictRule[] = [
    {
        type: "teacher_conflict",
        keyOf: (entry) => pairKey(entry.teacherId, entry),
        message: "Trùng giáo viên cùng buổi/ca trong tuần",
        cause: (a, b) =>
            `Giáo viên ${a.teacherId} phải dạy đồng thời lớp ${a.classId} và lớp ${b.classId}.`,
        resolution: "Đổi giờ tiết, đổi giáo viên hoặc chuyển sang phòng khác giờ.",
    },
    {
        type: "class_conflict",
        keyOf: (entry) => pairKey(entry.classId, entry),
        message: "Cùng lớp dạy 2 môn trong một buổi/ca",
        cause: (a, b) =>
            `Lớp ${a.classId} bị xếp 2 môn (${a.subjectId} và ${b.subjectId}) cùng thời điểm.`,
        resolution: "Đổi giờ tiết hoặc đổi phòng học cho một trong hai tiết.",
    },
    {
        type: "room_conflict",
        keyOf: (entry) => pairKey(entry.roomId, entry),
        message: "Trùng phòng học cùng buổi/ca",
        cause: (a, b) =>
            `Phòng ${a.roomId} bị chiếm đồng thời bởi lớp ${a.classId} và lớp ${b.classId}.`,
        resolution: "Đổi phòng học cho một trong hai tiết hoặc dời giờ tiết.",
    },
];

const collectPairConflicts = (
    entries: TimetableEntry[],
    rule: PairConflictRule,
): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    const seen = groupBySlot(entries, rule.keyOf);

    for (const [
        key,
        group,
    ] of seen) {
        if (group.length < 2) {
            continue;
        }

        for (let i = 0; i < group.length; i += 1) {
            for (let j = i + 1; j < group.length; j += 1) {
                const a = group[i];

                const b = group[j];

                if (!weeksOverlap(a.week, b.week)) {
                    continue;
                }

                if (isSameVersionLine(a, b)) {
                    continue;
                }

                const {
                    dayOfWeek,
                    period,
                } = splitKey(key);

                conflicts.push({
                    type: rule.type,
                    dayOfWeek,
                    period,
                    week: a.week,
                    rows: [a, b],
                    message: rule.message,
                    cause: rule.cause(a, b),
                    resolution: rule.resolution,
                });
            }
        }
    }

    return conflicts;
};

export interface TimetableQuotaSource {
    teacherId: string;

    classId: string;

    subjectId: string;

    periodsPerWeek: number;
}

export interface DetectConflictContext {
    assignments?: TimetableQuotaSource[];

    classes?: SchoolClass[];

    roomCapacity?: Record<string, number>;
}

export const detectConflicts = (
    entries: TimetableEntry[],
    context: DetectConflictContext = {},
): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    for (const rule of PAIR_CONFLICT_RULES) {
        conflicts.push(...collectPairConflicts(entries, rule));
    }

    const assignmentIds = new Set(
        (context.assignments ?? []).map((item) => `${item.teacherId}|${item.classId}|${item.subjectId}`),
    );

    for (const entry of entries) {
        const triple = `${entry.teacherId}|${entry.classId}|${entry.subjectId}`;

        if (assignmentIds.size > 0 && !assignmentIds.has(triple)) {
            conflicts.push({
                type: "assignment_missing",
                dayOfWeek: entry.dayOfWeek,
                period: entry.period,
                week: entry.week,
                rows: [entry],
                message: "Tiết học chưa có phân công giảng dạy",
                cause:
                    `Không tìm thấy phân công cho giáo viên ${entry.teacherId} dạy môn ${entry.subjectId} ở lớp ${entry.classId}.`,
                resolution: "Tạo phân công giảng dạy hoặc sửa giáo viên/môn/lớp của tiết.",
            });
        }
    }

    const classById = new Map(
        (context.classes ?? []).map((item) => [item.id, item]),
    );

    for (const entry of entries) {
        const target = classById.get(entry.classId);

        if (!target) {
            continue;
        }

        if (target.campusId !== entry.campusId) {
            conflicts.push({
                type: "campus_mismatch",
                dayOfWeek: entry.dayOfWeek,
                period: entry.period,
                week: entry.week,
                rows: [entry],
                message: "Tiết học nằm sai cơ sở",
                cause:
                    `Lớp ${entry.classId} thuộc cơ sở ${target.campusId} nhưng tiết được gán cho cơ sở ${entry.campusId}.`,
                resolution: "Đổi cơ sở của tiết về đúng cơ sở của lớp.",
            });
        }
    }

    const capacity = context.roomCapacity ?? {};

    for (const entry of entries) {
        const target = classById.get(entry.classId);

        const limit = capacity[entry.roomId];

        if (limit === undefined || !target?.capacity) {
            continue;
        }

        if (target.capacity > limit) {
            conflicts.push({
                type: "capacity_exceeded",
                dayOfWeek: entry.dayOfWeek,
                period: entry.period,
                week: entry.week,
                rows: [entry],
                message: "Vượt sức chứa phòng học",
                cause:
                    `Lớp ${entry.classId} có ${target.capacity} học sinh vượt sức chứa ${limit} của phòng ${entry.roomId}.`,
                resolution: "Đổi sang phòng có sức chứa lớn hơn.",
            });
        }
    }

    conflicts.push(...detectQuotaConflicts(entries, context.assignments ?? []));

    return conflicts;
};

const detectQuotaConflicts = (
    entries: TimetableEntry[],
    assignments: TimetableQuotaSource[],
): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    for (const assignment of assignments) {
        const rows = entries.filter((entry) =>
            entry.teacherId === assignment.teacherId &&
            entry.classId === assignment.classId &&
            entry.subjectId === assignment.subjectId);

        if (rows.length === 0) {
            continue;
        }

        if (rows.length > assignment.periodsPerWeek) {
            conflicts.push({
                type: "quota_exceeded",
                dayOfWeek: rows[0].dayOfWeek,
                period: rows[0].period,
                week: rows[0].week,
                rows,
                message: "Vượt số tiết phân công giảng dạy",
                cause:
                    `Phân công ${assignment.teacherId} - ${assignment.subjectId} - ${assignment.classId} yêu cầu ${assignment.periodsPerWeek} tiết/tuần nhưng đã xếp ${rows.length} tiết.`,
                resolution: "Giảm số tiết đã xếp hoặc điều chỉnh lại hạn mức phân công.",
            });
        }
    }

    return conflicts;
};

export const detectMissingQuota = (
    entries: TimetableEntry[],
    assignments: TimetableQuotaSource[],
): TimetableConflict[] =>
    assignments
        .filter((assignment) => {
            const scheduled = entries.filter((entry) =>
                entry.teacherId === assignment.teacherId &&
                entry.classId === assignment.classId &&
                entry.subjectId === assignment.subjectId).length;

            return scheduled < assignment.periodsPerWeek;
        })
        .map((assignment) => ({
            type: "quota_missing" as TimetableConflictType,
            dayOfWeek: "monday" as WeekDay,
            period: 0,
            week: 0,
            rows: [],
            message: "Thiếu tiết so với phân công giảng dạy",
            cause:
                `Phân công ${assignment.teacherId} - ${assignment.subjectId} - ${assignment.classId} cần ${assignment.periodsPerWeek} tiết/tuần nhưng mới xếp ít hơn.`,
            resolution: "Bổ sung tiết học còn thiếu vào thời khóa biểu.",
        }));

export const detectAssignmentCoverage = (
    entries: TimetableEntry[],
    assignments: TimetableQuotaSource[],
    options: {
        academicYearId: string;

        semesterId: string;
    },
): TimetableConflict[] =>
    entries
        .filter((entry) =>
            entry.academicYearId === options.academicYearId &&
            entry.semesterId === options.semesterId)
        .filter((entry) => !assignments.some((assignment) =>
            assignment.teacherId === entry.teacherId &&
            assignment.classId === entry.classId &&
            assignment.subjectId === entry.subjectId))
        .map((entry) => ({
            type: "assignment_missing" as TimetableConflictType,
            dayOfWeek: entry.dayOfWeek,
            period: entry.period,
            week: entry.week,
            rows: [entry],
            message: "Thiếu phân công giảng dạy",
            cause:
                `Tiết ${entry.id} dùng giáo viên ${entry.teacherId} dạy ${entry.subjectId} cho lớp ${entry.classId} nhưng không có phân công tương ứng.`,
            resolution: "Tạo phân công giảng dây cho tiết này trong tab Phân công giảng dạy.",
        }));

export const detectCrossCampusTeaching = (
    entries: TimetableEntry[],
    assignments: TimetableQuotaSource[],
    classes: SchoolClass[],
): TimetableConflict[] => {
    const campusByClass = new Map(
        classes.map((item) => [item.id, item.campusId]),
    );

    const assignedTriples = new Set(
        assignments.map((item) =>
            `${item.teacherId}|${item.classId}|${item.subjectId}`),
    );

    const rowsByTeacher = new Map<string, TimetableEntry[]>();

    for (const entry of entries) {
        const triple = `${entry.teacherId}|${entry.classId}|${entry.subjectId}`;

        if (!assignedTriples.has(triple)) {
            continue;
        }

        const group = rowsByTeacher.get(entry.teacherId) ?? [];

        group.push(entry);

        rowsByTeacher.set(entry.teacherId, group);
    }

    const conflicts: TimetableConflict[] = [];

    for (const [
        teacherId,
        rows,
    ] of rowsByTeacher) {
        const campuses = new Set(
            rows
                .map((entry) => campusByClass.get(entry.classId))
                .filter((value): value is string => Boolean(value)),
        );

        if (campuses.size < 2) {
            continue;
        }

        const daySet = [...new Set(
            rows.map((entry) => entry.dayOfWeek),
        )].sort((a, b) =>
            WEEKDAY_ORDER.indexOf(a) - WEEKDAY_ORDER.indexOf(b));

        const anchor = rows.find((entry) =>
            entry.dayOfWeek === daySet[daySet.length - 1]) ?? rows[0];

        conflicts.push({
            type: "campus_mismatch",
            dayOfWeek: anchor.dayOfWeek,
            period: anchor.period,
            week: anchor.week,
            rows,
            message: "Giáo viên dạy ở nhiều cơ sở",
            cause:
                `Giáo viên ${teacherId} được xếp dạy ở ${campuses.size} cơ sở (${[...campuses].join(", ")}) trong cùng học kỳ, cần tính thêm thời gian di chuyển giữa các cơ sở.`,
            resolution: "Gom các tiết của giáo viên về một cơ sở hoặc xếp khác ngày.",
        });
    }

    return conflicts;
};

export interface PlacementContext {
    academicYearId: string;

    semesterId: string;

    week?: number;

    classes?: SchoolClass[];

    assignments?: TimetableQuotaSource[];

    roomIds?: string[];

    roomCapacity?: Record<string, number>;
}

const sameSlot = (
    entry: TimetableEntry,
    candidate: TimetableEntry,
): boolean =>
    !isSameVersionLine(entry, candidate) &&
    entry.dayOfWeek === candidate.dayOfWeek &&
    entry.period === candidate.period &&
    entry.academicYearId === candidate.academicYearId &&
    entry.semesterId === candidate.semesterId;

export const validatePlacement = (
    entries: TimetableEntry[],
    candidate: TimetableEntry,
    context: PlacementContext,
): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    const week = candidate.week || context.week || 0;

    const others = entries.filter(
        (entry) => weeksOverlap(entry.week, week),
    );

    const push = (
        type: TimetableConflictType,
        message: string,
        cause: string,
        resolution: string,
        rows: TimetableEntry[],
    ): void => {
        conflicts.push({
            type,
            dayOfWeek: candidate.dayOfWeek,
            period: candidate.period,
            week,
            rows,
            message,
            cause,
            resolution,
        });
    };

    for (const entry of others) {
        if (!sameSlot(entry, candidate)) {
            continue;
        }

        if (entry.teacherId === candidate.teacherId) {
            push(
                "teacher_conflict",
                "Giáo viên đã bị xếp trùng giờ",
                `Giáo viên ${candidate.teacherId} đang dạy lớp ${entry.classId} cùng thứ và tiết này.`,
                "Chọn giáo viên khác hoặc đổi sang thời điểm khác.",
                [entry],
            );
        }

        if (entry.classId === candidate.classId) {
            push(
                "class_conflict",
                "Lớp đã bị xếp trùng giờ",
                `Lớp ${candidate.classId} đang học môn ${entry.subjectId} cùng thứ và tiết này.`,
                "Đổi sang thời điểm khác hoặc đổi môn cho tiết đang xếp.",
                [entry],
            );
        }

        if (entry.roomId === candidate.roomId) {
            push(
                "room_conflict",
                "Phòng học đã bị chiếm",
                `Phòng ${candidate.roomId} đang có lớp ${entry.classId} học cùng thứ và tiết này.`,
                "Chọn phòng học khác còn trống.",
                [entry],
            );
        }
    }

    const assignments = context.assignments ?? [];

    if (assignments.length > 0) {
        const matched = assignments.some((assignment) =>
            assignment.teacherId === candidate.teacherId &&
            assignment.classId === candidate.classId &&
            assignment.subjectId === candidate.subjectId);

        if (!matched) {
            push(
                "assignment_missing",
                "Chưa có phân công giảng dây",
                `Giáo viên ${candidate.teacherId} chưa được phân công dạy môn ${candidate.subjectId} cho lớp ${candidate.classId}.`,
                "Tạo phân công giảng dây trước khi xếp tiết này.",
                [],
            );
        }
    }

    const targetClass = (context.classes ?? []).find(
        (item) => item.id === candidate.classId,
    );

    if (targetClass && targetClass.campusId !== candidate.campusId) {
        push(
            "campus_mismatch",
            "Sai cơ sở",
            `Lớp ${candidate.classId} thuộc cơ sở ${targetClass.campusId} nhưng tiết được xếp ở cơ sở ${candidate.campusId}.`,
            "Xếp tiết vào đúng cơ sở của lớp.",
            [],
        );
    }

    if (targetClass?.capacity) {
        const limit = context.roomCapacity?.[candidate.roomId];

        if (limit !== undefined && targetClass.capacity > limit) {
            push(
                "capacity_exceeded",
                "Vượt sức chứa phòng học",
                `Lớp ${candidate.classId} có ${targetClass.capacity} học sinh vượt sức chứa ${limit} của phòng ${candidate.roomId}.`,
                "Chọn phòng có sức chứa lớn hơn.",
                [],
            );
        }
    }

    return conflicts;
};

export const suggestFreeSlots = (
    entries: TimetableEntry[],
    candidate: TimetableEntry,
    context: PlacementContext,
    options: {
        roomIds?: string[];

        limit?: number;
    } = {},
): TimetableSuggestion[] => {
    const roomIds = options.roomIds ?? context.roomIds ?? [candidate.roomId];

    const suggestions: TimetableSuggestion[] = [];

    for (const day of SCHOOL_DAYS) {
        for (const periodItem of PERIOD_TIME) {
            for (const roomId of roomIds) {
                const probe: TimetableEntry = {
                    ...candidate,
                    dayOfWeek: day,
                    period: periodItem.period,
                    roomId,
                };

                const conflicts = validatePlacement(entries, probe, {
                    ...context,
                    week: candidate.week || context.week,
                });

                if (conflicts.length > 0) {
                    continue;
                }

                const distance = Math.abs(
                    periodItem.period - candidate.period,
                );

                suggestions.push({
                    dayOfWeek: day,
                    period: periodItem.period,
                    roomId,
                    teacherId: candidate.teacherId,
                    score: Math.max(0, 100 - distance * 5),
                    note:
                        `${day} tiết ${periodItem.period} (${periodItem.startTime} - ${periodItem.endTime}), phòng ${roomId}`,
                });
            }
        }
    }

    return suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, options.limit ?? 6);
};

export const buildChangeLog = (
    entries: TimetableEntry[],
    candidate: TimetableEntry,
    context: PlacementContext,
    options: {
        roomIds?: string[];

        limit?: number;
    } = {},
): {
    conflicts: TimetableConflict[];
    suggestions: TimetableSuggestion[];
} => ({
    conflicts: validatePlacement(entries, candidate, context),
    suggestions: suggestFreeSlots(entries, candidate, context, options),
});

export const sortConflicts = (
    conflicts: TimetableConflict[],
): TimetableConflict[] =>
    [...conflicts].sort((a, b) => {
        const dayDiff = WEEKDAY_ORDER.indexOf(a.dayOfWeek) -
            WEEKDAY_ORDER.indexOf(b.dayOfWeek);

        if (dayDiff !== 0) {
            return dayDiff;
        }

        if (a.period !== b.period) {
            return a.period - b.period;
        }

        return a.type.localeCompare(b.type);
    });

export const computeQuotaUsage = (
    entries: TimetableEntry[],
    quotas: TimetableQuotaSource[],
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

export interface WorkloadStrainOptions {
    /**
     * Số tiết liên tục tối đa trong một buổi trước khi coi là quá tải.
     * Mặc định 5 theo ngưỡng nghiệp vụ "quá 5 tiết liên tục".
     */
    maxConsecutivePerSession?: number;

    /**
     * Tổng số tiết một giáo viên có thể dạy trong một ngày.
     * Mặc định 8 (tương ứng 2 buổi x 5 tiết).
     */
    maxPeriodsPerDay?: number;

    /**
     * Ngày được xét. Mặc định Thứ Hai - Thứ Sáu.
     */
    days?: WeekDay[];
}

export const DEFAULT_MAX_CONSECUTIVE_PER_SESSION = 5;

export const DEFAULT_MAX_PERIODS_PER_DAY = 8;

const longestConsecutiveRun = (
    periods: number[],
): number => {
    if (periods.length === 0) {
        return 0;
    }

    const sorted = [...new Set(periods)].sort((a, b) => a - b);

    let best = 1;
    let current = 1;

    for (let index = 1; index < sorted.length; index += 1) {
        if (sorted[index] === sorted[index - 1] + 1) {
            current += 1;
        } else {
            current = 1;
        }

        if (current > best) {
            best = current;
        }
    }

    return best;
};

/**
 * Phát hiện giáo viên quá tải theo hai tiêu chí:
 * 1. Dạy quá `maxConsecutivePerSession` tiết liên tục trong cùng một buổi.
 * 2. Dạy quá `maxPeriodsPerDay` tiết trong một ngày.
 */
export const detectWorkloadStrain = (
    entries: TimetableEntry[],
    options: WorkloadStrainOptions = {},
): TimetableConflict[] => {
    const maxConsecutive = options.maxConsecutivePerSession
        ?? DEFAULT_MAX_CONSECUTIVE_PER_SESSION;

    const maxPerDay = options.maxPeriodsPerDay
        ?? DEFAULT_MAX_PERIODS_PER_DAY;

    const days = options.days ?? SCHOOL_DAYS;

    const daySet = new Set(days);

    const conflicts: TimetableConflict[] = [];

    const byTeacherDay = groupBySlot(
        entries.filter((entry) => daySet.has(entry.dayOfWeek)),
        (entry) => `${entry.teacherId}|${entry.dayOfWeek}`,
    );

    for (const [key, rows] of byTeacherDay) {
        const [teacherId] = key.split("|");

        const bySession = new Map<TimetableSession, TimetableEntry[]>();

        for (const entry of rows) {
            const session = periodSession(entry.period);

            const bucket = bySession.get(session) ?? [];

            bucket.push(entry);

            bySession.set(session, bucket);
        }

        for (const [session, sessionRows] of bySession) {
            const periods = sessionRows.map((entry) => entry.period);

            const run = longestConsecutiveRun(periods);

            if (run <= maxConsecutive) {
                continue;
            }

            const worstPeriod = Math.min(...periods);

            const anchor = sessionRows.find((entry) =>
                entry.period === worstPeriod) ?? sessionRows[0];

            conflicts.push({
                type: "workload_strain",
                dayOfWeek: anchor.dayOfWeek,
                period: anchor.period,
                week: anchor.week,
                rows: sessionRows,
                message: `Giáo viên dạy ${run} tiết liên tục trong ${SESSION_LABELS[session].toLowerCase()}`,
                cause:
                    `Giáo viên ${teacherId} dạy ${run} tiết liền nhau ${SESSION_LABELS[session].toLowerCase()}, vượt ngưỡng ${maxConsecutive} tiết liên tục.`,
                resolution:
                    "Rảnh bớt tiết cho giáo viên khác hoặc xen kẽ giờ nghỉ giữa buổi.",
            });
        }

        if (rows.length > maxPerDay) {
            const periods = rows.map((entry) => entry.period);

            const anchor = rows.find((entry) =>
                entry.period === Math.min(...periods)) ?? rows[0];

            conflicts.push({
                type: "workload_strain",
                dayOfWeek: anchor.dayOfWeek,
                period: anchor.period,
                week: anchor.week,
                rows,
                message: `Giáo viên dạy ${rows.length} tiết trong một ngày`,
                cause:
                    `Giáo viên ${teacherId} dạy ${rows.length} tiết ${DAY_LABELS[anchor.dayOfWeek].toLowerCase()}, vượt ngưỡng ${maxPerDay} tiết/ngày.`,
                resolution:
                    "Phân bổ lại tiết dạy sang ngày khác hoặc giáo viên khác để giảm tải.",
            });
        }
    }

    return conflicts;
};

/**
 * Bộ xung đột dùng chung cho lớp hiển thị thời khóa biểu:
 * xung đột theo cặp + quá tải giáo viên.
 */
export const detectCalendarConflicts = (
    entries: TimetableEntry[],
    context: DetectConflictContext & WorkloadStrainOptions = {},
): TimetableConflict[] => [
    ...detectConflicts(entries, context),
    ...detectWorkloadStrain(entries, context),
];
