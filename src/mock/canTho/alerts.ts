import type {
    AlertItem,
} from "../common/types";

import {
    TIMETABLE_SCENARIOS,
} from "./timetablePlan";


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

        title: "Cần cập nhật danh sách học sinh phân hiệu Chu Van An",

        description:
            "Danh sách học sinh mới nhập học chưa được đồng bộ vào sổ theo dõi của phân hiệu.",

        level: "danger",

        createdAt: "2026-08-20T10:00:00",

        status: "new",
    },
];

/**
 * Cảnh báo thời khóa biểu. Mỗi cảnh báo trỏ tới đúng tiết hoặc nhóm
 * xung đột gốc rễ để điều hướng tới đúng kiểm tra và điều chỉnh.
 */
export const canThoTimetableAlerts: AlertItem[] = [
    {
        id: "can-tho-timetable-alert-001",

        campusId: "campus-chu-van-an",

        title: "Trùng giáo viên trong thời khóa biểu",

        description:
            "Giáo viên Nguyễn Thanh Phuong bị xếp hai lớp cùng thứ và tiết.",

        level: "danger",

        createdAt: "2026-09-16T07:45:00",

        status: "new",

        refType: "timetable_conflict",

        conflictType: "teacher_conflict",

        timetableIds: TIMETABLE_SCENARIOS.teacherConflict,

        cause:
            "Giáo viên Nguyễn Thanh Phuong đồng thời dạy lớp 7A2 phân hiệu Chu Văn An và lớp 7A2 phân hiệu Thới Bình.",

        resolution:
            "Mở tab Kiểm tra và điều chỉnh, áp dụng một ô thời gian trống để xếp lại giáo viên không cần di chuyển.",
    },

    {
        id: "can-tho-timetable-alert-002",

        campusId: "campus-chu-van-an",

        title: "Lớp bị xếp hai môn cùng giờ",

        description:
            "Lớp 9A2 có hai tiết cùng thứ và tiết nhưngng môn khác nhau.",

        level: "danger",

        createdAt: "2026-09-16T07:46:00",

        status: "new",

        refType: "timetable_conflict",

        conflictType: "class_conflict",

        timetableIds: TIMETABLE_SCENARIOS.classConflict,

        cause:
            "Lớp 9A2 được xếp Ngữ văn và Vật lý cùng buổi sáng.",

        resolution:
            "Giữ nguyên môn Vật lý, dời tiết Ngữ văn sang buổi chiều để lớp vẫn học đủ chương bảo đảm.",
    },

    {
        id: "can-tho-timetable-alert-003",

        campusId: "campus-huynh-thuc-khang",

        title: "Trùng phòng học cùng buổi",

        description:
            "Phòng học được hai lớp chiếm cùng một buổi.",

        level: "warning",

        createdAt: "2026-09-16T07:47:00",

        status: "processing",

        refType: "timetable_conflict",

        conflictType: "room_conflict",

        timetableIds: TIMETABLE_SCENARIOS.roomConflict,

        cause:
            "Hai lớp khác nhau cùng dùng một phòng học tại phân hiệu Huỳnh Thục Khang.",

        resolution:
            "Đổi một lớp sang phòng học dự phòng còn trống cùng buổi.",
    },

    {
        id: "can-tho-timetable-alert-004",

        campusId: "campus-huynh-thuc-khang",

        title: "Thiếu tiết so với phân công giảng dạy",

        description:
            "Lớp 8A2 chưa đủ số tiết Vật lý theo phân công đã duyệt.",

        level: "warning",

        createdAt: "2026-09-15T08:00:00",

        status: "new",

        refType: "assignment",

        refId: "personnel-assignment-901",

        conflictType: "quota_missing",

        cause:
            "Phân công Vật lý cho lớp 8A2 yêu cầu nhiều tiết hơn số tiết đã xếp vào thời khóa biểu.",

        resolution:
            "Mở tab Phân công giảng dạy để xem số tiết còn thiếu, sau đó bổ sung vào lưới thời gian trống.",
    },

    {
        id: "can-tho-timetable-alert-005",

        campusId: "campus-huynh-thuc-khang",

        title: "Vượt số tiết phân công giảng dạy",

        description:
            "Số tiết đã xếp cho lớp 6A1 nhiều hơn hạn mức được phân công.",

        level: "warning",

        createdAt: "2026-09-15T08:05:00",

        status: "new",

        refType: "assignment",

        refId: "personnel-assignment-902",

        conflictType: "quota_exceeded",

        cause:
            "Số tiết đã xếp cho lớp 6A1 vượt quá hạn mức phân công đã duyệt.",

        resolution:
            "Giảm số tiết đã xếp hoặc điều chỉnh lại hạn mức phân công trong tab Phân công giảng dạy.",
    },

    {
        id: "can-tho-timetable-alert-006",

        campusId: "campus-main",

        title: "Giáo viên được xếp dạy ở nhiều cơ sở",

        description:
            "Giáo viên Trần Văn Long có lịch dạy ở các phân hiệu khác nhau trong cùng học kỳ.",

        level: "info",

        createdAt: "2026-09-14T09:00:00",

        status: "processing",

        refType: "teacher",

        refId: TIMETABLE_SCENARIOS.crossCampus,

        conflictType: "campus_mismatch",

        cause:
            "Các tiết được xếp ở nhiều cơ sở, cần tính thêm thời gian di chuyển giữa các cơ sở.",

        resolution:
            "Gom các tiết của một giáo viên về một cơ sở hoặc sắp các ngày khác nhau.",
    },
];