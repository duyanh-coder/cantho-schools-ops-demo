import type { ReactNode } from "react";

import {
    BarChartOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    RobotOutlined,
    SolutionOutlined,
} from "@ant-design/icons";


export interface OperationFeature {
    key: string;

    title: string;

    description: string;

    path: string;

    colorClass: string;

    icon: ReactNode;
}


/**
 * Các tính năng vận hành hiển thị trên trang chủ.
 *
 * Tách riêng khỏi component để test được kiểm tra nội dung mà không cần
 * dựng giao diện.
 */
export const OPERATION_FEATURES: OperationFeature[] = [
    {
        key: "documents",
        title: "Văn bản điện tử",
        description: "Quản lý văn bản, hồ sơ và các thông tin điều hành.",
        path: "/operations/documents",
        colorClass: "feature-card--documents",
        icon: <FileTextOutlined />,
    },
    {
        key: "timetable",
        title: "Thời khóa biểu",
        description: "Theo dõi và quản lý thời khóa biểu tại các cơ sở giáo dục.",
        path: "/operations/timetable",
        colorClass: "feature-card--timetable",
        icon: <CalendarOutlined />,
    },
    {
        key: "schools",
        title: "Trường & Phân hiệu",
        description: "Quản lý thông tin trường học và các cơ sở trực thuộc.",
        path: "/operations/schools",
        colorClass: "feature-card--school",
        icon: <SolutionOutlined />,
    },
    {
        key: "gis",
        title: "Bản đồ GIS",
        description: "Quản lý địa bàn, trường học và các cơ sở trên nền bản đồ số.",
        path: "/operations/gis",
        colorClass: "feature-card--gis",
        icon: <EnvironmentOutlined />,
    },
    {
        key: "reports",
        title: "Báo cáo điều hành",
        description: "Tổng hợp số liệu và hỗ trợ theo dõi tình hình hoạt động.",
        path: "/operations/reports",
        colorClass: "feature-card--reports",
        icon: <BarChartOutlined />,
    },
    {
        key: "chatbot",
        title: "Trợ lý AI",
        description: "Hỗ trợ tra cứu thông tin và giải đáp nghiệp vụ nhanh chóng.",
        path: "/operations/chatbot",
        colorClass: "feature-card--chatbot",
        icon: <RobotOutlined />,
    },
];