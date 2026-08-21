import {
  CloseOutlined,
  DeleteOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Button, Input, Tooltip } from "antd";

import { useState, useEffect } from "react";

import chatbotRobot from "@/assets/images/chatbot-robot.png";

import "./style.scss";

interface ChatMessage {
  id: string;

  role: "user" | "assistant";

  content: string;

  createdAt: string;
}

const getCurrentTime = () => {
    return new Date()
        .toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit",
            },
        );
};

const initialMessages: ChatMessage[] = [
  {
    id: "chatbot-001",

    role: "assistant",

    content:
      "Xin chào! Tôi là Trợ lý AI. Tôi có thể hỗ trợ bạn tra cứu và tìm kiếm thông tin trong hệ thống.",

    createdAt: getCurrentTime(),
  },
];

// Thời gian hiện lại Chatbot (s)
const CHATBOT_REOPEN_DELAY = 5 * 60 * 1000;

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, CHATBOT_REOPEN_DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isVisible]);

  const handleHideChatbot = () => {
    setIsOpen(false);

    setIsVisible(false);
  };

  const handleSend = () => {
    const content = message.trim();

    if (!content) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `chatbot-${Date.now()}`,

      role: "user",

      content,

    //   createdAt: new Date().toLocaleTimeString("vi-VN", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   }),
      createdAt: getCurrentTime(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);

    setMessage("");

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `chatbot-ai-${Date.now()}`,

        role: "assistant",

        content:
          "Đây là phản hồi mô phỏng của Trợ lý AI. Chức năng sẽ được kết nối với AI API ở bước sau.",

        createdAt: getCurrentTime(),

        // createdAt: new Date().toLocaleTimeString("vi-VN", {
        //   hour: "2-digit",
        //   minute: "2-digit",
        // }),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    }, 500);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {isVisible && (
        <>
          {/* ========================================
                FLOATING ROBOT
            ======================================== */}

          {!isOpen && (
            <div className="chatbot-launcher">
              <button
                type="button"
                className="chatbot-launcher__close"
                onClick={handleHideChatbot}
                aria-label="Tắt Trợ lý AI"
              >
                ×
              </button>
              
              {/* BUBBLE XIN CHÀO */}

              <div className="chatbot-launcher__bubble">
                <span>Xin chào</span>

                <span className="chatbot-launcher__wave">👋</span>
              </div>

              {/* ROBOT BUTTON */}

              <Tooltip title="Trợ lý AI">
                <button
                  type="button"
                  className="chatbot-launcher__button"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  aria-label="Mở Trợ lý AI"
                >
                  <img
                    src={chatbotRobot}
                    alt="Trợ lý AI"
                    className="chatbot-launcher__robot"
                  />
                </button>
              </Tooltip>
            </div>
          )}

          {/* ========================================
                CHAT WINDOW
            ======================================== */}

          {isOpen && (
            <div className="chatbot-window">
              {/* HEADER */}

              <div className="chatbot-window__header">
                <div className="chatbot-window__assistant">
                  <div className="chatbot-window__header-robot">
                    <img src={chatbotRobot} alt="Trợ lý AI" />
                  </div>

                  <div className="chatbot-window__assistant-info">
                    <h3>Trợ lý AI</h3>

                    <span>
                      <i />
                      Sẵn sàng hỗ trợ
                    </span>
                  </div>
                </div>

                <div className="chatbot-window__actions">
                  <Tooltip title="Xóa hội thoại">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={handleClearChat}
                    />
                  </Tooltip>

                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  />
                </div>
              </div>

              {/* MESSAGES */}

              <div className="chatbot-window__messages">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`chatbot-message chatbot-message--${item.role}`}
                  >
                    {item.role === "assistant" ? (
                      <div className="chatbot-message__robot">
                        <img src={chatbotRobot} alt="Trợ lý AI" />
                      </div>
                    ) : (
                      <Avatar
                        size={28}
                        icon={<UserOutlined />}
                        className="chatbot-message__avatar chatbot-message__avatar--user"
                      />
                    )}

                    <div className="chatbot-message__content">
                      <div className="chatbot-message__bubble">
                        {item.content}
                      </div>

                      <span className="chatbot-message__time">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}

              <div className="chatbot-window__input">
                <Input.TextArea
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  onPressEnter={(event) => {
                    if (!event.shiftKey) {
                      event.preventDefault();

                      handleSend();
                    }
                  }}
                  placeholder="Nhập câu hỏi..."
                  autoSize={{
                    minRows: 1,
                    maxRows: 4,
                  }}
                />

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Chatbot;
