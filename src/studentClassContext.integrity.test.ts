import {
    renderHook,
} from "@testing-library/react";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoBoardingProfiles,
    canThoCampuses,
    canThoClasses,
    canThoStudents,
    canThoStudentMovements,
} from "@/mock/canTho";

import {
    buildClassNeeds,
    buildClassRosterIntegrity,
    buildClassRosterStats,
} from "@/utils/classRoster";

import {
    STUDENTS_STORAGE_KEY,
    useStudents,
} from "@/store/useStudents";

const SCHOOL_001 = "can-tho-school-001";

const classById = new Map(
    canThoClasses.map((classItem) => [classItem.id, classItem]),
);

describe("PHASE 06 class-scoped roster", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("scopes the roster to one class and its academic year only", () => {
        const sample = canThoClasses.find(
            (classItem) => classItem.schoolId === SCHOOL_001,
        );

        expect(sample).toBeDefined();

        const classId = sample?.id ?? "";

        const { result } = renderHook(() => useStudents(
            sample?.schoolId,
            sample?.campusId,
            classId,
        ));

        const roster = result.current.byClass;

        expect(roster.length).toBeGreaterThan(0);

        for (const student of roster) {
            expect(student.classId).toBe(classId);
            expect(student.academicYear).toBe(sample?.academicYear);
        }

        const otherClassStudents = canThoStudents.filter(
            (student) => student.classId === classId,
        );

        expect(roster.length).toBe(otherClassStudents.length);
    });

    it("never leaks students of another class, campus or school", () => {
        const { result } = renderHook(() => useStudents(SCHOOL_001));

        const classIds = new Set(
            canThoClasses
                .filter((classItem) => classItem.schoolId === SCHOOL_001)
                .map((classItem) => classItem.id),
        );

        const foreign = result.current.bySchool.filter(
            (student) => student.classId
                ? !classIds.has(student.classId)
                : false,
        );

        expect(foreign).toStrictEqual([]);

        for (const student of result.current.bySchool) {
            expect(student.schoolId).toBe(SCHOOL_001);
        }
    });

    it("keeps student campus, school, year and grade aligned with the class", () => {
        for (const student of canThoStudents) {
            if (!student.classId) {
                continue;
            }

            const classItem = classById.get(student.classId);

            expect(classItem).toBeDefined();
            expect(student.schoolId).toBe(classItem?.schoolId);
            expect(student.campusId).toBe(classItem?.campusId);
            expect(student.academicYear).toBe(classItem?.academicYear);
            expect(student.grade).toBe(classItem?.grade);
        }
    });

    it("gives every studying student a class and every classId a real campus", () => {
        const campusIds = new Set(canThoCampuses.map((campus) => campus.id));

        for (const student of canThoStudents) {
            if (student.status === "studying") {
                expect(student.classId).toBeTruthy();
            }

            expect(campusIds.has(student.campusId)).toBe(true);
        }
    });

    it("reports integrity mismatches instead of ignoring them", () => {
        const classItem = canThoClasses[0];

        const clean = buildClassRosterIntegrity(
            canThoStudents.filter(
                (student) => student.classId === classItem.id,
            ),
            classItem,
        );

        expect(clean.campusMismatch).toBe(0);
        expect(clean.schoolMismatch).toBe(0);
        expect(clean.yearMismatch).toBe(0);
        expect(clean.gradeMismatch).toBe(0);
        expect(clean.missingClass).toBe(0);

        const otherCampus = canThoClasses.find(
            (item) => item.campusId !== classItem.campusId,
        );

        const otherSchoolClass = canThoClasses.find(
            (item) => item.schoolId !== classItem.schoolId,
        );

        expect(otherCampus).toBeDefined();
        expect(otherSchoolClass).toBeDefined();

        const broken = buildClassRosterIntegrity(
            [
                {
                    ...canThoStudents[0],
                    campusId: otherCampus?.campusId ?? "campus-an-lac",
                    schoolId: otherSchoolClass?.schoolId ?? "can-tho-school-004",
                    academicYear: "2025-2026",
                    grade: (classItem.grade === 9 ? 8 : 9),
                    classId: classItem.id,
                },
            ],
            classItem,
        );

        expect(broken.campusMismatch).toBe(1);
        expect(broken.schoolMismatch).toBe(1);
        expect(broken.yearMismatch).toBe(1);
        expect(broken.gradeMismatch).toBe(1);
    });

    it("counts roster stats from studying students only", () => {
        const classItem = canThoClasses.find(
            (item) => item.homeroomTeacherId && item.schoolId === SCHOOL_001,
        );

        expect(classItem).toBeDefined();

        if (!classItem) {
            return;
        }

        const rows = canThoStudents.filter(
            (student) => student.classId === classItem.id,
        );

        const stats = buildClassRosterStats(rows, classItem);

        const studying = rows.filter(
            (student) => student.status === "studying",
        );

        expect(stats.total).toBe(studying.length);
        expect(stats.male + stats.female).toBe(stats.total);
        expect(stats.capacity).toBe(classItem.capacity ?? 40);
        expect(stats.remaining).toBe(Math.max(0, stats.capacity - stats.total));
    });

    it("derives class needs from one boarding profile per student-year", () => {
        const profileKeys = new Set<string>();

        for (const profile of canThoBoardingProfiles) {
            const key = `${profile.studentId}|${profile.academicYearId}`;

            expect(profileKeys.has(key)).toBe(false);
            profileKeys.add(key);
        }

        const classItem = canThoClasses.find(
            (item) => item.schoolId === SCHOOL_001,
        );

        if (!classItem) {
            return;
        }

        const profileByStudent = new Map(
            canThoBoardingProfiles
                .filter((profile) =>
                    profile.academicYearId === classItem.academicYear)
                .map((profile) => [profile.studentId, profile] as const),
        );

        const rows = canThoStudents
            .filter((student) =>
                student.classId === classItem.id &&
                student.status === "studying")
            .map((student) => ({
                student,
                profile: profileByStudent.get(student.id),
            }));

        const needs = buildClassNeeds(rows);

        expect(needs.boarding).toBe(
            rows.filter((row) => row.profile?.boarding).length,
        );
        expect(needs.twoSession).toBe(
            rows.filter((row) => row.profile?.twoSession).length,
        );
        expect(needs.meal).toBe(
            rows.filter((row) => row.profile?.mealRequired).length,
        );
    });

    it("keeps every class transfer movement with from/to class history", () => {
        const transfers = canThoStudentMovements.filter(
            (movement) => movement.type === "class_transfer",
        );

        expect(transfers.length).toBeGreaterThan(0);

        for (const movement of transfers) {
            expect(movement.fromClassId).toBeTruthy();
            expect(movement.toClassId).toBeTruthy();
            expect(movement.fromClassId).not.toBe(movement.toClassId);
            expect(classById.has(movement.toClassId ?? "")).toBe(true);
        }
    });

    it("keeps a moved student record alive and never deletes the old movement", () => {
        const transfer = canThoStudentMovements.find(
            (movement) => movement.type === "class_transfer",
        );

        const student = canThoStudents.find(
            (item) => item.id === transfer?.studentId,
        );

        expect(student).toBeDefined();

        // Hồ sơ vẫn tồn tại sau khi chuyển lớp/nghỉ học.
        expect(canThoStudents).toContain(student);

        // Lịch sử biến động cũ vẫn được giữ nguyên.
        const history = canThoStudentMovements.filter(
            (movement) => movement.studentId === transfer?.studentId,
        );

        expect(
            history.some((movement) =>
                movement.id === transfer?.id),
        ).toBe(true);

        // Lớp hiện tại của hồ sơ vẫn là một lớp có thật.
        expect(classById.has(student?.classId ?? "")).toBe(true);
    });

    it("re-seeds the student store when the cached payload is stale", () => {
        const fullKey = `htql:crud:${STUDENTS_STORAGE_KEY}`;

        localStorage.setItem(fullKey, JSON.stringify([
            { id: "stale-student-payload" },
        ]));

        const { result } = renderHook(() => useStudents());

        expect(result.current.items.length).toBe(canThoStudents.length);
        expect(result.current.byId.get("stale-student-payload")).toBeUndefined();
    });
});