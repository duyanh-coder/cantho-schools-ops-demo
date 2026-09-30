import {
    Layout,
    Menu,
} from "antd";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import { APP_CONFIG } from "@/config/app";

import { APP_MENU_ITEMS } from "@/layouts/AppSidebar/menuItems";

import "./style.scss";

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
                items={APP_MENU_ITEMS}
                onClick={(item) =>
                    navigate(item.key)
                }
            />
        </Sider>
    );
}

export default AppSidebar;