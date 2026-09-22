export interface RoleFeature {
    key: string;

    title: string;

    path: string;

    flow: string;

    iconKey: string;
}

export interface RoleGuide {
    key: string;

    label: string;

    description: string;

    features: RoleFeature[];
}

export const ROLE_GUIDES: RoleGuide[] = [
    {
        key: "leader",
        label: "Lãnh đạo",
        description:
            "Với vai trò lãnh đạo (Sở / Phòng / Ban giám hiệu), bạn tập trung vào điều hành, giám sát và ra quyết định.",
        features: [
            {
                key: "alerts",
                title: "Cảnh báo",
                path: "/operations/alerts",
                flow: "Vào Cảnh báo → xem mức nguy hiểm → theo dõi trạng thái xử lý.",
                iconKey: "warning",
            },
            {
                key: "reports",
                title: "Báo cáo",
                path: "/operations/reports",
                flow: "Vào Báo cáo → chọn nội dung → xem tổng hợp số liệu.",
                iconKey: "report",
            },
            {
                key: "gis",
                title: "Bản đồ GIS",
                path: "/operations/gis",
                flow: "Vào Bản đồ GIS → chọn cơ sở → xem thông tin địa bàn.",
                iconKey: "gis",
            },
            {
                key: "chatbot",
                title: "Trợ lý AI",
                path: "/operations/chatbot",
                flow: "Vào Trợ lý AI → chọn gợi ý nhanh → nhận câu trả lời.",
                iconKey: "chatbot",
            },
        ],
    },
    {
        key: "manager",
        label: "Quản lý điều hành",
        description:
            "Lãnh đạo trường học và tổ điều hành theo dõi triển khai từng chức năng và xử lý công việc hằng ngày.",
        features: [
            {
                key: "tasks",
                title: "Công việc cần làm",
                path: "/operations/tasks",
                flow: "Vào Công việc → xem việc chưa hoàn thành → nhấn Đi làm ngay.",
                iconKey: "task",
            },
            {
                key: "documents",
                title: "Văn bản điện tử",
                path: "/operations/documents",
                flow: "Vào Văn bản → xem văn bản đến → phân công xử lý.",
                iconKey: "document",
            },
            {
                key: "personnel",
                title: "Nhân sự",
                path: "/operations/personnel",
                flow: "Vào Nhân sự → Thêm/Cập nhật hồ sơ → theo dõi theo tổ hoặc trạng thái.",
                iconKey: "personnel",
            },
            {
                key: "schools",
                title: "Trường & Cơ sở",
                path: "/operations/schools",
                flow: "Vào Trường & Cơ sở → xem/nhập từng cơ sở → cập nhật danh mục.",
                iconKey: "school",
            },
        ],
    },
    {
        key: "teaching",
        label: "Giảng dạy",
        description:
            "Giáo viên và GVCN theo dõi thời khóa biểu, học sinh và hoạt động bán trú của lớp.",
        features: [
            {
                key: "timetable",
                title: "Thời khóa biểu",
                path: "/operations/timetable",
                flow: "Vào Thời khóa biểu → chọn ngày/lớp → theo dõi lịch dạy.",
                iconKey: "timetable",
            },
            {
                key: "students",
                title: "Học sinh",
                path: "/operations/students",
                flow: "Vào Học sinh → tìm theo lớp/tên → xem hồ sơ và điểm.",
                iconKey: "student",
            },
            {
                key: "boarding",
                title: "Bán trú",
                path: "/operations/boarding",
                flow: "Vào Bán trú → xem số học sinh đăng ký → cập nhật theo khối.",
                iconKey: "boarding",
            },
            {
                key: "sectors",
                title: "Khối & tổ",
                path: "/operations/sectors",
                flow: "Vào Khối & tổ → xem thành viên của tổ → cập nhật phân công.",
                iconKey: "sector",
            },
        ],
    },
    {
        key: "clerk",
        label: "Văn thư - hành chính",
        description:
            "Văn thư và cán bộ hành chính cập nhật danh mục, văn bản và dữ liệu nền tảng.",
        features: [
            {
                key: "catalogs",
                title: "Danh mục",
                path: "/operations/catalogs",
                flow: "Vào Danh mục → chọn loại danh mục → Thêm/Sửa mục → cột danh sách cập nhật ngay.",
                iconKey: "catalog",
            },
            {
                key: "documents",
                title: "Văn bản điện tử",
                path: "/operations/documents",
                flow: "Vào Văn bản → tiếp nhận văn bản → cập nhật trạng thái xử lý.",
                iconKey: "document",
            },
            {
                key: "sectors",
                title: "Khối & tổ",
                path: "/operations/sectors",
                flow: "Vào Khối & tổ → cập nhật tổ chuyên môn và phân công.",
                iconKey: "sector",
            },
            {
                key: "reports",
                title: "Báo cáo",
                path: "/operations/reports",
                flow: "Vào Báo cáo → xem các mẫu báo cáo định kỳ.",
                iconKey: "report",
            },
        ],
    },
];