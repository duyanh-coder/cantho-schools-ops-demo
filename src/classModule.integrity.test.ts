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
    canThoTeachers,
    canThoTeachingAttendance,
    canThoTimetables,
} from "@/mock/canTho";

const campusIds = new Set(canThoCampuses.map((c) => c.id));
const personnelIds = new Set(canThoPersonnel.map((p) => p.id));
const classIds = new Set(canThoClasses.map((c) => c.id));
const roomIds = new Set(canThoRooms.map((r) => r.id));
const yearIds = new Set(canThoAcademicYears.map((y) => y.id));
const timetableIds = new Set(canThoTimetables.map((t) => t.id));

const teacherIds = new Set(canThoTeachers.map((t) => t.id));

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

    it("timetables reference valid classes, teachers, rooms", () => {
        for (const timetable of canThoTimetables) {
            expect(classIds.has(timetable.classId)).toBe(true);
            expect(teacherIds.has(timetable.teacherId)).toBe(true);
            if (timetable.room) {
                const inRoomIds = canThoTimetables.some((t) =>
                    t !== timetable &&
                    t.room === timetable.room &&
                    t.day === timetable.day &&
                    t.period === timetable.period &&
                    t.classId !== timetable.classId,
                );

                expect(inRoomIds).toBe(false);
            }
        }
    });

    it("teaching attendance references valid class and timetable", () => {
        for (const record of canThoTeachingAttendance) {
            expect(classIds.has(record.classId)).toBe(true);
            expect(timetableIds.has(record.timetableId)).toBe(true);
            expect(teacherIds.has(record.teacherId)).toBe(true);
        }
    });
});