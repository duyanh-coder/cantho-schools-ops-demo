import { describe, expect, it } from "vitest";

import {
    canThoCampuses,
    canThoClasses,
    canThoPersonnel,
    canThoRooms,
    canThoStudents,
} from "@/mock/canTho";

import {
    summarizeCampus,
} from "@/utils/campusSummary";

describe("PHASE 03 campus summary integrity", () => {
    it("summarizes the secondary campus as a branch", () => {
        const summary = summarizeCampus("campus-an-lac");

        expect(summary.classCount).toBeGreaterThan(0);

        expect(
            canThoClasses.filter(
                (classItem) => classItem.campusId === "campus-an-lac",
            ).length,
        ).toBe(summary.classCount);
    });

    it("personnel breakdown stays consistent", () => {
        for (const campus of canThoCampuses) {
            const summary = summarizeCampus(campus.id);

            expect(summary.teachers + summary.managers + summary.staff)
                .toBe(summary.totalPersonnel);

            expect(summary.totalPersonnel).toBe(
                canThoPersonnel.filter(
                    (item) => item.campusIds.includes(campus.id),
                ).length,
            );
        }
    });

    it("room count matches the real room list", () => {
        for (const campus of canThoCampuses) {
            const summary = summarizeCampus(campus.id);

            expect(summary.roomCount).toBe(
                canThoRooms.filter(
                    (room) => room.campusId === campus.id,
                ).length,
            );
        }
    });

    it("student count matches studying students of the campus", () => {
        for (const campus of canThoCampuses) {
            const summary = summarizeCampus(campus.id);

            expect(summary.studentCount).toBe(
                canThoStudents.filter(
                    (student) =>
                        student.campusId === campus.id &&
                        student.status === "studying",
                ).length,
            );
        }
    });
});