import {
    canThoClasses,
} from "./classes";

import {
    canThoPersonnelAssignments,
} from "./personnelAssignments";

import {
    canThoRooms,
} from "./rooms";

import type {
    TimetableEntry,
} from "../common/types";


const SCHOOL_001 = "can-tho-school-001";

const ACADEMIC_YEAR_ID = "2026-2027";

const SEMESTER_ID = "2026-2027-HK1";

const DAYS = [
    "monday", "tuesday", "wednesday", "thursday", "friday",
] as const;

const SUBJECT_TEACHER: Array<[string, string]> = [
    ["math", "can-tho-personnel-003"],
    ["literature", "can-tho-personnel-002"],
    ["english", "can-tho-personnel-004"],
    ["physics", "can-tho-personnel-005"],
];

const roomByCampus = new Map<string, string[]>();

for (const room of canThoRooms) {
    const list = roomByCampus.get(room.campusId) ?? [];

    list.push(room.id);

    roomByCampus.set(room.campusId, list);
}

const assignmentBySlot = new Map<string, string>();

for (const assignment of canThoPersonnelAssignments) {
    if (
        assignment.academicYear !== ACADEMIC_YEAR_ID ||
        assignment.semester !== 1 ||
        assignment.status !== "active"
    ) {
        continue;
    }

    const key = [
        assignment.personnelId,
        assignment.classId,
        assignment.subjectId,
    ].join("|");

    assignmentBySlot.set(key, assignment.id);
}

const roomFor = (
    campusId: string,
    slot: number,
): string => {
    const rooms = roomByCampus.get(campusId) ?? [];

    if (rooms.length === 0) {
        return "room-main-01";
    }

    return rooms[slot % rooms.length];
};

const padItemIndex = (value: number): string =>
    String(value).padStart(3, "0");

const generatedTimetables: TimetableEntry[] = canThoClasses
    .filter((classItem) => classItem.schoolId === SCHOOL_001)
    .filter((classItem) => Number.parseInt(
        classItem.id.slice("can-tho-class-".length), 10,
    ) >= 22)
    .flatMap((classItem) => {
        const classSeq = Number.parseInt(
            classItem.id.slice("can-tho-class-".length), 10,
        );

        return DAYS.flatMap((day, dayIndex) => {
            const period = dayIndex + 1;

            const [subjectId, teacherId] = SUBJECT_TEACHER[
                (classSeq + dayIndex) % SUBJECT_TEACHER.length
            ];

            const assignmentId = assignmentBySlot.get(
                [teacherId, classItem.id, subjectId].join("|"),
            );

            return {
                id: `can-tho-timetable-${padItemIndex(32 + ((classSeq - 22) * 5) + dayIndex)}`,
                academicYearId: ACADEMIC_YEAR_ID,
                semesterId: SEMESTER_ID,
                campusId: classItem.campusId,
                classId: classItem.id,
                teacherId,
                subjectId,
                roomId: roomFor(classItem.campusId, classSeq + dayIndex),
                dayOfWeek: day,
                period,
                week: 0,
                status: "PUBLISHED" as const,
                assignmentId,
            };
        });
    });

const baseEntry = (
    id: string,
    campusId: string,
    classId: string,
    teacherId: string,
    subjectId: string,
    day: (typeof DAYS)[number],
    period: number,
): TimetableEntry => ({
    id,
    academicYearId: ACADEMIC_YEAR_ID,
    semesterId: SEMESTER_ID,
    campusId,
    classId,
    teacherId,
    subjectId,
    roomId: roomFor(campusId, Number.parseInt(
        classId.slice("can-tho-class-".length), 10,
    ) + period),
    dayOfWeek: day,
    period,
    week: 0,
    status: "PUBLISHED",
    assignmentId: assignmentBySlot.get(
        [teacherId, classId, subjectId].join("|"),
    ),
});


export const canThoTimetables: TimetableEntry[] = [
    // ========================================
    // TRỤ SỞ CHÍNH - THCS NINH KIỀU
    // ========================================

    baseEntry("can-tho-timetable-001", "campus-main", "can-tho-class-001", "can-tho-personnel-003", "math", "monday", 1),
    baseEntry("can-tho-timetable-002", "campus-main", "can-tho-class-001", "can-tho-personnel-002", "literature", "monday", 2),
    baseEntry("can-tho-timetable-003", "campus-main", "can-tho-class-001", "can-tho-personnel-003", "math", "wednesday", 3),
    baseEntry("can-tho-timetable-004", "campus-main", "can-tho-class-002", "can-tho-personnel-004", "english", "tuesday", 1),
    baseEntry("can-tho-timetable-005", "campus-main", "can-tho-class-002", "can-tho-personnel-005", "physics", "tuesday", 2),
    baseEntry("can-tho-timetable-006", "campus-main", "can-tho-class-002", "can-tho-personnel-002", "literature", "friday", 3),

    // ========================================
    // PHÂN HIỆU CHU VĂN AN
    // ========================================

    baseEntry("can-tho-timetable-007", "campus-chu-van-an", "can-tho-class-003", "can-tho-personnel-003", "math", "monday", 1),
    baseEntry("can-tho-timetable-008", "campus-chu-van-an", "can-tho-class-003", "can-tho-personnel-002", "literature", "monday", 2),
    baseEntry("can-tho-timetable-009", "campus-chu-van-an", "can-tho-class-004", "can-tho-personnel-004", "english", "wednesday", 1),
    baseEntry("can-tho-timetable-010", "campus-chu-van-an", "can-tho-class-004", "can-tho-personnel-005", "physics", "wednesday", 2),
    baseEntry("can-tho-timetable-011", "campus-chu-van-an", "can-tho-class-003", "can-tho-personnel-003", "math", "thursday", 3),

    // ========================================
    // PHÂN HIỆU THỚI BÌNH
    // ========================================

    baseEntry("can-tho-timetable-012", "campus-thoi-binh", "can-tho-class-005", "can-tho-personnel-004", "english", "monday", 1),
    baseEntry("can-tho-timetable-013", "campus-thoi-binh", "can-tho-class-005", "can-tho-personnel-005", "physics", "monday", 2),
    baseEntry("can-tho-timetable-014", "campus-thoi-binh", "can-tho-class-006", "can-tho-personnel-003", "math", "wednesday", 1),
    baseEntry("can-tho-timetable-015", "campus-thoi-binh", "can-tho-class-006", "can-tho-personnel-002", "literature", "wednesday", 2),
    baseEntry("can-tho-timetable-016", "campus-thoi-binh", "can-tho-class-005", "can-tho-personnel-004", "english", "friday", 3),

    // ========================================
    // PHÂN HIỆU AN LẠC
    // ========================================

    baseEntry("can-tho-timetable-017", "campus-an-lac", "can-tho-class-007", "can-tho-personnel-003", "math", "monday", 1),
    baseEntry("can-tho-timetable-018", "campus-an-lac", "can-tho-class-007", "can-tho-personnel-005", "physics", "monday", 2),
    baseEntry("can-tho-timetable-019", "campus-an-lac", "can-tho-class-008", "can-tho-personnel-002", "literature", "wednesday", 1),
    baseEntry("can-tho-timetable-020", "campus-an-lac", "can-tho-class-008", "can-tho-personnel-004", "english", "thursday", 2),
    baseEntry("can-tho-timetable-021", "campus-an-lac", "can-tho-class-007", "can-tho-personnel-003", "math", "friday", 3),

    // ========================================
    // PHÂN HIỆU TRẦN HƯNG ĐẠO
    // ========================================

    baseEntry("can-tho-timetable-022", "campus-tran-hung-dao", "can-tho-class-009", "can-tho-personnel-002", "literature", "monday", 1),
    baseEntry("can-tho-timetable-023", "campus-tran-hung-dao", "can-tho-class-009", "can-tho-personnel-003", "math", "tuesday", 2),
    baseEntry("can-tho-timetable-024", "campus-tran-hung-dao", "can-tho-class-010", "can-tho-personnel-004", "english", "wednesday", 1),
    baseEntry("can-tho-timetable-025", "campus-tran-hung-dao", "can-tho-class-010", "can-tho-personnel-005", "physics", "thursday", 2),
    baseEntry("can-tho-timetable-026", "campus-tran-hung-dao", "can-tho-class-009", "can-tho-personnel-003", "math", "friday", 3),

    // ========================================
    // PHÂN HIỆU HUỲNH THÚC KHÁNG
    // ========================================

    baseEntry("can-tho-timetable-027", "campus-huynh-thuc-khang", "can-tho-class-011", "can-tho-personnel-005", "physics", "monday", 1),
    baseEntry("can-tho-timetable-028", "campus-huynh-thuc-khang", "can-tho-class-011", "can-tho-personnel-004", "english", "monday", 2),
    baseEntry("can-tho-timetable-029", "campus-huynh-thuc-khang", "can-tho-class-012", "can-tho-personnel-002", "literature", "wednesday", 1),
    baseEntry("can-tho-timetable-030", "campus-huynh-thuc-khang", "can-tho-class-012", "can-tho-personnel-003", "math", "thursday", 2),
    baseEntry("can-tho-timetable-031", "campus-huynh-thuc-khang", "can-tho-class-011", "can-tho-personnel-005", "physics", "friday", 3),

    ...generatedTimetables,
];