import {
    ClearOutlined,
    RobotOutlined,
    SendOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Avatar,
    Button,
    Card,
    Empty,
    Input,
    Typography,
} from "antd";

import {
    useState,
} from "react";

import "./style.scss";


const {
    Text,
} = Typography;


interface ChatMessage {
    id: string;

    role: "user" | "assistant";

    content: string;

    createdAt: string;
}


const quickPrompts: string[] = [
    "Thống kê số bán trú tháng này",
    "Danh sách nhân sự mới tuyển",
    "Lập thời khóa biểu tuần tới",
];


const initialMessages: ChatMessage[] = [
    {
        id: "chat-001",

        role: "assistant",

        content:
            "Xin chào! Tôi là Trợ lý AI. Tôi có thể hỗ trợ tra cứu và phân tích thông tin trong hệ thống.",

        createdAt: "09:00",
    },
];


function ChatbotPage() {
    const [
        messages,
        setMessages,
    ] = useState<ChatMessage[]>(
        initialMessages,
    );


    const [
        message,
        setMessage,
    ] = useState("");


    const handleSend = () => {
        const content =
            message.trim();


        if (!content) {
            return;
        }


        const userMessage: ChatMessage = {
            id:
                `chat-${Date.now()}`,

            role: "user",

            content,

            createdAt:
                new Date()
                    .toLocaleTimeString(
                        "vi-VN",
                        {
                            hour: "2-digit",

                            minute: "2-digit",
                        },
                    ),
        };


        setMessages(
            (currentMessages) => [
                ...currentMessages,

                userMessage,
            ],
        );


        setMessage("");


        /* ========================================
           MOCK AI RESPONSE
        ======================================== */

        window.setTimeout(
            () => {
                const assistantMessage: ChatMessage = {
                    id:
                        `chat-${Date.now()}-ai`,

                    role:
                        "assistant",

                    content:
                        "Đây là phản hồi mô phỏng của Trợ lý AI. Phần này sẽ được kết nối với API AI ở bước sau.",

                    createdAt:
                        new Date()
                            .toLocaleTimeString(
                                "vi-VN",
                                {
                                    hour: "2-digit",

                                    minute: "2-digit",
                                },
                            ),
                };


                setMessages(
                    (
                        currentMessages,
                    ) => [
                        ...currentMessages,

                        assistantMessage,
                    ],
                );
            },
            500,
        );
    };


    const handleClearChat = () => {
        setMessages(
            initialMessages,
        );
    };


    return (
        <div className="ai-chat-page">

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            AI ASSISTANT
                        </span>

                        <h2>Trợ lý AI</h2>

                        <p>
                            Hỗ trợ tra cứu, tổng hợp và phân tích thông tin
                            trong hệ thống.
                        </p>
                    </div>
                </header>
            </div>

            <Card className="ai-chat">

                {/* ========================================
                    CHAT HEADER
                ======================================== */}

                <div className="ai-chat__header">

                    <div className="ai-chat__assistant">

                        <Avatar
                            size={48}
                            icon={
                                <RobotOutlined />
                            }
                            className="ai-chat__avatar"
                        />


                        <div>

                            <h2>
                                Trợ lý AI
                            </h2>


                            <Text type="secondary">

                                Sẵn sàng hỗ trợ bạn

                            </Text>

                        </div>

                    </div>


                    <Button
                        icon={
                            <ClearOutlined />
                        }
                        onClick={
                            handleClearChat
                        }
                    >

                        Xóa hội thoại

                    </Button>

                </div>


                {/* ========================================
                    CHAT MESSAGES
                ======================================== */}

                <div className="ai-chat__messages">

                    {
                        messages.length === 0
                            ? (
                                <Empty
                                    description="Chưa có hội thoại"
                                />
                            )
                            : messages.map(
                                (
                                    item,
                                ) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className={
                                            `ai-message ai-message--${item.role}`
                                        }
                                    >

                                        <Avatar
                                            icon={
                                                item.role ===
                                                "assistant"
                                                    ? (
                                                        <RobotOutlined />
                                                    )
                                                    : (
                                                        <UserOutlined />
                                                    )
                                            }
                                            className={
                                                `ai-message__avatar ai-message__avatar--${item.role}`
                                            }
                                        />


                                        <div className="ai-message__content">

                                            <div className="ai-message__bubble">

                                                {
                                                    item.content
                                                }

                                            </div>


                                            <span className="ai-message__time">

                                                {
                                                    item.createdAt
                                                }

                                            </span>

                                        </div>

                                    </div>
                                ),
                            )
                    }

                </div>


                {/* ========================================
                    CHAT INPUT
                ======================================== */}

                <div className="ai-chat__input">

                    <div className="ai-chat__quick">
                        {
                            quickPrompts.map(
                                (
                                    prompt,
                                ) => (
                                    <Button
                                        key={
                                            prompt
                                        }
                                        type="text"
                                        size="small"
                                        onClick={
                                            () => {
                                                setMessage(
                                                    prompt,
                                                );
                                            }
                                        }
                                        className="ai-chat__quick-chip"
                                    >
                                        {
                                            prompt
                                        }
                                    </Button>
                                ),
                            )
                        }
                    </div>


                    <Input.TextArea
                        value={
                            message
                        }
                        onChange={
                            (
                                event,
                            ) => {
                                setMessage(
                                    event.target.value,
                                );
                            }
                        }
                        onPressEnter={
                            (
                                event,
                            ) => {
                                if (
                                    !event.shiftKey
                                ) {
                                    event.preventDefault();

                                    handleSend();
                                }
                            }
                        }
                        placeholder="Nhập câu hỏi của bạn..."
                        autoSize={{
                            minRows: 2,

                            maxRows: 5,
                        }}
                    />


                    <Button
                        type="primary"
                        icon={
                            <SendOutlined />
                        }
                        onClick={
                            handleSend
                        }
                    >

                        Gửi

                    </Button>

                </div>

            </Card>

        </div>
    );
}


export default ChatbotPage;