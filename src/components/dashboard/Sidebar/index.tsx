import {
  BarChartOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
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
    key: "/operations/teaching",
    icon: <SafetyCertificateOutlined />,
    label: "Điểm danh giảng dạy",
  },
  {
    key: "/operations/schools",
    icon: <SolutionOutlined />,
    label: "Trường & Cơ sở",
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

  return (
    <Sider
      width={256}
      collapsedWidth={72}
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={onBreakpoint}
      className="dashboard-sidebar"
    >
      <div className="dashboard-sidebar__brand">
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