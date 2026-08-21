import type {
    AlertItem,
} from "../common/types";


export const caMauAlerts: AlertItem[] = [
    {
        id: "ca-mau-alert-001",

        campusId: "ca-mau-campus-001",

        title: "Chưa hoàn thành điểm danh giảng dạy",

        description:
            "Một số tiết học trong ngày chưa được cập nhật trạng thái giảng dạy.",

        level: "warning",

        createdAt: "2026-08-17T09:30:00",

        status: "new",
    },

    {
        id: "ca-mau-alert-002",

        campusId: "ca-mau-campus-001",

        title: "Giáo viên đi trễ",

        description:
            "Có giáo viên được ghi nhận vào lớp trễ theo lịch giảng dạy.",

        level: "warning",

        createdAt: "2026-08-17T10:00:00",

        status: "processing",
    },

    {
        id: "ca-mau-alert-003",

        campusId: "ca-mau-campus-002",

        title: "Cần cập nhật thời khóa biểu",

        description:
            "Thời khóa biểu của một số lớp chưa được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-18T08:15:00",

        status: "new",
    },

    {
        id: "ca-mau-alert-004",

        campusId: "ca-mau-campus-003",

        title: "Văn bản mới cần xử lý",

        description:
            "Có văn bản đến mới đang chờ phân công xử lý.",

        level: "info",

        createdAt: "2026-08-18T09:00:00",

        status: "new",
    },

    {
        id: "ca-mau-alert-005",

        campusId: "ca-mau-campus-004",

        title: "Giáo viên vắng giảng dạy",

        description:
            "Một tiết học được ghi nhận giáo viên vắng mặt.",

        level: "danger",

        createdAt: "2026-08-18T10:30:00",

        status: "processing",
    },

    {
        id: "ca-mau-alert-006",

        campusId: "ca-mau-campus-005",

        title: "Cập nhật cơ sở vật chất",

        description:
            "Thông tin cơ sở vật chất cần được rà soát và cập nhật.",

        level: "warning",

        createdAt: "2026-08-19T08:00:00",

        status: "new",
    },

    {
        id: "ca-mau-alert-007",

        campusId: "ca-mau-campus-006",

        title: "Hoàn thành báo cáo định kỳ",

        description:
            "Báo cáo tình hình hoạt động đã được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-19T14:00:00",

        status: "resolved",
    },

    {
        id: "ca-mau-alert-008",

        campusId: "ca-mau-campus-007",

        title: "Cần xử lý văn bản quá hạn",

        description:
            "Có văn bản đang xử lý gần hoặc vượt thời hạn quy định.",

        level: "danger",

        createdAt: "2026-08-19T15:30:00",

        status: "processing",
    },
];