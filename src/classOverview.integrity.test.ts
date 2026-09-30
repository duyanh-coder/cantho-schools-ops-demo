import { describe, expect, it } from "vitest";

import {
    canThoCampuses,
    canThoClassHistory,
    canThoClasses,
    canThoFacilities,
    canThoGrades,
    canThoPersonnel,
    canThoRooms,
    canThoStudents,
} from "@/mock/canTho";

const SCHOOL_001 = "can-tho-school-001";
const ACADEMIC_YEAR = "2026-2027";

const school001Classes = canThoClasses.filter(
    (classItem) => classItem.schoolId === SCHOOL_001,
);

describe("PHASE 05 class data integrity", () => {
    it("has 142 classes for Ninh Kieu spread over 6 campuses", () => {
        expect(school001Classes).toHaveLength(142);

        const expected: Record<string, number> = {
            "campus-main": 40,
            "campus-an-lac": 26,
            "campus-chu-van-an": 24,
            "campus-huynh-thuc-khang": 20,
            "campus-thoi-binh": 17,
            "campus-tran-hung-dao": 15,
        };

        for (const [campusId, count] of Object.entries(expected)) {
            expect(
                school001Classes.filter(
                    (classItem) => classItem.campusId === campusId,
                ),
            ).toHaveLength(count);
        }
    });

    it("keeps the 9 classes of the other three schools", () => {
        const other = canThoClasses.filter(
            (classItem) => classItem.schoolId !== SCHOOL_001,
        );

        expect(other).toHaveLength(9);
    });

    it("every class belongs to a campus of its own school", () => {
        const campusSchool = new Map(
            canThoCampuses.map((campus) => [campus.id, campus.schoolId]),
        );

        for (const classItem of canThoClasses) {
            expect(campusSchool.get(classItem.campusId)).toBe(
                classItem.schoolId,
            );
        }
    });

    it("class codes are unique per school and academic year", () => {
        const seen = new Set<string>();

        for (const classItem of canThoClasses) {
            const key = `${classItem.schoolId}|${classItem.academicYear}|${classItem.code}`;

            expect(seen.has(key)).toBe(false);

            seen.add(key);
        }
    });

    it("gradeId always matches the grade of the class", () => {
        const gradeIds = new Set(canThoGrades.map((grade) => grade.id));

        for (const classItem of canThoClasses) {
            expect(classItem.gradeId).toBe(
                `${classItem.schoolId}-g${classItem.grade}`,
            );

            expect(gradeIds.has(classItem.gradeId ?? "")).toBe(true);
        }
    });

    it("Ninh Kieu exposes exactly 4 grades (6-9)", () => {
        const grades = canThoGrades.filter(
            (grade) => grade.schoolId === SCHOOL_001,
        );

        expect(grades.map((grade) => grade.sortOrder).sort()).toEqual([
            6, 7, 8, 9,
        ]);

        expect(new Set(grades.map((grade) => grade.code)).size).toBe(4);
    });

    it("every class has exactly one homeroom teacher who is active and based there", () => {
        for (const classItem of school001Classes) {
            expect(classItem.homeroomTeacherId).toBeTruthy();

            const teacher = canThoPersonnel.find(
                (person) => person.id === classItem.homeroomTeacherId,
            );

            expect(teacher, `GV of ${classItem.code}`).toBeDefined();
            expect(teacher?.status).toBe("active");
            expect(teacher?.campusIds).toContain(classItem.campusId);
            expect(teacher?.subjectIds.length ?? 0).toBeGreaterThan(0);
        }
    });

    it("no teacher is homeroom teacher of two classes", () => {
        const teacherIds = school001Classes.map(
            (classItem) => classItem.homeroomTeacherId,
        );

        expect(new Set(teacherIds).size).toBe(teacherIds.length);
    });

    it("every class has its own classroom at the same campus", () => {
        const classroomIds = school001Classes.map(
            (classItem) => classItem.roomId,
        );

        expect(new Set(classroomIds).size).toBe(classroomIds.length);

        for (const classItem of school001Classes) {
            const room = canThoRooms.find(
                (item) => item.id === classItem.roomId,
            );

            expect(room, `phong của ${classItem.code}`).toBeDefined();
            expect(room?.campusId).toBe(classItem.campusId);
            expect(room?.category).toBe("classroom");
        }
    });

    it("classrooms cover all classes with a small spare buffer", () => {
        const classroomCounts = canThoFacilities
            .filter(
                (facility) =>
                    facility.schoolId === SCHOOL_001 &&
                    facility.category === "classroom",
            )
            .reduce<Record<string, number>>((totals, facility) => {
                totals[facility.campusId] =
                    (totals[facility.campusId] ?? 0) + facility.quantity;

                return totals;
            }, {});

        expect(Object.values(classroomCounts).reduce((sum, n) => sum + n, 0))
            .toBe(147);

        for (const [campusId, roomCount] of Object.entries(classroomCounts)) {
            const classCount = school001Classes.filter(
                (classItem) => classItem.campusId === campusId,
            ).length;

            expect(roomCount).toBeGreaterThanOrEqual(classCount);
            expect(roomCount - classCount).toBeLessThanOrEqual(1);
        }
    });

    it("keeps the agreed mix of boarding, two-session and special classes", () => {
        const countOf = (classType: string): number => school001Classes.filter(
            (classItem) => classItem.classType === classType,
        ).length;

        expect(countOf("REGULAR")).toBe(128);
        expect(countOf("BOARDING")).toBe(6);
        expect(countOf("TWO_SESSION")).toBe(5);
        expect(countOf("SPECIAL")).toBe(3);
    });

    it("capacity follows the class type", () => {
        const expected: Record<string, number> = {
            REGULAR: 40,
            BOARDING: 45,
            TWO_SESSION: 42,
            SPECIAL: 36,
        };

        for (const classItem of school001Classes) {
            expect(classItem.capacity).toBe(
                expected[classItem.classType ?? "REGULAR"],
            );
        }
    });

    it("all classes are active in the 2026-2027 academic year", () => {
        for (const classItem of canThoClasses) {
            expect(classItem.status).toBe("active");
            expect(classItem.academicYear).toBe(ACADEMIC_YEAR);
        }
    });

    it("gives every class a grade that exists in the same school", () => {
        const gradeIds = new Set(canThoGrades.map((grade) => grade.id));

        const gradeNumbersBySchool = new Map(
            canThoGrades.map((grade) => [
                grade.schoolId,
                new Set(
                    canThoGrades
                        .filter((item) => item.schoolId === grade.schoolId)
                        .map((item) => item.sortOrder),
                ),
            ]),
        );

        for (const classItem of canThoClasses) {
            expect(classItem.gradeId).toBeDefined();
            expect(gradeIds.has(classItem.gradeId ?? "")).toBe(true);
            expect(
                gradeNumbersBySchool
                    .get(classItem.schoolId)
                    ?.has(classItem.grade),
            ).toBe(true);
        }
    });

    it("keeps a unique class code per school and academic year", () => {
        const seen = new Set<string>();

        for (const classItem of canThoClasses) {
            const key = [
                classItem.schoolId,
                classItem.academicYear,
                classItem.code,
            ].join("|");

            expect(seen.has(key)).toBe(false);

            seen.add(key);
        }
    });
});

describe("PHASE 05 student roster integrity", () => {
    const classIds = new Set(canThoClasses.map((c) => c.id));

    const campusByClass = new Map(
        canThoClasses.map((c) => [c.id, c.campusId]),
    );

    const studying = canThoStudents.filter((s) => s.status === "studying");

    it("puts every student in a class of the same school", () => {
        const schoolByClass = new Map(
            canThoClasses.map((c) => [c.id, c.schoolId]),
        );

        for (const student of canThoStudents) {
            expect(student.classId).toBeDefined();
            expect(classIds.has(student.classId ?? "")).toBe(true);
            expect(schoolByClass.get(student.classId ?? "")).toBe(
                student.schoolId,
            );
        }
    });

    it("keeps the student campus aligned with the class campus", () => {
        for (const student of canThoStudents) {
            expect(campusByClass.get(student.classId ?? ""))
                .toBe(student.campusId);
        }
    });

    it("uses unique student codes", () => {
        const codes = canThoStudents.map((s) => s.code);

        expect(new Set(codes).size).toBe(codes.length);
    });

    it("keeps Ninh Kieu class sizes inside the agreed 30-48 band", () => {
        const perClass = new Map<string, number>();

        for (const student of studying) {
            if (student.schoolId !== SCHOOL_001) {
                continue;
            }

            perClass.set(
                student.classId ?? "",
                (perClass.get(student.classId ?? "") ?? 0) + 1,
            );
        }

        for (const [classId, size] of perClass) {
            expect(classIds.has(classId)).toBe(true);
            expect(size).toBeGreaterThanOrEqual(30);
            expect(size).toBeLessThanOrEqual(48);
        }
    });

    it("reaches about 5680 Ninh Kieu students", () => {
        const total = studying.filter(
            (s) => s.schoolId === SCHOOL_001,
        ).length;

        expect(total).toBeGreaterThan(5600);
        expect(total).toBeLessThan(5760);
    });
});

describe("PHASE 05 class history integrity", () => {
    it("references existing classes", () => {
        const classIds = new Set(canThoClasses.map((c) => c.id));

        expect(canThoClassHistory.length).toBeGreaterThan(0);

        for (const entry of canThoClassHistory) {
            expect(classIds.has(entry.classId)).toBe(true);
            expect(entry.content.trim().length).toBeGreaterThan(0);
        }
    });

    it("never mentions a retired campus name", () => {
        const retired = ["Trụ sở chính", "Nguyễn Du", "Đoàn Thị Điểm"];

        for (const entry of canThoClassHistory) {
            for (const name of retired) {
                expect(entry.content).not.toContain(name);
            }
        }
    });
});
