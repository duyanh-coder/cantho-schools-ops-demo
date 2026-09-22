import {
  BellOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Badge,
  Button,
  Space,
  Tag,
} from "antd";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/store/auth";
import { getRoleLabel } from "@/utils/permission";

import "./style.scss";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({
  onToggleSidebar,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();

    navigate("/login");
  };

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
            <strong>{user?.fullName ?? "Khách"}</strong>

            {user && (
              <Tag color="blue" className="dashboard-header__role">
                {getRoleLabel(user.role)}
              </Tag>
            )}
          </div>

          {user && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleSignOut}
              className="dashboard-header__signout"
            >
              Đăng xuất
            </Button>
          )}
        </Space>
      </div>
    </header>
  );
};

export default DashboardHeader;