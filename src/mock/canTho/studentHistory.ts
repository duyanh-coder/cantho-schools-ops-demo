import type { StudentHistoryEntry } from "../common/types";

export const canThoStudentHistory: StudentHistoryEntry[] = [
    { id: "can-tho-history-001", studentId: "can-tho-student-001", type: "created", actor: "Hệ thống", content: "Tạo hồ sơ học sinh Lê Minh An, lớp 6A1.", createdAt: "2026-08-10T08:00:00+07:00" },
    { id: "can-tho-history-002", studentId: "can-tho-student-001", type: "class_changed", actor: "Nguyễn Thị Hồng (GVCN)", content: "Chuyển lớp từ 6A2 sang 6A1 theo QĐ-2026-008.", createdAt: "2026-08-14T08:00:00+07:00" },
    { id: "can-tho-history-003", studentId: "can-tho-student-002", type: "created", actor: "Hệ thống", content: "Tạo hồ sơ học sinh Trần Mai Linh, lớp 7A1.", createdAt: "2026-08-10T08:05:00+07:00" },
    { id: "can-tho-history-004", studentId: "can-tho-student-002", type: "class_changed", actor: "Nguyễn Thị Hồng (GVCN)", content: "Chuyển lớp từ 7A2 sang 7A1 theo QĐ-2026-009.", createdAt: "2026-08-14T08:05:00+07:00" },
    { id: "can-tho-history-005", studentId: "can-tho-student-special-003", type: "admitted", actor: "Bộ phận tuyển sinh", content: "Nhập học đầu cấp khối 6 tại cơ sở chính.", createdAt: "2026-08-10T08:00:00+07:00" },
    { id: "can-tho-history-006", studentId: "can-tho-student-special-003", type: "transferred", actor: "Bộ phận tuyển sinh", content: "Chuyển trường đến Trường THCS An Lạc theo QĐ-2026-031.", createdAt: "2026-12-15T09:30:00+07:00" },
    { id: "can-tho-history-007", studentId: "can-tho-student-special-004", type: "status_changed", actor: "Bộ phận tuyển sinh", content: "Chuyển trạng thái sang Tạm dừng (xin nghỉ học có thời hạn).", createdAt: "2027-01-20T10:00:00+07:00" },
    { id: "can-tho-history-008", studentId: "can-tho-student-special-005", type: "created", actor: "Hệ thống", content: "Tạo hồ sơ học sinh Võ Đình Khôi, lớp 9A1.", createdAt: "2026-08-12T08:20:00+07:00" },
    { id: "can-tho-history-009", studentId: "can-tho-student-special-005", type: "status_changed", actor: "Bộ phận tuyển sinh", content: "Hạ hạnh kiểm, chuyển trạng thái sang Nghỉ học theo QĐ-2026-048.", createdAt: "2026-11-05T09:45:00+07:00" },
    { id: "can-tho-history-010", studentId: "can-tho-student-special-001", type: "admitted", actor: "Bộ phận tuyển sinh", content: "Nhập học khối 6 tại cơ sở chính.", createdAt: "2023-08-10T08:00:00+07:00" },
    { id: "can-tho-history-011", studentId: "can-tho-student-special-001", type: "class_changed", actor: "Bộ phận quản lý lớp", content: "Chuyển lớp sang lớp bán trú khối 9 theo QĐ-2026-010.", createdAt: "2026-08-15T08:30:00+07:00" },
    { id: "can-tho-history-012", studentId: "can-tho-student-special-001", type: "graduated", actor: "Bộ phận tuyển sinh", content: "Tốt nghiệp THCS theo QĐ-2027-030.", createdAt: "2027-06-10T10:00:00+07:00" },
    { id: "can-tho-history-013", studentId: "can-tho-student-special-002", type: "admitted", actor: "Bộ phận tuyển sinh", content: "Nhập học khối 6 tại phân hiệu Thới Bình.", createdAt: "2023-08-12T08:00:00+07:00" },
    { id: "can-tho-history-014", studentId: "can-tho-student-special-002", type: "class_changed", actor: "Bộ phận quản lý lớp", content: "Chuyển lớp sang lớp chất lượng cao theo QĐ-2026-012.", createdAt: "2026-08-16T08:45:00+07:00" },
    { id: "can-tho-history-015", studentId: "can-tho-student-special-002", type: "graduated", actor: "Bộ phận tuyển sinh", content: "Tốt nghiệp THCS theo QĐ-2027-032.", createdAt: "2027-06-12T10:30:00+07:00" },
];