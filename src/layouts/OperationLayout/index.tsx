import { useState } from "react";

import { Layout } from "antd";

import { Outlet } from "react-router-dom";

import DashboardHeader from "@/components/dashboard/Header";
import DashboardSidebar from "@/components/dashboard/Sidebar";

import "./style.scss";

const { Content } = Layout;

const OperationLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="operation-layout">
      <DashboardSidebar
        collapsed={collapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
      />

      <Layout className="operation-layout__main">
        <DashboardHeader
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />

        <Content className="operation-layout__content">
          <div className="operation-layout__container">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default OperationLayout;