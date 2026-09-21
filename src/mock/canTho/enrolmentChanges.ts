import type { EnrolmentChange } from "../common/types";

export const canThoEnrolmentChanges: EnrolmentChange[] = [
    { id: "can-tho-enrolment-001", schoolId: "can-tho-school-001", campusId: "can-tho-campus-001", classId: "can-tho-class-001", changeType: "increase", studentName: "Lê Minh An", effectiveDate: "2026-08-17", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },

    { id: "can-tho-enrolment-002", schoolId: "can-tho-school-001", campusId: "can-tho-campus-002", classId: "can-tho-class-003", changeType: "increase", studentName: "Nguyễn Gia Bảo", effectiveDate: "2026-08-17", reason: "Chuyển từ trường tiểu học lên THCS", status: "completed" },

    { id: "can-tho-enrolment-003", schoolId: "can-tho-school-001", campusId: "can-tho-campus-003", classId: "can-tho-class-005", changeType: "increase", studentName: "Võ Minh Khang", effectiveDate: "2026-08-18", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },

    { id: "can-tho-enrolment-004", schoolId: "can-tho-school-001", campusId: "can-tho-campus-004", classId: "can-tho-class-007", changeType: "decrease", studentName: "Nguyễn Thu Vân", effectiveDate: "2026-08-19", reason: "Chuyển trường ra khỏi quận", status: "completed" },

    { id: "can-tho-enrolment-005", schoolId: "can-tho-school-001", campusId: "can-tho-campus-005", classId: "can-tho-class-009", changeType: "increase", studentName: "Dương Hoàng Nam", effectiveDate: "2026-08-20", reason: "Chuyển đến từ trường công lập khác", status: "pending" },

    { id: "can-tho-enrolment-006", schoolId: "can-tho-school-001", campusId: "can-tho-campus-006", classId: "can-tho-class-011", changeType: "increase", studentName: "Lý Minh Trí", effectiveDate: "2026-08-21", reason: "Hoàn tất thủ tục nhập học chậm", status: "pending" },
];