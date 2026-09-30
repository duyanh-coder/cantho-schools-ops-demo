import {
    ApartmentOutlined,
    BookOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    HistoryOutlined,
    IdcardOutlined,
    MoreOutlined,
    PlusOutlined,
    ReadOutlined,
    ReloadOutlined,
    SearchOutlined,
    SwapOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Avatar,
    Button,
    Divider,
    Dropdown,
    Form,
    Input,
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

import {
    subjects,
} from "@/mock/common";

import type {
    Campus,
    Personnel,
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
    usePersonnelHistory,
} from "@/store/usePersonnelHistory";

import "./style.scss";


const SCHOOL_ID = "can-tho-school-001";


const MANAGER_KEYWORDS = [
    "Hiệu trưởng",
    "Phó hiệu trưởng",
    "Tổ trưởng chuyên môn",
    "Trưởng khối",
];


type TabKey =
    | "list"
    | "structure"
    | "team"
    | "subject"
    | "excellent"
    | "reward";


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


const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

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

const sectorName = (sectorId: string | undefined): string => {
    if (!sectorId) {
        return "";
    }

    return canThoMockData.sectors.find((item) => item.id === sectorId)?.name
        ?? sectorId;
};

const toSubjectName = (subjectId: string): string => {
    return SUBJECT_NAME.get(subjectId) ?? subjectId;
};

const nowIso = (): string => {
    return new Date().toISOString();
};

const avatarFor = (
    item: Personnel,
): ReactNode => (
    <Avatar
        size={32}
        style={{
            backgroundColor: item.gender === "female" ? "#eb2f96" : "#1677ff",
            flexShrink: 0,
        }}
    >
        {initials(item.fullName)}
    </Avatar>
);

const PersonnelList = ({
    compact = false,
    schoolId = SCHOOL_ID,
}: {
    compact?: boolean;

    schoolId?: string;
}) => {
    const navigate = useNavigate();

    const personnelApi = usePersonnel();

    const historyApi = usePersonnelHistory();

    const assignmentApi = usePersonnelAssignments();

    const competitionApi = usePersonnelCompetitions();

    const rewardApi = usePersonnelRewards();

    const campusesApi = useCampuses(schoolId);

    const [activeTab, setActiveTab] = useState<TabKey>("list");

    const genderOptions =
        useCatalogOptions("gender");

    const yesNoOptions =
        useCatalogOptions("yes-no");

    const statusOptions =
        useCatalogOptions("personnel-status");

    const awardOptions =
        useCatalogOptions("award");

    const items = useMemo(
        () => personnelApi.items.filter((item) => item.schoolId === schoolId),
        [personnelApi.items, schoolId],
    );

    const campuses = campusesApi.bySchool;

    const campusesById = campusesApi.byId;

    const sectors = useMemo(
        () => canThoMockData.sectors.filter(
            (sector) =>
                sector.schoolId === schoolId &&
                sector.type === "subject_group",
        ),
        [schoolId],
    );

    const wards = useMemo(
        () => canThoMockData.wards.filter(
            (ward) => ward.regionId === "can-tho",
        ),
        [],
    );

    const campusOptions = useMemo(
        () => campuses.map((campus) => ({
            value: campus.id,
            label: campus.name,
        })),
        [campuses],
    );

    const sectorOptions = useMemo(
        () => sectors.map((sector) => ({
            value: sector.id,
            label: sector.name,
        })),
        [sectors],
    );

    const wardOptions = useMemo(
        () => wards.map((ward) => ({
            value: ward.id,
            label: ward.name,
        })),
        [wards],
    );

    const subjectOptions = useMemo(
        () => subjects.map((subject) => ({
            value: subject.id,
            label: subject.name,
        })),
        [],
    );

    const structureGroups = useMemo(() => {
        const isManager = (item: Personnel) =>
            MANAGER_KEYWORDS.some((title) => item.roleTitle.includes(title));

        const isTeacher = (item: Personnel) =>
            !isManager(item) &&
            item.subjectIds.length > 0;

        const managerPool = items.filter(isManager);

        const teacherPool = items.filter(isTeacher);

        const staffPool = items.filter(
            (item) => !isManager(item) && !isTeacher(item),
        );

        return [
            {
                key: "manager",
                label: "Cán bộ quản lý",
                pool: managerPool,
            },
            {
                key: "teacher",
                label: "Giáo viên",
                pool: teacherPool,
            },
            {
                key: "staff",
                label: "Nhân viên",
                pool: staffPool,
            },
        ];
    }, [items]);

    const assignmentCounts = useMemo(
        () => {
            const counts = new Map<string, number>();

            for (const assignment of assignmentApi.items) {
                counts.set(
                    assignment.personnelId,
                    (counts.get(assignment.personnelId) ?? 0) + 1,
                );
            }

            return counts;
        },
        [assignmentApi.items],
    );

    const committeeCounts = useMemo(
        () => {
            const counts = new Map<string, number>();

            for (const committee of competitionApi.items) {
                counts.set(
                    committee.personnelId,
                    (counts.get(committee.personnelId) ?? 0) + 1,
                );
            }

            return counts;
        },
        [competitionApi.items],
    );

    const rewardCounts = useMemo(
        () => {
            const counts = new Map<string, number>();

            for (const reward of rewardApi.items) {
                counts.set(
                    reward.personnelId,
                    (counts.get(reward.personnelId) ?? 0) + 1,
                );
            }

            return counts;
        },
        [rewardApi.items],
    );

    const roleTitleOptions = useMemo(() => {
        const seen = new Set<string>();

        const options = items
            .map((item) => item.roleTitle)
            .filter((value) => {
                if (!value || seen.has(value)) {
                    return false;
                }

                seen.add(value);

                return true;
            })
            .map((value) => ({ value, label: value }));

        return options;
    }, [items]);

    const degreeOptions = useMemo(() => {
        const seen = new Set<string>();

        const options = items
            .map((item) => item.degree)
            .filter((value) => {
                if (!value || seen.has(value)) {
                    return false;
                }

                seen.add(value);

                return true;
            })
            .map((value) => ({ value, label: value }));

        return options;
    }, [items]);

    const [keyword, setKeyword] = useState("");

    const [campusFilter, setCampusFilter] = useState<string[]>([]);

    const [sectorFilter, setSectorFilter] = useState<string | undefined>();

    const [roleTitleFilter, setRoleTitleFilter] = useState<string | undefined>();

    const [degreeFilter, setDegreeFilter] = useState<string | undefined>();

    const [statusFilter, setStatusFilter] = useState<string | undefined>();

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<Personnel | null>(null);

    const [statusPersonnel, setStatusPersonnel] = useState<Personnel | null>(null);

    const [form] = Form.useForm<Record<string, unknown>>();

    const kpis = useMemo(() => {
        const teacherCount = items.filter(
            (item) => item.subjectIds.length > 0,
        ).length;

        const managerCount = items.filter((item) =>
            ["Hiệu trưởng", "Phó hiệu trưởng", "Tổ trưởng chuyên môn", "Trưởng khối"].some(
                (title) => item.roleTitle.includes(title),
            ),
        ).length;

        const honourCount = items.filter(
            (item) => item.isExcellentTeacher,
        ).length;

        const masterCount = items.filter(
            (item) => item.degree.includes("Thạc sĩ"),
        ).length;

        const activeCampuses = campuses.filter((campus) =>
            items.some((item) => item.campusIds.includes(campus.id)),
        ).length;

        return [
            {
                title: "Tổng CB-GV",
                value: items.length,
                icon: <TeamOutlined />,
                tone: "blue" as const,
                note: "cán bộ – giáo viên – nhân viên",
            },
            {
                title: "Giáo viên giảng dạy",
                value: teacherCount,
                icon: <BookOutlined />,
                tone: "green" as const,
                note: "có môn giảng dạy",
            },
            {
                title: "Cán bộ quản lý",
                value: managerCount,
                icon: <IdcardOutlined />,
                tone: "purple" as const,
                note: "Ban Giám hiệu & tổ trưởng",
            },
            {
                title: "Đạt danh hiệu",
                value: honourCount,
                icon: <TrophyOutlined />,
                tone: "orange" as const,
                note: "GVDG / CSTĐ tiêu biểu",
            },
            {
                title: "Trình độ Thạc sĩ+",
                value: masterCount,
                icon: <ReadOutlined />,
                tone: "purple" as const,
                note: "học vị chuyên môn cao",
            },
            {
                title: "Tổ chuyên môn",
                value: sectors.length,
                icon: <ApartmentOutlined />,
                tone: "blue" as const,
                note: "khối tự nhiên + xã hội + khác",
            },
            {
                title: "Cơ sở có nhân sự",
                value: activeCampuses,
                icon: <UserOutlined />,
                tone: "orange" as const,
                note: "trụ sở chính + phân hiệu",
            },
        ];
    }, [items, campuses, sectors]);

    const filtered = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return items.filter((item) => {
            if (kw) {
                const haystack = [
                    item.code,
                    item.fullName,
                    item.email,
                    item.roleTitle,
                    item.degree,
                    sectorName(item.teamId),
                    item.campusIds.map((campusId) => campusName(campusesById, campusId)).join(" "),
                ].join(" ").toLowerCase();

                if (!haystack.includes(kw)) {
                    return false;
                }
            }

            if (campusFilter.length > 0 && !campusFilter.some((id) => item.campusIds.includes(id))) {
                return false;
            }

            if (sectorFilter && item.teamId !== sectorFilter) {
                return false;
            }

            if (roleTitleFilter && item.roleTitle !== roleTitleFilter) {
                return false;
            }

            if (degreeFilter && item.degree !== degreeFilter) {
                return false;
            }

            if (statusFilter && item.status !== statusFilter) {
                return false;
            }

            return true;
        });
    }, [items, campusesById, keyword, campusFilter, sectorFilter, roleTitleFilter, degreeFilter, statusFilter]);

    const handleClearFilters = () => {
        setKeyword("");

        setCampusFilter([]);

        setSectorFilter(undefined);

        setRoleTitleFilter(undefined);

        setDegreeFilter(undefined);

        setStatusFilter(undefined);
    };

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            gender: "female",
            isExcellentTeacher: "0",
            status: "active",
            campusIds: [campuses[0]?.id ?? "campus-main"],
        });

        setOpen(true);
    };

    const openEdit = (personnel: Personnel) => {
        setEditing(personnel);

        form.setFieldsValue({
            ...personnel,
            isExcellentTeacher: personnel.isExcellentTeacher ? "1" : "0",
        });

        setOpen(true);
    };

    const handleFinish = (
        values: Record<string, unknown>,
    ) => {
        const actor = "Ban Giám hiệu";

        if (editing) {
            personnelApi.update({
                ...editing,
                ...values,
                isExcellentTeacher: String(values.isExcellentTeacher) === "1",
            } as Personnel);

            historyApi.create({
                id: `personnel-history-${Date.now().toString(36)}`,
                personnelId: editing.id,
                type: "updated",
                actor,
                content: `Cập nhật hồ sơ nhân sự "${editing.fullName}".`,
                createdAt: nowIso(),
            });

            message.success("Đã cập nhật hồ sơ nhân sự");
        } else {
            const id = `can-tho-personnel-${Date.now().toString(36)}`;

            personnelApi.create({
                ...values,
                id,
                schoolId,
                isExcellentTeacher: String(values.isExcellentTeacher) === "1",
            } as Personnel);

            historyApi.create({
                id: `personnel-history-${Date.now().toString(36)}`,
                personnelId: id,
                type: "created",
                actor,
                content: `Tiếp nhận nhân sự mới "${String(values.fullName)}".`,
                createdAt: nowIso(),
            });

            message.success("Đã thêm nhân sự mới");
        }

        setOpen(false);

        setEditing(null);

        form.resetFields();
    };

    const openStatusChange = (personnel: Personnel) => {
        setStatusPersonnel(personnel);

        form.resetFields();

        form.setFieldsValue({
            newStatus: personnel.status,
            statusReason: "",
        });
    };

    const handleStatusFinish = (
        values: Record<string, unknown>,
    ) => {
        if (!statusPersonnel) {
            return;
        }

        const nextStatus = String(values.newStatus);

        const reason = String(values.statusReason ?? "").trim();

        if (nextStatus !== statusPersonnel.status) {
            const statusLabel = statusOptions.find(
                (option) => String(option.value) === nextStatus,
            )?.label
                ?? nextStatus;

            personnelApi.update({
                ...statusPersonnel,
                status: nextStatus as Personnel["status"],
            });

            historyApi.create({
                id: `personnel-history-${Date.now().toString(36)}`,
                personnelId: statusPersonnel.id,
                type: "status_changed",
                actor: "Ban Giám hiệu",
                content:
                    reason.length > 0
                        ? `Chuyển trạng thái nhân sự sang ${statusLabel}: ${reason}`
                        : `Chuyển trạng thái nhân sự sang ${statusLabel}.`,
                createdAt: nowIso(),
            });

            message.success(`Đã chuyển trạng thái sang ${statusLabel}`);
        }

        setStatusPersonnel(null);

        form.resetFields();
    };

    const removePersonnel = (
        personnel: Personnel,
    ) => {
        const assignmentCount = assignmentCounts.get(personnel.id) ?? 0;

        if (assignmentCount > 0) {
            Modal.warning({
                title: "Không thể xóa",
                content:
                    `Nhân sự “${personnel.fullName}” đang có ${assignmentCount} phân công ` +
                    "giảng dạy. Vui lòng gỡ phân công trước khi xóa hồ sơ.",
                okText: "Đã hiểu",
            });

            return;
        }

        Modal.confirm({
            title: "Xóa hồ sơ nhân sự?",
            content:
                `Bạn có chắc muốn xóa “${personnel.fullName}” khỏi danh sách? ` +
                "Thao tác này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                personnelApi.remove(personnel.id);

                for (const entry of assignmentApi.items.filter(
                    (item) => item.personnelId === personnel.id,
                )) {
                    assignmentApi.remove(entry.id);
                }

                for (const entry of competitionApi.items.filter(
                    (item) => item.personnelId === personnel.id,
                )) {
                    competitionApi.remove(entry.id);
                }

                for (const entry of rewardApi.items.filter(
                    (item) => item.personnelId === personnel.id,
                )) {
                    rewardApi.remove(entry.id);
                }

                for (const entry of historyApi.items.filter(
                    (item) => item.personnelId === personnel.id,
                )) {
                    historyApi.remove(entry.id);
                }

                message.success("Đã xóa hồ sơ nhân sự");
            },
        });
    };

    const columns: ColumnsType<Personnel> = [
        {
            title: "STT",
            key: "__index",
            width: 48,
            render: (_: unknown, __: Personnel, index: number) => index + 1,
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            width: 200,
            render: (value: string, personnel: Personnel) => (
                <Space size={8}>
                    {avatarFor(personnel)}

                    <span className="personnel-cell__name">{value}</span>
                </Space>
            ),
        },
        {
            title: "Chức danh",
            dataIndex: "roleTitle",
            width: 170,
        },
        {
            title: "Tổ / Bộ môn",
            key: "__team_subject",
            width: 170,
            render: (_: unknown, personnel: Personnel) => (
                <Space size={4} wrap>
                    {sectorName(personnel.teamId)
                        ? <Tag>{sectorName(personnel.teamId)}</Tag>
                        : null}

                    {personnel.subjectIds.map((subjectId) => (
                        <Tag key={subjectId} color="blue">{toSubjectName(subjectId)}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Cơ sở công tác",
            dataIndex: "campusIds",
            width: 220,
            render: (value: string[]) => (
                <Space size={4} wrap>
                    {value.map((campusId) => (
                        <Tag key={campusId}>{campusName(campusesById, campusId)}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Chi tiết",
            key: "__detail",
            width: 74,
            render: (_: unknown, personnel: Personnel) => (
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() =>
                        navigate(`/operations/personnel/${personnel.id}`)}
                >
                    Chi tiết
                </Button>
            ),
        },
        {
            title: "",
            key: "__actions",
            width: 56,
            align: "right",
            render: (_: unknown, personnel: Personnel) => (
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "edit",
                                icon: <EditOutlined />,
                                label: "Chỉnh sửa",
                                onClick: () => openEdit(personnel),
                            },
                            {
                                key: "assignment",
                                icon: <BookOutlined />,
                                label: "Phân công giảng dạy",
                                onClick: () =>
                                    navigate(
                                        `/operations/personnel/${personnel.id}?tab=personal`,
                                    ),
                            },
                            {
                                key: "history",
                                icon: <HistoryOutlined />,
                                label: "Xem lịch sử",
                                onClick: () =>
                                    navigate(
                                        `/operations/personnel/${personnel.id}?tab=history`,
                                    ),
                            },
                            {
                                type: "divider",
                            },
                            {
                                key: "status",
                                icon: <SwapOutlined />,
                                label: "Đổi trạng thái hoạt động",
                                onClick: () => openStatusChange(personnel),
                            },
                            {
                                type: "divider",
                            },
                            {
                                key: "remove",
                                icon: <DeleteOutlined />,
                                label: "Xóa",
                                danger: true,
                                onClick: () => removePersonnel(personnel),
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

    const awardLabel = (value: string): string =>
        awardOptions.find(
            (option) => String(option.value) === value,
        )?.label
            ?? value;

    const structureRows = useMemo(
        () => structureGroups.map((group) => ({
            key: group.key,
            label: group.label,
            count: group.pool.length,
            male: group.pool.filter((item) => item.gender === "male").length,
            female: group.pool.filter((item) => item.gender === "female").length,
            active: group.pool.filter((item) => item.status === "active").length,
        })),
        [structureGroups],
    );

    const structureColumns: ColumnsType<(typeof structureRows)[number]> = [
        { title: "Loại nhân sự", dataIndex: "label", width: 220 },
        { title: "Tổng số", dataIndex: "count", width: 120, align: "right" },
        { title: "Nam", dataIndex: "male", width: 90, align: "right" },
        { title: "Nữ", dataIndex: "female", width: 90, align: "right" },
        { title: "Đang công tác", dataIndex: "active", width: 130, align: "right" },
    ];

    const teamRows = useMemo(
        () => sectors.map((sector) => ({
            sector,
            members: items.filter((item) => item.teamId === sector.id),
        })),
        [sectors, items],
    );

    const teamColumns: ColumnsType<(typeof teamRows)[number]> = [
        {
            title: "Tổ chuyên môn",
            key: "team",
            render: (_: unknown, row) => (
                <span className="personnel-cell__name">{row.sector.name}</span>
            ),
        },
        {
            title: "Mã",
            key: "code",
            width: 160,
            render: (_: unknown, row) => row.sector.code,
        },
        {
            title: "Số thành viên",
            key: "count",
            width: 130,
            align: "right",
            render: (_: unknown, row) => row.members.length,
        },
        {
            title: "Thành viên",
            key: "members",
            render: (_: unknown, row) => (
                <Space size={4} wrap>
                    {row.members.map((item) => (
                        <Tag key={item.id}>{item.fullName}</Tag>
                    ))}
                </Space>
            ),
        },
    ];

    const subjectRows = useMemo(
        () => subjects
            .map((subject) => ({
                subject,
                members: items.filter((item) => item.subjectIds.includes(subject.id)),
            }))
            .filter((row) => row.members.length > 0),
        [items],
    );

    const subjectColumns: ColumnsType<(typeof subjectRows)[number]> = [
        {
            title: "Môn học",
            key: "subject",
            render: (_: unknown, row) => (
                <span className="personnel-cell__name">{row.subject.name}</span>
            ),
        },
        {
            title: "Số giáo viên",
            key: "count",
            width: 140,
            align: "right",
            render: (_: unknown, row) => row.members.length,
        },
        {
            title: "Giáo viên",
            key: "members",
            render: (_: unknown, row) => (
                <Space size={4} wrap>
                    {row.members.map((item) => <Tag key={item.id}>{item.fullName}</Tag>)}
                </Space>
            ),
        },
    ];

    const excellentRows = useMemo(
        () => items.filter((item) => item.isExcellentTeacher),
        [items],
    );

    const excellentColumns: ColumnsType<Personnel> = [
        {
            title: "STT",
            key: "__index",
            width: 48,
            render: (_: unknown, __: Personnel, index: number) => index + 1,
        },
        {
            title: "Họ tên",
            dataIndex: "fullName",
            width: 200,
            render: (value: string, personnel: Personnel) => (
                <Space size={8}>
                    {avatarFor(personnel)}

                    <span className="personnel-cell__name">{value}</span>
                </Space>
            ),
        },
        {
            title: "Chức danh",
            dataIndex: "roleTitle",
            width: 170,
        },
        {
            title: "Tổ / Bộ môn",
            key: "__team_subject",
            render: (_: unknown, personnel: Personnel) => (
                <Space size={4} wrap>
                    {sectorName(personnel.teamId)
                        ? <Tag>{sectorName(personnel.teamId)}</Tag>
                        : null}

                    {personnel.subjectIds.map((subjectId) => (
                        <Tag key={subjectId} color="blue">{toSubjectName(subjectId)}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Hội thi",
            key: "__committee",
            width: 90,
            align: "right",
            render: (_: unknown, personnel: Personnel) =>
                committeeCounts.get(personnel.id) ?? 0,
        },
        {
            title: "Khen thưởng",
            key: "__reward",
            width: 100,
            align: "right",
            render: (_: unknown, personnel: Personnel) =>
                rewardCounts.get(personnel.id) ?? 0,
        },
    ];

    const rewardRows = useMemo(
        () => rewardApi.items
            .map((reward) => ({
                reward,
                personnel: personnelApi.byId.get(reward.personnelId),
            }))
            .filter((row) => row.personnel?.schoolId === schoolId)
            .sort(
                (a, b) => b.reward.academicYear.localeCompare(a.reward.academicYear),
            ),
        [rewardApi.items, personnelApi.byId, schoolId],
    );

    const rewardColumns: ColumnsType<(typeof rewardRows)[number]> = [
        {
            title: "Nhân sự",
            key: "personnel",
            width: 220,
            render: (_: unknown, row) => (
                <Space size={8}>
                    {row.personnel ? avatarFor(row.personnel) : null}

                    <span className="personnel-cell__name">
                        {row.personnel?.fullName ?? "—"}
                    </span>
                </Space>
            ),
        },
        {
            title: "Danh hiệu",
            key: "title",
            width: 220,
            render: (_: unknown, row) => row.reward.title,
        },
        {
            title: "Loại",
            key: "type",
            width: 140,
            render: (_: unknown, row) => awardLabel(row.reward.awardType),
        },
        {
            title: "Cấp",
            key: "level",
            width: 120,
            render: (_: unknown, row) => levelLabel(row.reward.level),
        },
        {
            title: "Năm học",
            key: "year",
            width: 110,
            render: (_: unknown, row) => row.reward.academicYear,
        },
    ];

    return (
        <div className="personnel-page">
            {!compact && (
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            QUẢN LÝ NHÂN SỰ
                        </span>

                        <h2>Danh sách nhân sự</h2>

                        <p>
                            Hồ sơ cán bộ quản lý, giáo viên và nhân viên của
                            Trường THCS Ninh Kiều, phân công theo hệ thống cơ sở trực thuộc.
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

            <Tabs
                className="page-tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={[
                    {
                        key: "list",
                        label: "Danh sách",
                        children: (
                            <section className="crud-panel__card">
                                <div className="crud-panel__header">
                    <div className="crud-panel__title">
                        <span className="crud-panel__eyebrow">
                            DANH SÁCH NHÂN SỰ
                        </span>

                        <h3>Quản lý cán bộ – giáo viên – nhân viên</h3>
                    </div>

                    <div className="crud-panel__actions">
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm tên, mã, email..."
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
                            Thêm nhân sự
                        </Button>
                    </div>
                </div>

                <div className="crud-panel__filters">
                    <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        placeholder="Cơ sở công tác"
                        options={campusOptions}
                        value={campusFilter}
                        onChange={setCampusFilter}
                        className="crud-panel__filter"
                        maxTagCount="responsive"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Tổ / bộ môn"
                        options={sectorOptions}
                        value={sectorFilter}
                        onChange={setSectorFilter}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Chức danh"
                        options={roleTitleOptions}
                        value={roleTitleFilter}
                        onChange={setRoleTitleFilter}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Trình độ"
                        options={degreeOptions}
                        value={degreeFilter}
                        onChange={setDegreeFilter}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        placeholder="Trạng thái"
                        options={statusOptions}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="crud-panel__filter"
                    />
                </div>

                <div className="crud-panel__body">
                    <Table<Personnel>
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng ${total} nhân sự`,
                        }}
                        onRow={(personnel) => ({
                            onDoubleClick: () =>
                                navigate(`/operations/personnel/${personnel.id}`),
                        })}
                    />
                </div>
            </section>
            ),
        },
        {
            key: "structure",
            label: "Theo cơ cấu",
            children: (
                <section className="crud-panel__card">
                    <div className="crud-panel__header">
                        <div className="crud-panel__title">
                            <span className="crud-panel__eyebrow">
                                CƠ CẤU NHÂN SỰ
                            </span>

                            <h3>Cán bộ quản lý – giáo viên – nhân viên</h3>
                        </div>
                    </div>

                    <div className="crud-panel__body">
                        <Table
                            rowKey="key"
                            columns={structureColumns}
                            dataSource={structureRows}
                            pagination={false}
                        />
                    </div>
                </section>
            ),
        },
        {
            key: "team",
            label: "Theo tổ chuyên môn",
            children: (
                <section className="crud-panel__card">
                    <div className="crud-panel__header">
                        <div className="crud-panel__title">
                            <span className="crud-panel__eyebrow">
                                TỔ CHUYÊN MÔN
                            </span>

                            <h3>Thành viên theo từng tổ (theo teamId)</h3>
                        </div>
                    </div>

                    <div className="crud-panel__body">
                        <Table
                            rowKey={(row) => row.sector.id}
                            columns={teamColumns}
                            dataSource={teamRows}
                            scroll={{ x: "max-content" }}
                            pagination={false}
                        />
                    </div>
                </section>
            ),
        },
        {
            key: "subject",
            label: "Chuyên môn",
            children: (
                <section className="crud-panel__card">
                    <div className="crud-panel__header">
                        <div className="crud-panel__title">
                            <span className="crud-panel__eyebrow">
                                BỘ MÔN
                            </span>

                            <h3>Giáo viên theo môn giảng dạy</h3>
                        </div>
                    </div>

                    <div className="crud-panel__body">
                        <Table
                            rowKey={(row) => row.subject.id}
                            columns={subjectColumns}
                            dataSource={subjectRows}
                            scroll={{ x: "max-content" }}
                            pagination={false}
                        />
                    </div>
                </section>
            ),
        },
        {
            key: "excellent",
            label: "Dạy giỏi",
            children: (
                <section className="crud-panel__card">
                    <div className="crud-panel__header">
                        <div className="crud-panel__title">
                            <span className="crud-panel__eyebrow">
                                GIÁO VIÊN DẠY GIỎI
                            </span>

                            <h3>Cán bộ – giáo viên đạt danh hiệu dạy giỏi</h3>
                        </div>
                    </div>

                    <div className="crud-panel__body">
                        <Table<Personnel>
                            rowKey="id"
                            columns={excellentColumns}
                            dataSource={excellentRows}
                            scroll={{ x: "max-content" }}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} người đạt danh hiệu`,
                            }}
                        />
                    </div>
                </section>
            ),
        },
        {
            key: "reward",
            label: "Thi đua – khen thưởng",
            children: (
                <section className="crud-panel__card">
                    <div className="crud-panel__header">
                        <div className="crud-panel__title">
                            <span className="crud-panel__eyebrow">
                                KHEN THƯỞNG
                            </span>

                            <h3>Danh hiệu, bằng khen theo nhân sự</h3>
                        </div>
                    </div>

                    <div className="crud-panel__body">
                        <Table
                            rowKey={(row) => row.reward.id}
                            columns={rewardColumns}
                            dataSource={rewardRows}
                            scroll={{ x: "max-content" }}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng ${total} minh chứng khen thưởng`,
                            }}
                        />
                    </div>
                </section>
            ),
        },
    ]}
/>

            <Modal
                open={open}
                title={editing ? `Cập nhật hồ sơ: ${editing?.fullName ?? ""}` : "Thêm mới nhân sự"}
                okText="Lưu"
                cancelText="Hủy"
                width={840}
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
                            name="code"
                            label="Mã nhân sự"
                            required
                            rules={[
                                { required: true, message: "Vui lòng nhập mã nhân sự" },
                                {
                                    validator: (_, value: string) => {
                                        if (!value) {
                                            return Promise.resolve();
                                        }

                                        const duplicate = items.some(
                                            (item) =>
                                                item.code.trim() === value.trim() &&
                                                item.id !== editing?.id,
                                        );

                                        return duplicate
                                            ? Promise.reject(new Error("Mã nhân sự đã tồn tại"))
                                            : Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="VD: CT-CBCS-018" />
                        </Form.Item>

                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                        >
                            <Input placeholder="VD: Nguyễn Thị An" />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                        >
                            <Select options={genderOptions} />
                        </Form.Item>

                        <Form.Item name="dob" label="Ngày sinh">
                            <Input type="date" />
                        </Form.Item>

                        <Form.Item
                            name="roleTitle"
                            label="Chức danh / Vị trí"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
                        >
                            <Input placeholder="VD: Giáo viên Toán" />
                        </Form.Item>

                        <Form.Item name="degree" label="Trình độ">
                            <Input placeholder="VD: Cử nhân Sư phạm Toán" />
                        </Form.Item>
                    </div>

                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Công tác
                        </Divider>

                        <Form.Item
                            name="subjectIds"
                            label="Môn giảng dạy"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn môn giảng dạy" }]}
                        >
                            <Select
                                mode="multiple"
                                options={subjectOptions}
                                placeholder="Chọn môn giảng dạy"
                                maxTagCount="responsive"
                            />
                        </Form.Item>

                        <Form.Item name="teamId" label="Tổ chuyên môn">
                            <Select
                                allowClear
                                options={sectorOptions}
                                placeholder="Chọn tổ chuyên môn"
                            />
                        </Form.Item>

                        <Form.Item
                            name="campusIds"
                            label="Cơ sở công tác"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn cơ sở công tác" }]}
                        >
                            <Select
                                mode="multiple"
                                options={campusOptions}
                                placeholder="Chọn cơ sở công tác"
                                maxTagCount="responsive"
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        >
                            <Select options={statusOptions} />
                        </Form.Item>
                    </div>

                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Liên hệ
                        </Divider>

                        <Form.Item name="phone" label="Số điện thoại">
                            <Input placeholder="VD: 0901xxxxxx" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    validator: (_, value: string) => {
                                        if (!value) {
                                            return Promise.resolve();
                                        }

                                        const duplicate = items.some(
                                            (item) =>
                                                item.email.trim().toLowerCase() ===
                                                    value.trim().toLowerCase() &&
                                                item.id !== editing?.id,
                                        );

                                        return duplicate
                                            ? Promise.reject(new Error("Email đã được sử dụng"))
                                            : Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="VD: an.nguyen@ninhkieu.edu.vn" />
                        </Form.Item>
                    </div>

                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Bổ sung
                        </Divider>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            style={{ display: "block", width: "100%" }}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Địa chỉ thường trú"
                            />
                        </Form.Item>

                        <Form.Item name="wardId" label="Phường/Xã">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={wardOptions}
                                placeholder="Chọn phường/xã"
                            />
                        </Form.Item>

                        <Form.Item name="careerStartDate" label="Ngày vào ngành">
                            <Input type="date" />
                        </Form.Item>

                        <Form.Item name="schoolStartDate" label="Ngày vào trường">
                            <Input type="date" />
                        </Form.Item>

                        <Form.Item name="isExcellentTeacher" label="GV giỏi / CSTĐ">
                            <Select options={yesNoOptions} />
                        </Form.Item>

                        <Form.Item
                            name="achievements"
                            label="Thành tích"
                            style={{ display: "block", width: "100%" }}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Thành tích, danh hiệu thi đua..."
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={statusPersonnel !== null}
                title={`Đổi trạng thái: ${statusPersonnel?.fullName ?? ""}`}
                okText="Lưu"
                cancelText="Hủy"
                width={520}
                destroyOnHidden
                onCancel={() => setStatusPersonnel(null)}
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
                        <Select options={statusOptions} />
                    </Form.Item>

                    <Form.Item
                        name="statusReason"
                        label="Lý do thay đổi"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Bắt buộc nhập lý do khi chuyển sang đã nghỉ / tạm ngừng"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PersonnelList;