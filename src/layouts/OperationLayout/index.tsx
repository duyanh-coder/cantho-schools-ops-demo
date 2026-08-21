import {
    ArrowLeftOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    Button,
    Layout,
} from "antd";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import "./style.scss";

const { Header, Content } = Layout;

const pageTitles: Record<string, string> = {
    "/operations/gis": "Bản đồ GIS",
    "/operations/timetable": "Thời khóa biểu",
    "/operations/teaching": "Điểm danh giảng dạy",
    "/operations/schools": "Trường & Cơ sở",
    "/operations/documents": "Văn bản điện tử",
    "/operations/reports": "Báo cáo điều hành",
    "/operations/alerts": "Cảnh báo",
    "/operations/chatbot": "Trợ lý AI",
};

const OperationLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const title =
        pageTitles[location.pathname] ?? "Chức năng điều hành";

    return (
        <Layout className="operation-layout">
            <Header className="operation-layout__header">
                <div
                    className="operation-layout__brand"
                    onClick={() => navigate("/")}
                >
                    <div className="operation-layout__logo">
                        SOC
                    </div>

                    <div>
                        <div className="operation-layout__system-name">
                            School Operation Center
                        </div>

                        <div className="operation-layout__system-subtitle">
                            Hệ thống điều hành Giáo dục Công lập
                        </div>
                    </div>
                </div>

                <div className="operation-layout__user">
                    Hiệu trưởng
                </div>
            </Header>

            <Content className="operation-layout__content">
                <div className="operation-layout__container">
                    <div className="operation-layout__navigation">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/")}
                        >
                            Quay lại hệ thống
                        </Button>

                        <Breadcrumb
                            items={[
                                {
                                    title: (
                                        <span
                                            className="breadcrumb-home"
                                            onClick={() => navigate("/")}
                                        >
                                            <HomeOutlined />
                                        </span>
                                    ),
                                },
                                {
                                    title,
                                },
                            ]}
                        />
                    </div>

                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default OperationLayout;