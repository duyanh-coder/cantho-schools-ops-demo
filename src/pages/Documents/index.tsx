import {
    ArrowLeftOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FileDoneOutlined,
    FileTextOutlined,
    FilterOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import {
    Badge,
    Button,
    Empty,
    Select,
} from "antd";

import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import MobileActionBar from "@/components/MobileActionBar";
import StatsCard from "@/components/dashboard/StatCard";

import {
    getCurrentRegionMockData,
} from "@/mock";

import type {
    DocumentItem,
} from "@/mock/common/types";

import "./style.scss";


type DocumentStatus = DocumentItem["status"];

type DocumentType = DocumentItem["type"];


const statusConfig: Record<
    DocumentStatus,
    {
        label: string;
        color: string;
    }
> = {
    new: {
        label: "Mới",
        color: "blue",
    },

    processing: {
        label: "Đang xử lý",
        color: "orange",
    },

    completed: {
        label: "Đã xử lý",
        color: "green",
    },
};


const documentTypeConfig: Record<
    DocumentType,
    string
> = {
    incoming: "Văn bản đến",

    outgoing: "Văn bản đi",

    internal: "Văn bản nội bộ",
};


const DocumentsPage = () => {
    const navigate = useNavigate();

    const {
        documents,
        campuses,
    } = getCurrentRegionMockData();

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<
        DocumentStatus | "all"
    >("all");


    const filteredDocuments =
        statusFilter === "all"
            ? documents
            : documents.filter(
                (document) =>
                    document.status === statusFilter,
            );


    const statistics = [
        {
            title: "Văn bản mới",

            value: documents.filter(
                (item) =>
                    item.status === "new",
            ).length,

            className:
                "documents-stat-card--new",

            icon: <FileTextOutlined />,
        },

        {
            title: "Đang xử lý",

            value: documents.filter(
                (item) =>
                    item.status === "processing",
            ).length,

            className:
                "documents-stat-card--processing",

            icon: <ClockCircleOutlined />,
        },

        {
            title: "Đã xử lý",

            value: documents.filter(
                (item) =>
                    item.status === "completed",
            ).length,

            className:
                "documents-stat-card--completed",

            icon: <FileDoneOutlined />,
        },

        {
            title: "Tổng văn bản",

            value: documents.length,

            className:
                "documents-stat-card--overdue",

            icon: <ExclamationCircleOutlined />,
        },
    ];


    const handleBack = () => {
        navigate(-1);
    };


    const handleCreate = () => {
        console.log(
            "Create document",
        );
    };


    return (
        <div className="documents-page">

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            E-OFFICE
                        </span>

                        <h2>Văn bản điện tử</h2>

                        <p>
                            Theo dõi, quản lý và xử lý công văn, văn bản, hồ sơ
                            và các thông tin điều hành.
                        </p>
                    </div>
                </header>
            </div>

            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Văn bản mới"
                    value={statistics[0].value}
                    icon={<FileTextOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Đang xử lý"
                    value={statistics[1].value}
                    icon={<ClockCircleOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Đã xử lý"
                    value={statistics[2].value}
                    icon={<FileDoneOutlined />}
                />

                <StatsCard
                    tone="purple"
                    title="Tổng văn bản"
                    value={statistics[3].value}
                    icon={<ExclamationCircleOutlined />}
                />
            </div>


            <section className="documents-panel">

                <div className="documents-panel__header">

                    <div>
                        <span className="documents-panel__eyebrow">
                            DANH SÁCH VĂN BẢN
                        </span>

                        <h2>
                            Văn bản gần đây
                        </h2>
                    </div>


                    <div className="documents-panel__actions">

                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="documents-panel__filter"
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
                                    value: "completed",
                                    label: "Đã xử lý",
                                },
                            ]}
                        />

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            className="documents-panel__create"
                        >
                            Tạo văn bản
                        </Button>

                    </div>

                </div>


                <div className="documents-list">

                    {filteredDocuments.length === 0 ? (

                        <Empty
                            description="Không có văn bản phù hợp"
                        />

                    ) : (

                        filteredDocuments.map(
                            (document) => {
                                const status =
                                    statusConfig[
                                        document.status
                                    ];

                                const campus =
                                    document.campusId
                                        ? campuses.find(
                                            (item) =>
                                                item.id ===
                                                document.campusId,
                                        )
                                        : undefined;

                                return (
                                    <article
                                        key={document.id}
                                        className="document-item"
                                    >

                                        <div className="document-item__icon">
                                            <FileTextOutlined />
                                        </div>


                                        <div className="document-item__main">

                                            <div className="document-item__top">

                                                <span className="document-item__code">
                                                    {document.code}
                                                </span>

                                                <Badge
                                                    color={status.color}
                                                    text={status.label}
                                                />

                                            </div>


                                            <h3>
                                                {document.title}
                                            </h3>


                                            <div className="document-item__meta">

                                                <span>
                                                    {
                                                        documentTypeConfig[
                                                            document.type
                                                        ]
                                                    }
                                                </span>


                                                {campus && (
                                                    <span>
                                                        {
                                                            campus.name
                                                        }
                                                    </span>
                                                )}


                                                <span>
                                                    {
                                                        document.issuedDate
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </article>
                                );
                            },
                        )

                    )}

                </div>

            </section>


            <MobileActionBar
                actions={[
                    {
                        key: "back",
                        label: "Quay lại",
                        icon: (
                            <ArrowLeftOutlined />
                        ),
                        onClick: handleBack,
                    },
                    {
                        key: "filter",
                        label: "Lọc",
                        icon: (
                            <FilterOutlined />
                        ),
                        onClick: () => {
                            setStatusFilter(
                                "all",
                            );
                        },
                    },
                    {
                        key: "create",
                        label: "Tạo mới",
                        icon: (
                            <PlusOutlined />
                        ),
                        primary: true,
                        onClick: handleCreate,
                    },
                ]}
            />

        </div>
    );
};


export default DocumentsPage;