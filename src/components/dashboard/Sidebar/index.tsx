import {
  ApartmentOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CoffeeOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ReadOutlined,
  RobotOutlined,
  SolutionOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import { Layout, Menu } from "antd";

import type { MenuProps } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

import "./style.scss";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;

const menuItems: MenuItem[] = [
  {
    key: "/operations",
    icon: <DashboardOutlined />,
    label: "Trung tâm điều hành",
  },
  {
    key: "/operations/tasks",
    icon: <CheckCircleOutlined />,
    label: "Công việc cần làm",
  },
  {
    key: "/operations/catalogs",
    icon: <AppstoreOutlined />,
    label: "Danh mục dùng chung",
  },
  {
    type: "divider",
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
    key: "/operations/schools",
    icon: <SolutionOutlined />,
    label: "Trường & Cơ sở",
  },
  {
    key: "/operations/personnel",
    icon: <TeamOutlined />,
    label: "Nhân sự",
  },
  {
    key: "/operations/sectors",
    icon: <ApartmentOutlined />,
    label: "Khối - tổ",
  },
  {
    key: "/operations/students",
    icon: <ReadOutlined />,
    label: "Học sinh",
  },
  {
    key: "/operations/boarding",
    icon: <CoffeeOutlined />,
    label: "Bán trú",
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
    key: "/operations/alerts",
    icon: <WarningOutlined />,
    label: "Cảnh báo",
  },
  {
    key: "/operations/chatbot",
    icon: <RobotOutlined />,
    label: "Trợ lý AI",
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;

  onBreakpoint?: (broken: boolean) => void;
}

const DashboardSidebar = ({
  collapsed,
  onBreakpoint,
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const location = useLocation();

  const handleBrandClick = () => {
    sessionStorage.removeItem("home-scroll-position");

    navigate("/");

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  return (
    <Sider
      width={256}
      collapsedWidth={72}
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={onBreakpoint}
      className="dashboard-sidebar"
    >
      <div
        className="dashboard-sidebar__brand"
        onClick={handleBrandClick}
      >
        <div className="dashboard-sidebar__logo">SOC</div>

        <div className="dashboard-sidebar__brand-text">
          <strong>School Operation</strong>

          <span>Center</span>
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(item) => navigate(item.key)}
        className="dashboard-sidebar__menu"
      />
    </Sider>
  );
};

export default DashboardSidebar;