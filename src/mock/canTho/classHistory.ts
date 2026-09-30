import type { ClassHistoryEntry } from "../common/types";

/**
 * Biến động khối/lớp học. Nội dung ghi đúng tên cơ sở trong `campuses.ts`:
 * `Trường THCS Ninh Kiều` cho cơ sở chính và `Phân hiệu <tên>` cho các
 * cơ sở vệ tinh, không dùng `Trụ sở chính` hay tên phân hiệu đã đổi.
 */
export const canThoClassHistory: ClassHistoryEntry[] = [
    {
        id: "class-history-001",
        classId: "can-tho-class-001",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 6A1 (năm học 2026-2027) tại Trường THCS Ninh Kiều.",
        createdAt: "2026-08-10T08:00:00.000Z",
    },
    {
        id: "class-history-002",
        classId: "can-tho-class-001",
        type: "teacher_changed",
        actor: "Ban Giám hiệu",
        content: "Phân công GVCN lớp 6A1 cho đồng chí Trần Văn Long.",
        createdAt: "2026-08-12T09:30:00.000Z",
    },
    {
        id: "class-history-003",
        classId: "can-tho-class-001",
        type: "room_changed",
        actor: "Tổ trưởng chuyên môn",
        content: "Xếp lớp 6A1 vào phòng NK-101 để bố trí học kỳ 1.",
        createdAt: "2026-08-15T07:20:00.000Z",
    },
    {
        id: "class-history-004",
        classId: "can-tho-class-024",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 8A1 (năm học 2026-2027) - lớp bán trú tại Trường THCS Ninh Kiều.",
        createdAt: "2026-08-10T08:15:00.000Z",
    },
    {
        id: "class-history-005",
        classId: "can-tho-class-024",
        type: "updated",
        actor: "Phòng Khảo thí và Đào tạo",
        content: "Điều chỉnh sức chứa lớp 8A1 lên 45 em sau khi rà soát sĩ số bán trú.",
        createdAt: "2026-08-28T02:45:00.000Z",
    },
    {
        id: "class-history-006",
        classId: "can-tho-class-026",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 9A1 (năm học 2026-2027) - lớp 2 buổi tại Trường THCS Ninh Kiều.",
        createdAt: "2026-08-10T08:20:00.000Z",
    },
    {
        id: "class-history-007",
        classId: "can-tho-class-027",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 9A2 (năm học 2026-2027) - lớp 2 buổi tại Trường THCS Ninh Kiều.",
        createdAt: "2026-08-10T08:22:00.000Z",
    },
    {
        id: "class-history-008",
        classId: "can-tho-class-026",
        type: "status_changed",
        actor: "Ban Giám hiệu",
        content: "Duy trì lớp 9A1 ở trạng thái hoạt động sau khi rà soát đội ngũ.",
        createdAt: "2026-08-20T03:10:00.000Z",
    },
    {
        id: "class-history-009",
        classId: "can-tho-class-003",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 6A1 (năm học 2026-2027) tại Phân hiệu Chu Văn An.",
        createdAt: "2026-08-10T08:25:00.000Z",
    },
    {
        id: "class-history-010",
        classId: "can-tho-class-046",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 6A2 (năm học 2026-2027) tại Phân hiệu Trần Hưng Đạo.",
        createdAt: "2026-08-10T08:30:00.000Z",
    },
    {
        id: "class-history-011",
        classId: "can-tho-class-055",
        type: "created",
        actor: "Ban Giám hiệu",
        content: "Thành lập lớp 8A2 (năm học 2026-2027) tại Phân hiệu Huỳnh Thúc Kháng.",
        createdAt: "2026-08-10T08:35:00.000Z",
    },
    {
        id: "class-history-012",
        classId: "can-tho-class-055",
        type: "updated",
        actor: "Tổ trưởng chuyên môn",
        content: "Bổ sung tiết thực hành môn Vật lý cho lớp 8A2 do thiếu phòng thí nghiệm.",
        createdAt: "2026-09-05T06:40:00.000Z",
    },
];
