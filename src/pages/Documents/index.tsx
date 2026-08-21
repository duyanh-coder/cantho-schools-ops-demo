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
    Col,
    Empty,
    Row,
    Select,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import MobileActionBar from "@/components/MobileActionBar";
import OperationPageHeader from "@/components/OperationPageHeader";

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


    const filteredDocuments = useMemo(() => {
        if (statusFilter === "all") {
            return documents;
        }

        return documents.filter(
            (document) =>
                document.status === statusFilter,
        );
    }, [
        documents,
        statusFilter,
    ]);


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

            <OperationPageHeader
                eyebrow="E-OFFICE"
                title="Văn bản điện tử"
                description="Theo dõi, quản lý và xử lý công văn, văn bản, hồ sơ và các thông tin điều hành."
                icon={<FileTextOutlined />}
            />


            <Row
                gutter={[20, 20]}
                className="documents-page__statistics"
            >
                {statistics.map((item) => (
                    <Col
                        key={item.title}
                        xs={24}
                        sm={12}
                        lg={6}
                    >
                        <div
                            className={[
                                "documents-stat-card",
                                item.className,
                            ].join(" ")}
                        >
                            <div className="documents-stat-card__icon">
                                {item.icon}
                            </div>

                            <div className="documents-stat-card__content">
                                <span>
                                    {item.title}
                                </span>

                                <strong>
                                    {item.value}
                                </strong>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>


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