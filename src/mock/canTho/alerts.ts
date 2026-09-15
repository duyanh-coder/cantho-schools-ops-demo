import type {
    AlertItem,
} from "../common/types";


export const canThoAlerts: AlertItem[] = [
    {
        id: "can-tho-alert-001",

        campusId: "can-tho-campus-001",

        title: "Chưa hoàn thành điểm danh giảng dạy",

        description:
            "Một số tiết học trong ngày chưa được cập nhật trạng thái giảng dạy.",

        level: "warning",

        createdAt: "2026-08-17T09:30:00",

        status: "new",
    },

    {
        id: "can-tho-alert-002",

        campusId: "can-tho-campus-001",

        title: "Giáo viên đi trễ",

        description:
            "Có giáo viên được ghi nhận vào lớp trễ theo lịch giảng dạy.",

        level: "warning",

        createdAt: "2026-08-17T10:00:00",

        status: "processing",
    },

    {
        id: "can-tho-alert-003",

        campusId: "can-tho-campus-002",

        title: "Cần cập nhật thời khóa biểu",

        description:
            "Thời khóa biểu của một số lớp chưa được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-18T08:15:00",

        status: "new",
    },

    {
        id: "can-tho-alert-004",

        campusId: "can-tho-campus-003",

        title: "Văn bản mới cần xử lý",

        description:
            "Có văn bản đến mới đang chờ phân công xử lý.",

        level: "info",

        createdAt: "2026-08-18T09:00:00",

        status: "new",
    },

    {
        id: "can-tho-alert-005",

        campusId: "can-tho-campus-004",

        title: "Giáo viên vắng giảng dạy",

        description:
            "Một tiết học được ghi nhận giáo viên vắng mặt.",

        level: "danger",

        createdAt: "2026-08-18T10:30:00",

        status: "processing",
    },

    {
        id: "can-tho-alert-006",

        campusId: "can-tho-campus-005",

        title: "Cập nhật cơ sở vật chất",

        description:
            "Thông tin cơ sở vật chất cần được rà soát và cập nhật.",

        level: "warning",

        createdAt: "2026-08-19T08:00:00",

        status: "new",
    },

    {
        id: "can-tho-alert-007",

        campusId: "can-tho-campus-006",

        title: "Hoàn thành báo cáo định kỳ",

        description:
            "Báo cáo tình hình hoạt động đã được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-19T14:00:00",

        status: "resolved",
    },

    {
        id: "can-tho-alert-008",

        campusId: "can-tho-campus-007",

        title: "Cần xử lý văn bản quá hạn",

        description:
            "Có văn bản đang xử lý gần hoặc vượt thời hạn quy định.",

        level: "danger",

        createdAt: "2026-08-19T15:30:00",

        status: "processing",
    },

    {
        id: "can-tho-alert-009",

        campusId: "can-tho-campus-008",

        title: "Cần duyệt kế hoạch giảng dạy",

        description:
            "Kế hoạch giảng dạy đầu năm học đang chờ phê duyệt.",

        level: "info",

        createdAt: "2026-08-20T08:30:00",

        status: "new",
    },

    {
        id: "can-tho-alert-010",

        campusId: "can-tho-campus-009",

        title: "Rà soát danh sách lớp đầu năm",

        description:
            "Danh sách học sinh các lớp cần được rà soát và cập nhật.",

        level: "warning",

        createdAt: "2026-08-20T10:00:00",

        status: "new",
    },
];