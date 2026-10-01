import {
    DAY_LABELS,
    PERIOD_TIME,
} from "@/mock/common/types";

import type {
    TimetableConflict,
    TimetableEntry,
    WeekDay,
} from "@/mock/common/types";

/**
 * Bảng tra cứu hiển thị dùng chung cho mọi màn hình thời khóa biểu,
 * không dựng riêng cho trang này.
 */
export {
    buildTimetableLookups as buildLookups,
    shortTeacher,
    SUBJECT_TONES,
    SUBJECT_TONE_COLORS,
    subjectToneColor,
} from "@/components/TimetableCalendar/lookups";

export type {
    TimetableCalendarLookups as TimetableLookups,
} from "@/components/TimetableCalendar/lookups";


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
