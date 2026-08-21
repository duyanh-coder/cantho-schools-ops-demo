import {
    AppstoreOutlined,
    CalendarOutlined,
    DashboardOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    RobotOutlined,
    SettingOutlined,
    SolutionOutlined,
    WarningOutlined,
} from "@ant-design/icons";

import {
    Layout,
    Menu,
} from "antd";

import type {
    MenuProps,
} from "antd";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { APP_CONFIG } from "@/config/app";

import "./style.scss";

type MenuItem =
    Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
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
        label: "Trường & Cơ sở",
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
        key: "/alerts",
        icon: <WarningOutlined />,
        label: "Cảnh báo",
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

const {
    Sider,
} = Layout;

function AppSidebar() {
    const navigate = useNavigate();

    const location = useLocation();

    return (
        <Sider
            width={260}
            breakpoint="lg"
            collapsedWidth={72}
            className="app-sidebar"
        >
            <div className="app-sidebar__brand">
                <div className="app-sidebar__logo">
                    CM
                </div>

                <div className="app-sidebar__brand-text">
                    <strong>
                        Cà Mau
                    </strong>

                    <span>
                        {APP_CONFIG.titleEn}
                    </span>
                </div>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[
                    location.pathname,
                ]}
                items={menuItems}
                onClick={(item) =>
                    navigate(item.key)
                }
            />
        </Sider>
    );
}

export default AppSidebar;