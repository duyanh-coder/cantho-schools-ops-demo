import { describe, expect, it } from "vitest";

import {
    canThoAcademicYears,
    canThoCampuses,
    canThoClasses,
    canThoClassHistory,
    canThoPersonnel,
    canThoPersonnelAssignments,
    canThoRooms,
    canThoSemesters,
    canThoStudents,
    canThoTeachingAttendance,
    canThoTimetables,
} from "@/mock/canTho";

import {
    WEEKDAY_ORDER,
} from "@/mock/common/types";

const campusIds = new Set(canThoCampuses.map((c) => c.id));
const personnelIds = new Set(canThoPersonnel.map((p) => p.id));
const classIds = new Set(canThoClasses.map((c) => c.id));
const roomIds = new Set(canThoRooms.map((r) => r.id));
const yearIds = new Set(canThoAcademicYears.map((y) => y.id));
const semesterIds = new Set(canThoSemesters.map((s) => s.id));
const timetableIds = new Set(canThoTimetables.map((t) => t.id));
const assignmentIds = new Set(canThoPersonnelAssignments.map((a) => a.id));

const validStatuses = new Set([
    "DRAFT",
    "CHECKING",
    "CONFLICT",
    "ADJUSTING",
    "PENDING_APPROVAL",
    "APPROVED",
    "PUBLISHED",
]);

describe("PHASE 04 feature integrity", () => {
    it("academic years and semesters are internally consistent", () => {
        for (const semester of canThoSemesters) {
            expect(yearIds.has(semester.academicYearId)).toBe(true);
        }
    });

    it("rooms reference valid campuses and capacities are positive", () => {
        for (const room of canThoRooms) {
            expect(campusIds.has(room.campusId)).toBe(true);
            expect(room.capacity).toBeGreaterThan(0);
        }
    });

    it("classes reference valid campus, year, teacher, room", () => {
        for (const cls of canThoClasses) {
            expect(campusIds.has(cls.campusId)).toBe(true);
            expect(yearIds.has(cls.academicYear)).toBe(true);
            if (cls.homeroomTeacherId) {
                expect(personnelIds.has(cls.homeroomTeacherId)).toBe(true);
            }
            if (cls.roomId) {
                expect(roomIds.has(cls.roomId)).toBe(true);
            }
            expect([6, 7, 8, 9, 10, 11, 12]).toContain(cls.grade);
        }
    });

    it("class history references valid classes", () => {
        for (const entry of canThoClassHistory) {
            expect(classIds.has(entry.classId)).toBe(true);
        }
    });

    it("assignments reference valid personnel and classes", () => {
        for (const assignment of canThoPersonnelAssignments) {
            expect(personnelIds.has(assignment.personnelId)).toBe(true);
            expect(classIds.has(assignment.classId)).toBe(true);
            if (assignment.campusId) {
                expect(campusIds.has(assignment.campusId)).toBe(true);
            }
        }
    });

    it("students reference valid classes", () => {
        for (const student of canThoStudents) {
            if (student.classId) {
                expect(classIds.has(student.classId)).toBe(true);
            }
        }
    });

    it("timetables reference valid classes, teachers, rooms, year, semester", () => {
        for (const timetable of canThoTimetables) {
            expect(classIds.has(timetable.classId)).toBe(true);
            expect(personnelIds.has(timetable.teacherId)).toBe(true);
            expect(campusIds.has(timetable.campusId)).toBe(true);
            expect(roomIds.has(timetable.roomId)).toBe(true);
            expect(yearIds.has(timetable.academicYearId)).toBe(true);
            expect(semesterIds.has(timetable.semesterId)).toBe(true);
            expect(WEEKDAY_ORDER).toContain(timetable.dayOfWeek);
            expect(timetable.period).toBeGreaterThan(0);
            expect(timetable.period).toBeLessThanOrEqual(10);
            expect(validStatuses.has(timetable.status)).toBe(true);
            if (timetable.assignmentId) {
                expect(assignmentIds.has(timetable.assignmentId)).toBe(true);
            }
        }
    });

    it("no class is scheduled twice in the same day/period/week", () => {
        const keyed = new Map<
            string,
            typeof canThoTimetables[number][]
        >();

        for (const timetable of canThoTimetables) {
            const key = [
                timetable.classId,
                timetable.dayOfWeek,
                timetable.period,
            ].join("|");

            const bucket = keyed.get(key) ?? [];

            bucket.push(timetable);

            keyed.set(key, bucket);
        }

        for (const bucket of keyed.values()) {
            for (let i = 0; i < bucket.length; i += 1) {
                for (let j = i + 1; j < bucket.length; j += 1) {
                    const [a, b] = [bucket[i], bucket[j]];

                    const overlaps = a.week === 0 || b.week === 0 || a.week === b.week;

                    expect(overlaps).toBe(false);
                }
            }
        }
    });

    it("teaching attendance references valid class, personnel, timetable", () => {
        for (const record of canThoTeachingAttendance) {
            expect(classIds.has(record.classId)).toBe(true);
            expect(timetableIds.has(record.timetableId)).toBe(true);
            expect(personnelIds.has(record.teacherId)).toBe(true);
        }
    });
});