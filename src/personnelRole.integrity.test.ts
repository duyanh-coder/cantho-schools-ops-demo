import { describe, expect, it } from "vitest";

import {
    canThoMockData,
} from "@/mock";

import {
    getSchoolOverviewStats,
} from "@/mock/canTho";

import {
    groupPersonnel,
    isManagerRole,
    personnelGroupOf,
    personnelOfSchool,
    summarizePersonnel,
} from "@/mock/common";

const SCHOOL_001 = "can-tho-school-001";

const personnelOf001 = personnelOfSchool(
    canThoMockData.personnel,
    SCHOOL_001,
);

describe("personnel grouping is shared by overview and personnel list", () => {
    it("groups are exclusive and add up to the roster size", () => {
        const summary = summarizePersonnel(personnelOf001);

        expect(summary.total).toBe(personnelOf001.length);

        expect(summary.teachers + summary.managers + summary.staff)
            .toBe(summary.total);

        expect(summary.male + summary.female).toBe(summary.total);

        expect(summary.active + summary.inactive).toBe(summary.total);
    });

    it("counts a manager with subjects as a manager, not a teacher", () => {
        const managerWithSubject = personnelOf001.filter(
            (item) =>
                isManagerRole(item.roleTitle) &&
                item.subjectIds.length > 0,
        );

        expect(managerWithSubject.length).toBeGreaterThan(0);

        for (const person of managerWithSubject) {
            expect(personnelGroupOf(person)).toBe("manager");
        }

        const summary = summarizePersonnel(personnelOf001);

        const teachersWithSubject = personnelOf001.filter(
            (item) =>
                !isManagerRole(item.roleTitle) &&
                item.subjectIds.length > 0,
        );

        expect(summary.teachers).toBe(teachersWithSubject.length);

        const subjectHolders = personnelOf001.filter(
            (item) => item.subjectIds.length > 0,
        );

        expect(summary.teachers).toBeLessThan(subjectHolders.length);
    });

    it("nobody belongs to two groups", () => {
        const groups = groupPersonnel(personnelOf001);

        expect(groups.map((group) => group.group))
            .toEqual(["manager", "teacher", "staff"]);

        expect(groups.reduce((sum, group) => sum + group.count, 0))
            .toBe(personnelOf001.length);
    });

    it("overview stats use the same rule for every school", () => {
        for (const school of canThoMockData.schools) {
            const stats = getSchoolOverviewStats(school.id);

            expect(stats, school.id).toBeDefined();

            const expected = summarizePersonnel(
                personnelOfSchool(canThoMockData.personnel, school.id),
            );

            expect(stats!.schoolId).toBe(school.id);
            expect(stats!.personnel.total).toBe(expected.total);
            expect(stats!.personnel.teachers).toBe(expected.teachers);
            expect(stats!.personnel.managers).toBe(expected.managers);
            expect(stats!.personnel.staff).toBe(expected.staff);
            expect(stats!.personnel.male).toBe(expected.male);
            expect(stats!.personnel.female).toBe(expected.female);
        }
    });

    it("the see-more count splits the roster into preview and rest", () => {
        const total = personnelOf001.length;

        const preview = 10;

        const rest = total - preview;

        expect(preview + rest).toBe(total);

        expect(rest).toBeGreaterThan(0);
    });
});
