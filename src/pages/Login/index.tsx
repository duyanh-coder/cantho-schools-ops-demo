import {
    LockOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Button,
    Card,
    Form,
    Input,
    message,
} from "antd";

import {
    Navigate,
    useNavigate,
} from "react-router-dom";

import {
    AUTH_ACCOUNTS,
    AUTH_DEMO_PASSWORD,
    useAuth,
} from "@/store/auth";

import {
    getRoleLabel,
} from "@/utils/permission";

import "./style.scss";


interface LoginValues {
    username: string;

    password: string;
}


const demoAccounts =
    Object.values(
        AUTH_ACCOUNTS,
    );


const LoginPage = () => {
    const {
        user,
        signIn,
    } = useAuth();

    const [
        form,
    ] =
        Form.useForm<LoginValues>();

    const navigate =
        useNavigate();

    const handleFinish = (
        values: LoginValues,
    ) => {
        const success =
            signIn(
                values.username,
                values.password,
            );

        if (success) {
            navigate(
                "/operations/personnel",
                {
                    replace: true,
                },
            );
        } else {
            message.error(
                "Sai tên đăng nhập hoặc mật khẩu",
            );
        }
    };

    const fillAccount = (
        username: string,
    ) => {
        form.setFieldsValue({
            username,
            password: AUTH_DEMO_PASSWORD,
        });

        handleFinish({
            username,
            password: AUTH_DEMO_PASSWORD,
        });
    };

    if (user) {
        return (
            <Navigate
                to="/operations/personnel"
                replace
            />
        );
    }

    return (
        <div className="login-page">
            <Card
                className="login-page__card"
                title="Đăng nhập hệ thống"
                bordered={false}
            >
                <Form<LoginValues>
                    id="login-form"
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        username: "admin",
                        password: AUTH_DEMO_PASSWORD,
                    }}
                >
                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên đăng nhập",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="admin / hieutruong / vanthu"
                            autoComplete="username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu demo"
                            autoComplete="current-password"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                    >
                        Đăng nhập
                    </Button>
                </Form>

                <div className="login-page__demo">
                    <span className="login-page__demo-title">
                        Truy cập nhanh (mật khẩu {AUTH_DEMO_PASSWORD})
                    </span>

                    <div className="login-page__demo-list">
                        {demoAccounts.map(
                            (account) => (
                                <Button
                                    key={account.id}
                                    size="small"
                                    onClick={() =>
                                        fillAccount(
                                            account.username,
                                        )
                                    }
                                >
                                    {account.fullName} ·{" "}
                                    {getRoleLabel(
                                        account.role,
                                    )}
                                </Button>
                            ),
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;