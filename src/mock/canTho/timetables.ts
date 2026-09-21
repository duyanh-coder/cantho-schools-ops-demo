import type {
    TimetableItem,
} from "../common/types";


export const canThoTimetables: TimetableItem[] = [
    // ========================================
    // TRỤ SỞ CHÍNH - THCS ĐOÀN THỊ ĐIỂM
    // ========================================

    {
        id: "can-tho-timetable-001",
        campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "A101", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-002",
        campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 2, room: "A101", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-003",
        campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "wednesday", period: 3, room: "A101", startTime: "08:40", endTime: "09:25",
    },
    {
        id: "can-tho-timetable-004",
        campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "tuesday", period: 1, room: "A102", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-005",
        campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "tuesday", period: 2, room: "A102", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-006",
        campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "friday", period: 3, room: "A102", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU CHU VĂN AN
    // ========================================

    {
        id: "can-tho-timetable-007",
        campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "B201", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-008",
        campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 2, room: "B201", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-009",
        campusId: "can-tho-campus-002", classId: "can-tho-class-004", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "wednesday", period: 1, room: "B202", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-010",
        campusId: "can-tho-campus-002", classId: "can-tho-class-004", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "wednesday", period: 2, room: "B202", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-011",
        campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "thursday", period: 3, room: "B201", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU THỚI BÌNH
    // ========================================

    {
        id: "can-tho-timetable-012",
        campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "monday", period: 1, room: "C301", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-013",
        campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 2, room: "C301", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-014",
        campusId: "can-tho-campus-003", classId: "can-tho-class-006", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "wednesday", period: 1, room: "C302", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-015",
        campusId: "can-tho-campus-003", classId: "can-tho-class-006", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 2, room: "C302", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-016",
        campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "friday", period: 3, room: "C301", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU AN LẠC
    // ========================================

    {
        id: "can-tho-timetable-017",
        campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "monday", period: 1, room: "D401", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-018",
        campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 2, room: "D401", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-019",
        campusId: "can-tho-campus-004", classId: "can-tho-class-008", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 1, room: "D402", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-020",
        campusId: "can-tho-campus-004", classId: "can-tho-class-008", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "thursday", period: 2, room: "D402", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-021",
        campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "friday", period: 3, room: "D401", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU TRẦN HƯNG ĐẠO
    // ========================================

    {
        id: "can-tho-timetable-022",
        campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "monday", period: 1, room: "E501", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-023",
        campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "tuesday", period: 2, room: "E501", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-024",
        campusId: "can-tho-campus-005", classId: "can-tho-class-010", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "wednesday", period: 1, room: "E502", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-025",
        campusId: "can-tho-campus-005", classId: "can-tho-class-010", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "thursday", period: 2, room: "E502", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-026",
        campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "friday", period: 3, room: "E501", startTime: "08:40", endTime: "09:25",
    },

    // ========================================
    // PHÂN HIỆU HUỲNH THÚC KHÁNG
    // ========================================

    {
        id: "can-tho-timetable-027",
        campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "monday", period: 1, room: "F601", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-028",
        campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-003", subjectId: "english",
        day: "monday", period: 2, room: "F601", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-029",
        campusId: "can-tho-campus-006", classId: "can-tho-class-012", teacherId: "can-tho-teacher-002", subjectId: "literature",
        day: "wednesday", period: 1, room: "F602", startTime: "07:00", endTime: "07:45",
    },
    {
        id: "can-tho-timetable-030",
        campusId: "can-tho-campus-006", classId: "can-tho-class-012", teacherId: "can-tho-teacher-001", subjectId: "math",
        day: "thursday", period: 2, room: "F602", startTime: "07:50", endTime: "08:35",
    },
    {
        id: "can-tho-timetable-031",
        campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", subjectId: "physics",
        day: "friday", period: 3, room: "F601", startTime: "08:40", endTime: "09:25",
    },
];