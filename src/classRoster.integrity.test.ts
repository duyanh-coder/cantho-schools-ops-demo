import { describe, expect, it } from "vitest";

import {
    canThoBoardingProfiles,
    canThoClasses,
    canThoEnrolmentChanges,
    canThoPersonnel,
    canThoStudentMovements,
    canThoStudents,
} from "@/mock/canTho";

import {
    buildClassEnrolment,
    buildClassNeeds,
    buildClassRosterStats,
    buildClassWarnings,
} from "@/utils/classRoster";

const classItem = canThoClasses.find(
    (c) => c.id === "can-tho-class-001",
)!;

const studentsOf = (classId: string) => canThoStudents.filter(
    (student) => student.classId === classId,
);

const rowsOf = (classId: string) => studentsOf(classId)
    .filter((student) => student.status === "studying")
    .map((student) => ({
        student,
        profile: canThoBoardingProfiles.find(
            (profile) => profile.studentId === student.id &&
                profile.academicYearId === "2026-2027",
        ),
    }));

describe("PHASE 05 class roster derivation", () => {
    it("counts only studying students and reads capacity from the class", () => {
        const students = studentsOf(classItem.id);

        const stats = buildClassRosterStats(students, classItem);

        const studying = students.filter((s) => s.status === "studying");

        expect(stats.total).toBe(studying.length);
        expect(stats.male + stats.female).toBe(stats.total);
        expect(stats.capacity).toBe(classItem.capacity);
        expect(stats.remaining).toBe(
            Math.max(0, stats.capacity - stats.total),
        );
        expect(stats.fillRate).toBe(
            Math.round((stats.total / stats.capacity) * 100),
        );
    });

    it("reports an empty class without dividing by zero", () => {
        const stats = buildClassRosterStats([], {
            ...classItem,
            capacity: 0,
        });

        expect(stats.total).toBe(0);
        expect(stats.fillRate).toBe(0);
        expect(stats.remaining).toBe(0);
    });

    it("derives needs from boarding profiles, not from class flags", () => {
        const rows = rowsOf(classItem.id);

        const needs = buildClassNeeds(rows);

        const active = rows.filter((row) => row.profile?.status === "active");

        expect(needs.boarding).toBe(
            active.filter((row) => row.profile?.boarding).length,
        );
        expect(needs.twoSession).toBe(
            active.filter((row) => row.profile?.twoSession).length,
        );
        expect(needs.meal).toBe(
            active.filter((row) => row.profile?.mealRequired).length,
        );
        expect(needs.inactiveProfile).toBe(
            rows.filter((row) => row.profile &&
                row.profile.status !== "active").length,
        );
    });

    it("scopes enrolment changes and movements to the class", () => {
        const enrolment = buildClassEnrolment(
            canThoEnrolmentChanges,
            canThoStudentMovements,
            "can-tho-class-001",
        );

        expect(
            enrolment.pendingIn.length + enrolment.pendingOut.length,
        ).toBe(
            canThoEnrolmentChanges.filter(
                (change) =>
                    change.classId === "can-tho-class-001" &&
                    change.status === "pending",
            ).length,
        );

        expect(enrolment.netPending).toBe(
            enrolment.pendingIn.length - enrolment.pendingOut.length,
        );

        for (const movement of enrolment.movements) {
            expect(
                movement.fromClassId === "can-tho-class-001" ||
                movement.toClassId === "can-tho-class-001",
            ).toBe(true);
        }
    });

    it("warns on over capacity and a missing homeroom teacher", () => {
        const stats = buildClassRosterStats(
            studentsOf(classItem.id),
            classItem,
        );

        const warnings = buildClassWarnings(
            { ...stats, total: stats.capacity + 3 },
            {
                homeroomTeacherId: undefined,
                needs: buildClassNeeds(rowsOf(classItem.id)),
                netPending: 0,
            },
        );

        const titles = warnings.map((warning) => warning.title);

        expect(titles).toContain("Lớp vượt sức chứa");
        expect(titles).toContain("Chưa phân công GVCN");
    });

    it("covers every boarding and two-session student with a profile", () => {
        const classTypeByClassId = new Map(
            canThoClasses.map((item) => [item.id, item.classType]),
        );

        const expected = canThoStudents.filter((student) => {
            if (student.status !== "studying" || !student.classId) {
                return false;
            }

            const classType = classTypeByClassId.get(student.classId);

            return classType === "BOARDING" || classType === "TWO_SESSION";
        });

        const profileByStudent = new Map(
            canThoBoardingProfiles.map((profile) => [
                profile.studentId,
                profile,
            ]),
        );

        expect(expected.length).toBeGreaterThan(0);

        expect(canThoBoardingProfiles.length).toBeGreaterThanOrEqual(
            expected.length,
        );

        for (const student of expected) {
            const profile = profileByStudent.get(student.id);

            expect(
                profile,
                `Thiếu hồ sơ nội trú cho ${student.id}`,
            ).toBeDefined();

            const classType = classTypeByClassId.get(student.classId!);

            expect(profile!.boarding).toBe(classType === "BOARDING");
            expect(profile!.twoSession).toBe(true);
        }

        for (const profile of canThoBoardingProfiles) {
            expect(profileByStudent.get(profile.studentId)).toBe(profile);
        }
    });

    it("stays quiet on a healthy class", () => {
        const stats = buildClassRosterStats(
            studentsOf(classItem.id),
            classItem,
        );

        const warnings = buildClassWarnings(
            { ...stats, total: 5, fillRate: 12 },
            {
                homeroomTeacherId: "can-tho-personnel-001",
                needs: buildClassNeeds([]),
                netPending: 0,
            },
        );

        expect(warnings).toStrictEqual([]);
    });
});

describe("homeroom teacher assignment covers every class of every school", () => {
    const personnelById = new Map(
        canThoPersonnel.map((person) => [person.id, person]),
    );

    it("assigns a homeroom teacher to all 151 classes", () => {
        const missing = canThoClasses.filter(
            (classItem) => !classItem.homeroomTeacherId,
        );

        expect(missing.map((classItem) => classItem.id)).toStrictEqual([]);
    });

    it("never lets one teacher be homeroom of two classes", () => {
        const ids = canThoClasses
            .map((classItem) => classItem.homeroomTeacherId)
            .filter((id): id is string => Boolean(id));

        const duplicates = [...new Set(
            ids.filter((id, index) => ids.indexOf(id) !== index),
        )];

        expect(duplicates).toStrictEqual([]);
    });

    it("assigns an active teacher of the same school and campus", () => {
        for (const classItem of canThoClasses) {
            const teacher = personnelById.get(classItem.homeroomTeacherId ?? "");

            expect(teacher, classItem.id).toBeDefined();
            expect(teacher!.status).toBe("active");
            expect(teacher!.schoolId).toBe(classItem.schoolId);
            expect(teacher!.campusIds).toContain(classItem.campusId);
            expect(teacher!.subjectIds.length).toBeGreaterThan(0);
        }
    });

    it("covers the classes of the schools outside Ninh Kiều", () => {
        const otherSchools = canThoClasses.filter(
            (classItem) => classItem.schoolId !== "can-tho-school-001",
        );

        expect(otherSchools.length).toBe(9);

        for (const classItem of otherSchools) {
            expect(
                classItem.homeroomTeacherId,
                classItem.id,
            ).toBeTruthy();
        }
    });
});

