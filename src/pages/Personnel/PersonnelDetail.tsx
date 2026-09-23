import {
    ArrowLeftOutlined,
    BookOutlined,
    PlusOutlined,
    ReadOutlined,
    TeamOutlined,
    TrophyOutlined,
    UndoOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Avatar,
    Button,
    Descriptions,
    Divider,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    message,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import type {
    Campus,
    Personnel,
    PersonnelAssignment,
    PersonnelCompetition,
    PersonnelHistoryEntry,
    PersonnelReward,
    PersonnelWorkHistory,
} from "@/mock/common/types";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import {
    useCampuses,
    CAMPUS_LEGACY_ID_MAP,
} from "@/store/useCampuses";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    usePersonnelAssignments,
} from "@/store/usePersonnelAssignments";

import {
    usePersonnelCompetitions,
} from "@/store/usePersonnelCompetitions";

import {
    usePersonnelRewards,
} from "@/store/usePersonnelRewards";

import {
    usePersonnelWorkHistory,
} from "@/store/usePersonnelWorkHistory";

import {
    usePersonnelHistory,
} from "@/store/usePersonnelHistory";

import "./style.scss";


const TAB_KEYS = [
    "overview",
    "personal",
    "professional",
    "work",
    "assignment",
    "competition",
    "reward",
    "history",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

const paging = (pageSize: number) => ({
    pageSize,
    showSizeChanger: false,
    showTotal: (total: number, range: [number, number]) =>
        `${range[0]}–${range[1]} / ${total}`,
});

const toName = (
    fullName: string,
): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColor = (
    gender: Personnel["gender"],
): string => {
    return gender === "female" ? "#eb2f96" : "#1677ff";
};

const campusName = (
    campusesById: Map<string, Campus>,
    campusId: string,
): string => {
    const normalized = CAMPUS_LEGACY_ID_MAP[campusId] ?? campusId;

    return campusesById.get(normalized)?.name
        ?? campusId;
};

const className = (
    classId: string,
): string => {
    return canThoMockData.classes.find(
        (item) => item.id === classId,
    )?.name
        ?? classId;
};

const wardName = (
    wardId: string | undefined,
): string => {
    if (!wardId) {
        return "—";
    }

    return canThoMockData.wards.find(
        (item) => item.id === wardId,
    )?.name
        ?? wardId;
};

const subjectName = (
    subjectId: string,
): string => {
    return SUBJECT_NAME.get(subjectId) ?? subjectId;
};

const formatDate = (
    value: string | undefined,
): string => {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("vi-VN");
};

const PersonnelDetail = () => {
    const { personnelId = "" } = useParams();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const personnelApi = usePersonnel();

    const campusesApi = useCampuses();

    const assignmentApi = usePersonnelAssignments(personnelId);

    const competitionApi = usePersonnelCompetitions(personnelId);

    const rewardApi = usePersonnelRewards(personnelId);

    const workHistoryApi = usePersonnelWorkHistory(personnelId);

    const historyApi = usePersonnelHistory(personnelId);

    const genderOptions = useCatalogOptions("gender");

    const semesterOptions = useCatalogOptions("semester");

    const personnelStatusOptions = useCatalogOptions("personnel-status");

    const awardOptions = useCatalogOptions("award");

    const personnel = personnelApi.byId.get(personnelId);

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return (TAB_KEYS as readonly string[]).includes(raw ?? "")
            ? raw as TabKey
            : "overview";
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    const [addOpen, setAddOpen] = useState(false);

    const [assignmentForm] = Form.useForm<Record<string, unknown>>();

    const campuses = campusesApi.bySchool;

    const campusesById = campusesApi.byId;

    const campusOptions = useMemo(
        () => campuses.map((campus) => ({
            value: campus.id,
            label: campus.name,
        })),
        [campuses],
    );

    const classOptions = useMemo(
        () => canThoMockData.classes
            .filter((item) =>
                campuses.some((campus) => campus.id === item.campusId))
            .map((item) => ({
                value: item.id,
                label: `${item.name} (${campusName(campusesById, item.campusId)})`,
            })),
        [campuses, campusesById],
    );

    const subjectOptions = useMemo(
        () => subjects.map((subject) => ({
            value: subject.id,
            label: subject.name,
        })),
        [],
    );

    useEffect(() => {
        if (!personnel && personnelApi.items.length > 0) {
            navigate("/operations/schools?tab=personnel", { replace: true });
        }
    }, [personnel, personnelApi.items.length, navigate]);

    if (!personnel) {
        return null;
    }

    const statusLabel = personnelStatusOptions.find(
        (option) => String(option.value) === personnel.status,
    )?.label
        ?? personnel.status;

    const genderLabel = genderOptions.find(
        (option) => String(option.value) === personnel.gender,
    )?.label
        ?? personnel.gender;

    const semesterLabel = (
        value: PersonnelAssignment["semester"],
    ): string => {
        return semesterOptions.find(
            (option) => Number(option.value) === value,
        )?.label
            ?? String(value);
    };

    const awardLabel = (
        value: string,
    ): string => {
        return awardOptions.find(
            (option) => String(option.value) === value,
        )?.label
            ?? value;
    };

    const levelLabel = (
        value: string,
    ): string => {
        const map: Record<string, string> = {
            truong: "Cấp trường",
            quan: "Cấp quận",
            thanh_pho: "Cấp thành phố",
            bo_gddt: "Bộ GD&ĐT",
        };

        return map[value] ?? value;
    };

    const workCount = workHistoryApi.byPersonnel.length;

    const assignmentCount = assignmentApi.byPersonnel.length;

    const currentSemester = assignmentApi.byPersonnel.find(
        (item) => item.status === "active",
    );

    const kpis = [
        {
            title: "Tổ chuyên môn",
            value: personnel.teamId
                ? canThoMockData.sectors.find(
                    (item) => item.id === personnel.teamId,
                )?.name ?? "—"
                : "—",
            icon: <TeamOutlined />,
            tone: "blue" as const,
            note: "sinh hoạt chuyên môn",
            tab: "professional" as TabKey,
        },
        {
            title: "Môn giảng dạy",
            value: personnel.subjectIds.length,
            icon: <BookOutlined />,
            tone: "green" as const,
            note: "bộ môn chính",
            tab: "professional" as TabKey,
        },
        {
            title: "Tiết/tuần",
            value: currentSemester?.periodsPerWeek ?? "—",
            icon: <ReadOutlined />,
            tone: "purple" as const,
            note: "khối lượng đang đảm nhiệm",
            tab: "assignment" as TabKey,
        },
        {
            title: "Phân công giảng dạy",
            value: assignmentCount,
            icon: <BookOutlined />,
            tone: "orange" as const,
            note: "lịch sử phân công",
            tab: "assignment" as TabKey,
        },
        {
            title: "Giáo viên dạy giỏi",
            value: competitionApi.byPersonnel.length,
            icon: <TrophyOutlined />,
            tone: "orange" as const,
            note: "kết quả hội thi",
            tab: "competition" as TabKey,
        },
        {
            title: "Khen thưởng",
            value: rewardApi.byPersonnel.length,
            icon: <TrophyOutlined />,
            tone: "purple" as const,
            note: "danh hiệu, bằng khen",
            tab: "reward" as TabKey,
        },
        {
            title: "Quá trình công tác",
            value: workCount,
            icon: <UndoOutlined />,
            tone: "blue" as const,
            note: "luân chuyển, bổ nhiệm",
            tab: "work" as TabKey,
        },
    ];

    const assignmentColumns: ColumnsType<PersonnelAssignment> = [
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 110,
        },
        {
            title: "Học kỳ",
            dataIndex: "semester",
            width: 90,
            render: (value: PersonnelAssignment["semester"]) =>
                semesterLabel(value),
        },
        {
            title: "Cơ sở",
            dataIndex: "campusId",
            width: 200,
            render: (value: string) => campusName(campusesById, value),
        },
        {
            title: "Lớp",
            dataIndex: "classId",
            width: 170,
            render: (value: string) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() =>
                        navigate(`/operations/classes/${value}`)}
                >
                    {className(value)}
                </Button>
            ),
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            width: 120,
            render: (value: string) => <Tag color="blue">{subjectName(value)}</Tag>,
        },
        {
            title: "Tiết/tuần",
            dataIndex: "periodsPerWeek",
            width: 100,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 130,
            render: (value: string) => (
                <Tag color={value === "active" ? "green" : "default"}>
                    {value === "active" ? "Đang hiệu lực" : "Hết hiệu lực"}
                </Tag>
            ),
        },
    ];

    const competitionColumns: ColumnsType<PersonnelCompetition> = [
        {
            title: "Hội thi",
            dataIndex: "name",
            width: 260,
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 110,
        },
        {
            title: "Cấp",
            dataIndex: "level",
            width: 120,
            render: (value: string) => levelLabel(value),
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            width: 120,
            render: (value: string) => <Tag color="blue">{subjectName(value)}</Tag>,
        },
        {
            title: "Kết quả",
            dataIndex: "result",
            width: 150,
        },
        {
            title: "Danh hiệu",
            dataIndex: "award",
            width: 130,
            render: (value: string) => awardLabel(value),
        },
        {
            title: "Minh chứng",
            dataIndex: "evidence",
            render: (value: string | undefined) =>
                value
                    ? <span className="operations-tab-panel__muted">{value}</span>
                    : "—",
        },
    ];

    const rewardColumns: ColumnsType<PersonnelReward> = [
        {
            title: "Danh hiệu",
            dataIndex: "title",
            width: 260,
        },
        {
            title: "Loại",
            dataIndex: "awardType",
            width: 130,
            render: (value: string) => awardLabel(value),
        },
        {
            title: "Cấp",
            dataIndex: "level",
            width: 120,
            render: (value: string) => levelLabel(value),
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 110,
        },
        {
            title: "Số quyết định",
            dataIndex: "decisionNo",
            width: 140,
        },
        {
            title: "Ngày quyết định",
            dataIndex: "decisionDate",
            width: 130,
            render: (value: string) => formatDate(value),
        },
        {
            title: "Minh chứng",
            dataIndex: "evidence",
            render: (value: string | undefined) =>
                value
                    ? <span className="operations-tab-panel__muted">{value}</span>
                    : "—",
        },
    ];

    const workColumns: ColumnsType<PersonnelWorkHistory> = [
        {
            title: "Giai đoạn",
            width: 170,
            render: (_: unknown, row: PersonnelWorkHistory) => (
                <span>
                    {formatDate(row.startDate)} – {row.endDate ? formatDate(row.endDate) : "nay"}
                </span>
            ),
        },
        {
            title: "Cơ sở",
            dataIndex: "campusId",
            width: 200,
            render: (value: string) => campusName(campusesById, value),
        },
        {
            title: "Vị trí",
            dataIndex: "positionTitle",
            width: 240,
        },
        {
            title: "Môn",
            dataIndex: "subjectIds",
            render: (value: string[] | undefined) => (
                <Space size={4} wrap>
                    {value?.map((subjectId) => (
                        <Tag key={subjectId}>{subjectName(subjectId)}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Quyết định",
            dataIndex: "decisionNo",
            width: 120,
            render: (value: string | undefined) => value ?? "—",
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            render: (value: string | undefined) =>
                value
                    ? <span className="operations-tab-panel__muted">{value}</span>
                    : "—",
        },
    ];

    const historyColumns: ColumnsType<PersonnelHistoryEntry> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 150,
            render: (value: PersonnelHistoryEntry["type"]) => {
                const map: Record<string, string> = {
                    created: "Tiếp nhận",
                    updated: "Cập nhật",
                    status_changed: "Trạng thái",
                    assignment_added: "Phân công",
                };

                const toneMap: Record<string, string> = {
                    created: "green",
                    updated: "blue",
                    status_changed: "orange",
                    assignment_added: "purple",
                };

                return (
                    <Tag color={toneMap[value] ?? "default"}>
                        {map[value] ?? value}
                    </Tag>
                );
            },
        },
        {
            title: "Nội dung",
            dataIndex: "content",
        },
        {
            title: "Thực hiện bởi",
            dataIndex: "actor",
            width: 200,
        },
        {
            title: "Thời điểm",
            dataIndex: "createdAt",
            width: 190,
            render: (value: string) =>
                new Date(value).toLocaleString("vi-VN"),
        },
    ];

    const overviewFields: Array<{
        label: string;

        value: string;
    }> = [
        {
            label: "Mã nhân sự",
            value: personnel.code,
        },
        {
            label: "Họ và tên",
            value: personnel.fullName,
        },
        {
            label: "Giới tính",
            value: genderLabel,
        },
        {
            label: "Ngày sinh",
            value: formatDate(personnel.dob),
        },
        {
            label: "Chức danh",
            value: personnel.roleTitle,
        },
        {
            label: "Trình độ",
            value: personnel.degree || "—",
        },
        {
            label: "Điện thoại",
            value: personnel.phone || "—",
        },
        {
            label: "Email",
            value: personnel.email || "—",
        },
        {
            label: "Cơ sở công tác",
            value: personnel.campusIds.map((campusId) => campusName(campusesById, campusId)).join(", "),
        },
        {
            label: "Phường/Xã",
            value: wardName(personnel.wardId),
        },
        {
            label: "Ngày vào ngành",
            value: formatDate(personnel.careerStartDate),
        },
        {
            label: "Ngày vào trường",
            value: formatDate(personnel.schoolStartDate),
        },
    ];

    const personalFields = [
        { label: "Địa chỉ thường trú", value: personnel.address || "—" },
        { label: "Phường/Xã", value: wardName(personnel.wardId) },
        { label: "Số điện thoại", value: personnel.phone || "—" },
        { label: "Email", value: personnel.email || "—" },
        { label: "Ngày sinh", value: formatDate(personnel.dob) },
        { label: "Giới tính", value: genderLabel },
    ];

    const professionalFields = [
        { label: "Chức danh / Vị trí", value: personnel.roleTitle },
        { label: "Trình độ / Học vị", value: personnel.degree || "—" },
        { label: "Tổ chuyên môn", value: personnel.teamId ?? "—" },
        { label: "Ngày vào ngành", value: formatDate(personnel.careerStartDate) },
        { label: "Ngày vào trường", value: formatDate(personnel.schoolStartDate) },
        {
            label: "GV giỏi / CSTĐ",
            value: personnel.isExcellentTeacher ? "Có" : "Không",
        },
    ];

    const openAddAssignment = () => {
        assignmentForm.resetFields();

        assignmentForm.setFieldsValue({
            personnelId,
            campusId: "campus-main",
            academicYear: "2026-2027",
            semester: 1,
            periodsPerWeek: 2,
            status: "active",
        });

        setAddOpen(true);
    };

    const handleAssignmentFinish = (
        values: Record<string, unknown>,
    ) => {
        assignmentApi.create({
            id: `personnel-assignment-${Date.now().toString(36)}`,
            personnelId,
            campusId: String(values.campusId),
            classId: String(values.classId),
            subjectId: String(values.subjectId),
            academicYear: String(values.academicYear),
            semester: Number(values.semester) as 1 | 2,
            periodsPerWeek: Number(values.periodsPerWeek),
            status: String(values.status) as PersonnelAssignment["status"],
        });

        historyApi.create({
            id: `personnel-history-${Date.now().toString(36)}`,
            personnelId,
            type: "assignment_added",
            actor: "Ban Giám hiệu",
            content: (
                `Phân công giảng dạy môn ${subjectName(String(values.subjectId))} ` +
                `lớp ${className(String(values.classId))} – năm học ${String(values.academicYear)}.`
            ),
            createdAt: new Date().toISOString(),
        });

        message.success("Đã thêm phân công giảng dạy");

        setAddOpen(false);
    };

    const tabItems = [
        {
            key: "overview",
            label: "Tổng quan",
            children: (
                <div className="personnel-detail-tab">
                    <div className="page-kpi">
                        {kpis.map((kpi) => (
                            <StatsCard
                                key={`${kpi.tab}-${kpi.title}`}
                                tone={kpi.tone}
                                title={kpi.title}
                                value={kpi.value}
                                icon={kpi.icon}
                                note={kpi.note}
                                onClick={() => setActiveTab(kpi.tab)}
                            />
                        ))}
                    </div>

                    <Descriptions
                        column={2}
                        size="small"
                        bordered
                        className="personnel-detail-tabs__descriptions"
                    >
                        {overviewFields.map((field, index) => (
                            <Descriptions.Item
                                key={field.label}
                                label={field.label}
                                span={field.label === "Cơ sở công tác" ? 2 : 1}
                            >
                                <span className={
                                    index === 1
                                        ? "personnel-detail-tabs__strong"
                                        : undefined
                                }>
                                    {field.value}
                                </span>
                            </Descriptions.Item>
                        ))}
                    </Descriptions>

                    {personnel.achievements && (
                        <>
                            <Divider titlePlacement="left" plain>
                                Thành tích nổi bật
                            </Divider>

                            <Alert
                                type="success"
                                showIcon
                                message={personnel.achievements}
                            />
                        </>
                    )}
                </div>
            ),
        },
        {
            key: "personal",
            label: "Thông tin cá nhân",
            children: (
                <Descriptions
                    column={2}
                    size="small"
                    bordered
                    className="personnel-detail-tabs__descriptions"
                >
                    {personalFields.map((field) => (
                        <Descriptions.Item key={field.label} label={field.label}>
                            {field.value}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            ),
        },
        {
            key: "professional",
            label: "Chuyên môn",
            children: (
                <div className="operations-tab-panel">
                    <div className="operations-tab-panel__header">
                        <div className="operations-tab-panel__title">
                            <h4>Trình độ và vị trí chuyên môn</h4>

                            <p>Thông tin chức danh, trình độ, tổ bộ môn và môn giảng dạy.</p>
                        </div>
                    </div>

                    <Descriptions
                        column={2}
                        size="small"
                        bordered
                        className="personnel-detail-tabs__descriptions"
                    >
                        {professionalFields.map((field) => (
                            <Descriptions.Item key={field.label} label={field.label}>
                                {field.value}
                            </Descriptions.Item>
                        ))}

                        <Descriptions.Item label="Môn giảng dạy" span={2}>
                            <Space size={4} wrap>
                                {personnel.subjectIds.map((subjectId) => (
                                    <Tag key={subjectId} color="blue">
                                        {subjectName(subjectId)}
                                    </Tag>
                                ))}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: "work",
            label: "Công tác",
            children: workHistoryApi.byPersonnel.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={workColumns}
                    dataSource={workHistoryApi.byPersonnel}
                    pagination={paging(6)}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có dữ liệu quá trình công tác."
                />
            ),
        },
        {
            key: "assignment",
            label: "Phân công giảng dạy",
            children: (
                <div className="operations-tab-panel">
                    <div className="operations-tab-panel__header">
                        <div className="operations-tab-panel__title">
                            <h4>Lịch sử phân công</h4>

                            <p>
                                Chỉ ghi nhận thêm phân công mới; không xóa, không sửa
                                các phân công đã có để bảo toàn lịch sử.
                            </p>
                        </div>

                        <div className="operations-tab-panel__actions">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={openAddAssignment}
                            >
                                Thêm phân công
                            </Button>
                        </div>
                    </div>

                    {assignmentApi.byPersonnel.length > 0 ? (
                        <Table
                            rowKey="id"
                            columns={assignmentColumns}
                            dataSource={assignmentApi.byPersonnel}
                            pagination={paging(6)}
                            size="small"
                            scroll={{ x: true }}
                        />
                    ) : (
                        <Alert
                            type="info"
                            showIcon
                            message="Chưa có phân công giảng dạy."
                        />
                    )}
                </div>
            ),
        },
        {
            key: "competition",
            label: "Dạy giỏi",
            children: competitionApi.byPersonnel.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={competitionColumns}
                    dataSource={competitionApi.byPersonnel}
                    pagination={paging(6)}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có kết quả hội thi giáo viên dạy giỏi."
                />
            ),
        },
        {
            key: "reward",
            label: "Thi đua & Khen thưởng",
            children: rewardApi.byPersonnel.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={rewardColumns}
                    dataSource={rewardApi.byPersonnel}
                    pagination={paging(6)}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có danh hiệu thi đua, khen thưởng."
                />
            ),
        },
        {
            key: "history",
            label: "Lịch sử",
            children: historyApi.byPersonnel.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={historyColumns}
                    dataSource={historyApi.byPersonnel}
                    pagination={paging(8)}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có ghi nhận lịch sử."
                />
            ),
        },
    ];

    return (
        <div className="personnel-detail-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span
                            className="personnel-detail__breadcrumb"
                            onClick={() => navigate("/operations/schools?tab=personnel")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate("/operations/schools?tab=personnel");
                                }
                            }}
                        >
                            <ArrowLeftOutlined /> Danh sách nhân sự
                        </span>

                        <div className="personnel-detail__identity">
                            <Avatar
                                size={54}
                                style={{
                                    backgroundColor: avatarColor(personnel.gender),
                                    flexShrink: 0,
                                }}
                            >
                                {toName(personnel.fullName)}
                            </Avatar>

                            <div>
                                <div className="personnel-detail__identity-name">
                                    {personnel.fullName}
                                </div>

                                <span className="personnel-detail__identity-meta">
                                    {personnel.code} · {personnel.roleTitle}
                                </span>

                                <div className="personnel-detail__identity-tags">
                                    <Space size={4} wrap>
                                        <Tag color={
                                            personnel.status === "active"
                                                ? "green"
                                                : "red"
                                        }>
                                            {statusLabel}
                                        </Tag>

                                        {personnel.isExcellentTeacher && (
                                            <Tag color="orange">
                                                GV giỏi / CSTĐ
                                            </Tag>
                                        )}

                                        {personnel.teamId && (
                                            <Tag>
                                                {canThoMockData.sectors.find(
                                                    (item) => item.id === personnel.teamId,
                                                )?.name ?? personnel.teamId}
                                            </Tag>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-head__meta">
                        {personnel.campusIds.map((campusId) => (
                            <Tag key={campusId} color="purple">
                                {campusName(campusesById, campusId)}
                            </Tag>
                        ))}
                    </div>
                </header>
            </div>

            <Tabs
                key={personnel.id}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: 0 }}
            />

            <Modal
                open={addOpen}
                title="Thêm phân công giảng dạy"
                okText="Thêm mới"
                cancelText="Hủy"
                width={560}
                destroyOnHidden
                onCancel={() => setAddOpen(false)}
                onOk={() => assignmentForm.submit()}
            >
                <Form
                    form={assignmentForm}
                    layout="vertical"
                    onFinish={handleAssignmentFinish}
                >
                    <Form.Item
                        name="campusId"
                        label="Cơ sở"
                        required
                        rules={[{ required: true, message: "Chọn cơ sở" }]}
                    >
                        <Select options={campusOptions} />
                    </Form.Item>

                    <Form.Item
                        name="classId"
                        label="Lớp học"
                        required
                        rules={[{ required: true, message: "Chọn lớp học" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={classOptions}
                            placeholder="Chọn lớp"
                        />
                    </Form.Item>

                    <Form.Item
                        name="subjectId"
                        label="Môn"
                        required
                        rules={[{ required: true, message: "Chọn môn" }]}
                    >
                        <Select options={subjectOptions} />
                    </Form.Item>

                    <Form.Item
                        name="academicYear"
                        label="Năm học"
                        required
                        rules={[{ required: true, message: "Nhập năm học" }]}
                    >
                        <Input placeholder="VD: 2026-2027" />
                    </Form.Item>

                    <Form.Item
                        name="semester"
                        label="Học kỳ"
                        required
                        rules={[{ required: true, message: "Chọn học kỳ" }]}
                    >
                        <Select options={semesterOptions} />
                    </Form.Item>

                    <Form.Item
                        name="periodsPerWeek"
                        label="Số tiết / tuần"
                        required
                        rules={[{ required: true, message: "Nhập số tiết" }]}
                    >
                        <InputNumber min={1} max={30} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        required
                        rules={[{ required: true, message: "Chọn trạng thái" }]}
                    >
                        <Select
                            options={[
                                { value: "active", label: "Đang hiệu lực" },
                                { value: "inactive", label: "Hết hiệu lực" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export { PersonnelDetail };

export default PersonnelDetail;