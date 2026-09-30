import { describe, expect, it } from "vitest";

import {
    canThoAcademicYears,
    canThoCampuses,
    canThoClasses,
    canThoPersonnel,
    canThoPersonnelAssignments,
    canThoRooms,
    canThoSemesters,
    canThoTimetableAlerts,
    canThoTimetableHistory,
    canThoTimetables,
} from "@/mock/canTho";

import {
    TIMETABLE_SCENARIOS as canThoTimetableScenarios,
    plannedPeriods,
} from "@/mock/canTho/timetablePlan";

import {
    WEEKDAY_ORDER,
} from "@/mock/common/types";

import {
    detectConflicts,
    detectCrossCampusTeaching,
    detectMissingQuota,
} from "@/utils/timetable";

const campusIds = new Set(canThoCampuses.map((c) => c.id));
const personnelIds = new Set(canThoPersonnel.map((p) => p.id));
const classIds = new Set(canThoClasses.map((c) => c.id));
const roomIds = new Set(canThoRooms.map((r) => r.id));
const yearIds = new Set(canThoAcademicYears.map((y) => y.id));
const semesterIds = new Set(canThoSemesters.map((s) => s.id));
const timetableIds = new Set(canThoTimetables.map((t) => t.id));

const validStatuses = new Set([
    "DRAFT",
    "CHECKING",
    "CONFLICT",
    "ADJUSTING",
    "PENDING_APPROVAL",
    "APPROVED",
    "PUBLISHED",
]);

const activeAssignments = canThoPersonnelAssignments
    .filter((item) =>
        item.academicYear === "2026-2027" &&
        item.semester === 1 &&
        item.status === "active")
    .map((item) => ({
        teacherId: item.personnelId,
        classId: item.classId,
        subjectId: item.subjectId,
        periodsPerWeek: item.periodsPerWeek,
    }));

/**
 * Giữ lại bản có số version cao nhất trong từng chuỗi phiên bản,
 * giống hệt `useTimetables.effective` mà trang dùng để vẽ lưới
 * và chạy kiểm tra xung đột.
 */
const effectiveEntries = (() => {
    const winners = new Map<string, typeof canThoTimetables[number]>();

    for (const entry of canThoTimetables) {
        const rootId = entry.supersedesId ?? entry.id;

        const current = winners.get(rootId);

        if (!current || entry.version > current.version) {
            winners.set(rootId, entry);
        }
    }

    return [...winners.values()];
})();

const countByType = (
    conflicts: ReturnType<typeof detectConflicts>,
): Record<string, number> => {
    const byType: Record<string, number> = {};

    for (const conflict of conflicts) {
        byType[conflict.type] = (byType[conflict.type] ?? 0) + 1;
    }

    return byType;
};

describe("PHASE 05 timetable module integrity", () => {
    it("timetables reference valid classes, teachers, rooms, year, semester, campus", () => {
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
            expect(timetable.version).toBeGreaterThan(0);
        }
    });

    it("every timetable has an active assignment for its teacher-class-subject", () => {
        for (const timetable of canThoTimetables) {
            expect(timetable.assignmentId).toBeTruthy();

            expect(activeAssignments.some((assignment) =>
                assignment.teacherId === timetable.teacherId &&
                assignment.classId === timetable.classId &&
                assignment.subjectId === timetable.subjectId)).toBe(true);
        }
    });

    it("the ADJUSTING version supersedes the published base and keeps the slot", () => {
        const base = canThoTimetables.find((entry) =>
            entry.id === "can-tho-timetable-001");

        const version = canThoTimetables.find((entry) =>
            entry.id === canThoTimetableScenarios.adjustmentVersion);

        expect(base).toBeDefined();
        expect(version).toBeDefined();

        expect(version?.version).toBe(2);
        expect(version?.status).toBe("ADJUSTING");
        expect(version?.supersedesId).toBe(base?.id);

        /**
         * Phiên bản điều chỉnh giữ nguyên lớp, thứ, tiết, tuần của bản gốc.
         */
        expect(version?.classId).toBe(base?.classId);
        expect(version?.dayOfWeek).toBe(base?.dayOfWeek);
        expect(version?.period).toBe(base?.period);
        expect(version?.week).toBe(base?.week);

        /**
         * Tiếp tục điểm danh trên cùng bộ ba giáo viên - lớp - môn,
         * không làm thay đổi phân công giảng dạy.
         */
        expect(version?.teacherId).toBe(base?.teacherId);
        expect(version?.subjectId).toBe(base?.subjectId);

        /**
         * Lưới chỉ hiển thị bản có số version cao nhất trong chuỗi.
         */
        expect(effectiveEntries.some((entry) => entry.id === base?.id)).toBe(false);
        expect(effectiveEntries.some((entry) => entry.id === version?.id)).toBe(true);
    });

    it("effective keeps exactly one entry per version line", () => {
        const roots = new Map<string, number>();

        for (const entry of canThoTimetables) {
            const rootId = entry.supersedesId ?? entry.id;

            roots.set(
                rootId,
                Math.max(roots.get(rootId) ?? 0, entry.version),
            );
        }

        expect(effectiveEntries.length).toBe(roots.size);

        for (const [
            rootId,
            maxVersion,
        ] of roots) {
            const winner = effectiveEntries.find((entry) =>
                entry.id === rootId ||
                entry.supersedesId === rootId);

            expect(winner).toBeDefined();
            expect(winner?.version).toBe(maxVersion);
        }
    });

    it("planned periods per triple match the effective timetable counts", () => {
        for (const planned of plannedPeriods) {
            const scheduled = effectiveEntries.filter((entry) =>
                entry.teacherId === planned.teacherId &&
                entry.classId === planned.classId &&
                entry.subjectId === planned.subjectId).length;

            expect(scheduled).toBe(planned.periodsPerWeek);
        }
    });

    it("no class, teacher, or room is double-booked outside deliberate conflicts", () => {
        const deliberate = new Set<string>([
            ...canThoTimetableScenarios.teacherConflict,
            ...canThoTimetableScenarios.classConflict,
            ...canThoTimetableScenarios.roomConflict,
        ]);

        const keyed = new Map<
            string,
            typeof effectiveEntries
        >();

        for (const entry of effectiveEntries) {
            for (const keyOf of [
                (item: typeof entry) => `${item.classId}|${item.dayOfWeek}|${item.period}`,
                (item: typeof entry) => `${item.teacherId}|${item.dayOfWeek}|${item.period}`,
                (item: typeof entry) => `${item.roomId}|${item.dayOfWeek}|${item.period}`,
            ]) {
                const key = keyOf(entry);

                const bucket = keyed.get(key) ?? [];

                bucket.push(entry);

                keyed.set(key, bucket);
            }
        }

        for (const bucket of keyed.values()) {
            for (let i = 0; i < bucket.length; i += 1) {
                for (let j = i + 1; j < bucket.length; j += 1) {
                    const [a, b] = [bucket[i], bucket[j]];

                    const bothDeliberate =
                        deliberate.has(a.id) && deliberate.has(b.id);

                    const weeksOverlap =
                        a.week === 0 || b.week === 0 || a.week === b.week;

                    expect(bothDeliberate || !weeksOverlap).toBe(true);
                }
            }
        }
    });

    it("detects exactly the seeded conflict scenarios on the effective view", () => {
        const byType = countByType(
            detectConflicts(effectiveEntries, {
                assignments: activeAssignments,
                classes: canThoClasses,
            }),
        );

        expect(byType.teacher_conflict).toBe(1);
        expect(byType.class_conflict).toBe(1);
        expect(byType.room_conflict).toBe(1);
        expect(byType.quota_exceeded).toBe(1);
        expect(byType.assignment_missing).toBeUndefined();
        expect(byType.campus_mismatch).toBeUndefined();
    });

    it("keeps the seeded quota gap and cross-campus teaching on the effective view", () => {
        const missing = detectMissingQuota(effectiveEntries, activeAssignments);

        const crossCampus = detectCrossCampusTeaching(
            effectiveEntries,
            activeAssignments,
            canThoClasses,
        );

        expect(missing.length).toBe(13);
        expect(crossCampus.length).toBe(8);
    });

    it("timetable history references existing timetables and snapshots", () => {
        for (const entry of canThoTimetableHistory) {
            expect(timetableIds.has(entry.entryId)).toBe(true);

            expect(classIds.has(entry.classId)).toBe(true);
            expect(campusIds.has(entry.campusId)).toBe(true);
        }

        const created = canThoTimetableHistory.find((entry) =>
            entry.id === "timetable-history-001");

        expect(created?.after).toBeDefined();
        expect(created?.after?.classId).toBeTruthy();
        expect(created?.after?.teacherId).toBeTruthy();

        const adjusted = canThoTimetableHistory.find((entry) =>
            entry.id === "timetable-history-002");

        expect(adjusted?.before?.roomId).toBeDefined();
        expect(adjusted?.after?.roomId).toBeDefined();
        expect(adjusted?.before?.roomId).not.toBe(adjusted?.after?.roomId);

        expect(adjusted?.action).toBe("room_changed");
    });

    it("timetable alerts reference existing timetables and conflict types", () => {
        const validAlertTypes = new Set<string>([
            "teacher_conflict",
            "class_conflict",
            "room_conflict",
            "quota_missing",
            "quota_exceeded",
            "campus_mismatch",
        ]);

        for (const alert of canThoTimetableAlerts) {
            for (const timetableId of alert.timetableIds ?? []) {
                expect(timetableIds.has(timetableId)).toBe(true);
            }

            if (alert.conflictType) {
                expect(validAlertTypes.has(alert.conflictType)).toBe(true);
            }
        }
    });
});