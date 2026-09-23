import type { EnrolmentChange } from "../common/types";

export const canThoEnrolmentChanges: EnrolmentChange[] = [
    { id: "can-tho-enrolment-001", schoolId: "can-tho-school-001", campusId: "campus-main", classId: "can-tho-class-001", changeType: "increase", studentName: "Lê Minh An", effectiveDate: "2026-08-17", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },

    { id: "can-tho-enrolment-002", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", classId: "can-tho-class-003", changeType: "increase", studentName: "Nguyễn Gia Bảo", effectiveDate: "2026-08-17", reason: "Chuyển từ trường tiểu học lên THCS", status: "completed" },

    { id: "can-tho-enrolment-003", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", classId: "can-tho-class-005", changeType: "increase", studentName: "Võ Minh Khang", effectiveDate: "2026-08-18", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },

    { id: "can-tho-enrolment-004", schoolId: "can-tho-school-001", campusId: "campus-an-lac", classId: "can-tho-class-007", changeType: "decrease", studentName: "Nguyễn Thu Vân", effectiveDate: "2026-08-19", reason: "Chuyển trường ra khỏi quận", status: "completed" },

    { id: "can-tho-enrolment-005", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", classId: "can-tho-class-009", changeType: "increase", studentName: "Dương Hoàng Nam", effectiveDate: "2026-08-20", reason: "Chuyển đến từ trường công lập khác", status: "pending" },

    { id: "can-tho-enrolment-006", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-011", changeType: "increase", studentName: "Lý Minh Trí", effectiveDate: "2026-08-21", reason: "Hoàn tất thủ tục nhập học chậm", status: "pending" },

    { id: "can-tho-enrolment-007", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", classId: "can-tho-class-013", changeType: "increase", studentName: "Lê Nhật Minh", effectiveDate: "2026-08-17", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },

    { id: "can-tho-enrolment-008", schoolId: "can-tho-school-002", campusId: "can-tho-campus-008", classId: "can-tho-class-016", changeType: "increase", studentName: "Võ Trung Kiên", effectiveDate: "2026-08-20", reason: "Chuyển đến từ trường công lập khác", status: "pending" },

    { id: "can-tho-enrolment-009", schoolId: "can-tho-school-003", campusId: "can-tho-campus-009", classId: "can-tho-class-017", changeType: "increase", studentName: "Đặng Ánh Tuyết", effectiveDate: "2026-08-18", reason: "Nhập học đầu cấp theo tuyển sinh", status: "completed" },
];