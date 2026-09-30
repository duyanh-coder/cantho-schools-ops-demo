import type {
    TimetableEntry,
} from "@/mock/common/types";

import type {
    TimetableCalendarFilters,
    TimetableEvent,
} from "./types";

import type {
    TimetableCalendarLookups,
} from "./lookups";

import {
    applyCalendarFilters,
    toTimetableEvents,
} from "./helpers";

export interface TimetableCampusSummary {
    campusId: string;

    campusName: string;

    lessons: number;

    classes: number;

    teachers: number;

    rooms: number;
}

export interface TimetableWeekSummary {
    totalLessons: number;

    classCount: number;

    teacherCount: number;

    roomCount: number;

    campusCount: number;

    /**
     * Số liệu theo từng cơ sở/phân hiệu, chỉ gồm cơ sở đang có tiết.
     */
    byCampus: TimetableCampusSummary[];
}

const emptySummary: TimetableWeekSummary = {
    totalLessons: 0,
    classCount: 0,
    teacherCount: 0,
    roomCount: 0,
    campusCount: 0,
    byCampus: [],
};

/**
 * Tổng quan tuần cho ban giám hiệu. Chạy đúng pipeline của lưới
 * (`applyCalendarFilters` + `toTimetableEvents`) nên số liệu không thể
 * lệch với những tiết đang hiển thị, kể cả khi bộ lọc cơ sở/khối/lớp/
 * giáo viên/môn/phòng đang được chọn.
 */
export const summarizeTimetableWeek = (
    entries: TimetableEntry[],
    filters: TimetableCalendarFilters,
    lookups: TimetableCalendarLookups,
    week = 0,
): TimetableWeekSummary => {
    const events: TimetableEvent[] = toTimetableEvents(
        applyCalendarFilters(entries, filters, lookups, week),
        lookups,
        [],
    );

    if (events.length === 0) {
        return emptySummary;
    }

    const classes = new Set<string>();
    const teachers = new Set<string>();
    const rooms = new Set<string>();
    const campusLessons = new Map<
        string,
        {
            campusId: string;
            campusName: string;
            lessons: number;
            classes: Set<string>;
            teachers: Set<string>;
            rooms: Set<string>;
        }
    >();

    for (const event of events) {
        classes.add(event.classId);
        teachers.add(event.teacherId);
        rooms.add(event.roomId);

        const bucket = campusLessons.get(event.campusId) ?? {
            campusId: event.campusId,
            campusName: event.campusName,
            lessons: 0,
            classes: new Set<string>(),
            teachers: new Set<string>(),
            rooms: new Set<string>(),
        };

        bucket.lessons += 1;
        bucket.classes.add(event.classId);
        bucket.teachers.add(event.teacherId);
        bucket.rooms.add(event.roomId);

        campusLessons.set(event.campusId, bucket);
    }

    return {
        totalLessons: events.length,
        classCount: classes.size,
        teacherCount: teachers.size,
        roomCount: rooms.size,
        campusCount: campusLessons.size,
        byCampus: [...campusLessons.values()]
            .sort((a, b) =>
                a.campusName.localeCompare(b.campusName, "vi"))
            .map((bucket) => ({
                campusId: bucket.campusId,
                campusName: bucket.campusName,
                lessons: bucket.lessons,
                classes: bucket.classes.size,
                teachers: bucket.teachers.size,
                rooms: bucket.rooms.size,
            })),
    };
};