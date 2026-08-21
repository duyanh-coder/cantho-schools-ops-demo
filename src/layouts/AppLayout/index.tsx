import type { ReactNode } from "react";

import { Layout } from "antd";

import AppHeader from "@/layouts/AppHeader";
import AppSidebar from "@/layouts/AppSidebar";

import "./style.scss";

interface AppLayoutProps {
    children: ReactNode;
}

function AppLayout({
    children,
}: AppLayoutProps) {
    return (
        <Layout className="app-layout">
            <AppSidebar />

            <Layout className="app-layout__main">
                <AppHeader />

                <Layout.Content className="app-layout__content">
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}

export default AppLayout;