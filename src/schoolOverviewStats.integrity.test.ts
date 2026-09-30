import { describe, expect, it } from "vitest";

import {
    canThoCampuses,
    canThoClasses,
    canThoStudents,
    getSchoolOverviewStats,
} from "@/mock/canTho";

const statsFor001 =
    getSchoolOverviewStats("can-tho-school-001");

describe("PHASE 01 school overview stats integrity", () => {
    it("stats exist for the primary school", () => {
        expect(statsFor001).toBeDefined();

        const stats = statsFor001!;

        expect(stats.schoolId).toBe("can-tho-school-001");

        expect(stats.academicYear).toBe("2026-2027");
    });

    it("personnel stats are internally consistent", () => {
        const stats = statsFor001!;

        const { total, teachers, managers, staff, male, female } =
            stats.personnel;

        expect(teachers + managers + staff).toBe(total);

        expect(male + female).toBe(total);
    });

    it("student stats are internally consistent and add up", () => {
        const stats = statsFor001!;

        const { total, grades, male, female } = stats.students;

        expect(
            grades.reduce((sum, grade) => sum + grade.count, 0),
        ).toBe(total);

        expect(male + female).toBe(total);
    });

    it("campus stats add up to the campus list", () => {
        const stats = statsFor001!;

        const realCampuses = canThoCampuses.filter(
            (campus) => campus.schoolId === "can-tho-school-001",
        );

        expect(stats.campuses.total).toBe(realCampuses.length);

        expect(
            stats.campuses.headquarters + stats.campuses.branches,
        ).toBe(stats.campuses.total);
    });

    it("class stats add up to the class list and grade breakdown", () => {
        const stats = statsFor001!;

        const realClasses = canThoClasses.filter(
            (classItem) => classItem.schoolId === "can-tho-school-001",
        );

        expect(stats.classes.total).toBe(realClasses.length);

        expect(
            stats.classes.grades.reduce((sum, grade) => sum + grade.count, 0),
        ).toBe(stats.classes.total);

        for (const entry of stats.classes.grades) {
            const realCount = realClasses.filter(
                (classItem) => classItem.grade === entry.grade,
            ).length;

            expect(entry.count).toBe(realCount);
        }
    });

    it("student stats are derived from the student roster, not hard-coded", () => {
        const stats = statsFor001!;

        const enrolled = canThoStudents.filter(
            (student) =>
                student.schoolId === "can-tho-school-001" &&
                student.status === "studying",
        );

        expect(stats.students.total).toBe(enrolled.length);

        expect(stats.students.male).toBe(
            enrolled.filter((student) => student.gender === "male")
                .length,
        );

        for (const entry of stats.students.grades) {
            const realCount = enrolled.filter(
                (student) => student.grade === entry.grade,
            ).length;

            expect(entry.count).toBe(realCount);
        }
    });

    it("campus naming follows the Trường/Phân hiệu convention", () => {
        const headquarters = canThoCampuses.filter(
            (campus) => campus.isMainCampus,
        );

        for (const campus of headquarters) {
            expect(campus.name).toMatch(/^Trường /);
            expect(campus.name).not.toContain("Trụ sở chính");
        }

        const branches = canThoCampuses.filter(
            (campus) => !campus.isMainCampus,
        );

        for (const campus of branches) {
            expect(campus.name).toMatch(/^Phân hiệu /);
        }

        const main = canThoCampuses.find(
            (campus) => campus.id === "campus-main",
        );

        expect(main?.name).toBe("Trường THCS Ninh Kiều");
        expect(main?.historicalName).toBe("THCS Đoàn Thị Điểm");
    });
});