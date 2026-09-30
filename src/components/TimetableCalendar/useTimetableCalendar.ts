import {
    useMemo,
} from "react";

import type {
    TimetableConflict,
    TimetableConflictType,
} from "@/mock/common/types";

import {
    subjectTone,
} from "./lookups";

import type {
    TimetableCalendarModel,
    UseTimetableCalendarOptions,
} from "./types";

import {
    applyCalendarFilters,
    buildCalendarDays,
    currentSlotAt,
    deriveSessionBlocks,
    groupConflictsBySlot,
    groupEventsBySlot,
    resolveCalendarWeek,
    toTimetableEvents,
    weekRangeLabel,
} from "./helpers";

const conflictOrder: TimetableConflictType[] = [
    "teacher_conflict",
    "class_conflict",
    "room_conflict",
    "workload_strain",
    "quota_exceeded",
    "quota_missing",
    "assignment_missing",
    "campus_mismatch",
    "capacity_exceeded",
];

/**
 * Chuẩn bị toàn bộ dữ liệu cho lớp hiển thị thời khóa biểu: lọc theo
 * ngữ cảnh, chuẩn hóa sự kiện, gom theo ô thời gian và gắn xung đột.
 * Component chỉ việc dựng giao diện từ model này.
 */
export const useTimetableCalendar = ({
    entries,
    lookups,
    semester,
    filters,
    week = 0,
    today,
    now,
    conflicts,
}: UseTimetableCalendarOptions): TimetableCalendarModel => {
    const todayValue = useMemo(
        () => today ?? new Date(),
        [today],
    );

    const nowValue = useMemo(
        () => now ?? new Date(),
        [now],
    );

    /**
     * `week = 0` trong bộ lọc là lịch lặp hằng tuần, phải quy về tuần
     * hiện hành thay vì để tuần 0 làm lưới rơi về tuần đầu danh sách.
     */
    const effectiveWeek = resolveCalendarWeek(filters?.week, week);

    const days = useMemo(
        () => {
            const weekDays = buildCalendarDays(
                semester,
                effectiveWeek,
                todayValue,
            );

            // Chọn một thứ trong tuần thì lưới chỉ còn cột của thứ đó,
            // bỏ trống nghĩa là xem cả tuần.
            const dayFilter = filters?.dayOfWeek;

            if (!dayFilter) {
                return weekDays;
            }

            return weekDays.filter((day) => day.day === dayFilter);
        },
        [semester, effectiveWeek, todayValue, filters?.dayOfWeek],
    );

    const scopedConflicts = useMemo(
        () => conflicts ?? [],
        [conflicts],
    );

    const filtered = useMemo(
        () => applyCalendarFilters(
            entries,
            filters,
            lookups,
            effectiveWeek,
        ),
        [entries, filters, lookups, effectiveWeek],
    );

    const events = useMemo(
        () => toTimetableEvents(filtered, lookups, scopedConflicts),
        [filtered, lookups, scopedConflicts],
    );

    const visibleConflicts = useMemo(
        () => scopedConflicts.filter((conflict) =>
            conflict.rows.some((row) => filtered.some((entry) =>
                entry.id === row.id))),
        [scopedConflicts, filtered],
    );

    const bySlot = useMemo(
        () => groupEventsBySlot(events),
        [events],
    );

    const conflictsBySlot = useMemo(
        () => groupConflictsBySlot(visibleConflicts),
        [visibleConflicts],
    );

    const conflictTypes = useMemo(() => {
        const present = new Set(
            visibleConflicts.map((conflict) => conflict.type),
        );

        return conflictOrder.filter((type) => present.has(type));
    }, [visibleConflicts]);

    const sessions = useMemo(
        () => deriveSessionBlocks(events, filters?.session),
        [events, filters?.session],
    );

    const currentSlot = useMemo(
        () => currentSlotAt(nowValue, days),
        [nowValue, days],
    );

    const scope = useMemo(
        () => ({
            classes: new Set(events.map((event) => event.classId)),
            subjects: new Set(events.map((event) => event.subjectId)),
        }),
        [events],
    );

    /**
     * Chú giải màu theo môn: chỉ liệt kê môn đang có tiết trong tuần đang
     * xem để chú giải luôn khớp với lưới.
     */
    const legend = useMemo(
        () => [...scope.subjects]
            .map((subjectId) => {
                const event = events.find((item) =>
                    item.subjectId === subjectId);

                return {
                    subjectId,
                    subjectName: event?.subjectName ?? subjectId,
                    tone: subjectTone(subjectId),
                };
            })
            .sort((a, b) => a.subjectName.localeCompare(b.subjectName)),
        [events, scope.subjects],
    );

    return {
        events,
        days,
        sessions,
        bySlot,
        conflicts: visibleConflicts,
        conflictsBySlot,
        conflictTypes,
        currentSlot,
        isEmpty: events.length === 0,
        weekLabel: weekRangeLabel(semester, effectiveWeek),
        totalLessons: events.length,
        totalClasses: scope.classes.size,
        totalSubjects: scope.subjects.size,
        totalConflicts: visibleConflicts.length,
        legend,
    };
};

export const timetablesConflictOf = (
    conflicts: TimetableConflict[],
    entryId: string,
): TimetableConflict[] =>
    conflicts.filter((conflict) =>
        conflict.rows.some((row) => row.id === entryId));
