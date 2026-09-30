import { Layout, Menu } from "antd";

import type { MenuProps } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

import { MENU_ITEMS } from "@/components/dashboard/Sidebar/menuItems";

import "./style.scss";

const { Sider } = Layout;

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

  const menuSelectedKey =
    location.pathname === "/operations/catalogs"
      ? `${location.pathname}${location.search}`
      : location.pathname;

  const handleMenuClick: MenuProps["onClick"] = (item) => {
    navigate(item.key);
  };

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
        selectedKeys={[menuSelectedKey]}
        items={MENU_ITEMS}
        onClick={handleMenuClick}
        className="dashboard-sidebar__menu"
      />
    </Sider>
  );
};

export default DashboardSidebar;