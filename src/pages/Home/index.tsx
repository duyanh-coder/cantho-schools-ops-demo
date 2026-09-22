import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  ArrowRightOutlined,
  BarChartOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  LinkOutlined,
  PartitionOutlined,
  ReadOutlined,
  RiseOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  TeamOutlined,
  TrophyOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Statistic,
  Typography,
} from "antd";

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

/* ============================================================
   EDUCATION STATS — số liệu sưu tầm & tham khảo từ nguồn web
   (Sở GD&ĐT TP Cần Thơ), phục vụ minh họa trang chủ demo.
============================================================ */

interface EducationLevelStat {
  label: string;
  schools: number;
  students: number;
  teacherShortage: number;
}

const educationLevelStats: EducationLevelStat[] = [
  {
    label: "Mầm non",
    schools: 382,
    students: 121905,
    teacherShortage: 1026,
  },
  {
    label: "Tiểu học",
    schools: 506,
    students: 257755,
    teacherShortage: 610,
  },
  {
    label: "THCS",
    schools: 241,
    students: 195357,
    teacherShortage: 438,
  },
  {
    label: "THPT & liên cấp",
    schools: 103,
    students: 90800,
    teacherShortage: 445,
  },
];

const educationChartMax = {
  schools: Math.max(
    ...educationLevelStats.map((level) => level.schools),
  ),
  students: Math.max(
    ...educationLevelStats.map((level) => level.students),
  ),
  teacherShortage: Math.max(
    ...educationLevelStats.map((level) => level.teacherShortage),
  ),
};

const educationHeadlineStats = [
  {
    label: "Trường học (MN → phổ thông)",
    value: "1.232",
    suffix: "",
    hint: "Sau hợp nhất 3 địa phương (7/2025)",
    icon: <ReadOutlined />,
    colorClass: "edu-stat-card--schools",
  },
  {
    label: "Trẻ & học sinh năm học 2025–2026",
    value: "654,700",
    suffix: "+",
    hint: "Từ mầm non đến THPT",
    icon: <TeamOutlined />,
    colorClass: "edu-stat-card--students",
  },
  {
    label: "Cán bộ, giáo viên, nhân viên",
    value: "38.263",
    suffix: "",
    hint: "Toàn ngành từ MN đến THPT",
    icon: <TrophyOutlined />,
    colorClass: "edu-stat-card--staff",
  },
  {
    label: "Trường đạt chuẩn quốc gia",
    value: "81,41",
    suffix: "%",
    hint: "1.003/1.232 trường (đến 30/6/2025)",
    icon: <RiseOutlined />,
    colorClass: "edu-stat-card--standard",
  },
];

const restructurePlan = [
  { label: "Mầm non – mẫu giáo", from: 327, to: 177 },
  { label: "Tiểu học", from: 481, to: 217 },
  { label: "Trung học cơ sở", from: 223, to: 126 },
];

const educationSources = [
  {
    title:
      "Ngành Giáo dục và Đào tạo TP Cần Thơ triển khai nhiệm vụ năm học mới 2025–2026",
    source: "Báo Cần Thơ (baocantho.com.vn)",
    date: "25/8/2025",
    url: "https://baocantho.com.vn/nganh-giao-duc-va-dao-tao-tp-can-tho-trien-khai-nhiem-vu-nam-hoc-moi-2025-2026-a190048.html",
  },
  {
    title:
      "TP Cần Thơ dự kiến giảm 525 trường học, huy động hơn 689.860 trẻ, học sinh và học viên năm học 2026–2027",
    source: "Báo Cần Thơ (baocantho.com.vn)",
    date: "2/8/2026",
    url: "https://baocantho.com.vn/tp-can-tho-du-kien-giam-525-truong-hoc-huy-dong-hon-689-860-tre-hoc-sinh-va-hoc-vien-nam-hoc-2026--a211356.html",
  },
  {
    title:
      "Cần Thơ: Đảm bảo đội ngũ giáo viên cho năm học 2025 – 2026 sau hợp nhất",
    source: "TTXVN (baotintuc.vn) — theo Sở GD&ĐT TP Cần Thơ",
    date: "9/7/2025",
    url: "https://baotintuc.vn/dia-phuong/can-tho-dam-bao-doi-ngu-giao-vien-cho-nam-hoc-2025-2026-sau-hop-nhat-20250709171548794.htm",
  },
  {
    title:
      "Cần Thơ trước thềm năm học 2025–2026: Ngành giáo dục vững bước trong mô hình chính quyền 2 cấp",
    source: "Thanh ủy Cần Thơ (thanhuycantho.vn)",
    date: "2025",
    url: "https://thanhuycantho.vn/tin-tuc-su-kien/ndid/11738/key/default",
  },
];

const formatCompactNumber = (value: number) =>
  value >= 1000
    ? `${(value / 1000).toFixed(1).replace(".", ",")}k`
    : String(value);

function HomePage() {
  const navigate = useNavigate();

  const heroRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    let frame = 0;

    const updateParallax = () => {
      const hero = heroRef.current;

      if (hero) {
        const rect = hero.getBoundingClientRect();

        const scrolled = Math.min(
            Math.max(-rect.top, 0),
            rect.height,
        );

        hero.style.setProperty(
            "--hero-parallax",
            `${scrolled * 0.1}px`,
        );
      }

      frame = 0;
    };

    const handleScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="home-page">
      {/* HERO */}
      <section
        ref={heroRef}
        className="home-hero"
        style={{ "--hero-bg": `url(${heroImage})` } as CSSProperties}
      >
        <div className="home-hero__bg" aria-hidden="true" />

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
                    onClick={() => navigate("/operations/schools")}
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
                      <strong>07+</strong>

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

      {/* EDUCATION */}
      <section className="home-education">
        <div className="home-container">
          <div className="section-heading">
            <Text className="section-heading__eyebrow">CAN THO EDUCATION</Text>

            <Title style={{ marginTop: 0 }}>
              Trường học trên địa bàn TP Cần Thơ
            </Title>

            <Paragraph>
              Tổng hợp một số chỉ tiêu quy mô ngành Giáo dục thành phố theo số
              liệu công bố của Sở GD&ĐT (tham khảo nguồn web), phục vụ minh họa
              cho bản demo.
            </Paragraph>
          </div>

          <Row gutter={[20, 20]} className="home-education__stats">
            {educationHeadlineStats.map((stat) => (
              <Col key={stat.label} xs={24} sm={12} lg={6}>
                <Card className={`edu-stat-card ${stat.colorClass}`}>
                  <div className="edu-stat-card__icon">{stat.icon}</div>

                  <Statistic
                    title={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                  />

                  <Text className="edu-stat-card__hint">{stat.hint}</Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[24, 24]} className="home-education__charts">
            <Col xs={24} lg={12}>
              <Card className="edu-chart-card edu-chart-card--schools">
                <div className="edu-chart-card__heading">
                  <div>
                    <h4>Số trường theo cấp học</h4>

                    <Text>Đơn vị: trường — sau hợp nhất (7/2025)</Text>
                  </div>

                  <span className="edu-chart-card__dot" />
                </div>

                <div className="edu-chart edu-chart--vertical">
                  {educationLevelStats.map((level) => (
                    <div className="edu-chart__item" key={level.label}>
                      <span className="edu-chart__value">
                        {level.schools}
                      </span>

                      <div className="edu-chart__track">
                        <span
                          className="edu-chart__bar"
                          style={{
                            height: `${
                              (level.schools / educationChartMax.schools) * 100
                            }%`,
                          }}
                        />
                      </div>

                      <span className="edu-chart__label">{level.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="edu-chart-card edu-chart-card--students">
                <div className="edu-chart-card__heading">
                  <div>
                    <h4>Số học sinh theo cấp học</h4>

                    <Text>Đơn vị: nghìn học sinh — năm học 2025–2026</Text>
                  </div>

                  <span className="edu-chart-card__dot" />
                </div>

                <div className="edu-chart edu-chart--vertical">
                  {educationLevelStats.map((level) => (
                    <div className="edu-chart__item" key={level.label}>
                      <span className="edu-chart__value">
                        {formatCompactNumber(level.students)}
                      </span>

                      <div className="edu-chart__track">
                        <span
                          className="edu-chart__bar"
                          style={{
                            height: `${
                              (level.students / educationChartMax.students) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <span className="edu-chart__label">{level.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="edu-chart-card edu-chart-card--standard">
                <div className="edu-chart-card__heading">
                  <div>
                    <h4>Tỷ lệ trường đạt chuẩn quốc gia</h4>

                    <Text>Lũy kế đến 30/6/2025 — cuối năm học 2024–2025</Text>
                  </div>

                  <span className="edu-chart-card__dot" />
                </div>

                <Row gutter={[16, 16]} className="edu-progress">
                  <Col xs={12}>
                    <div className="edu-progress__item">
                      <Progress
                        type="circle"
                        size={132}
                        percent={81.41}
                        strokeColor="#16a34a"
                        trailColor="rgba(148, 163, 184, 0.18)"
                        format={(percent) => (
                          <span className="edu-progress__value">
                            {percent?.toFixed(2).replace(".", ",")}%
                          </span>
                        )}
                      />

                      <div className="edu-progress__caption">
                        <strong>Toàn thành phố</strong>

                        <span>1.003/1.232 trường</span>
                      </div>
                    </div>
                  </Col>

                  <Col xs={12}>
                    <div className="edu-progress__item">
                      <Progress
                        type="circle"
                        size={132}
                        percent={67}
                        strokeColor="#f59e0b"
                        trailColor="rgba(148, 163, 184, 0.18)"
                        format={(percent) => (
                          <span className="edu-progress__value">
                            {percent}%
                          </span>
                        )}
                      />

                      <div className="edu-progress__caption">
                        <strong>Riêng THPT</strong>

                        <span>69/103 trường</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card className="edu-chart-card edu-chart-card--teachers">
                <div className="edu-chart-card__heading">
                  <div>
                    <h4>Giáo viên còn thiếu theo cấp học</h4>

                    <Text>
                      Đơn vị: giáo viên — theo định mức (2025–2026)
                    </Text>
                  </div>

                  <span className="edu-chart-card__dot" />
                </div>

                <div className="edu-rows">
                  {educationLevelStats.map((level) => (
                    <div className="edu-rows__item" key={level.label}>
                      <div className="edu-rows__head">
                        <span>{level.label}</span>

                        <strong>{level.teacherShortage} GV</strong>
                      </div>

                      <div className="edu-rows__track">
                        <span
                          style={{
                            width: `${
                              (level.teacherShortage /
                                educationChartMax.teacherShortage) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <Text className="edu-rows__note">
                    Tổng thiếu 2.519 giáo viên so với định mức; năm học
                    2024–2025 thiếu 1.993 giáo viên (theo biên chế giao).
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="edu-restructure">
            <div className="edu-restructure__brief">
              <div className="edu-restructure__badge">
                <PartitionOutlined />

                <span>DỰ KIẾN 2026–2027</span>
              </div>

              <h4>Sắp xếp, sáp nhập trường học</h4>

              <Paragraph>
                Dự kiến giảm 525 trường (−45,5%), từ 1.153 còn 628 đơn vị sự
                nghiệp công lập — khớp với mô hình sáp nhập trường đang được
                mô phỏng trong bản demo.
              </Paragraph>
            </div>

            <div className="edu-restructure__tiles">
              {restructurePlan.map((plan) => (
                <div className="edu-restructure__tile" key={plan.label}>
                  <span className="edu-restructure__tile-label">
                    {plan.label}
                  </span>

                  <div className="edu-restructure__tile-values">
                    <strong>{plan.from}</strong>

                    <span className="edu-restructure__arrow">
                      <ArrowRightOutlined />
                    </span>

                    <strong className="edu-restructure__to">{plan.to}</strong>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="edu-news">
            <div className="edu-news__header">
              <div className="edu-news__title">
                <LinkOutlined />

                <div>
                  <h4>Thông tin thêm</h4>

                  <span>
                    Thông tin liên quan cập nhật từ các nguồn tham khảo.
                  </span>
                </div>
              </div>

              <Text className="edu-news__count">
                {educationSources.length} bài viết
              </Text>
            </div>

            <div className="edu-news__list">
              {educationSources.map((source) => (
                <a
                  key={source.url}
                  className="edu-news__item"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="edu-news__item-meta">
                    <span>{source.date}</span>

                    <span>{source.source}</span>
                  </div>

                  <h5>{source.title}</h5>

                  <span className="edu-news__item-more">
                    Xem chi tiết →
                  </span>
                </a>
              ))}
            </div>
          </Card>
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
