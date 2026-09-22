import {
  BellOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Badge,
  Button,
  Space,
} from "antd";

import "./style.scss";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({
  onToggleSidebar,
}: DashboardHeaderProps) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <Button
          type="text"
          shape="circle"
          icon={<MenuOutlined />}
          className="dashboard-header__toggle"
          onClick={onToggleSidebar}
        />

        <div className="dashboard-header__title">
          <span className="dashboard-header__eyebrow">SCHOOL OPERATION CENTER</span>

          <h1>School Management Dashboard</h1>
        </div>
      </div>

      <div className="dashboard-header__user">
        <Space size="small">
          <Badge count={5}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              className="dashboard-header__bell"
            />
          </Badge>

          <Avatar
            size={38}
            icon={<UserOutlined />}
            className="dashboard-header__avatar"
          />

          <div className="dashboard-header__greeting">
            <strong>Welcome, Admin</strong>
          </div>
        </Space>
      </div>
    </header>
  );
};

export default DashboardHeader;