import {
    BankOutlined,
    EnvironmentOutlined,
    FilterOutlined,
    SearchOutlined,
    SolutionOutlined,
} from "@ant-design/icons";

import {
    Badge,
    Card,
    Col,
    Empty,
    Input,
    Row,
    Select,
    Tag,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import StatsCard from "@/components/dashboard/StatCard";

import {
    getCurrentRegionMockData,
} from "@/mock";

import "./style.scss";


const EDUCATION_LEVEL_CONFIG = {
    THCS: {
        label: "THCS",
        color: "blue",
    },

    THPT: {
        label: "THPT",
        color: "purple",
    },

    THCS_THPT: {
        label: "THCS & THPT",
        color: "cyan",
    },
};


const STATUS_CONFIG = {
    active: {
        label: "Đang hoạt động",
        status: "success" as const,
    },

    inactive: {
        label: "Không hoạt động",
        status: "default" as const,
    },
};


function SchoolsPage() {
    const {
        schools,
        campuses,
    } = getCurrentRegionMockData();


    const [
        keyword,
        setKeyword,
    ] = useState("");


    const [
        educationLevel,
        setEducationLevel,
    ] = useState("all");


    const [
        status,
        setStatus,
    ] = useState("all");


    const filteredSchools = useMemo(() => {
        const searchKeyword =
            keyword
                .trim()
                .toLowerCase();

        return schools.filter((school) => {
            const matchKeyword =
                !searchKeyword ||
                school.name
                    .toLowerCase()
                    .includes(searchKeyword) ||
                school.code
                    .toLowerCase()
                    .includes(searchKeyword);

            const matchEducationLevel =
                educationLevel === "all" ||
                school.educationLevel === educationLevel;

            const matchStatus =
                status === "all" ||
                school.status === status;

            return (
                matchKeyword &&
                matchEducationLevel &&
                matchStatus
            );
        });
    }, [
        schools,
        keyword,
        educationLevel,
        status,
    ]);


    const statistics = useMemo(() => {
        return {
            schools:
                schools.length,

            campuses:
                campuses.length,

            activeSchools:
                schools.filter(
                    (item) =>
                        item.status === "active",
                ).length,

            mainCampuses:
                campuses.filter(
                    (item) =>
                        item.isMainCampus,
                ).length,
        };
    }, [
        schools,
        campuses,
    ]);


    return (
        <div className="schools-page">

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            SCHOOLS
                        </span>

                        <h2>Trường & Cơ sở</h2>

                        <p>
                            Theo dõi thông tin trường học và các cơ sở trực
                            thuộc trên địa bàn.
                        </p>
                    </div>
                </header>

            <Card className="schools-page__filters">

                <div className="schools-page__filter-header">

                    <FilterOutlined />

                    <span>
                        Bộ lọc trường học
                    </span>

                </div>


                <Row gutter={[12, 12]}>

                    <Col
                        xs={24}
                        md={10}
                    >
                        <Input
                            value={keyword}
                            onChange={(event) =>
                                setKeyword(
                                    event.target.value,
                                )
                            }
                            prefix={
                                <SearchOutlined />
                            }
                            placeholder="Tìm theo tên hoặc mã trường"
                            className="schools-page__search"
                        />
                    </Col>


                    <Col
                        xs={12}
                        md={7}
                    >
                        <Select
                            value={
                                educationLevel
                            }
                            onChange={
                                setEducationLevel
                            }
                            className="schools-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả cấp học",
                                },
                                {
                                    value: "THCS",
                                    label: "THCS",
                                },
                                {
                                    value: "THPT",
                                    label: "THPT",
                                },
                                {
                                    value: "THCS_THPT",
                                    label: "THCS & THPT",
                                },
                            ]}
                        />
                    </Col>


                    <Col
                        xs={12}
                        md={7}
                    >
                        <Select
                            value={status}
                            onChange={setStatus}
                            className="schools-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả trạng thái",
                                },
                                {
                                    value: "active",
                                    label: "Đang hoạt động",
                                },
                                {
                                    value: "inactive",
                                    label: "Không hoạt động",
                                },
                            ]}
                        />
                    </Col>

                </Row>

            </Card>
            </div>

            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Trường học"
                    value={statistics.schools}
                    icon={<BankOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Tổng cơ sở"
                    value={statistics.campuses}
                    note="Cơ sở trực thuộc"
                    icon={<EnvironmentOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Đang hoạt động"
                    value={statistics.activeSchools}
                    icon={<SolutionOutlined />}
                />

                <StatsCard
                    tone="purple"
                    title="Trụ sở chính"
                    value={statistics.mainCampuses}
                    icon={<BankOutlined />}
                />
            </div>


            {/* =========================
                SCHOOL LIST
            ========================= */}

            <div className="schools-page__list">

                {filteredSchools.length === 0 ? (
                    <Empty
                        description="Không tìm thấy trường phù hợp"
                    />
                ) : (
                    <Row gutter={[16, 16]}>

                        {filteredSchools.map(
                            (school) => {
                                const schoolCampuses =
                                    campuses.filter(
                                        (campus) =>
                                            campus.schoolId ===
                                            school.id,
                                    );

                                const mainCampus =
                                    schoolCampuses.find(
                                        (campus) =>
                                            campus.isMainCampus,
                                    );

                                const levelConfig =
                                    EDUCATION_LEVEL_CONFIG[
                                        school.educationLevel
                                    ];

                                const statusConfig =
                                    STATUS_CONFIG[
                                        school.status
                                    ];


                                return (
                                    <Col
                                        key={school.id}
                                        xs={24}
                                        lg={12}
                                        xl={8}
                                    >

                                        <Card
                                            className="school-item"
                                        >

                                            <div
                                                className="school-item__header"
                                            >

                                                <div
                                                    className="school-item__icon"
                                                >
                                                    <BankOutlined />
                                                </div>


                                                <div
                                                    className="school-item__title"
                                                >

                                                    <span>
                                                        {school.code}
                                                    </span>

                                                    <h3>
                                                        {school.name}
                                                    </h3>

                                                </div>

                                            </div>


                                            <div
                                                className="school-item__tags"
                                            >

                                                <Tag
                                                    color={
                                                        levelConfig.color
                                                    }
                                                >
                                                    {
                                                        levelConfig.label
                                                    }
                                                </Tag>


                                                <Badge
                                                    status={
                                                        statusConfig.status
                                                    }
                                                    text={
                                                        statusConfig.label
                                                    }
                                                />

                                            </div>


                                            <div
                                                className="school-item__info"
                                            >

                                                <div>

                                                    <span>
                                                        <EnvironmentOutlined />

                                                        Cơ sở
                                                    </span>

                                                    <strong>
                                                        {
                                                            schoolCampuses.length
                                                        }
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        <BankOutlined />

                                                        Cơ sở chính
                                                    </span>

                                                    <strong>
                                                        {
                                                            mainCampus?.name ??
                                                            "-"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>


                                            <div
                                                className="school-item__address"
                                            >

                                                <EnvironmentOutlined />

                                                <span>
                                                    {
                                                        mainCampus?.address ??
                                                        "Chưa cập nhật địa chỉ"
                                                    }
                                                </span>

                                            </div>


                                            {/* CAMPUSES */}

                                            {schoolCampuses.length > 0 && (

                                                <div
                                                    className="school-item__campuses"
                                                >

                                                    <span
                                                        className="school-item__campuses-label"
                                                    >
                                                        Danh sách cơ sở
                                                    </span>


                                                    {schoolCampuses.map(
                                                        (
                                                            campus,
                                                        ) => (
                                                            <div
                                                                key={
                                                                    campus.id
                                                                }
                                                                className="school-campus"
                                                            >

                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            campus.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        {
                                                                            campus.code
                                                                        }
                                                                    </span>

                                                                </div>


                                                                {campus.isMainCampus && (

                                                                    <Tag
                                                                        color="blue"
                                                                    >
                                                                        Chính
                                                                    </Tag>

                                                                )}

                                                            </div>
                                                        ),
                                                    )}

                                                </div>

                                            )}

                                        </Card>

                                    </Col>
                                );
                            },
                        )}

                    </Row>
                )}

            </div>

        </div>
    );
}


export default SchoolsPage;