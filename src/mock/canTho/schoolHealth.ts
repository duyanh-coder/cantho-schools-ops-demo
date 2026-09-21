import type { SchoolHealthItem } from "../common/types";

export const canThoSchoolHealth: SchoolHealthItem[] = [
    { id: "can-tho-health-001", campusId: "can-tho-campus-001", type: "health_check", date: "2026-09-20", summary: "Khám sức khỏe định kỳ đầu năm", studentsExamined: 64, issues: "23 HS cận thị nhẹ, 5 HS thiếu cân", status: "done" },
    { id: "can-tho-health-002", campusId: "can-tho-campus-002", type: "health_check", date: "2026-09-21", summary: "Khám sức khỏe định kỳ đầu năm", studentsExamined: 32, issues: "10 HS cận thị nhẹ", status: "done" },
    { id: "can-tho-health-003", campusId: "can-tho-campus-003", type: "health_check", date: "2026-09-22", summary: "Khám sức khỏe định kỳ đầu năm", studentsExamined: 64, issues: "2 HS cần theo dõi thêm về thị lực", status: "done" },
    { id: "can-tho-health-004", campusId: "can-tho-campus-001", type: "food_safety_inspection", date: "2026-10-08", summary: "Kiểm tra an toàn thực phẩm căn tin", issues: "Không phát hiện vi phạm", status: "done" },
    { id: "can-tho-health-005", campusId: "can-tho-campus-016", type: "food_safety_inspection", date: "2026-10-10", summary: "Kiểm tra bếp phục vụ cơm trưa", issues: "Yêu cầu bổ sung găng tay, hồ sơ nguồn gốc thực phẩm", status: "done" },
    { id: "can-tho-health-006", campusId: "can-tho-campus-001", type: "insurance", date: "2026-09-05", summary: "Rà soát danh sách tham gia BHYT học sinh 2026-2027", studentsExamined: 251, issues: "12 HS hộ nghèo được cấp thẻ miễn phí", status: "done" },
    { id: "can-tho-health-007", campusId: "can-tho-campus-001", type: "first_aid", date: "2026-11-12", summary: "Tập huấn sơ cấp cứu cho CB-GV-NV và học sinh khối 9", studentsExamined: 32, status: "done" },
    { id: "can-tho-health-008", campusId: "can-tho-campus-004", type: "health_check", date: "2027-03-02", summary: "Khám sức khỏe giữa năm học (kế hoạch)", status: "pending" },
];