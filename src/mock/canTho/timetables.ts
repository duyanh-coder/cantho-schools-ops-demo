import type {
    TimetableItem,
} from "../common/types";

import {
    canThoClasses,
} from "./classes";


const SCHOOL_001 = "can-tho-school-001";

const ROOM_PREFIX_BY_CAMPUS: Record<string, string> = {
    "campus-main": "A",
    "campus-chu-van-an": "B",
    "campus-thoi-binh": "C",
    "campus-an-lac": "D",
    "campus-tran-hung-dao": "E",
    "campus-huynh-thuc-khang": "F",
};

const DAYS = [
    "monday", "tuesday", "wednesday", "thursday", "friday",
] as const;

const PERIOD_TIME: Record<number, [string, string]> = {
    1: ["07:00", "07:45"],
    2: ["07:50", "08:35"],
    3: ["08:40", "09:25"],
    4: ["09:30", "10:15"],
    5: ["10:20", "11:05"],
};

const SUBJECT_TEACHER: Array<[string, string]> = [
    ["math", "can-tho-teacher-001"],
    ["literature", "can-tho-teacher-002"],
    ["english", "can-tho-teacher-003"],
    ["physics", "can-tho-teacher-004"],
];

const padItemIndex = (value: number): string =>
    String(value).padStart(3, "0");

const generatedTimetables: TimetableItem[] = canThoClasses
    .filter((classItem) => classItem.schoolId === SCHOOL_001)
    .filter((classItem) => Number.parseInt(
        classItem.id.slice("can-tho-class-".length), 10,
    ) >= 22)
    .flatMap((classItem) => {
        const classSeq = Number.parseInt(
            classItem.id.slice("can-tho-class-".length), 10,
        );

        const roomPrefix = ROOM_PREFIX_BY_CAMPUS[classItem.campusId] ?? "A";

        const roomFloor = 2 + (classSeq % 4);

        const roomNo = 1 + (classSeq % 9);

        const room = `${roomPrefix}${roomFloor}${roomNo}`;

        return DAYS.flatMap((day, dayIndex) => {
            const period = dayIndex + 1;

            const [subjectId, teacherId] = SUBJECT_TEACHER[
                (classSeq + dayIndex) % SUBJECT_TEACHER.length
            ];

            return {
                id: `can-tho-timetable-${padItemIndex(32 + ((classSeq - 22) * 5) + dayIndex)}`,
                campusId: classItem.campusId,
                classId: classItem.id,
                teacherId,
                subjectId,
                day,
                period,
                room,
                startTime: PERIOD_TIME[period][0],
                endTime: PERIOD_TIME[period][1],
            };
        });
    });


export const canThoTimetables: TimetableItem[] = [
    // ========================================
    // TRỤ SỞ CHÍNH - THCS NINH KIỀU
    // ========================================

    {
        id: "can-tho-timetable-001",
        campusId: "campus-main", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "A101", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-002",
        campusId: "campus-main", classId: "can-tho-class-001", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 2, room: "A101", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-003",
        campusId: "campus-main", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "wednesday", period: 3, room: "A101", startTime: "08:40", endTime: "09:25",
    },
    {
        id: "can-tho-timetable-004",
        campusId: "campus-main", classId: "can-tho-class-002", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "tuesday", period: 1, room: "A102", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-005",
        campusId: "campus-main", classId: "can-tho-class-002", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "tuesday", period: 2, room: "A102", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-006",
        campusId: "campus-main", classId: "can-tho-class-002", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "friday", period: 3, room: "A102", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU CHU VĂN AN
    // ========================================

    {
        id: "can-tho-timetable-007",
        campusId: "campus-chu-van-an", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "B201", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-008",
        campusId: "campus-chu-van-an", classId: "can-tho-class-003", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 2, room: "B201", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-009",
        campusId: "campus-chu-van-an", classId: "can-tho-class-004", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "wednesday", period: 1, room: "B202", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-010",
        campusId: "campus-chu-van-an", classId: "can-tho-class-004", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "wednesday", period: 2, room: "B202", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-011",
        campusId: "campus-chu-van-an", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "thursday", period: 3, room: "B201", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU THỚI BÌNH
    // ========================================

    {
        id: "can-tho-timetable-012",
        campusId: "campus-thoi-binh", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "monday", period: 1, room: "C301", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-013",
        campusId: "campus-thoi-binh", classId: "can-tho-class-005", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 2, room: "C301", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-014",
        campusId: "campus-thoi-binh", classId: "can-tho-class-006", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "wednesday", period: 1, room: "C302", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-015",
        campusId: "campus-thoi-binh", classId: "can-tho-class-006", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 2, room: "C302", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-016",
        campusId: "campus-thoi-binh", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "friday", period: 3, room: "C301", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU AN LẠC
    // ========================================

    {
        id: "can-tho-timetable-017",
        campusId: "campus-an-lac", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "D401", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-018",
        campusId: "campus-an-lac", classId: "can-tho-class-007", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 2, room: "D401", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-019",
        campusId: "campus-an-lac", classId: "can-tho-class-008", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 1, room: "D402", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-020",
        campusId: "campus-an-lac", classId: "can-tho-class-008", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "thursday", period: 2, room: "D402", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-021",
        campusId: "campus-an-lac", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "friday", period: 3, room: "D401", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU TRẦN HƯNG ĐẠO
    // ========================================

    {
        id: "can-tho-timetable-022",
        campusId: "campus-tran-hung-dao", classId: "can-tho-class-009", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 1, room: "E501", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-023",
        campusId: "campus-tran-hung-dao", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "tuesday", period: 2, room: "E501", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-024",
        campusId: "campus-tran-hung-dao", classId: "can-tho-class-010", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "wednesday", period: 1, room: "E502", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-025",
        campusId: "campus-tran-hung-dao", classId: "can-tho-class-010", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "thursday", period: 2, room: "E502", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-026",
        campusId: "campus-tran-hung-dao", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "friday", period: 3, room: "E501", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU HUỲNH THÚC KHÁNG
    // ========================================

    {
        id: "can-tho-timetable-027",
        campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 1, room: "F601", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-028",
        campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-011", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "monday", period: 2, room: "F601", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-029",
        campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-012", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 1, room: "F602", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-030",
        campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-012", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "thursday", period: 2, room: "F602", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-031",
        campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "friday", period: 3, room: "F601", startTime: "08:40", endTime: "09:25",
    },

    ...generatedTimetables,
];