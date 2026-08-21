import {
    // CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    WarningOutlined,
} from "@ant-design/icons";

import {
    Card,
    Col,
    Empty,
    Input,
    Row,
    Select,
    Statistic,
    Tag,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import {
    getCurrentRegionMockData,
} from "@/mock";

import type {
    AlertItem,
} from "@/mock/common/types";

import OperationPageHeader
    from "@/components/OperationPageHeader";

import "./style.scss";


const getLevelConfig = (
    level: AlertItem["level"],
) => {
    switch (level) {
        case "danger":
            return {
                label: "Nguy hiểm",
                color: "error",
                icon: <ExclamationCircleOutlined />,
            };

        case "warning":
            return {
                label: "Cảnh báo",
                color: "warning",
                icon: <WarningOutlined />,
            };

        case "info":
        default:
            return {
                label: "Thông tin",
                color: "processing",
                icon: <InfoCircleOutlined />,
            };
    }
};


const getStatusConfig = (
    status: AlertItem["status"],
) => {
    switch (status) {
        case "resolved":
            return {
                label: "Đã xử lý",
                color: "success",
            };

        case "processing":
            return {
                label: "Đang xử lý",
                color: "processing",
            };

        case "new":
        default:
            return {
                label: "Mới",
                color: "default",
            };
    }
};


function AlertsPage() {
    const {
        alerts,
        campuses,
    } = getCurrentRegionMockData();


    const [
        keyword,
        setKeyword,
    ] = useState("");


    const [
        levelFilter,
        setLevelFilter,
    ] = useState("all");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    const [
        campusFilter,
        setCampusFilter,
    ] = useState("all");


    /* ========================================
       FILTER
    ======================================== */

    const filteredAlerts = useMemo(() => {
        const normalizedKeyword =
            keyword
                .trim()
                .toLowerCase();


        return alerts.filter(
            (alert) => {
                const matchKeyword =
                    !normalizedKeyword ||
                    alert.title
                        .toLowerCase()
                        .includes(
                            normalizedKeyword,
                        ) ||
                    alert.description
                        .toLowerCase()
                        .includes(
                            normalizedKeyword,
                        );


                const matchLevel =
                    levelFilter === "all" ||
                    alert.level ===
                    levelFilter;


                const matchStatus =
                    statusFilter === "all" ||
                    alert.status ===
                    statusFilter;


                const matchCampus =
                    campusFilter === "all" ||
                    alert.campusId ===
                    campusFilter;


                return (
                    matchKeyword &&
                    matchLevel &&
                    matchStatus &&
                    matchCampus
                );
            },
        );
    }, [
        alerts,
        keyword,
        levelFilter,
        statusFilter,
        campusFilter,
    ]);


    /* ========================================
       STATISTICS
    ======================================== */

    const dangerCount =
        alerts.filter(
            (alert) =>
                alert.level ===
                "danger",
        ).length;


    const processingCount =
        alerts.filter(
            (alert) =>
                alert.status ===
                "processing",
        ).length;


    const newCount =
        alerts.filter(
            (alert) =>
                alert.status ===
                "new",
        ).length;


    return (
        <div className="alerts-page">

            <OperationPageHeader
                eyebrow="ALERTS"
                title="Cảnh báo"
                description="Theo dõi các cảnh báo và tình trạng xử lý trong hệ thống."
                icon={
                    <WarningOutlined />
                }
            />


            {/* ========================================
                STATISTICS
            ======================================== */}

            <Row
                gutter={[
                    16,
                    16,
                ]}
                className="alerts-page__statistics"
            >

                <Col
                    xs={24}
                    sm={12}
                    lg={6}
                >

                    <Card className="alerts-stat-card">

                        <Statistic
                            title="Tổng cảnh báo"
                            value={
                                alerts.length
                            }
                            prefix={
                                <WarningOutlined />
                            }
                        />

                    </Card>

                </Col>


                <Col
                    xs={24}
                    sm={12}
                    lg={6}
                >

                    <Card className="alerts-stat-card">

                        <Statistic
                            title="Mức nguy hiểm"
                            value={
                                dangerCount
                            }
                            prefix={
                                <ExclamationCircleOutlined />
                            }
                        />

                    </Card>

                </Col>


                <Col
                    xs={24}
                    sm={12}
                    lg={6}
                >

                    <Card className="alerts-stat-card">

                        <Statistic
                            title="Cần xử lý"
                            value={
                                processingCount
                            }
                            prefix={
                                <ClockCircleOutlined />
                            }
                        />

                    </Card>

                </Col>


                <Col
                    xs={24}
                    sm={12}
                    lg={6}
                >

                    <Card className="alerts-stat-card">

                        <Statistic
                            title="Cảnh báo mới"
                            value={
                                newCount
                            }
                            prefix={
                                <InfoCircleOutlined />
                            }
                        />

                    </Card>

                </Col>

            </Row>


            {/* ========================================
                FILTER
            ======================================== */}

            <Card className="alerts-filter-card">

                <div className="alerts-toolbar">

                    <Input
                        allowClear
                        value={
                            keyword
                        }
                        onChange={
                            (event) => {
                                setKeyword(
                                    event.target.value,
                                );
                            }
                        }
                        placeholder="Tìm kiếm cảnh báo"
                        prefix={
                            <SearchOutlined />
                        }
                        className="alerts-toolbar__search"
                    />


                    <Select
                        value={
                            levelFilter
                        }
                        onChange={
                            setLevelFilter
                        }
                        className="alerts-toolbar__select"
                        options={[
                            {
                                value: "all",
                                label: "Tất cả mức độ",
                            },
                            {
                                value: "danger",
                                label: "Nguy hiểm",
                            },
                            {
                                value: "warning",
                                label: "Cảnh báo",
                            },
                            {
                                value: "info",
                                label: "Thông tin",
                            },
                        ]}
                    />


                    <Select
                        value={
                            statusFilter
                        }
                        onChange={
                            setStatusFilter
                        }
                        className="alerts-toolbar__select"
                        options={[
                            {
                                value: "all",
                                label: "Tất cả trạng thái",
                            },
                            {
                                value: "new",
                                label: "Mới",
                            },
                            {
                                value: "processing",
                                label: "Đang xử lý",
                            },
                            {
                                value: "resolved",
                                label: "Đã xử lý",
                            },
                        ]}
                    />


                    <Select
                        value={
                            campusFilter
                        }
                        onChange={
                            setCampusFilter
                        }
                        className="alerts-toolbar__select"
                        options={[
                            {
                                value: "all",
                                label: "Tất cả cơ sở",
                            },

                            ...campuses.map(
                                (campus) => ({
                                    value:
                                        campus.id,

                                    label:
                                        campus.name,
                                }),
                            ),
                        ]}
                    />

                </div>

            </Card>


            {/* ========================================
                ALERT LIST
            ======================================== */}

            <div className="alerts-list">

                {
                    filteredAlerts.length === 0
                        ? (
                            <Card>

                                <Empty
                                    description="Không tìm thấy cảnh báo"
                                />

                            </Card>
                        )
                        : filteredAlerts.map(
                            (alert) => {
                                const levelConfig =
                                    getLevelConfig(
                                        alert.level,
                                    );


                                const statusConfig =
                                    getStatusConfig(
                                        alert.status,
                                    );


                                const campus =
                                    campuses.find(
                                        (item) =>
                                            item.id ===
                                            alert.campusId,
                                    );


                                return (
                                    <Card
                                        key={
                                            alert.id
                                        }
                                        className={
                                            `alert-item alert-item--${alert.level}`
                                        }
                                    >

                                        <div className="alert-item__header">

                                            <div className="alert-item__title">

                                                <div
                                                    className={
                                                        `alert-item__icon alert-item__icon--${alert.level}`
                                                    }
                                                >
                                                    {
                                                        levelConfig.icon
                                                    }
                                                </div>


                                                <div>

                                                    <h3>
                                                        {
                                                            alert.title
                                                        }
                                                    </h3>


                                                    <div className="alert-item__meta">

                                                        <Tag
                                                            color={
                                                                levelConfig.color
                                                            }
                                                        >
                                                            {
                                                                levelConfig.label
                                                            }
                                                        </Tag>


                                                        <Tag
                                                            color={
                                                                statusConfig.color
                                                            }
                                                        >
                                                            {
                                                                statusConfig.label
                                                            }
                                                        </Tag>

                                                    </div>

                                                </div>

                                            </div>


                                            <span className="alert-item__time">

                                                <ClockCircleOutlined />

                                                {
                                                    alert.createdAt
                                                }

                                            </span>

                                        </div>


                                        <p className="alert-item__description">

                                            {
                                                alert.description
                                            }

                                        </p>


                                        <div className="alert-item__footer">

                                            <span>

                                                <FilterOutlined />

                                                {
                                                    campus?.name ??
                                                    "-"
                                                }

                                            </span>


                                            <span>

                                                ID:
                                                {" "}
                                                {
                                                    alert.id
                                                }

                                            </span>

                                        </div>

                                    </Card>
                                );
                            },
                        )
                }

            </div>

        </div>
    );
}


export default AlertsPage;