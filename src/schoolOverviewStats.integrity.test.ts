import { describe, expect, it } from "vitest";

import {
    canThoCampuses,
    canThoClasses,
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
});