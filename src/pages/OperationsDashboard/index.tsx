import {
    AlertOutlined,
    ApartmentOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    PlusOutlined,
    ReadOutlined,
    RobotOutlined,
    SafetyCertificateOutlined,
    SolutionOutlined,
    TeamOutlined,
    WarningOutlined,
} from "@ant-design/icons";

import type {
    ReactNode,
} from "react";

import {
    useState,
} from "react";

import {
    Button,
    Card,
    Empty,
    Tag,
} from "antd";

import {
    useNavigate,
} from "react-router-dom";

import {
    getCurrentRegionMockData,
} from "@/mock";

import type {
    TaskItem,
} from "@/mock/common/types";

import {
    ROLE_GUIDES,
} from "@/config/roles";

import {
    CATALOG_DEFS,
} from "@/config/catalogs";

import {
    getTaskHint,
    modulePathByHint,
} from "@/config/taskModules";

import StatsCard from "@/components/dashboard/StatCard";

import type {
    CrudFieldOption,
} from "@/components/dashboard/CrudManager";

import {
    readCrudItems,
} from "@/store/useCrud";

import {
    readCatalogOptions,
} from "@/store/useCatalog";

import "./style.scss";

interface ModuleSummary {
    title: string;

    path: string;

    tone: "blue" | "green" | "orange" | "purple";

    icon: ReactNode;

    catalog:
        | string
        | null;
}

const moduleSummaryDefs:
    ModuleSummary[] = [
        {
            title: "Nhân sự",
            path: "/operations/schools?tab=personnel",
            tone: "blue",
            icon: <TeamOutlined />,
            catalog: "personnel-status",
        },
        {
            title: "Khối & tổ",
            path: "/operations/schools?tab=sectors",
            tone: "green",
            icon: <ApartmentOutlined />,
            catalog: "sector-type",
        },
        {
            title: "Lớp học",
            path: "/operations/schools?tab=classes",
            tone: "purple",
            icon: <ReadOutlined />,
            catalog: "class-status",
        },
        {
            title: "Học sinh",
            path: "/operations/schools?tab=students",
            tone: "orange",
            icon: <SolutionOutlined />,
            catalog: "student-status",
        },
    ];

const statusConfig: Record<
    TaskItem["status"],
    {
        label: string;

        color: string;
    }
> = {
    todo: {
        label: "Chưa làm",
        color: "default",
    },
    in_progress: {
        label: "Đang làm",
        color: "processing",
    },
    completed: {
        label: "Hoàn thành",
        color: "success",
    },
};


const OperationsDashboard = () => {
    const navigate =
        useNavigate();

    const regionMock =
        getCurrentRegionMockData();

    const {
        alerts,
        campuses,
    } =
        regionMock;

    const tasks =
        readCrudItems(
            "can-tho-tasks",
            regionMock.tasks,
        );

    const catalogByKey =
        CATALOG_DEFS.reduce(
            (
                acc,
                catalog,
            ) => {
                acc[catalog.key] =
                    readCatalogOptions(
                        catalog,
                    );

                return acc;
            },
            {} as Record<string, CrudFieldOption[]>,
        );

    const [
        activeRole,
        setActiveRole,
    ] =
        useState(
            "manager",
        );

    const roleGuide =
        ROLE_GUIDES.find(
            (guide) =>
                guide.key ===
                activeRole,
        ) ?? ROLE_GUIDES[0];

    const pendingAlerts =
        alerts
            .filter(
                (alert) =>
                    alert.status !==
                        "resolved",
            )
            .sort(
                (a, b) => {
                    const rank:
                        Record<string, number> = {
                            danger: 0,
                            warning: 1,
                            info: 2,
                        };

                    return (
                        rank[a.level] -
                        rank[b.level]
                    );
                },
            )
            .slice(
                0,
                5,
            );

    const pendingTasks =
        tasks
            .filter(
                (task) =>
                    task.status !==
                    "completed",
            );

    const moduleCounts:
        Record<string, number> = {
            "/operations/schools?tab=personnel":
                readCrudItems(
                    "can-tho-personnel",
                    regionMock.personnel,
                ).length,
            "/operations/schools?tab=sectors":
                readCrudItems(
                    "can-tho-sectors",
                    regionMock.sectors,
                ).length,
            "/operations/schools?tab=classes":
                readCrudItems(
                    "can-tho-classes",
                    regionMock.classes,
                ).length,
            "/operations/schools?tab=students":
                readCrudItems(
                    "can-tho-students",
                    regionMock.students,
                ).length,
        };

const getTaskModuleHint = (
        task: TaskItem,
    ) => {
        return (
            getTaskHint(
                task.title,
            ) ?? {
                module: "cảnh báo",
                color: "red",
                iconKey: "alert",
            }
        );
    };

    const taskIconByKey:
        Record<string, ReactNode> = {
            timetable: <CalendarOutlined />,
            student: <ReadOutlined />,
            school: <SolutionOutlined />,
            personnel: <TeamOutlined />,
            document: <FileTextOutlined />,
            report: <BarChartOutlined />,
            alert: <WarningOutlined />,
            task: <CheckCircleOutlined />,
        };

    return (
        <div className="op-dashboard">
            <header className="page-head">
                <div className="page-head__inner">
                    <span className="page-head__eyebrow">
                        TRUNG TÂM ĐIỀU HÀNH
                    </span>

                    <h2>Trung tâm điều hành trường học</h2>

                    <p>
                        Mọi việc cần làm, thông báo và chức năng phù hợp
                        với vai trò của bạn đều ở đây.
                    </p>
                </div>
            </header>

            {/* ============ ROLE SELECTOR ============ */}
            <div className="op-dashboard__rolebar">
                <span className="op-dashboard__rolebar-label">
                    Bạn là ai?
                </span>

                <div className="op-dashboard__rolebar-tabs">
                    {ROLE_GUIDES.map(
                        (guide) => (
                            <Button
                                key={guide.key}
                                size="small"
                                type={
                                    activeRole ===
                                    guide.key
                                        ? "primary"
                                        : "default"
                                }
                                onClick={() =>
                                    setActiveRole(
                                        guide.key,
                                    )
                                }
                                className="op-dashboard__role-tab"
                            >
                                {guide.label}
                            </Button>
                        ),
                    )}
                </div>
            </div>

            {/* ============ KPI ============ */}
            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Cảnh báo chưa xử lý"
                    value={
                        alerts.filter(
                            (alert) =>
                                alert.status !==
                                "resolved",
                        ).length
                    }
                    icon={<WarningOutlined />}
                    note={`${pendingAlerts.length} việc ưu tiên`}
                />

                <StatsCard
                    tone="orange"
                    title="Việc cần làm"
                    value={
                        pendingTasks.length
                    }
                    icon={<ClockCircleOutlined />}
                    note="đang chờ xử lý"
                />

                <StatsCard
                    tone="green"
                    title="Danh mục dùng chung"
                    value={
                        CATALOG_DEFS.length
                    }
                    icon={<AppstoreOutlined />}
                    note="cấp dữ liệu cho các cột"
                />

                <StatsCard
                    tone="purple"
                    title="Trợ lý AI"
                    value="24/7"
                    icon={<RobotOutlined />}
                    note="sẵn sàng hỗ trợ"
                />
            </div>

            {/* ============ VAI TRÒ / GỢI Ý ============ */}
            <Card className="op-dashboard__role">
                <div className="op-dashboard__role-head">
                    <div className="op-dashboard__role-badge">
                        <SafetyCertificateOutlined />
                    </div>

                    <div>
                        <h3>
                            Chức năng phù hợp:{" "}
                            {roleGuide.label}
                        </h3>

                        <p>{roleGuide.description}</p>
                    </div>
                </div>

                <div className="op-dashboard__role-grid">
                    {roleGuide.features.map(
                        (feature) => (
                            <button
                                key={feature.key}
                                type="button"
                                className="op-dashboard__feature"
                                onClick={() => {
                                    navigate(
                                        feature.path,
                                    );

                                    window.scrollTo(
                                        {
                                            top: 0,
                                            behavior: "auto",
                                        },
                                    );
                                }}
                            >
                                <span className="op-dashboard__feature-icon">
                                    {
                                        {
                                            warning: <WarningOutlined />,
                                            report: <BarChartOutlined />,
                                            gis: <EnvironmentOutlined />,
                                            chatbot: <RobotOutlined />,
                                            task: <CheckCircleOutlined />,
                                            document: <FileTextOutlined />,
                                            personnel: <TeamOutlined />,
                                            school: <SolutionOutlined />,
                                            timetable: <CalendarOutlined />,
                                            student: <ReadOutlined />,
                                            sector: <ApartmentOutlined />,
                                            catalog: <AppstoreOutlined />,
                                        }[feature.iconKey]
                                    }
                                </span>

                                <span className="op-dashboard__feature-title">
                                    {feature.title}
                                </span>

                                <span className="op-dashboard__feature-flow">
                                    {feature.flow}
                                </span>
                            </button>
                        ),
                    )}
                </div>
            </Card>

            <div className="op-dashboard__cols">
                {/* ============ VIỆC CẦN LÀM ============ */}
                <Card
                    className="op-dashboard__card"
                    title="Việc cần làm"
                    extra={
                        <Button
                            type="link"
                            size="small"
                            onClick={() =>
                                navigate(
                                    "/operations/tasks",
                                )
                            }
                        >
                            Xem tất cả
                        </Button>
                    }
                >
                    {pendingTasks.length === 0 ? (
                        <Empty
                            description="Không còn việc đang chờ — thư thả nhé!"
                        />
                    ) : (
                        <div className="op-dashboard__tasklist">
                            {pendingTasks.map(
                                (task) => {
                                    const hint =
                                        getTaskModuleHint(
                                            task,
                                        );

                                    const path =
                                        modulePathByHint(
                                            hint,
                                        );

                                    return (
                                        <div
                                            key={task.id}
                                            className="op-dashboard__task"
                                        >
                                            <span
                                                className={
                                                    `op-dashboard__task-icon op-dashboard__task-icon--${hint.color}`
                                                }
                                            >
                                                {hint.iconKey
                                                    ? taskIconByKey[
                                                          hint.iconKey
                                                      ]
                                                    : <WarningOutlined />}
                                            </span>

                                            <div className="op-dashboard__task-body">
                                                <strong>
                                                    {task.title}
                                                </strong>

                                                <span>
                                                    {task.description}
                                                </span>

                                                <div className="op-dashboard__task-meta">
                                                    <Tag
                                                        color={
                                                            statusConfig[
                                                                task.status
                                                            ].color
                                                        }
                                                    >
                                                        {
                                                            statusConfig[
                                                                task.status
                                                            ].label
                                                        }
                                                    </Tag>

                                                    <span>
                                                        Hạn: {task.dueDate}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={() =>
                                                    navigate(
                                                        path,
                                                        {
                                                            replace: false,
                                                        },
                                                    )
                                                }
                                            >
                                                Đi làm ngay
                                            </Button>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    )}
                </Card>

                {/* ============ DANH SÁCH MODULE ============ */}
                <Card
                    className="op-dashboard__card"
                    title="Các bảng dữ liệu người dùng cập nhật"
                >
                    <div className="op-dashboard__modgrid">
                        {moduleSummaryDefs.map(
                            (moduleItem) => {
                                const catalogOptions =
                                    catalogByKey[
                                        moduleItem.catalog ??
                                            ""
                                    ];

                                return (
                                    <button
                                        key={moduleItem.path}
                                        type="button"
                                        className="op-dashboard__mod"
                                        onClick={() =>
                                            navigate(
                                                moduleItem.path,
                                            )
                                        }
                                    >
                                        <div>
                                            <span
                                                className={
                                                    `op-dashboard__mod-icon op-dashboard__mod-icon--${moduleItem.tone}`
                                                }
                                            >
                                                {moduleItem.icon}
                                            </span>

                                            <div>
                                                <strong>
                                                    {
                                                        moduleItem.title
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        moduleCounts[
                                                            moduleItem.path
                                                        ]
                                                    }{" "}
                                                    bản ghi
                                                </span>
                                            </div>
                                        </div>

                                        <div className="op-dashboard__mod-foot">
                                            <Button
                                                size="small"
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={(event) => {
                                                    event.stopPropagation();

                                                    navigate(
                                                        moduleItem.path,
                                                    );
                                                }}
                                            >
                                                Thêm mới
                                            </Button>

                                            {catalogOptions &&
                                                catalogOptions.length >
                                                    0 && (
                                                <span className="op-dashboard__mod-catalog">
                                                    {catalogOptions
                                                        .slice(
                                                            0,
                                                            2,
                                                        )
                                                        .map(
                                                            (option) =>
                                                                option.label,
                                                        )
                                                        .join(" · ")}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </Card>
            </div>

            {/* ============ THÔNG BÁO ============ */}
            <Card
                className="op-dashboard__alerts"
                title="Thông báo cần thiết"
                extra={
                    <Button
                        type="link"
                        size="small"
                        onClick={() =>
                            navigate(
                                "/operations/alerts",
                            )
                        }
                    >
                        Tất cả cảnh báo
                    </Button>
                }
            >
                {pendingAlerts.length === 0 ? (
                    <Empty description="Không có thông báo nào" />
                ) : (
                    <div className="op-dashboard__alertlist">
                        {pendingAlerts.map(
                            (alert) => {
                                const campus =
                                    campuses.find(
                                        (item) =>
                                            item.id ===
                                            alert.campusId,
                                    );

                                return (
                                    <div
                                        key={alert.id}
                                        className={
                                            `op-dashboard__alert op-dashboard__alert--${alert.level}`
                                        }
                                        onClick={() =>
                                            navigate(
                                                "/operations/alerts",
                                            )
                                        }
                                    >
                                        <span className="op-dashboard__alert-icon">
                                            {alert.level ===
                                            "danger" ? (
                                                <AlertOutlined />
                                            ) : alert.level ===
                                              "warning" ? (
                                                <WarningOutlined />
                                            ) : (
                                                <AlertOutlined />
                                            )}
                                        </span>

                                        <div>
                                            <strong>
                                                {alert.title}
                                            </strong>

                                            <span>
                                                {campus?.name ??
                                                    ""}{" "}
                                                · {alert.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                )}
            </Card>

            {/* ============ DANH MỤC ============ */}
            <Card
                className="op-dashboard__card"
                title="Danh mục dùng chung"
                extra={
                    <Button
                        type="link"
                        size="small"
                        onClick={() =>
                            navigate(
                                "/operations/catalogs",
                            )
                        }
                    >
                        Quản lý danh mục
                    </Button>
                }
            >
                <div className="op-dashboard__cats">
                    {CATALOG_DEFS.map(
                        (catalog) => {
                            const options =
                                catalogByKey[
                                    catalog.key
                                ];

                            return (
                                <button
                                    key={catalog.key}
                                    type="button"
                                    className="op-dashboard__cat"
                                    onClick={() =>
                                        navigate(
                                            "/operations/catalogs",
                                        )
                                    }
                                >
                                    <span>
                                        <AppstoreOutlined />
                                    </span>

                                    <strong>
                                        {catalog.title}
                                    </strong>

                                    <em>
                                        {options?.length ?? 0} mục
                                    </em>
                                </button>
                            );
                        },
                    )}
                </div>
            </Card>

            {/* ============ CHỨC NĂNG KHÁC ============ */}
            <Card
                className="op-dashboard__card"
                title="Các chức năng khác"
            >
                <div className="op-dashboard__other">
                    {[
                        {
                            title: "Bản đồ GIS",
                            path: "/operations/gis",
                            icon: (
                                <EnvironmentOutlined />
                            ),
                        },
                        {
                            title: "Báo cáo",
                            path: "/operations/reports",
                            icon: (
                                <BarChartOutlined />
                            ),
                        },
                        {
                            title: "Cảnh báo",
                            path: "/operations/alerts",
                            icon: (
                                <WarningOutlined />
                            ),
                        },
                        {
                            title: "Trợ lý AI",
                            path: "/operations/chatbot",
                            icon: (
                                <RobotOutlined />
                            ),
                        },
                    ].map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className="op-dashboard__other-item"
                            onClick={() =>
                                navigate(
                                    item.path,
                                )
                            }
                        >
                            {item.icon}

                            <span>{item.title}</span>
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};


export default OperationsDashboard;