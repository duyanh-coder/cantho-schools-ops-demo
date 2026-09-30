import type { PersonnelAssignment } from "../common/types";

import {
    plannedClasses,
    plannedPeriods,
} from "./timetablePlan";

const existingAssignments: PersonnelAssignment[] = [
    { id: "personnel-assignment-001", personnelId: "can-tho-personnel-002", campusId: "campus-main", classId: "can-tho-class-001", subjectId: "literature", academicYear: "2025-2026", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-002", personnelId: "can-tho-personnel-002", campusId: "campus-main", classId: "can-tho-class-001", subjectId: "literature", academicYear: "2025-2026", semester: 2, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-003", personnelId: "can-tho-personnel-002", campusId: "campus-main", classId: "can-tho-class-022", subjectId: "literature", academicYear: "2026-2027", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-004", personnelId: "can-tho-personnel-002", campusId: "campus-main", classId: "can-tho-class-023", subjectId: "literature", academicYear: "2026-2027", semester: 1, periodsPerWeek: 3, status: "active" },

    { id: "personnel-assignment-005", personnelId: "can-tho-personnel-002", campusId: "campus-chu-van-an", classId: "can-tho-class-028", subjectId: "literature", academicYear: "2026-2027", semester: 2, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-006", personnelId: "can-tho-personnel-003", campusId: "campus-main", classId: "can-tho-class-024", subjectId: "math", academicYear: "2025-2026", semester: 1, periodsPerWeek: 5, status: "active" },

    { id: "personnel-assignment-007", personnelId: "can-tho-personnel-003", campusId: "campus-main", classId: "can-tho-class-024", subjectId: "math", academicYear: "2025-2026", semester: 2, periodsPerWeek: 5, status: "active" },

    { id: "personnel-assignment-008", personnelId: "can-tho-personnel-003", campusId: "campus-main", classId: "can-tho-class-025", subjectId: "math", academicYear: "2026-2027", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-009", personnelId: "can-tho-personnel-003", campusId: "campus-main", classId: "can-tho-class-026", subjectId: "math", academicYear: "2026-2027", semester: 1, periodsPerWeek: 5, status: "active" },

    { id: "personnel-assignment-010", personnelId: "can-tho-personnel-003", campusId: "campus-main", classId: "can-tho-class-027", subjectId: "math", academicYear: "2026-2027", semester: 2, periodsPerWeek: 3, status: "active" },

    { id: "personnel-assignment-011", personnelId: "can-tho-personnel-006", campusId: "campus-main", classId: "can-tho-class-002", subjectId: "math", academicYear: "2026-2027", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-012", personnelId: "can-tho-personnel-006", campusId: "campus-chu-van-an", classId: "can-tho-class-004", subjectId: "math", academicYear: "2026-2027", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-013", personnelId: "can-tho-personnel-006", campusId: "campus-chu-van-an", classId: "can-tho-class-029", subjectId: "math", academicYear: "2026-2027", semester: 2, periodsPerWeek: 5, status: "active" },

    { id: "personnel-assignment-014", personnelId: "can-tho-personnel-004", campusId: "campus-main", classId: "can-tho-class-022", subjectId: "english", academicYear: "2026-2027", semester: 1, periodsPerWeek: 3, status: "active" },

    { id: "personnel-assignment-015", personnelId: "can-tho-personnel-004", campusId: "campus-main", classId: "can-tho-class-023", subjectId: "english", academicYear: "2026-2027", semester: 2, periodsPerWeek: 3, status: "active" },

    { id: "personnel-assignment-016", personnelId: "can-tho-personnel-004", campusId: "campus-thoi-binh", classId: "can-tho-class-005", subjectId: "english", academicYear: "2026-2027", semester: 1, periodsPerWeek: 3, status: "active" },

    { id: "personnel-assignment-017", personnelId: "can-tho-personnel-005", campusId: "campus-main", classId: "can-tho-class-024", subjectId: "physics", academicYear: "2025-2026", semester: 1, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-018", personnelId: "can-tho-personnel-005", campusId: "campus-main", classId: "can-tho-class-025", subjectId: "physics", academicYear: "2026-2027", semester: 1, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-019", personnelId: "can-tho-personnel-005", campusId: "campus-an-lac", classId: "can-tho-class-042", subjectId: "physics", academicYear: "2026-2027", semester: 2, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-020", personnelId: "can-tho-personnel-007", campusId: "campus-thoi-binh", classId: "can-tho-class-034", subjectId: "biology", academicYear: "2025-2026", semester: 1, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-021", personnelId: "can-tho-personnel-007", campusId: "campus-an-lac", classId: "can-tho-class-040", subjectId: "biology", academicYear: "2026-2027", semester: 1, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-022", personnelId: "can-tho-personnel-007", campusId: "campus-an-lac", classId: "can-tho-class-041", subjectId: "biology", academicYear: "2026-2027", semester: 2, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-023", personnelId: "can-tho-personnel-008", campusId: "campus-tran-hung-dao", classId: "can-tho-class-046", subjectId: "literature", academicYear: "2025-2026", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-024", personnelId: "can-tho-personnel-008", campusId: "campus-tran-hung-dao", classId: "can-tho-class-047", subjectId: "literature", academicYear: "2026-2027", semester: 1, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-025", personnelId: "can-tho-personnel-008", campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-052", subjectId: "literature", academicYear: "2026-2027", semester: 2, periodsPerWeek: 4, status: "active" },

    { id: "personnel-assignment-026", personnelId: "can-tho-personnel-001", campusId: "campus-main", classId: "can-tho-class-026", subjectId: "literature", academicYear: "2026-2027", semester: 1, periodsPerWeek: 2, status: "active" },

    { id: "personnel-assignment-027", personnelId: "can-tho-personnel-005", campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-054", subjectId: "physics", academicYear: "2026-2027", semester: 1, periodsPerWeek: 2, status: "active" },
];

const ACADEMIC_YEAR = "2026-2027";

const SEMESTER: 1 | 2 = 1;

const campusByClass = new Map(
    plannedClasses.map((item) => [item.id, item.campusId]),
);

const keyOf = (
    personnelId: string,
    classId: string,
    subjectId: string,
): string => [personnelId, classId, subjectId].join("|");

const covered = new Set(
    existingAssignments
        .filter((item) =>
            item.academicYear === ACADEMIC_YEAR &&
            item.semester === SEMESTER &&
            item.status === "active")
        .map((item) => keyOf(item.personnelId, item.classId, item.subjectId)),
);

/**
 * Kịch bản E (thiếu tiết) và F (vượt số tiết phân công):
 * cố ý lệch hạn mức so với số tiết thực tế đã xếp trong thời khóa biểu.
 */
const quotaOverrides = new Map<string, (planned: number) => number>([
    [
        keyOf("can-tho-personnel-005", "can-tho-class-055", "physics"),
        (planned) => planned + 2,
    ],
    [
        keyOf("can-tho-personnel-005", "can-tho-class-011", "physics"),
        (planned) => Math.max(1, planned - 1),
    ],
]);

const generatedAssignments: PersonnelAssignment[] = plannedPeriods
    .filter((item) => !covered.has(
        keyOf(item.teacherId, item.classId, item.subjectId),
    ))
    .filter((item) => !quotaOverrides.has(
        keyOf(item.teacherId, item.classId, item.subjectId),
    ))
    .map((item, index) => ({
        id: `personnel-assignment-${String(index + 28).padStart(3, "0")}`,
        personnelId: item.teacherId,
        campusId: campusByClass.get(item.classId) ?? "campus-main",
        classId: item.classId,
        subjectId: item.subjectId,
        academicYear: ACADEMIC_YEAR,
        semester: SEMESTER,
        periodsPerWeek: item.periodsPerWeek,
        status: "active",
    }));

/**
 * Phân công cố ý lệch hạn mức, phát sinh bất kể thời khóa biểu đã xếp
 * bao nhiêu tiết cho bộ ba giáo viên - lớp - môn đó.
 */
const scenarioAssignments: PersonnelAssignment[] = [...quotaOverrides]
    .filter(([key]) => !covered.has(key))
    .map(([key, resolve], index) => {
        const [personnelId, classId, subjectId] = key.split("|");

        const planned = plannedPeriods.find((item) =>
            keyOf(item.teacherId, item.classId, item.subjectId) === key);

        return {
            id: `personnel-assignment-9${String(index + 1).padStart(2, "0")}`,
            personnelId,
            campusId: campusByClass.get(classId) ?? "campus-main",
            classId,
            subjectId,
            academicYear: ACADEMIC_YEAR,
            semester: SEMESTER,
            periodsPerWeek: resolve(planned?.periodsPerWeek ?? 0),
            status: "active",
        };
    });

export const canThoPersonnelAssignments: PersonnelAssignment[] = [
    ...existingAssignments,
    ...generatedAssignments,
    ...scenarioAssignments,
];
