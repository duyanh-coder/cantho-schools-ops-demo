import {
    AppstoreOutlined,
    CalendarOutlined,
    DashboardOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    RobotOutlined,
    SettingOutlined,
    SolutionOutlined,
} from "@ant-design/icons";

import type {
    MenuProps,
} from "antd";


type MenuItem =
    Required<MenuProps>["items"][number];


/**
 * Danh sách mục của sidebar ứng dụng.
 *
 * Tách riêng khỏi component để test được kiểm tra nội dung menu mà không
 * cần dựng giao diện.
 */
export const APP_MENU_ITEMS: MenuItem[] = [
    {
        key: "/",
        icon: <AppstoreOutlined />,
        label: "Tổng quan",
    },
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
    },
    {
        key: "/gis",
        icon: <EnvironmentOutlined />,
        label: "Bản đồ GIS",
    },
    {
        key: "/schools",
        icon: <SolutionOutlined />,
        label: "Trường & Phân hiệu",
    },
    {
        key: "/timetable",
        icon: <CalendarOutlined />,
        label: "Thời khóa biểu",
    },
    {
        key: "/documents",
        icon: <FileTextOutlined />,
        label: "Văn bản điện tử",
    },
    {
        key: "/chatbot",
        icon: <RobotOutlined />,
        label: "Trợ lý AI",
    },
    {
        key: "/admin",
        icon: <SettingOutlined />,
        label: "Quản trị",
    },
];