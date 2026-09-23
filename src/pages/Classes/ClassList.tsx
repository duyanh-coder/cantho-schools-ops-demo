import {
    ApartmentOutlined,
    BookOutlined,
    EditOutlined,
    EyeOutlined,
    HistoryOutlined,
    MoreOutlined,
    PlusOutlined,
    ReadOutlined,
    ReloadOutlined,
    SearchOutlined,
    SwapOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Avatar,
    Button,
    Divider,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    message,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import {
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import type {
    Campus,
    ClassType,
    Personnel,
    SchoolClass,
} from "@/mock/common/types";

import {
    useAcademicYears,
} from "@/store/useAcademicYears";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import {
    useCampuses,
    CAMPUS_LEGACY_ID_MAP,
} from "@/store/useCampuses";

import {
    useClassHistory,
} from "@/store/useClassHistory";

import {
    useClasses,
} from "@/store/useClasses";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    useRooms,
} from "@/store/useRooms";

import "./style.scss";


const SCHOOL_ID = "can-tho-school-001";

const CURRENT_ACADEMIC_YEAR = "2026-2027";

const initials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const campusName = (
    campusesById: Map<string, Campus>,
    campusId: string,
): string => {
    const normalized = CAMPUS_LEGACY_ID_MAP[campusId] ?? campusId;

    return campusesById.get(normalized)?.name
        ?? campusId;
};

const nowIso = (): string => {
    return new Date().toISOString();
};

const avatarFor = (
    personnel: Personnel,
): ReactNode => (
    <Avatar
        size={28}
        style={{
            backgroundColor: personnel.gender === "female" ? "#eb2f96" : "#1677ff",
            flexShrink: 0,
        }}
    >
        {initials(personnel.fullName)}
    </Avatar>
);

const ClassList = ({
    compact = false,
    schoolId = SCHOOL_ID,
}: {
    compact?: boolean;

    schoolId?: string;
}) => {
    const navigate = useNavigate();

    const location = useLocation();

    const classesApi = useClasses(schoolId);

    const campusesApi = useCampuses(schoolId);

    const yearsApi = useAcademicYears(schoolId);

    const personnelApi = usePersonnel();

    const roomsApi = useRooms();

    const historyApi = useClassHistory();

    const classTypeOptions = useCatalogOptions("class-type");

    const classStatusOptions = useCatalogOptions("class-status");

    const gradeOptions = useCatalogOptions("grade");

    const [searchParams] = useSearchParams();

    const items = classesApi.bySchool;

    const campuses = campusesApi.bySchool;

    const campusesById = campusesApi.byId;

    const years = yearsApi.items;

    const readDeepParam = (
        key: string,
    ): string | undefined => {
        const raw = searchParams.get(key);

        return raw && raw.length > 0 ? raw : undefined;
    };

    const [academicYear, setAcademicYear] =
        useState<string>(() =>
            readDeepParam("academicYear") ?? CURRENT_ACADEMIC_YEAR);

    const [campusFilter, setCampusFilter] =
        useState<string | undefined>(() => readDeepParam("campusId"));

    const [gradeFilter, setGradeFilter] =
        useState<string | undefined>(() => readDeepParam("grade"));

    const [classTypeFilter, setClassTypeFilter] =
        useState<string | undefined>(() => readDeepParam("classType"));

    const [statusFilter, setStatusFilter] =
        useState<string | undefined>(() => readDeepParam("status"));

    const [gvcnFilter, setGvcnFilter] =
        useState<string | undefined>(() => readDeepParam("gvcn"));

    const [keyword, setKeyword] = useState("");

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<SchoolClass | null>(null);

    const [statusClass, setStatusClass] = useState<SchoolClass | null>(null);

    const [form] = Form.useForm<Record<string, unknown>>();

    const campusOptions = useMemo(
        () => campuses.map((campus) => ({
            value: campus.id,
            label: campus.name,
        })),
        [campuses],
    );

    const yearOptions = useMemo(
        () => years.map((year) => ({
            value: year.id,
            label: year.name,
        })),
        [years],
    );

    const gradeOptionsForSchool = useMemo(
        () => {
            const grades = new Set<number>(
                items.map((item) => item.grade),
            );

            return gradeOptions.filter((option) =>
                grades.has(Number(option.value)));
        },
        [items, gradeOptions],
    );

    const personnelOptions = useMemo(
        () => personnelApi.items
            .filter((item) => item.schoolId === schoolId)
            .map((item) => ({
                value: item.id,
                label: `${item.fullName} (${item.code})`,
            })),
        [personnelApi.items, schoolId],
    );

    const gvcnOptions = useMemo(() => {
        const ids = new Set<string>(
            items
                .map((item) => item.homeroomTeacherId)
                .filter((id): id is string => Boolean(id)),
        );

        return personnelOptions.filter((option) =>
            ids.has(String(option.value)));
    }, [items, personnelOptions]);

    const roomOptions = useMemo(
        () => roomsApi.items.map((room) => ({
            value: room.id,
            label: `${room.code} – ${room.category === "classroom" ? "Phòng học" : "Phòng chức năng"} (sức chứa ${room.capacity})`,
        })),
        [roomsApi.items],
    );

    const studentCountByClassId = useMemo(
        () => {
            const map = new Map<string, number>();

            for (const student of canThoMockData.students) {
                if (!student.classId || student.status !== "studying") {
                    continue;
                }

                map.set(
                    student.classId,
                    (map.get(student.classId) ?? 0) + 1,
                );
            }

            return map;
        },
        [],
    );

    const syncParam = (
        key: string,
        value: string | undefined,
    ) => {
        const params = new URLSearchParams(searchParams);

        if (value && value.length > 0) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return items.filter((item) => {
            if (item.academicYear !== academicYear) {
                return false;
            }

            if (campusFilter && item.campusId !== campusFilter) {
                return false;
            }

            if (gradeFilter && String(item.grade) !== gradeFilter) {
                return false;
            }

            if (classTypeFilter && item.classType !== classTypeFilter) {
                return false;
            }

            if (statusFilter && item.status !== statusFilter) {
                return false;
            }

            if (
                gvcnFilter &&
                item.homeroomTeacherId !== gvcnFilter
            ) {
                return false;
            }

            if (kw) {
                const haystack = [
                    item.code,
                    item.name,
                    `Khối ${item.grade}`,
                    item.academicYear,
                    campusName(campusesById, item.campusId),
                ].join(" ").toLowerCase();

                if (!haystack.includes(kw)) {
                    return false;
                }
            }

            return true;
        });
    }, [
        items,
        campusesById,
        keyword,
        academicYear,
        campusFilter,
        gradeFilter,
        classTypeFilter,
        statusFilter,
        gvcnFilter,
    ]);

    const kpis = useMemo(() => {
        const total = filtered.length;

        const studentTotal = filtered.reduce(
            (sum, item) => sum + (studentCountByClassId.get(item.id) ?? 0),
            0,
        );

        const avgSize = total > 0
            ? Math.round(studentTotal / total)
            : 0;

        const activeClasses = filtered.filter(
            (item) => item.status === "active",
        ).length;

        const withGvcn = filtered.filter(
            (item) => Boolean(item.homeroomTeacherId),
        ).length;

        const activeGrades = new Set(
            filtered.map((item) => item.grade),
        ).size;

        return [
            {
                title: "Tổng lớp",
                value: total,
                icon: <ReadOutlined />,
                tone: "blue" as const,
                note: "lớp trong bộ lọc",
            },
            {
                title: "Học sinh",
                value: studentTotal,
                icon: <TeamOutlined />,
                tone: "green" as const,
                note: "đang theo học",
            },
            {
                title: "Sĩ số bình quân",
                value: avgSize,
                icon: <UserOutlined />,
                tone: "purple" as const,
                note: "học sinh / lớp",
            },
            {
                title: "Lớp đang hoạt động",
                value: activeClasses,
                icon: <BookOutlined />,
                tone: "orange" as const,
                note: "trong bộ lọc",
            },
            {
                title: "Khối đang triển khai",
                value: activeGrades,
                icon: <ApartmentOutlined />,
                tone: "blue" as const,
                note: "khối có lớp",
            },
            {
                title: "Đã phân công GVCN",
                value: withGvcn,
                icon: <TeamOutlined />,
                tone: "green" as const,
                note: "giáo viên chủ nhiệm",
            },
        ];
    }, [filtered, studentCountByClassId]);

    const handleClearFilters = () => {
        setKeyword("");

        setAcademicYear(CURRENT_ACADEMIC_YEAR);

        setCampusFilter(undefined);

        setGradeFilter(undefined);

        setClassTypeFilter(undefined);

        setStatusFilter(undefined);

        setGvcnFilter(undefined);

        const params = new URLSearchParams();

        const rawTab = searchParams.get("tab");

        const rawSchool = searchParams.get("school");

        if (rawTab) {
            params.set("tab", rawTab);
        }

        if (rawSchool) {
            params.set("school", rawSchool);
        }

        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            academicYear,
            campusId: campusFilter ?? campuses[0]?.id ?? "campus-main",
            grade: gradeFilter ? Number(gradeFilter) : 6,
            classType: "REGULAR",
            status: "active",
            capacity: 40,
        });

        setOpen(true);
    };

    const openEdit = (classItem: SchoolClass) => {
        setEditing(classItem);

        form.setFieldsValue({
            ...classItem,
        });

        setOpen(true);
    };

    const validateCodeUniqueness = (
        item: SchoolClass,
    ): string | null => {
        const duplicate = items.find(
            (entry) =>
                entry.id !== item.id &&
                entry.academicYear === item.academicYear &&
                entry.campusId === item.campusId &&
                entry.code.trim().toLowerCase() ===
                    item.code.trim().toLowerCase(),
        );

        return duplicate
            ? "Mã lớp đã tồn tại trong cùng cơ sở và năm học"
            : null;
    };

    const handleFinish = (
        values: Record<string, unknown>,
    ) => {
        const actor = "Ban Giám hiệu";

        const base = {
            schoolId,
            classType: (String(values.classType) || "REGULAR") as ClassType,
            capacity: Number(values.capacity ?? 40),
            status: String(values.status ?? "active"),
        };

        if (editing) {
            const updated = {
                ...editing,
                ...base,
                ...values,
                grade: Number(values.grade),
            } as SchoolClass;

            const duplicateError = validateCodeUniqueness(updated);

            if (duplicateError) {
                message.error(duplicateError);

                return;
            }

            const currentStudents = studentCountByClassId.get(editing.id) ?? 0;

            const nextCapacity = Number(updated.capacity ?? 40);

            if (currentStudents > nextCapacity) {
                message.error(
                    `Sức chứa (${nextCapacity}) nhỏ hơn số học sinh hiện tại (${currentStudents}).`,
                );

                return;
            }

            classesApi.update(updated);

            if (updated.homeroomTeacherId !== editing.homeroomTeacherId) {
                const teacher = updated.homeroomTeacherId
                    ? personnelApi.byId.get(updated.homeroomTeacherId)
                    : undefined;

                historyApi.create({
                    id: `class-history-${Date.now().toString(36)}`,
                    classId: updated.id,
                    type: "teacher_changed",
                    actor,
                    content: teacher
                        ? `Thay đổi GVCN lớp ${updated.name}. GVCN mới: ${teacher.fullName}.`
                        : `Thay đổi GVCN lớp ${updated.name}.`,
                    createdAt: nowIso(),
                });
            }

            historyApi.create({
                id: `class-history-${Date.now().toString(36)}`,
                classId: updated.id,
                type: "updated",
                actor,
                content: `Cập nhật thông tin lớp ${updated.name} (${updated.code}).`,
                createdAt: nowIso(),
            });

            message.success("Đã cập nhật thông tin lớp");
        } else {
            const id = `can-tho-class-${Date.now().toString(36)}`;

            const created = {
                ...base,
                ...values,
                id,
                grade: Number(values.grade),
                name: String(values.name),
                code: String(values.code),
                campusId: String(values.campusId),
                academicYear: String(values.academicYear),
            } as SchoolClass;

            const duplicateError = validateCodeUniqueness(created);

            if (duplicateError) {
                message.error(duplicateError);

                return;
            }

            classesApi.create(created);

            historyApi.create({
                id: `class-history-${Date.now().toString(36)}`,
                classId: id,
                type: "created",
                actor,
                content: `Thành lập lớp ${created.name} (${created.code}) – Khối ${created.grade}, năm học ${created.academicYear}.`,
                createdAt: nowIso(),
            });

            message.success("Đã thêm lớp học mới");
        }

        setOpen(false);

        setEditing(null);

        form.resetFields();
    };

    const openStatusChange = (classItem: SchoolClass) => {
        setStatusClass(classItem);

        form.resetFields();

        form.setFieldsValue({
            newStatus: classItem.status,
            statusReason: "",
        });
    };

    const handleStatusFinish = (
        values: Record<string, unknown>,
    ) => {
        if (!statusClass) {
            return;
        }

        const nextStatus = String(values.newStatus);

        const reason = String(values.statusReason ?? "").trim();

        if (nextStatus !== statusClass.status) {
            const statusLabel = classStatusOptions.find(
                (option) => String(option.value) === nextStatus,
            )?.label
                ?? nextStatus;

            classesApi.update({
                ...statusClass,
                status: nextStatus as SchoolClass["status"],
            });

            historyApi.create({
                id: `class-history-${Date.now().toString(36)}`,
                classId: statusClass.id,
                type: "status_changed",
                actor: "Ban Giám hiệu",
                content:
                    reason.length > 0
                        ? `Chuyển trạng thái lớp ${statusClass.name} sang ${statusLabel}: ${reason}`
                        : `Chuyển trạng thái lớp ${statusClass.name} sang ${statusLabel}.`,
                createdAt: nowIso(),
            });

            message.success(`Đã chuyển trạng thái sang ${statusLabel}`);
        }

        setStatusClass(null);

        form.resetFields();
    };

    const statusLabelFor = (status: string): string => {
        return classStatusOptions.find(
            (option) => String(option.value) === status,
        )?.label
            ?? status;
    };

    const classTypeLabelFor = (classType: string): string => {
        return classTypeOptions.find(
            (option) => String(option.value) === classType,
        )?.label
            ?? "Lớp đại trà";
    };

    const columns: ColumnsType<SchoolClass> = [
        {
            title: "STT",
            key: "__index",
            width: 48,
            render: (_: unknown, __: SchoolClass, index: number) => index + 1,
        },
        {
            title: "Lớp",
            dataIndex: "name",
            width: 120,
            render: (value: string) => (
                <span className="classes-cell__name">{value}</span>
            ),
        },
        {
            title: "Mã lớp",
            dataIndex: "code",
            width: 90,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Khối",
            dataIndex: "grade",
            width: 80,
            render: (value: number) => `Khối ${value}`,
        },
        {
            title: "Loại lớp",
            dataIndex: "classType",
            width: 130,
            render: (value: string) =>
                classTypeLabelFor(value),
        },
        {
            title: "GVCN",
            dataIndex: "homeroomTeacherId",
            width: 230,
            render: (value: string | undefined) => {
                const teacher = value
                    ? personnelApi.byId.get(value)
                    : undefined;

                if (!teacher) {
                    return <span className="classes-muted">Chưa phân công</span>;
                }

                return (
                    <Space size={6}>
                        {avatarFor(teacher)}

                        <span>{teacher.fullName}</span>
                    </Space>
                );
            },
        },
        {
            title: "Cơ sở",
            dataIndex: "campusId",
            width: 200,
            render: (value: string) => campusName(campusesById, value),
        },
        {
            title: "Học sinh",
            key: "__students",
            width: 110,
            render: (_: unknown, item: SchoolClass) => {
                const count = studentCountByClassId.get(item.id) ?? 0;

                return (
                    <Button
                        type="link"
                        size="small"
                        style={{ padding: 0 }}
                        onClick={() =>
                            navigate(
                                `/operations/classes/${item.id}?tab=students`,
                            )}
                    >
                        <Tag color={count > (item.capacity ?? 40) ? "red" : "blue"}>
                            {count}/{item.capacity ?? 40}
                        </Tag>
                    </Button>
                );
            },
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 110,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 120,
            render: (value: string) => {
                const tone: Record<string, string> = {
                    active: "green",
                    inactive: "orange",
                    suspended: "orange",
                    closed: "red",
                };

                return (
                    <Tag color={tone[value] ?? "default"}>
                        {statusLabelFor(value)}
                    </Tag>
                );
            },
        },
        {
            title: "",
            key: "__actions",
            width: 56,
            align: "right",
            render: (_: unknown, classItem: SchoolClass) => (
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "view",
                                icon: <EyeOutlined />,
                                label: "Xem chi tiết",
                                onClick: () =>
                                    navigate(`/operations/classes/${classItem.id}`),
                            },
                            {
                                key: "edit",
                                icon: <EditOutlined />,
                                label: "Chỉnh sửa",
                                onClick: () => openEdit(classItem),
                            },
                            {
                                key: "students",
                                icon: <TeamOutlined />,
                                label: "Danh sách học sinh",
                                onClick: () =>
                                    navigate(
                                        `/operations/classes/${classItem.id}?tab=students`,
                                    ),
                            },
                            {
                                key: "history",
                                icon: <HistoryOutlined />,
                                label: "Xem lịch sử",
                                onClick: () =>
                                    navigate(
                                        `/operations/classes/${classItem.id}?tab=history`,
                                    ),
                            },
                            {
                                type: "divider",
                            },
                            {
                                key: "status",
                                icon: <SwapOutlined />,
                                label: "Đổi trạng thái",
                                onClick: () => openStatusChange(classItem),
                            },
                        ],
                    }}
                >
                    <Button
                        type="text"
                        size="small"
                        icon={<MoreOutlined />}
                        title="Thao tác"
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="classes-page">
            {!compact && (
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            QUẢN LÝ KHỐI / LỚP
                        </span>

                        <h2>Danh sách lớp học</h2>

                        <p>
                            Theo dõi lớp học theo năm học, cơ sở và khối lớp;
                            phân công GVCN, phòng học và sĩ số của
                            Trường THCS Ninh Kiều.
                        </p>
                    </div>
                </header>
            )}

            {kpis.length > 0 && (
                <div className="page-kpi">
                    {kpis.map((kpi) => (
                        <StatsCard
                            key={kpi.title}
                            tone={kpi.tone}
                            title={kpi.title}
                            value={kpi.value}
                            icon={kpi.icon}
                            note={kpi.note}
                        />
                    ))}
                </div>
            )}

            <section className="crud-panel__card">
                <div className="crud-panel__header">
                    <div className="crud-panel__title">
                        <span className="crud-panel__eyebrow">
                            DANH SÁCH LỚP
                        </span>

                        <h3>Khối / lớp theo năm học {academicYear ?? "—"}</h3>
                    </div>

                    <div className="crud-panel__actions">
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm tên, mã lớp, cơ sở..."
                            value={keyword}
                            onChange={(event) =>
                                setKeyword(event.target.value)}
                            className="crud-panel__search"
                        />

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleClearFilters}
                            title="Xóa bộ lọc"
                        >
                            Xóa bộ lọc
                        </Button>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreate}
                        >
                            Thêm lớp
                        </Button>
                    </div>
                </div>

                <div className="crud-panel__filters">
                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Năm học"
                        options={yearOptions}
                        value={academicYear}
                        onChange={(value) => {
                            setAcademicYear(value);

                            syncParam("academicYear", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Cơ sở"
                        options={campusOptions}
                        value={campusFilter}
                        onChange={(value) => {
                            setCampusFilter(value);

                            syncParam("campusId", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Khối"
                        options={gradeOptionsForSchool}
                        value={gradeFilter}
                        onChange={(value) => {
                            const next = value ? String(value) : undefined;

                            setGradeFilter(next);

                            syncParam("grade", next);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Loại lớp"
                        options={classTypeOptions}
                        value={classTypeFilter}
                        onChange={(value) => {
                            setClassTypeFilter(value);

                            syncParam("classType", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="GVCN"
                        options={gvcnOptions}
                        value={gvcnFilter}
                        onChange={(value) => {
                            setGvcnFilter(value);

                            syncParam("gvcn", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Trạng thái"
                        options={classStatusOptions}
                        value={statusFilter}
                        onChange={(value) => {
                            setStatusFilter(value);

                            syncParam("status", value);
                        }}
                        className="crud-panel__filter"
                    />
                </div>

                <div className="crud-panel__body">
                    <Table<SchoolClass>
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} lớp`,
                        }}
                        onRow={(classItem) => ({
                            onDoubleClick: () =>
                                navigate(`/operations/classes/${classItem.id}`),
                        })}
                    />
                </div>
            </section>

            <Modal
                open={open}
                title={editing ? `Cập nhật lớp: ${editing.name ?? ""}` : "Thêm mới lớp học"}
                okText="Lưu"
                cancelText="Hủy"
                width={720}
                destroyOnHidden
                styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
                onCancel={() => {
                    setOpen(false);

                    setEditing(null);
                }}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Thông tin cơ bản
                        </Divider>

                        <Form.Item
                            name="name"
                            label="Tên lớp"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
                        >
                            <Input placeholder="VD: 6A1, 7A2..." />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            label="Mã lớp"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập mã lớp" }]}
                        >
                            <Input placeholder="VD: 6A1" />
                        </Form.Item>

                        <Form.Item
                            name="grade"
                            label="Khối"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn khối" }]}
                        >
                            <Select options={gradeOptionsForSchool} />
                        </Form.Item>

                        <Form.Item
                            name="academicYear"
                            label="Năm học"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn năm học" }]}
                        >
                            <Select options={yearOptions} />
                        </Form.Item>
                    </div>

                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Tổ chức lớp
                        </Divider>

                        <Form.Item
                            name="campusId"
                            label="Cơ sở"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn cơ sở" }]}
                        >
                            <Select options={campusOptions} />
                        </Form.Item>

                        <Form.Item
                            name="classType"
                            label="Loại lớp"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn loại lớp" }]}
                        >
                            <Select options={classTypeOptions} />
                        </Form.Item>

                        <Form.Item name="homeroomTeacherId" label="GVCN (chủ nhiệm)">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={personnelOptions}
                                placeholder="Chọn giáo viên chủ nhiệm"
                            />
                        </Form.Item>

                        <Form.Item name="roomId" label="Phòng học chính">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={roomOptions}
                                placeholder="Chọn phòng học"
                            />
                        </Form.Item>

                        <Form.Item
                            name="capacity"
                            label="Sức chứa tối đa"
                            required
                            rules={[{ required: true, message: "Nhập sức chứa" }]}
                        >
                            <InputNumber min={1} max={60} style={{ width: "100%" }} />
                        </Form.Item>

                        <Form.Item name="note" label="Ghi chú">
                            <Input.TextArea
                                rows={3}
                                placeholder="Ghi chú về lớp học..."
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={statusClass !== null}
                title={`Đổi trạng thái: ${statusClass?.name ?? ""}`}
                okText="Lưu"
                cancelText="Hủy"
                width={520}
                destroyOnHidden
                onCancel={() => setStatusClass(null)}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleStatusFinish}
                >
                    <Form.Item
                        name="newStatus"
                        label="Trạng thái mới"
                        required
                        rules={[{ required: true, message: "Chọn trạng thái mới" }]}
                    >
                        <Select options={classStatusOptions} />
                    </Form.Item>

                    <Form.Item
                        name="statusReason"
                        label="Lý do thay đổi"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Bắt buộc nhập lý do khi tạm ngưng / kết thúc lớp"
                        />
                    </Form.Item>

                    <Alert
                        type="info"
                        showIcon
                        message="Không xóa lớp: chỉ chuyển trạng thái để bảo toàn lịch sử."
                    />
                </Form>
            </Modal>
        </div>
    );
};

export { ClassList };

export default ClassList;