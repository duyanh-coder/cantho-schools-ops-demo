import type {
    TaskItem,
} from "../common/types";


export const canThoTasks: TaskItem[] = [
    {
        id: "can-tho-task-001",

        campusId: "campus-main",

        title: "Hoàn thành cập nhật thời khóa biểu",

        description:
            "Rà soát và cập nhật đầy đủ thời khóa biểu cho các lớp.",

        assigneeId: "can-tho-user-001",

        dueDate: "2026-08-20",

        status: "in_progress",
    },

    {
        id: "can-tho-task-002",

        campusId: "campus-main",

        title: "Kiểm tra điểm danh giảng dạy",

        description:
            "Kiểm tra các tiết học chưa được cập nhật trạng thái.",

        assigneeId: "can-tho-user-002",

        dueDate: "2026-08-19",

        status: "todo",
    },

    {
        id: "can-tho-task-003",

        campusId: "campus-chu-van-an",

        title: "Rà soát cơ sở vật chất",

        description:
            "Kiểm tra và cập nhật tình trạng cơ sở vật chất đầu năm học.",

        assigneeId: "can-tho-user-002",

        dueDate: "2026-08-22",

        status: "in_progress",
    },

    {
        id: "can-tho-task-004",

        campusId: "campus-thoi-binh",

        title: "Hoàn thành phân công nhiệm vụ",

        description:
            "Cập nhật và xác nhận phân công nhiệm vụ cho giáo viên.",

        assigneeId: "can-tho-user-003",

        dueDate: "2026-08-18",

        status: "completed",
    },

    {
        id: "can-tho-task-005",

        campusId: "campus-thoi-binh",

        title: "Xử lý văn bản đến",

        description:
            "Phân công xử lý các văn bản mới tiếp nhận.",

        assigneeId: "can-tho-user-004",

        dueDate: "2026-08-21",

        status: "todo",
    },

    {
        id: "can-tho-task-006",

        campusId: "campus-tran-hung-dao",

        title: "Cập nhật danh sách lớp",

        description:
            "Rà soát danh sách lớp và thông tin học sinh đầu năm.",

        assigneeId: "can-tho-user-003",

        dueDate: "2026-08-23",

        status: "in_progress",
    },

    {
        id: "can-tho-task-007",

        campusId: "campus-huynh-thuc-khang",

        title: "Hoàn thành báo cáo chuyên môn",

        description:
            "Tổng hợp số liệu và hoàn thành báo cáo chuyên môn định kỳ.",

        assigneeId: "can-tho-user-004",

        dueDate: "2026-08-20",

        status: "todo",
    },
];