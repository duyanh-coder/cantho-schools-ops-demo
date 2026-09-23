import {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    RightOutlined,
} from "@ant-design/icons";

import {
    Button,
    Card,
    Empty,
    Radio,
    Tag,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    canThoTasks,
} from "@/mock/canTho/tasks";

import {
    getCurrentRegionMockData,
} from "@/mock";

import {
    getTaskHint,
    modulePathByHint,
} from "@/config/taskModules";

import {
    useCrud,
} from "@/store/useCrud";

import "./style.scss";

const taskStatusConfig:
    Record<
        "todo" | "in_progress" | "completed",
        {
            label: string;

            color: string;
        }
    > = {
        todo: {
            label: "Chưa bắt đầu",
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

const flowConfig:
    Record<
        "todo" | "in_progress" | "completed",
        string
    > = {
        todo: "Chưa bắt đầu",
        in_progress: "Đang thực hiện",
        completed: "Đã hoàn thành",
    };

const TasksPage = () => {
    const navigate =
        useNavigate();

    const [
        filter,
        setFilter,
    ] =
        useState<
            "all" | "todo" | "in_progress" | "completed"
        >(
            "all",
        );

    const regionMock =
        getCurrentRegionMockData();

    const campusByTitle:
        Record<
            string,
            string
        > =
        regionMock.campuses.reduce(
            (
                acc,
                campus,
            ) => {
                acc[campus.id] =
                    campus.name;

                return acc;
            },
            {} as Record<string, string>,
        );

    const staffByTitle:
        Record<
            string,
            string
        > =
        regionMock.users.reduce(
            (
                acc,
                user,
            ) => {
                acc[user.id] =
                    user.fullName;

                return acc;
            },
            {} as Record<string, string>,
        );

    const {
        items,
        update,
    } =
        useCrud(
            "can-tho-tasks",
            canThoTasks,
        );

    const filteredTasks =
        useMemo(
            () => {
                if (
                    filter === "all"
                ) {
                    return items;
                }

                return items.filter(
                    (task) =>
                        task.status ===
                        filter,
                );
            },
            [
                items,
                filter,
            ],
        );

    const counts =
        useMemo(
            () => {
                const total =
                    items.length;

                const todo =
                    items.filter(
                        (task) =>
                            task.status ===
                            "todo",
                    ).length;

                const inProgress =
                    items.filter(
                        (task) =>
                            task.status ===
                            "in_progress",
                    ).length;

                const completed =
                    items.filter(
                        (task) =>
                            task.status ===
                            "completed",
                    ).length;

                return {
                    total,
                    todo,
                    inProgress,
                    completed,
                };
            },
            [items],
        );

    return (
        <div className="tasks-page">
            <header className="page-head">
                <div className="page-head__inner">
                    <span className="page-head__eyebrow">
                        DANH SÁCH CÔNG VIỆC
                    </span>

                    <h2>Công việc cần làm</h2>

                    <p>
                        Chọn trạng thái của từng việc. Bấm “Đi làm ngay”
                        để mở đúng chức năng cần thực hiện.
                    </p>
                </div>
            </header>

            <Radio.Group
                value={filter}
                onChange={(event) =>
                    setFilter(
                        event.target.value,
                    )
                }
                optionType="button"
                buttonStyle="solid"
            >
                <Radio.Button value="all">
                    Tất cả ({counts.total})
                </Radio.Button>

                <Radio.Button value="todo">
                    Chưa bắt đầu ({counts.todo})
                </Radio.Button>

                <Radio.Button value="in_progress">
                    Đang làm ({counts.inProgress})
                </Radio.Button>

                <Radio.Button value="completed">
                    Hoàn thành ({counts.completed})
                </Radio.Button>
            </Radio.Group>

            <div className="tasks-page__list">
                {filteredTasks.length ===
                0 ? (
                    <Card>
                        <Empty
                            description="Không có công việc nào ở trạng thái này."
                        />
                    </Card>
                ) : (
                    filteredTasks.map(
                        (task) => {
                            const hint =
                                getTaskHint(
                                    task.title,
                                );

                            const path =
                                modulePathByHint(
                                    hint,
                                );

                            const status =
                                taskStatusConfig[
                                    task.status
                                ];

                            return (
                                <Card
                                    key={task.id}
                                    className="tasks-page__item"
                                >
                                    <div className="tasks-page__item-body">
                                        <div className="tasks-page__item-head">
                                            <strong>
                                                {task.title}
                                            </strong>

                                            <Tag
                                                color={
                                                    status.color
                                                }
                                            >
                                                {
                                                    status.label
                                                }
                                            </Tag>
                                        </div>

                                        {task.description && (
                                            <p>
                                                {
                                                    task.description
                                                }
                                            </p>
                                        )}

                                        <div className="tasks-page__item-meta">
                                            {task.dueDate && (
                                                <span>
                                                    <CalendarOutlined />
                                                    Hạn: {task.dueDate}
                                                </span>
                                            )}

                                            {task.campusId && (
                                                <span>
                                                    {
                                                        campusByTitle[
                                                            task.campusId
                                                        ]
                                                    }
                                                </span>
                                            )}

                                            {task.assigneeId && (
                                                <span>
                                                    Người phụ trách:{" "}
                                                    {
                                                        staffByTitle[
                                                            task.assigneeId
                                                        ]
                                                    }
                                                </span>
                                            )}

                                            <Tag
                                                color={
                                                    hint.color
                                                }
                                            >
                                                {hint.module}
                                            </Tag>
                                        </div>
                                    </div>

                                    <div className="tasks-page__item-actions">
                                        <Button
                                            type="primary"
                                            icon={
                                                <RightOutlined />
                                            }
                                            onClick={() =>
                                                navigate(
                                                    path,
                                                )
                                            }
                                        >
                                            Đi làm ngay
                                        </Button>

                                        <div className="tasks-page__status-actions">
                                            {(
                                                [
                                                    "todo",
                                                    "in_progress",
                                                    "completed",
                                                ] as const
                                            ).map(
                                                (statusKey) => {
                                                    const option =
                                                        taskStatusConfig[
                                                            statusKey
                                                        ];

                                                    const done =
                                                        task.status ===
                                                        statusKey;

                                                    return (
                                                        <Button
                                                            key={statusKey}
                                                            size="small"
                                                            type={
                                                                done
                                                                    ? "primary"
                                                                    : "default"
                                                            }
                                                            icon={
                                                                statusKey ===
                                                                "completed"
                                                                    ? (
                                                                        <CheckCircleOutlined />
                                                                    )
                                                                    : (
                                                                        <ClockCircleOutlined />
                                                                    )
                                                            }
                                                            onClick={() =>
                                                                update(
                                                                    {
                                                                        ...task,
                                                                        status:
                                                                            statusKey,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </Button>
                                                    );
                                                },
                                            )}
                                        </div>

                                        <p className="tasks-page__flow">
                                            Dòng chảy: {flowConfig[task.status]}
                                        </p>
                                    </div>
                                </Card>
                            );
                        },
                    )
                )}
            </div>
        </div>
    );
};


export default TasksPage;