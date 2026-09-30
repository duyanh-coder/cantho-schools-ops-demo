import type {
    BoardingProfile,
} from "../common/types";

import {
    canThoClasses,
} from "./classes";

import {
    canThoStudents,
} from "./students";

const ACADEMIC_YEAR = "2026-2027";

/**
 * Hồ sơ nội trú / hai buổi được sinh từ chính lớp học: học sinh lớp nội trú
 * thì ở nội trú, học sinh lớp hai buổi thì chỉ học hai buổi. Nhờ vậy sĩ số và
 * nhu cầu của lớp luôn khớp với danh sách học sinh.
 */
const generatedProfiles = ((): BoardingProfile[] => {
    const classById = new Map(
        canThoClasses.map((classItem) => [classItem.id, classItem]),
    );

    const profiles: BoardingProfile[] = [];
    let index = 0;

    for (const student of canThoStudents) {
        if (student.status !== "studying" || !student.classId) {
            continue;
        }

        const classItem = classById.get(student.classId);

        if (!classItem || classItem.academicYear !== ACADEMIC_YEAR) {
            continue;
        }

        const boarding = classItem.classType === "BOARDING";
        const twoSession = boarding || classItem.classType === "TWO_SESSION";

        if (!twoSession) {
            continue;
        }

        index += 1;

        const day = String(1 + (index % 9)).padStart(2, "0");

        profiles.push({
            id: `can-tho-boarding-g${String(index).padStart(4, "0")}`,
            studentId: student.id,
            academicYearId: ACADEMIC_YEAR,
            twoSession,
            boarding,
            mealRequired: boarding,
            startDate: `2026-09-${day}`,
            status: "active",
        });
    }

    return profiles;
})();

/**
 * Các hồ sơ viết tay giữ nguyên để giữ các ca đặc biệt: học sinh đã ngừng
 * nội trú trong năm và ngày bắt đầu cụ thể.
 */
const manualProfiles: BoardingProfile[] = [
    { id: "can-tho-boarding-001", studentId: "can-tho-student-001", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-002", studentId: "can-tho-student-002", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-003", studentId: "can-tho-student-003", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-05", status: "active" },
    { id: "can-tho-boarding-004", studentId: "can-tho-student-004", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-05", status: "active" },
    { id: "can-tho-boarding-005", studentId: "can-tho-student-005", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-006", studentId: "can-tho-student-006", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-007", studentId: "can-tho-student-007", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-008", studentId: "can-tho-student-008", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-06", status: "active" },
    { id: "can-tho-boarding-009", studentId: "can-tho-student-009", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-02", status: "active" },
    { id: "can-tho-boarding-010", studentId: "can-tho-student-010", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-02", status: "active" },
    { id: "can-tho-boarding-011", studentId: "can-tho-student-011", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-07", status: "active" },
    { id: "can-tho-boarding-012", studentId: "can-tho-student-012", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-07", status: "active" },
    { id: "can-tho-boarding-013", studentId: "can-tho-student-013", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-014", studentId: "can-tho-student-special-001", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", endDate: "2027-06-10", status: "inactive" },
    { id: "can-tho-boarding-015", studentId: "can-tho-student-special-002", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", endDate: "2027-06-12", status: "inactive" },
    { id: "can-tho-boarding-016", studentId: "can-tho-student-014", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-02", status: "active" },
    { id: "can-tho-boarding-017", studentId: "can-tho-student-015", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-08", status: "active" },
    { id: "can-tho-boarding-018", studentId: "can-tho-student-016", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-08", status: "active" },
    { id: "can-tho-boarding-019", studentId: "can-tho-student-017", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-020", studentId: "can-tho-student-018", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-021", studentId: "can-tho-student-019", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-02", status: "active" },
    { id: "can-tho-boarding-022", studentId: "can-tho-student-020", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-023", studentId: "can-tho-student-021", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-09", status: "active" },
    { id: "can-tho-boarding-024", studentId: "can-tho-student-022", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-09", status: "active" },
    { id: "can-tho-boarding-025", studentId: "can-tho-student-035", academicYearId: "2026-2027", twoSession: true, boarding: false, mealRequired: false, startDate: "2026-09-02", status: "active" },
    { id: "can-tho-boarding-026", studentId: "can-tho-student-039", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
    { id: "can-tho-boarding-027", studentId: "can-tho-student-045", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-06", status: "active" },
    { id: "can-tho-boarding-028", studentId: "can-tho-student-047", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-03", status: "active" },
    { id: "can-tho-boarding-029", studentId: "can-tho-student-054", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-07", status: "active" },
    { id: "can-tho-boarding-030", studentId: "can-tho-student-057", academicYearId: "2026-2027", twoSession: true, boarding: true, mealRequired: true, startDate: "2026-09-01", status: "active" },
];

export const canThoBoardingProfiles: BoardingProfile[] = (() => {
    const merged = new Map<string, BoardingProfile>();

    for (const profile of generatedProfiles) {
        merged.set(profile.studentId, profile);
    }

    for (const profile of manualProfiles) {
        merged.set(profile.studentId, profile);
    }

    return [...merged.values()];
})();
