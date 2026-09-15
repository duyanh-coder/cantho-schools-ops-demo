import { useEffect, type ReactNode } from "react";

import {
  ArrowRightOutlined,
  BarChartOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import { Button, Card, Col, Row, Statistic, Typography } from "antd";

import { useNavigate } from "react-router-dom";

import { APP_CONFIG } from "@/config/app";
import { REGION_CONFIG } from "@/config/region";

import heroImage from "@/assets/images/cantho/hero.jpg";

import "./style.scss";

const { Title, Paragraph, Text } = Typography;

interface OperationFeature {
  key: string;
  title: string;
  description: string;
  path: string;
  colorClass: string;
  icon: ReactNode;
}

const operationFeatures: OperationFeature[] = [
  {
    key: "documents",
    title: "Văn bản điện tử",
    description: "Quản lý văn bản, hồ sơ và các thông tin điều hành.",
    path: "/operations/documents",
    colorClass: "feature-card--documents",
    icon: <FileTextOutlined />,
  },
  {
    key: "timetable",
    title: "Thời khóa biểu",
    description: "Theo dõi và quản lý thời khóa biểu tại các cơ sở giáo dục.",
    path: "/operations/timetable",
    colorClass: "feature-card--timetable",
    icon: <CalendarOutlined />,
  },
  {
    key: "teaching",
    title: "Điểm danh giảng dạy",
    description: "Theo dõi tình hình thực hiện kế hoạch giảng dạy.",
    path: "/operations/teaching",
    colorClass: "feature-card--teaching",
    icon: <SafetyCertificateOutlined />,
  },
  {
    key: "schools",
    title: "Trường & Cơ sở",
    description: "Quản lý thông tin trường học và các cơ sở trực thuộc.",
    path: "/operations/schools",
    colorClass: "feature-card--school",
    icon: <SolutionOutlined />,
  },
  {
    key: "gis",
    title: "Bản đồ GIS",
    description: "Quản lý địa bàn, trường học và các cơ sở trên nền bản đồ số.",
    path: "/operations/gis",
    colorClass: "feature-card--gis",
    icon: <EnvironmentOutlined />,
  },
  {
    key: "reports",
    title: "Báo cáo điều hành",
    description: "Tổng hợp số liệu và hỗ trợ theo dõi tình hình hoạt động.",
    path: "/operations/reports",
    colorClass: "feature-card--reports",
    icon: <BarChartOutlined />,
  },
  {
    key: "alerts",
    title: "Cảnh báo",
    description: "Theo dõi các vấn đề cần xử lý và thông báo quan trọng.",
    path: "/operations/alerts",
    colorClass: "feature-card--alerts",
    icon: <WarningOutlined />,
  },
  {
    key: "chatbot",
    title: "Trợ lý AI",
    description: "Hỗ trợ tra cứu thông tin và giải đáp nghiệp vụ nhanh chóng.",
    path: "/operations/chatbot",
    colorClass: "feature-card--chatbot",
    icon: <RobotOutlined />,
  },
];

function HomePage() {
  const navigate = useNavigate();

  const handleExploreSystem = () => {
    document.getElementById("operation-features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // const handleFeatureClick = (path: string) => {
  //   navigate(path);

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // };

  useEffect(() => {
    const savedScrollPosition =
        sessionStorage.getItem(
            "home-scroll-position",
        );

    if (savedScrollPosition) {
        window.scrollTo({
            top: Number(savedScrollPosition),
            behavior: "auto",
        });

        sessionStorage.removeItem(
            "home-scroll-position",
        );
    }
}, []);
  const handleNavigateFeature = (path: string) => {
    sessionStorage.setItem("home-scroll-position", window.scrollY.toString());

    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  return (
    <main className="home-page">
      {/* HERO */}
      <section
        className="home-hero"
        style={{
          backgroundImage: `
            linear-gradient(
                90deg,
                rgba(8, 30, 60, 0.92) 0%,
                rgba(12, 58, 105, 0.78) 42%,
                rgba(15, 80, 130, 0.35) 70%,
                rgba(15, 23, 42, 0.18) 100%
            ),
            url(${heroImage})
        `,
        }}
      >
        {/* <div className="home-hero__background" /> */}

        <div className="home-container">
          <Row align="middle" gutter={[48, 48]}>
            <Col xs={24} lg={14}>
              <div className="home-hero__content">
                <div className="home-hero__badge">
                  <SafetyCertificateOutlined />

                  <span>Nền tảng điều hành giáo dục số</span>
                </div>

                <Title className="home-hero__title">{APP_CONFIG.title}</Title>

                <Title level={2} className="home-hero__subtitle">
                  {APP_CONFIG.titleEn}
                </Title>

                <Paragraph className="home-hero__description">
                  Nền tảng hỗ trợ Hiệu trưởng và Ban Giám hiệu trong công tác
                  quản lý, điều hành và theo dõi hoạt động của các trường và cơ
                  sở giáo dục công lập.
                </Paragraph>

                <div className="home-hero__actions">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleExploreSystem}
                  >
                    Khám phá hệ thống
                    <ArrowRightOutlined />
                  </Button>

                  <Button
                    size="large"
                    onClick={() => navigate("/operations/dashboard")}
                  >
                    Vào trang điều hành
                  </Button>
                </div>

                <div className="home-hero__location">
                  <EnvironmentOutlined />

                  <span>{REGION_CONFIG.name}</span>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={10}>
              <div className="home-hero__visual">
                <div className="hero-dashboard-preview">
                  <div className="hero-dashboard-preview__header">
                    <div>
                      <span>SCHOOL</span>

                      <strong>OPERATION CENTER</strong>
                    </div>

                    <div className="hero-dashboard-preview__status">Online</div>
                  </div>

                  <div className="hero-dashboard-preview__stats">
                    <div>
                      <strong>01</strong>

                      <span>Địa bàn quản lý</span>
                    </div>

                    <div>
                      <strong>08+</strong>

                      <span>Chức năng điều hành</span>
                    </div>

                    <div>
                      <strong>24/7</strong>

                      <span>Hỗ trợ vận hành</span>
                    </div>
                  </div>

                  <div className="hero-dashboard-preview__chart">
                    <span />

                    <span />

                    <span />

                    <span />

                    <span />

                    <span />

                    <span />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="home-overview">
        <div className="home-container">
          <div className="section-heading">
            <Text className="section-heading__eyebrow">SCHOOL OPERATION</Text>

            <Title style={{ marginTop: 0 }}>
              Một nền tảng thống nhất cho công tác điều hành
            </Title>

            <Paragraph>
              Tập trung thông tin quản lý, vận hành và hỗ trợ ra quyết định
              trong một hệ thống trực quan, hiện đại và dễ sử dụng.
            </Paragraph>
          </div>

          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="overview-card overview-card--dashboard">
                <Statistic title="Quản lý tập trung" value="100" suffix="%" />

                <Text>Thông tin và nghiệp vụ trên cùng một nền tảng.</Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="overview-card overview-card--gis">
                <Statistic title="Bản đồ số" value="GIS" />

                <Text>Trực quan hóa trường và cơ sở theo địa bàn.</Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="overview-card overview-card--teaching">
                <Statistic title="Điều hành" value="24" suffix="/7" />

                <Text>Hỗ trợ theo dõi hoạt động liên tục.</Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="overview-card overview-card--chatbot">
                <Statistic title="Trợ lý thông minh" value="AI" />

                <Text>Hỗ trợ tra cứu và khai thác thông tin nhanh.</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURES */}
      <section id="operation-features" className="home-features">
        <div className="home-container">
          <div className="section-heading">
            <Text className="section-heading__eyebrow">OPERATION MODULES</Text>

            <Title style={{ marginTop: 0 }}>Các chức năng điều hành</Title>

            <Paragraph>
              Lựa chọn chức năng để truy cập vào khu vực quản lý và điều hành
              chuyên biệt.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {operationFeatures.map((feature) => (
              <Col key={feature.key} xs={24} sm={12} xl={6}>
                <Card
                  hoverable
                  className={`feature-card ${feature.colorClass}`}
                  onClick={() => handleNavigateFeature(feature.path)}
                >
                  <div className="feature-card__content">
                    <div className="feature-card__icon">{feature.icon}</div>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>
                  </div>

                  <div className="feature-card__footer">
                    <span className="feature-card__link">Xem chi tiết →</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-container">
          <div className="home-footer__content">
            <div>
              <strong>{APP_CONFIG.title}</strong>

              <span>{APP_CONFIG.titleEn}</span>
            </div>

            <Text>© 2026 CUSC</Text>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;
