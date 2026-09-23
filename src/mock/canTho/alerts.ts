import type {
    AlertItem,
} from "../common/types";


export const canThoAlerts: AlertItem[] = [
    {
        id: "can-tho-alert-001",

        campusId: "campus-main",

        title: "Chưa cập nhật lịch giảng dạy tuần mới",

        description:
            "Một số tiết học trong tuần kế tiếp chưa được xác nhận lại.",

        level: "warning",

        createdAt: "2026-08-17T09:30:00",

        status: "new",
    },

    {
        id: "can-tho-alert-002",

        campusId: "campus-main",

        title: "Giáo viên chưa hoàn thiện hồ sơ chuyên môn",

        description:
            "Có giáo viên chưa nộp đủ hồ sơ chuẩn bị đầu năm học.",

        level: "warning",

        createdAt: "2026-08-17T10:00:00",

        status: "processing",
    },

    {
        id: "can-tho-alert-003",

        campusId: "campus-chu-van-an",

        title: "Cần cập nhật thời khóa biểu",

        description:
            "Thời khóa biểu của một số lớp chưa được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-18T08:15:00",

        status: "new",
    },

    {
        id: "can-tho-alert-004",

        campusId: "campus-thoi-binh",

        title: "Văn bản mới cần xử lý",

        description:
            "Có văn bản đến mới đang chờ phân công xử lý.",

        level: "info",

        createdAt: "2026-08-18T09:00:00",

        status: "new",
    },

    {
        id: "can-tho-alert-005",

        campusId: "campus-thoi-binh",

        title: "Giáo viên vắng mặt không phép",

        description:
            "Một tiết học được ghi nhận giáo viên vắng mặt.",

        level: "danger",

        createdAt: "2026-08-18T10:30:00",

        status: "processing",
    },

    {
        id: "can-tho-alert-006",

        campusId: "campus-tran-hung-dao",

        title: "Cập nhật cơ sở vật chất",

        description:
            "Thông tin cơ sở vật chất cần được rà soát và cập nhật.",

        level: "warning",

        createdAt: "2026-08-19T08:00:00",

        status: "new",
    },

    {
        id: "can-tho-alert-007",

        campusId: "campus-huynh-thuc-khang",

        title: "Hoàn thành báo cáo định kỳ",

        description:
            "Báo cáo tình hình hoạt động đã được cập nhật đầy đủ.",

        level: "info",

        createdAt: "2026-08-19T14:00:00",

        status: "resolved",
    },

    {
        id: "can-tho-alert-008",

        campusId: "can-tho-campus-008",

        title: "Chưa rà soát phòng thí nghiệm phân hiệu Hưng Phú",

        description:
            "Danh mục thiết bị thí nghiệm của phân hiệu chưa được kiểm kê trước năm học mới.",

        level: "warning",

        createdAt: "2026-08-20T08:30:00",

        status: "new",
    },

    {
        id: "can-tho-alert-009",

        campusId: "campus-chu-van-an",

        title: "Cần cập nhật danh sách học sinh phân hiệu Chu Văn An",

        description:
            "Danh sách học sinh mới nhập học chưa được đồng bộ vào sổ theo dõi của phân hiệu.",

        level: "danger",

        createdAt: "2026-08-20T10:00:00",

        status: "new",
    },
];