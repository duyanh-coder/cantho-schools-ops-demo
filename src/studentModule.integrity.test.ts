import { describe, expect, it } from "vitest";

import {
    subjects,
} from "@/mock/common";

import {
    canThoAcademicYears,
    canThoBoardingProfiles,
    canThoCampuses,
    canThoClasses,
    canThoStudentAchievements,
    canThoStudentHistory,
    canThoStudentMovements,
    canThoStudents,
    canThoTeachers,
    canThoTranscripts,
} from "@/mock/canTho";

const campusIds = new Set(canThoCampuses.map((c) => c.id));
const classIds = new Set(canThoClasses.map((c) => c.id));
const yearIds = new Set(canThoAcademicYears.map((y) => y.id));
const teacherIds = new Set(canThoTeachers.map((t) => t.id));
const studentIds = new Set(canThoStudents.map((s) => s.id));
const subjectIds = new Set(subjects.map((s) => s.id));

const classById = new Map(canThoClasses.map((c) => [c.id, c]));

describe("PHASE 05 feature integrity", () => {
    it("students reference valid campus, class, year and have unique codes", () => {
        const codes = new Set<string>();

        for (const student of canThoStudents) {
            expect(campusIds.has(student.campusId)).toBe(true);
            expect(codes.has(student.code)).toBe(false);
            codes.add(student.code);

            if (student.classId) {
                expect(classIds.has(student.classId)).toBe(true);

                const classItem = classById.get(student.classId);

                expect(student.academicYear).toBe(classItem?.academicYear);
                expect(student.grade).toBe(classItem?.grade);
            }

            if (student.academicYear) {
                expect(yearIds.has(student.academicYear)).toBe(true);
            }
        }
    });

    it("all 4 status categories and core statuses are represented", () => {
        const statuses = new Set(canThoStudents.map((s) => s.status));

        expect(statuses.has("studying")).toBe(true);
        expect(statuses.has("transferred")).toBe(true);
        expect(statuses.has("dropped_out")).toBe(true);
        expect(statuses.has("graduated")).toBe(true);
        expect(statuses.has("suspended")).toBe(true);
    });

    it("non-studying students do not count into active roster (iactive flag)", () => {
        const active = canThoStudents.filter((s) => s.status === "studying");

        expect(active.length).toBeGreaterThan(0);

        for (const student of canThoStudents) {
            if (student.status !== "studying") {
                expect(active.includes(student)).toBe(false);
            }
        }
    });

    it("transcripts reference valid students, subjects and teachers", () => {
        for (const record of canThoTranscripts) {
            expect(studentIds.has(record.studentId)).toBe(true);
            expect(subjectIds.has(record.subjectId)).toBe(true);
            expect(yearIds.has(record.academicYear)).toBe(true);

            if (record.semesterId) {
                expect(record.semesterId).toBe(
                    `${record.academicYear}-HK${record.semester}`,
                );
            }

            if (record.teacherId) {
                expect(teacherIds.has(record.teacherId)).toBe(true);
            }

            expect(record.score).toBeGreaterThanOrEqual(0);
            expect(record.score).toBeLessThanOrEqual(10);
        }
    });

    it("movements reference valid students, campuses, classes and years", () => {
        for (const movement of canThoStudentMovements) {
            expect(studentIds.has(movement.studentId)).toBe(true);
            expect(yearIds.has(movement.academicYearId)).toBe(true);

            if (movement.fromCampusId) {
                expect(campusIds.has(movement.fromCampusId)).toBe(true);
            }

            if (movement.toCampusId) {
                expect(campusIds.has(movement.toCampusId)).toBe(true);
            }

            if (movement.fromClassId) {
                expect(classIds.has(movement.fromClassId)).toBe(true);
            }

            if (movement.toClassId) {
                expect(classIds.has(movement.toClassId)).toBe(true);
                expect(campusIds.has(classById.get(movement.toClassId)?.campusId ?? "")).toBe(true);
            }
        }
    });

    it("same campus/class transfer movements always change campus", () => {
        for (const movement of canThoStudentMovements) {
            if (movement.type !== "campus_transfer") {
                continue;
            }

            expect(movement.toCampusId).toBeDefined();
            expect(movement.toCampusId).not.toBe(movement.fromCampusId);
            expect(movement.toClassId).toBeDefined();
        }
    });

    it("achievements reference valid students and years", () => {
        for (const achievement of canThoStudentAchievements) {
            expect(studentIds.has(achievement.studentId)).toBe(true);
            expect(yearIds.has(achievement.academicYearId)).toBe(true);
            expect(["school", "district", "city", "province", "national"]).toContain(achievement.level);
        }
    });

    it("boarding profiles reference valid students and years, travel coherent flags", () => {
        for (const profile of canThoBoardingProfiles) {
            expect(studentIds.has(profile.studentId)).toBe(true);
            expect(yearIds.has(profile.academicYearId)).toBe(true);

            if (profile.mealRequired) {
                expect(profile.boarding).toBe(true);
            }

            if (profile.boarding) {
                expect(profile.twoSession).toBe(true);
            }

            if (profile.status === "inactive") {
                expect(profile.endDate).toBeDefined();
            }
        }
    });

    it("history entries reference valid students and events", () => {
        const events = new Set<string>([
            "created",
            "status_changed",
            "class_changed",
            "campus_changed",
            "admitted",
            "transferred",
            "graduated",
        ]);

        for (const entry of canThoStudentHistory) {
            expect(studentIds.has(entry.studentId)).toBe(true);
            expect(events.has(entry.type)).toBe(true);
            expect(entry.content.length).toBeGreaterThan(0);
        }
    });

    it("every non-studying special student has linked movement/history evidence", () => {
        for (const student of canThoStudents) {
            if (student.status === "studying") {
                continue;
            }

            const hasMovement = canThoStudentMovements.some(
                (m) => m.studentId === student.id,
            );

            const hasHistory = canThoStudentHistory.some(
                (h) => h.studentId === student.id,
            );

            expect(hasMovement || hasHistory).toBe(true);
        }
    });

    it("students array exposes enriched grade clustering for stats", () => {
        const grades = new Set(
            canThoStudents
                .map((s) => s.grade)
                .filter((g): g is number => g !== undefined),
        );

        expect(grades.has(6) || grades.has(7)).toBe(true);
    });
});