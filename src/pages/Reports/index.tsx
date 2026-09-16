import {
    BarChartOutlined,
    CalendarOutlined,
    FileTextOutlined,
    FilterOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import {
    Card,
    Empty,
    Input,
    Select,
    Table,
    Tag,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useState,
} from "react";

import {
    getCurrentRegionMockData,
} from "@/mock";

import type {
    ReportItem,
} from "@/mock/common/types";

import StatsCard from "@/components/dashboard/StatCard";

import "./style.scss";


function ReportsPage() {
    const {
        reports,
        campuses,
    } = getCurrentRegionMockData();


    const [
        keyword,
        setKeyword,
    ] = useState("");


    const [
        typeFilter,
        setTypeFilter,
    ] = useState("all");


    const [
        campusFilter,
        setCampusFilter,
    ] = useState("all");


    /* ========================================
       REPORT TYPES
    ======================================== */

    const reportTypes = [
        ...new Set(
            reports.map(
                (report) =>
                    report.type,
            ),
        ),
    ];


    /* ========================================
       FILTERED REPORTS
    ======================================== */

    const normalizedKeyword =
        keyword
            .trim()
            .toLowerCase();


    const filteredReports =
        reports.filter(
            (report) => {
                const matchKeyword =
                    !normalizedKeyword ||
                    report.title
                        .toLowerCase()
                        .includes(
                            normalizedKeyword,
                        );


                const matchType =
                    typeFilter === "all" ||
                    report.type ===
                    typeFilter;


                const matchCampus =
                    campusFilter === "all" ||
                    report.campusId ===
                    campusFilter;


                return (
                    matchKeyword &&
                    matchType &&
                    matchCampus
                );
            },
        );


    /* ========================================
       STATISTICS
    ======================================== */

    const campusReportCount =
        new Set(
            reports
                .map(
                    (report) =>
                        report.campusId,
                )
                .filter(
                    Boolean,
                ),
        ).size;


    /* ========================================
       TABLE COLUMNS
    ======================================== */

    const columns: ColumnsType<ReportItem> = [
        {
            title: "Báo cáo",

            dataIndex: "title",

            key: "title",

            render: (
                value: string,
            ) => (
                <div className="reports-title">

                    <div className="reports-title__icon">

                        <FileTextOutlined />

                    </div>


                    <strong>
                        {value}
                    </strong>

                </div>
            ),
        },

        {
            title: "Loại báo cáo",

            dataIndex: "type",

            key: "type",

            width: 180,

            render: (
                value: string,
            ) => (
                <Tag color="blue">
                    {value}
                </Tag>
            ),
        },

        {
            title: "Cơ sở",

            dataIndex: "campusId",

            key: "campusId",

            width: 240,

            render: (
                campusId?: string,
            ) => {
                if (!campusId) {
                    return (
                        <span>
                            Toàn địa bàn
                        </span>
                    );
                }


                const campus =
                    campuses.find(
                        (item) =>
                            item.id ===
                            campusId,
                    );


                return (
                    <span>
                        {
                            campus?.name ??
                            "-"
                        }
                    </span>
                );
            },
        },

        {
            title: "Ngày tạo",

            dataIndex: "createdAt",

            key: "createdAt",

            width: 150,

            render: (
                value: string,
            ) => (
                <span className="reports-date">

                    <CalendarOutlined />

                    {value}

                </span>
            ),
        },
    ];


    return (
        <div className="reports-page">

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            REPORTS
                        </span>

                        <h2>Báo cáo</h2>

                        <p>
                            Theo dõi và khai thác các báo cáo phục vụ công tác
                            quản lý, điều hành.
                        </p>
                    </div>
                </header>
            </div>

            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Tổng số báo cáo"
                    value={reports.length}
                    icon={<FileTextOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Loại báo cáo"
                    value={reportTypes.length}
                    icon={<FilterOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Cơ sở có báo cáo"
                    value={campusReportCount}
                    note="Cơ sở phát sinh báo cáo"
                    icon={<BarChartOutlined />}
                />
            </div>


            {/* ========================================
               CONTENT
            ======================================== */}

            <Card className="reports-card">


                {/* FILTER */}

                <div className="reports-toolbar">

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
                        placeholder="Tìm kiếm báo cáo"
                        prefix={
                            <SearchOutlined />
                        }
                        className="reports-toolbar__search"
                    />


                    <Select
                        value={
                            typeFilter
                        }
                        onChange={
                            setTypeFilter
                        }
                        className="reports-toolbar__select"
                        options={[
                            {
                                value: "all",

                                label:
                                    "Tất cả loại báo cáo",
                            },

                            ...reportTypes.map(
                                (type) => ({
                                    value:
                                        type,

                                    label:
                                        type,
                                }),
                            ),
                        ]}
                    />


                    <Select
                        value={
                            campusFilter
                        }
                        onChange={
                            setCampusFilter
                        }
                        className="reports-toolbar__select"
                        options={[
                            {
                                value: "all",

                                label:
                                    "Tất cả cơ sở",
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


                {/* TABLE */}

                <Table<ReportItem>
                    rowKey="id"
                    columns={
                        columns
                    }
                    dataSource={
                        filteredReports
                    }
                    pagination={{
                        pageSize: 10,

                        showSizeChanger: false,
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="Không tìm thấy báo cáo"
                            />
                        ),
                    }}
                    className="reports-table"
                />

            </Card>

        </div>
    );
}


export default ReportsPage;