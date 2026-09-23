import {
    ApartmentOutlined,
    BankOutlined,
    EditOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    SwapOutlined,
    TeamOutlined,
    ToolOutlined,
} from "@ant-design/icons";

import {
    Button,
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
    useNavigate,
} from "react-router-dom";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import type {
    Campus,
    CampusHistoryEventType,
    CampusStatus,
    CampusType,
} from "@/mock/common/types";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import {
    useCampuses,
} from "@/store/useCampuses";

import {
    useCampusHistory,
} from "@/store/useCampusHistory";

import "./style.scss";


const STATUS_TONE: Record<CampusStatus, string> = {
    ACTIVE: "green",
    SUSPENDED: "orange",
    INACTIVE: "red",
};

const HISTORY_EVENT_TO_TYPE: Record<CampusStatus, CampusHistoryEventType> = {
    ACTIVE: "status_changed",
    SUSPENDED: "status_changed",
    INACTIVE: "status_changed",
};

const MANAGER_NAME = (
    managerId: string | undefined,
): string => {
    if (!managerId) {
        return "";
    }

    const staffSource = canThoMockData.users.find(
        (user) => user.id === managerId,
    );

    if (staffSource) {
        return staffSource.fullName;
    }

    return canThoMockData.personnel.find(
        (item) => item.id === managerId,
    )?.fullName
        ?? managerId;
};

const WARD_NAME = (
    wardId: string,
): string => {
    return canThoMockData.wards.find(
        (ward) => ward.id === wardId,
    )?.name
        ?? wardId;
};

const nowIso = (): string => {
    return new Date().toISOString();
};

function buildCampusStats(
    campusId: string,
) {
    const classCount = canThoMockData.classes.filter(
        (item) => item.campusId === campusId,
    ).length;

    const studentCount = canThoMockData.students.filter(
        (item) => item.campusId === campusId,
    ).length;

    const teacherCount = canThoMockData.teachers.filter(
        (item) => item.campusIds.includes(campusId),
    ).length;

    const roomCount = canThoMockData.facilities.filter(
        (item) =>
            item.campusId === campusId &&
            item.category === "classroom",
    ).reduce((total, item) => total + item.quantity, 0);

    return {
        classCount,
        studentCount,
        teacherCount,
        roomCount,
    };
}

const CampusesPage = ({
    schoolId = "can-tho-school-001",
    compact = false,
}: {
    schoolId?: string;

    compact?: boolean;
}) => {
    const navigate = useNavigate();

    const campusesApi = useCampuses(schoolId);

    const historyApi = useCampusHistory();

    const campusStatusOptions =
        useCatalogOptions("campus-status");

    const campusTypeOptions =
        useCatalogOptions("campus-type");

    const campuses = campusesApi.bySchool;

    const [keyword, setKeyword] = useState("");

    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    const [typeFilter, setTypeFilter] = useState<string | undefined>();

    const [wardFilter, setWardFilter] = useState<string | undefined>();

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<Campus | null>(null);

    const [statusCampus, setStatusCampus] = useState<Campus | null>(null);

    const [form] = Form.useForm<Record<string, unknown>>();

    const labelMaps = useMemo(() => {
        const toMap = (options: Array<{ value: string | number; label: string }>) =>
            new Map<string, string>(
                options.map((option) => [String(option.value), option.label]),
            );

        return {
            status: toMap(campusStatusOptions),
            type: toMap(campusTypeOptions),
            ward: toMap(
                canThoMockData.wards.map((ward) => ({
                    value: ward.id,
                    label: ward.name,
                })),
            ),
        };
    }, [campusStatusOptions, campusTypeOptions]);

    const kpis = useMemo(
        () => {
            const classCount = campuses.reduce(
                (total, campus) => total + buildCampusStats(campus.id).classCount,
                0,
            );

            const studentCount = campuses.reduce(
                (total, campus) => total + buildCampusStats(campus.id).studentCount,
                0,
            );

            const teacherCount = campuses.reduce(
                (total, campus) => total + buildCampusStats(campus.id).teacherCount,
                0,
            );

            const roomCount = campuses.reduce(
                (total, campus) => total + buildCampusStats(campus.id).roomCount,
                0,
            );

            return [
                {
                    title: "Cơ sở",
                    value: campuses.length,
                    icon: <EnvironmentOutlined />,
                    tone: "blue" as const,
                    note: "trụ sở chính + phân hiệu",
                },
                {
                    title: "Lớp học",
                    value: classCount,
                    icon: <BankOutlined />,
                    tone: "green" as const,
                    note: "lớp trực thuộc cơ sở",
                },
                {
                    title: "Học sinh",
                    value: studentCount,
                    icon: <ApartmentOutlined />,
                    tone: "orange" as const,
                    note: "đang theo học",
                },
                {
                    title: "Giáo viên",
                    value: teacherCount,
                    icon: <TeamOutlined />,
                    tone: "purple" as const,
                    note: "giảng dạy tại cơ sở",
                },
                {
                    title: "Phòng học",
                    value: roomCount,
                    icon: <ToolOutlined />,
                    tone: "purple" as const,
                    note: "phòng học đã kiểm kê",
                },
            ];
        },
        [campuses],
    );

    const filtered = useMemo(
        () => {
            const kw = keyword.trim().toLowerCase();

            return campuses.filter((campus) => {
                if (kw) {
                    const haystack = [
                        campus.code,
                        campus.name,
                        campus.address,
                        campus.historicalName ?? "",
                        WARD_NAME(campus.wardId),
                    ].join(" ").toLowerCase();

                    if (!haystack.includes(kw)) {
                        return false;
                    }
                }

                if (statusFilter && campus.status !== statusFilter) {
                    return false;
                }

                if (typeFilter && campus.type !== typeFilter) {
                    return false;
                }

                if (wardFilter && campus.wardId !== wardFilter) {
                    return false;
                }

                return true;
            });
        },
        [campuses, keyword, statusFilter, typeFilter, wardFilter],
    );

    const handleClearFilters = () => {
        setKeyword("");

        setStatusFilter(undefined);

        setTypeFilter(undefined);

        setWardFilter(undefined);
    };

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            schoolId,
            isMainCampus: false,
            type: "BRANCH",
            status: "ACTIVE",
            latitude: 10.03,
            longitude: 105.77,
        });

        setOpen(true);
    };

    const openEdit = (campus: Campus) => {
        setEditing(campus);

        form.setFieldsValue({
            ...campus,
            schoolId,
        });

        setOpen(true);
    };

    const handleFinish = (
        values: Record<string, unknown>,
    ) => {
        const historyActor = "Ban Giám hiệu";

        if (editing) {
            const previous = editing;

            campusesApi.update({
                ...previous,
                ...values,
                schoolId,
            } as Campus);

            const changes: string[] = [];

            if (values.name !== previous.name) {
                changes.push(`đổi tên thành "${String(values.name)}"`);
            }

            if (values.address !== previous.address) {
                changes.push(`địa chỉ mới "${String(values.address)}"`);
            }

            if (String(values.wardId) !== previous.wardId) {
                changes.push(`phường/xã chuyển sang ${WARD_NAME(String(values.wardId))}`);
            }

            if (values.managerId !== previous.managerId) {
                changes.push(`cán bộ phụ trách: ${MANAGER_NAME(String(values.managerId))}`);
            }

            if (changes.length > 0) {
                historyApi.create({
                    id: `campus-history-${Date.now().toString(36)}`,
                    campusId: previous.id,
                    type: "updated",
                    actor: historyActor,
                    content: `Cập nhật thông tin cơ sở: ${changes.join(", ")}.`,
                    createdAt: nowIso(),
                });
            }

            message.success("Đã cập nhật cơ sở");
        } else {
            campusesApi.create({
                ...values,
                id: `campus-${Date.now().toString(36)}`,
                schoolId,
            } as Campus);

            const campusId = form.getFieldValue("id") as string | undefined
                ?? `campus-${Date.now().toString(36)}`;

            historyApi.create({
                id: `campus-history-${Date.now().toString(36)}`,
                campusId,
                type: "created",
                actor: historyActor,
                content: `Thành lập cơ sở mới "${String((values as { name: string }).name)}".`,
                createdAt: nowIso(),
            });

            message.success("Đã thêm cơ sở mới");
        }

        setOpen(false);

        setEditing(null);

        form.resetFields();
    };

    const openStatusChange = (campus: Campus) => {
        setStatusCampus(campus);

        form.resetFields();

        form.setFieldsValue({
            newStatus: campus.status,
            statusReason: "",
        });
    };

    const handleStatusFinish = (
        values: Record<string, unknown>,
    ) => {
        if (!statusCampus) {
            return;
        }

        const nextStatus = String(values.newStatus) as CampusStatus;

        const reason = String(values.statusReason ?? "").trim();

        if (nextStatus !== statusCampus.status) {
            campusesApi.update({
                ...statusCampus,
                status: nextStatus,
            });

            const label =
                labelMaps.status.get(nextStatus) ?? nextStatus;

            historyApi.create({
                id: `campus-history-${Date.now().toString(36)}`,
                campusId: statusCampus.id,
                type: HISTORY_EVENT_TO_TYPE[nextStatus],
                actor: "Ban Giám hiệu",
                content:
                    reason.length > 0
                        ? `Chuyển trạng thái sang ${label}: ${reason}`
                        : `Chuyển trạng thái sang ${label}.`,
                createdAt: nowIso(),
            });

            message.success(`Đã chuyển trạng thái sang ${label}`);
        }

        setStatusCampus(null);

        form.resetFields();
    };

    const columns: ColumnsType<Campus> = [
            {
                title: "Mã",
                dataIndex: "code",
                width: 110,
                render: (value: string) => (
                    <Tag>{value}</Tag>
                ),
            },
            {
                title: "Tên cơ sở",
                dataIndex: "name",
                width: 260,
                render: (value: string, campus: Campus) => (
                    <div className="campus-cell">
                        <strong>{value}</strong>

                        {campus.historicalName && (
                            <span className="campus-cell__history">
                                {campus.historicalName}
                            </span>
                        )}
                    </div>
                ),
            },
            {
                title: "Loại",
                dataIndex: "type",
                width: 130,
                render: (value: CampusType) => (
                    value === "HEADQUARTERS" ? (
                        <Tag color="purple">
                            {labelMaps.type.get(value)}
                        </Tag>
                    ) : (
                        <Tag>
                            {labelMaps.type.get(value)}
                        </Tag>
                    )
                ),
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                width: 280,
                render: (value: string) => (
                    <span className="campus-cell__address">{value}</span>
                ),
            },
            {
                title: "Phường/Xã",
                dataIndex: "wardId",
                width: 150,
                render: (value: string) => WARD_NAME(value),
            },
            {
                title: "Cán bộ phụ trách",
                dataIndex: "managerId",
                width: 180,
                render: (value: string | undefined) => MANAGER_NAME(value) || (
                    <span className="crud-panel__muted">—</span>
                ),
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                width: 130,
                render: (value: CampusStatus) => (
                    <Tag color={STATUS_TONE[value]}>{labelMaps.status.get(value)}</Tag>
                ),
            },
            {
                title: "",
                key: "__actions",
                width: 150,
                align: "right",
                render: (_: unknown, campus: Campus) => (
                    <Space size={4}>
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            title="Xem chi tiết"
                            onClick={() =>
                                navigate(`/operations/campuses/${campus.id}`)}
                        />

                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            title="Chỉnh sửa cơ sở"
                            onClick={() => openEdit(campus)}
                        />

                        <Button
                            type="text"
                            size="small"
                            icon={<SwapOutlined />}
                            title="Đổi trạng thái hoạt động"
                            onClick={() => openStatusChange(campus)}
                        />
                    </Space>
                ),
            },
        ];

    const wardOptions = useMemo(
        () => canThoMockData.wards.map(
            (ward) => ({ value: ward.id, label: ward.name }),
        ),
        [],
    );

    const managerOptions = useMemo(
        () => canThoMockData.users
            .filter((user) => user.schoolId === schoolId)
            .map((user) => ({ value: user.id, label: user.fullName })),
        [schoolId],
    );

    const renderHistoryType = (
        type: CampusHistoryEventType,
    ): ReactNode => {
        const labelMap: Record<CampusHistoryEventType, string> = {
            created: "Thành lập",
            updated: "Cập nhật thông tin",
            address_changed: "Địa chỉ",
            gis_changed: "Tọa độ GIS",
            status_changed: "Trạng thái",
            manager_changed: "Cán bộ phụ trách",
        };

        const toneMap: Record<CampusHistoryEventType, string> = {
            created: "green",
            updated: "blue",
            address_changed: "cyan",
            gis_changed: "geekblue",
            status_changed: "orange",
            manager_changed: "purple",
        };

        return (
            <Tag color={toneMap[type]}>{labelMap[type]}</Tag>
        );
    };

    return (
        <div className="campuses-page">
            {!compact && (
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            CAMPUS MANAGEMENT
                        </span>

                        <h2>Cơ sở trực thuộc</h2>

                        <p>
                            Quản lý trụ sở chính và các phân hiệu theo cơ sở,
                            địa chỉ, tọa độ GIS và lịch sử hoạt động.
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

            <section className="campuses-page__panel">
                <div className="campuses-page__header">
                    <div className="crud-panel__title">
                        <span className="crud-panel__eyebrow">
                            DANH SÁCH CƠ SỞ
                        </span>

                        <h3>Quản lý cơ sở trực thuộc</h3>

                        <p>
                            {filtered.length} cơ sở ·
                            Lưu tự động trên trình duyệt (localStorage)
                        </p>
                    </div>

                    <div className="crud-panel__actions">
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm..."
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
                            Thêm cơ sở
                        </Button>
                    </div>
                </div>

                <div className="crud-panel__filters">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Trạng thái"
                        options={campusStatusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Loại cơ sở"
                        options={campusTypeOptions}
                        value={typeFilter}
                        onChange={setTypeFilter}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Phường/Xã"
                        options={wardOptions}
                        value={wardFilter}
                        onChange={setWardFilter}
                        className="crud-panel__filter"
                    />
                </div>

                <div className="crud-panel__body">
                    <Table<Campus>
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} cơ sở`,
                        }}
                        onRow={(campus) => ({
                            onDoubleClick: () =>
                                navigate(`/operations/campuses/${campus.id}`),
                        })}
                    />
                </div>
            </section>

            <Modal
                open={open}
                title={editing ? "Cập nhật cơ sở" : "Thêm mới cơ sở"}
                okText="Lưu"
                cancelText="Hủy"
                width={720}
                destroyOnHidden
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
                    <Form.Item
                        name="name"
                        label="Tên cơ sở"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập tên cơ sở" }]}
                    >
                        <Input placeholder="VD: Phân hiệu An Cư" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Mã cơ sở"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập mã cơ sở" }]}
                    >
                        <Input placeholder="VD: NK-AC" />
                    </Form.Item>

                    <Form.Item name="type" label="Loại cơ sở">
                        <Select options={campusTypeOptions} />
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select options={campusStatusOptions} />
                    </Form.Item>

                    <Form.Item name="address" label="Địa chỉ">
                        <Input.TextArea rows={2} placeholder="Địa chỉ trụ sở" />
                    </Form.Item>

                    <Form.Item name="wardId" label="Phường/Xã">
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={wardOptions}
                        />
                    </Form.Item>

                    <Form.Item name="managerId" label="Cán bộ phụ trách">
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            options={managerOptions}
                        />
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="VD: 02923 823 456" />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input placeholder="VD: main@ninhkieu.edu.vn" />
                    </Form.Item>

                    <Form.Item name="latitude" label="Vĩ độ" style={{ display: "inline-block", width: "50%" }}>
                        <InputNumber min={8} max={24} step={0.0001} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="longitude" label="Kinh độ" style={{ display: "inline-block", width: "50%" }}>
                        <InputNumber min={103} max={110} step={0.0001} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                open={statusCampus !== null}
                title={`Đổi trạng thái: ${statusCampus?.name ?? ""}`}
                okText="Lưu"
                cancelText="Hủy"
                width={520}
                destroyOnHidden
                onCancel={() => setStatusCampus(null)}
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
                        <Select options={campusStatusOptions} />
                    </Form.Item>

                    <Form.Item
                        name="statusReason"
                        label="Lý do thay đổi"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Bắt buộc nhập lý do khi tạm ngưng hoặc ngừng hoạt động"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <section className="campuses-page__section">
                <header>
                    <span>LỊCH SỬ HOẠT ĐỘNG</span>

                    <strong>Nhật ký thay đổi theo cơ sở</strong>
                </header>

                <Table
                    rowKey="id"
                    dataSource={historyApi.items
                        .filter((entry) =>
                            campuses.some((campus) => campus.id === entry.campusId))
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .slice(0, 12)}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                    columns={[
                        {
                            title: "Loại",
                            dataIndex: "type",
                            width: 150,
                            render: (value: CampusHistoryEventType) => renderHistoryType(value),
                        },
                        {
                            title: "Cơ sở",
                            dataIndex: "campusId",
                            width: 220,
                            render: (value: string) =>
                                campuses.find((campus) => campus.id === value)?.name
                                ?? value,
                        },
                        {
                            title: "Nội dung",
                            dataIndex: "content",
                        },
                        {
                            title: "Thực hiện bởi",
                            dataIndex: "actor",
                            width: 180,
                        },
                        {
                            title: "Thời điểm",
                            dataIndex: "createdAt",
                            width: 180,
                            render: (value: string) =>
                                new Date(value).toLocaleString("vi-VN"),
                        },
                    ]}
                />
            </section>
        </div>
    );
};

export default CampusesPage;