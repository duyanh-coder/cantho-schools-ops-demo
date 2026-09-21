import type {
    TeachingAttendance,
} from "../common/types";


export const canThoTeachingAttendance: TeachingAttendance[] = [
    // ========================================
    // TRỤ SỞ CHÍNH - THCS ĐOÀN THỊ ĐIỂM
    // ========================================

    { id: "can-tho-attendance-001", campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-001", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-002", campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-002", date: "2026-08-17", status: "late" },
    { id: "can-tho-attendance-003", campusId: "can-tho-campus-001", classId: "can-tho-class-001", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-003", date: "2026-08-19", status: "present" },
    { id: "can-tho-attendance-004", campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-004", date: "2026-08-18", status: "present" },
    { id: "can-tho-attendance-005", campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-005", date: "2026-08-18", status: "late" },
    { id: "can-tho-attendance-006", campusId: "can-tho-campus-001", classId: "can-tho-class-002", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-006", date: "2026-08-21", status: "absent" },

    // ========================================
    // PHÂN HIỆU CHU VĂN AN
    // ========================================

    { id: "can-tho-attendance-007", campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-007", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-008", campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-008", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-009", campusId: "can-tho-campus-002", classId: "can-tho-class-004", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-009", date: "2026-08-19", status: "present" },
    { id: "can-tho-attendance-010", campusId: "can-tho-campus-002", classId: "can-tho-class-004", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-010", date: "2026-08-19", status: "late" },
    { id: "can-tho-attendance-011", campusId: "can-tho-campus-002", classId: "can-tho-class-003", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-011", date: "2026-08-20", status: "present" },

    // ========================================
    // PHÂN HIỆU THỚI BÌNH
    // ========================================

    { id: "can-tho-attendance-012", campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-012", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-013", campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-013", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-014", campusId: "can-tho-campus-003", classId: "can-tho-class-006", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-014", date: "2026-08-19", status: "present" },
    { id: "can-tho-attendance-015", campusId: "can-tho-campus-003", classId: "can-tho-class-006", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-015", date: "2026-08-19", status: "late" },
    { id: "can-tho-attendance-016", campusId: "can-tho-campus-003", classId: "can-tho-class-005", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-016", date: "2026-08-21", status: "present" },

    // ========================================
    // PHÂN HIỆU AN LẠC
    // ========================================

    { id: "can-tho-attendance-017", campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-017", date: "2026-08-17", status: "absent" },
    { id: "can-tho-attendance-018", campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-018", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-019", campusId: "can-tho-campus-004", classId: "can-tho-class-008", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-019", date: "2026-08-19", status: "present" },
    { id: "can-tho-attendance-020", campusId: "can-tho-campus-004", classId: "can-tho-class-008", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-020", date: "2026-08-20", status: "late" },
    { id: "can-tho-attendance-021", campusId: "can-tho-campus-004", classId: "can-tho-class-007", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-021", date: "2026-08-21", status: "present" },

    // ========================================
    // PHÂN HIỆU TRẦN HƯNG ĐẠO
    // ========================================

    { id: "can-tho-attendance-022", campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-022", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-023", campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-023", date: "2026-08-18", status: "present" },
    { id: "can-tho-attendance-024", campusId: "can-tho-campus-005", classId: "can-tho-class-010", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-024", date: "2026-08-19", status: "late" },
    { id: "can-tho-attendance-025", campusId: "can-tho-campus-005", classId: "can-tho-class-010", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-025", date: "2026-08-20", status: "present" },
    { id: "can-tho-attendance-026", campusId: "can-tho-campus-005", classId: "can-tho-class-009", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-026", date: "2026-08-21", status: "present" },

    // ========================================
    // PHÂN HIỆU HUỲNH THÚC KHÁNG
    // ========================================

    { id: "can-tho-attendance-027", campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-027", date: "2026-08-17", status: "absent" },
    { id: "can-tho-attendance-028", campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-003", timetableId: "can-tho-timetable-028", date: "2026-08-17", status: "present" },
    { id: "can-tho-attendance-029", campusId: "can-tho-campus-006", classId: "can-tho-class-012", teacherId: "can-tho-teacher-002", timetableId: "can-tho-timetable-029", date: "2026-08-19", status: "present" },
    { id: "can-tho-attendance-030", campusId: "can-tho-campus-006", classId: "can-tho-class-012", teacherId: "can-tho-teacher-001", timetableId: "can-tho-timetable-030", date: "2026-08-20", status: "late" },
    { id: "can-tho-attendance-031", campusId: "can-tho-campus-006", classId: "can-tho-class-011", teacherId: "can-tho-teacher-004", timetableId: "can-tho-timetable-031", date: "2026-08-21", status: "present" },
];