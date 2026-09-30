import {
    describe,
    expect,
    it,
} from "vitest";

import gridSource from "./pages/Timetable/index.tsx?raw";

import {
    applyCalendarFilters,
    toTimetableEvents,
} from "@/components/TimetableCalendar/helpers";

import {
    buildTimetableLookups,
} from "@/components/TimetableCalendar/lookups";

import {
    summarizeTimetableWeek,
} from "@/components/TimetableCalendar/overview";

import {
    canThoCampuses,
} from "@/mock/canTho/campuses";

import {
    canThoClasses,
} from "@/mock/canTho/classes";

import {
    canThoPersonnel,
} from "@/mock/canTho/personnel";

import {
    canThoRooms,
} from "@/mock/canTho/rooms";

import {
    plannedTimetables,
} from "@/mock/canTho/timetablePlan";

import {
    subjects,
} from "@/mock/common";

const lookups = buildTimetableLookups(
    subjects,
    canThoClasses,
    canThoPersonnel,
    canThoCampuses,
    canThoRooms,
);

const MAIN_CAMPUS = "campus-main";

describe("Timetable overview stays consistent with the shared grid", () => {
    it("feeds the summary from the same filtered entries as the calendar", () => {
        const week = 1;

        const filters = {};

        const summary = summarizeTimetableWeek(
            plannedTimetables,
            filters,
            lookups,
            week,
        );

        const events = toTimetableEvents(
            applyCalendarFilters(
                plannedTimetables,
                filters,
                lookups,
                week,
            ),
            lookups,
        );

        expect(summary.totalLessons).toBe(events.length);
    });

    it("narrows the summary when a campus filter is applied", () => {
        const whole = summarizeTimetableWeek(
            plannedTimetables,
            {},
            lookups,
            1,
        );

        const scoped = summarizeTimetableWeek(
            plannedTimetables,
            { campusId: MAIN_CAMPUS },
            lookups,
            1,
        );

        expect(scoped.totalLessons).toBeLessThanOrEqual(whole.totalLessons);
        expect(scoped.campusCount).toBeLessThanOrEqual(1);
    });

    it("narrows the summary when a single day is selected", () => {
        const whole = summarizeTimetableWeek(
            plannedTimetables,
            {},
            lookups,
            1,
        );

        const day = summarizeTimetableWeek(
            plannedTimetables,
            { dayOfWeek: "monday" },
            lookups,
            1,
        );

        expect(day.totalLessons).toBeLessThan(whole.totalLessons);
    });

    it("never reports more classes, teachers or rooms than lessons", () => {
        const summary = summarizeTimetableWeek(
            plannedTimetables,
            {},
            lookups,
            1,
        );

        expect(summary.classCount).toBeLessThanOrEqual(summary.totalLessons);
        expect(summary.teacherCount).toBeLessThanOrEqual(summary.totalLessons);
        expect(summary.roomCount).toBeLessThanOrEqual(summary.totalLessons);
    });

    it("reuses the shared calendar instead of a second grid component", () => {
        expect(gridSource).toContain("<TimetableCalendar");

        expect(gridSource).toContain("mode=\"overview\"");

        expect(gridSource).toContain("summarizeTimetableWeek");

        expect(gridSource).not.toContain("TimetableCalendar2");
    });

    it("drives the overview from the shared timetable store", () => {
        expect(gridSource).toContain("useTimetables");

        expect(gridSource).toContain("useAcademicYears");

        expect(gridSource).toContain("useSemesters");

        // Năm học không còn hard-code trong trang quản trị.
        expect(gridSource).not.toContain("ACADEMIC_YEAR_ID");
    });
});