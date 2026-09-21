import {
    AppstoreOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    ProfileOutlined,
    RobotOutlined,
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
        key: "/operations/gis",
        icon: <EnvironmentOutlined />,
        label: "Bản đồ GIS",
    },
    {
        key: "/operations/schools",
        icon: <SolutionOutlined />,
        label: "Trường & Cơ sở",
    },
    {
        key: "/operations/timetable",
        icon: <CalendarOutlined />,
        label: "Thời khóa biểu",
    },
    {
        key: "/operations/reports",
        icon: <ProfileOutlined />,
        label: "Báo cáo",
    },
    {
        key: "/operations/documents",
        icon: <FileTextOutlined />,
        label: "Văn bản điện tử",
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
                        Cần Thơ
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