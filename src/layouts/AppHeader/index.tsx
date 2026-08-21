import {
    BellOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Avatar,
    Badge,
    Button,
    Space,
    Typography,
} from "antd";

import { APP_CONFIG } from "@/config/app";

import "./style.scss";

const {
    Text,
    Title,
} = Typography;

function AppHeader() {
    return (
        <header className="app-header">
            <div className="app-header__title">
                <div className="app-header__title-text">
                    <Title level={5}>
                        {APP_CONFIG.title}
                    </Title>

                    <Text>
                        {APP_CONFIG.titleEn}
                    </Text>
                </div>
            </div>

            <Space size="middle">
                <Badge count={3}>
                    <Button
                        type="text"
                        shape="circle"
                        icon={<BellOutlined />}
                    />
                </Badge>

                <Avatar
                    icon={<UserOutlined />}
                />
            </Space>
        </header>
    );
}

export default AppHeader;