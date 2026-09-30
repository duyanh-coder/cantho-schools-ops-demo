import {
    AppstoreOutlined,
    BarChartOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    RobotOutlined,
    SolutionOutlined,
} from "@ant-design/icons";

import type { MenuProps } from "antd";

import { CATALOG_DEFS } from "@/config/catalogs";


type MenuItem = Required<MenuProps>["items"][number];


/**
 * Danh sách mục của sidebar trong vùng vận hành.
 *
 * Tách riêng khỏi component để test được kiểm tra nội dung menu mà không
 * cần dựng giao diện.
 */
export const catalogMenuItems: MenuItem[] = CATALOG_DEFS.map((catalog) => ({
  key: `/operations/catalogs?key=${catalog.key}`,
  label: catalog.title,
}));


export const MENU_ITEMS: MenuItem[] = [
  {
    key: "/operations/schools",
    icon: <SolutionOutlined />,
    label: "Trường & Phân hiệu",
  },
  {
    key: "/operations/documents",
    icon: <FileTextOutlined />,
    label: "Văn bản điện tử",
  },
  {
    key: "/operations/timetable",
    icon: <CalendarOutlined />,
    label: "Thời khóa biểu",
  },
  {
    key: "/operations/gis",
    icon: <EnvironmentOutlined />,
    label: "Bản đồ GIS",
  },
  {
    key: "/operations/reports",
    icon: <BarChartOutlined />,
    label: "Báo cáo",
  },
  {
    key: "/operations/chatbot",
    icon: <RobotOutlined />,
    label: "Trợ lý AI",
  },
  {
    type: "divider",
  },
  {
    key: "/operations/catalogs",
    icon: <AppstoreOutlined />,
    label: "Danh mục",
    children: catalogMenuItems,
  },
];