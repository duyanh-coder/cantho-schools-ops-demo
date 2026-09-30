import {
    ArrowLeftOutlined,
    BookOutlined,
    PlusOutlined,
    ReadOutlined,
    TeamOutlined,
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

import TimetableCalendar from "@/components/TimetableCalendar";

import {
    buildTimetableLookups,
} from "@/components/TimetableCalendar/lookups";

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
    useClasses,
} from "@/store/useClasses";

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

import {
    useRooms,
} from "@/store/useRooms";

import {
    useSemesters,
} from "@/store/useSemesters";

import {
    useTimetables,
} from "@/store/useTimetables";

import "./style.scss";


type TabKey = "personal" | "timetable" | "history";

/**
 * Ánh xạ các tab/đường link legacy sang tab mới (phase 04):
 * Tổng quan, Chuyên môn, Công tác, Phân công giảng dạy, Dạy giỏi,
 * Thi đua & Khen thưởng đều được gộp vào "Thông tin cá nhân".
 */
const LEGACY_TAB_MAP: Record<string, TabKey> = {
    overview: "personal",
    personal: "personal",
    professional: "personal",
    work: "personal",
    assignment: "personal",
    competition: "personal",
    reward: "personal",
    timetable: "timetable",
    history: "history",
};

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

    const classesApi = useClasses();

    const roomsApi = useRooms();

    const semestersApi = useSemesters();

    const assignmentApi = usePersonnelAssignments(personnelId);

    const competitionApi = usePersonnelCompetitions(personnelId);

    const rewardApi = usePersonnelRewards(personnelId);

    const workHistoryApi = usePersonnelWorkHistory(personnelId);

    const historyApi = usePersonnelHistory(personnelId);

    /**
     * Thời khóa biểu lấy toàn bộ dữ liệu rồi lọc theo giáo viên ở tầng
     * hiển thị, nhờ vậy bộ phát hiện xung đột nhìn được cả các tiết của
     * giáo viên khác và bắt được xung đột lớp học khi một lớp có hai
     * giáo viên cùng khung giờ. Một instance duy nhất nên sửa tiết ngay
     * trên màn hình vẫn cập nhật lưới và các cảnh báo.
     */
    const timetablesApi = useTimetables();

    const calendarEntries = useMemo(
        () => timetablesApi.effective.filter((entry) =>
            entry.teacherId === personnelId),
        [timetablesApi.effective, personnelId],
    );

    const calendarSemesters = useMemo(
        () => [...new Set(
            calendarEntries.map((entry) => entry.semesterId),
        )].sort(),
        [calendarEntries],
    );

    const calendarLookups = useMemo(
        () => buildTimetableLookups(
            subjects,
            classesApi.items,
            personnelApi.items,
            campusesApi.items,
            roomsApi.items,
        ),
        [
            classesApi.items,
            personnelApi.items,
            campusesApi.items,
            roomsApi.items,
        ],
    );

    const calendarSemester = useMemo(
        () => calendarSemesters
            .map((semesterId) =>
                semestersApi.items.find(
                    (semester) => semester.id === semesterId,
                ))
            .find((semester) => semester?.status === "ACTIVE") ??
            semestersApi.items.find(
                (semester) => semester.status === "ACTIVE",
            ),
        [calendarSemesters, semestersApi.items],
    );

    /**
     * Bộ chọn học kỳ chỉ nên có những học kỳ mà giáo viên thực sự có
     * tiết, tránh chọn xong ra một lưới trống.
     */
    const calendarSemesterOptions = useMemo(
        () => semestersApi.items.filter((semester) =>
            calendarSemesters.includes(semester.id)),
        [calendarSemesters, semestersApi.items],
    );

    const genderOptions = useCatalogOptions("gender");

    const semesterOptions = useCatalogOptions("semester");

    const personnelStatusOptions = useCatalogOptions("personnel-status");

    const awardOptions = useCatalogOptions("award");

    const personnel = personnelApi.byId.get(personnelId);

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return LEGACY_TAB_MAP[raw ?? ""] ?? "personal";
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

    const goBackToList = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/operations/schools?tab=personnel");
        }
    };

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
            anchor: "chuyen-mon",
        },
        {
            title: "Môn giảng dạy",
            value: personnel.subjectIds.length,
            icon: <BookOutlined />,
            tone: "green" as const,
            note: "bộ môn chính",
            anchor: "chuyen-mon",
        },
        {
            title: "Tiết/tuần",
            value: currentSemester?.periodsPerWeek ?? "—",
            icon: <ReadOutlined />,
            tone: "purple" as const,
            note: "khối lượng đang đảm nhiệm",
            anchor: "cong-tac",
        },
    ];

    const scrollToCard = (
        anchor: string,
    ) => {
        document.getElementById(`personnel-cv-${anchor}`)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const calendarReady = calendarEntries.length > 0;

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

    const cvLyLichFields: Array<{
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
            label: "Địa chỉ thường trú",
            value: personnel.address || "—",
        },
        {
            label: "Phường/Xã",
            value: wardName(personnel.wardId),
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
            label: "Chức danh",
            value: personnel.roleTitle,
        },
        {
            label: "Trình độ",
            value: personnel.degree || "—",
        },
        {
            label: "Cơ sở công tác",
            value: personnel.campusIds.map((campusId) => campusName(campusesById, campusId)).join(", "),
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
            key: "personal",
            label: "Thông tin cá nhân",
            children: (
                <div className="personnel-detail-tab personnel-detail-tab--cv">
                    <div className="page-kpi">
                        {kpis.map((kpi) => (
                            <StatsCard
                                key={`${kpi.anchor}-${kpi.title}`}
                                tone={kpi.tone}
                                title={kpi.title}
                                value={kpi.value}
                                icon={kpi.icon}
                                note={kpi.note}
                                onClick={() => scrollToCard(kpi.anchor)}
                            />
                        ))}
                    </div>

                    <div className="personnel-detail__cv">
                        <aside className="personnel-detail__cv-side">
                            <Avatar
                                size={120}
                                style={{
                                    backgroundColor: avatarColor(personnel.gender),
                                }}
                            >
                                {toName(personnel.fullName)}
                            </Avatar>

                            <h4>{personnel.fullName}</h4>

                            <span className="personnel-detail__cv-side-role">
                                {personnel.roleTitle}
                            </span>

                            <div className="personnel-detail__cv-side-tags">
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

                                    {personnel.campusIds.map((campusId) => (
                                        <Tag key={campusId} color="purple">
                                            {campusName(campusesById, campusId)}
                                        </Tag>
                                    ))}
                                </Space>
                            </div>

                            <dl className="personnel-detail__cv-side-facts">
                                <div>
                                    <dt>Mã nhân sự</dt>
                                    <dd>{personnel.code}</dd>
                                </div>

                                <div>
                                    <dt>Điện thoại</dt>
                                    <dd>{personnel.phone || "—"}</dd>
                                </div>

                                <div>
                                    <dt>Email</dt>
                                    <dd>{personnel.email || "—"}</dd>
                                </div>
                            </dl>
                        </aside>

                        <main className="personnel-detail__cv-main">
                            <section
                                id="personnel-cv-lylich"
                                className="personnel-detail__cv-card"
                            >
                                <h5>Lý lịch</h5>

                                <Descriptions
                                    column={2}
                                    size="small"
                                    bordered
                                    className="personnel-detail-tabs__descriptions"
                                >
                                    {cvLyLichFields.map((field, index) => (
                                        <Descriptions.Item
                                            key={field.label}
                                            label={field.label}
                                            span={
                                                field.label === "Cơ sở công tác" ? 2 : 1
                                            }
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
                            </section>

                            <section
                                id="personnel-cv-chuyen-mon"
                                className="personnel-detail__cv-card"
                            >
                                <h5>Chuyên môn</h5>

                                <Descriptions
                                    column={2}
                                    size="small"
                                    bordered
                                    className="personnel-detail-tabs__descriptions"
                                >
                                    {professionalFields.map((field) => (
                                        <Descriptions.Item
                                            key={field.label}
                                            label={field.label}
                                        >
                                            {field.value}
                                        </Descriptions.Item>
                                    ))}

                                    <Descriptions.Item
                                        label="Môn giảng dạy"
                                        span={2}
                                    >
                                        <Space size={4} wrap>
                                            {personnel.subjectIds.map((subjectId) => (
                                                <Tag key={subjectId} color="blue">
                                                    {subjectName(subjectId)}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                            </section>

                            <section
                                id="personnel-cv-cong-tac"
                                className="personnel-detail__cv-card"
                            >
                                <h5>Công tác</h5>

                                <div className="personnel-detail__cv-block-head">
                                    <h6>Phân công giảng dạy</h6>

                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={openAddAssignment}
                                    >
                                        Thêm phân công
                                    </Button>
                                </div>

                                {assignmentApi.byPersonnel.length > 0 ? (
                                    <Table
                                        rowKey="id"
                                        columns={assignmentColumns}
                                        dataSource={assignmentApi.byPersonnel}
                                        pagination={paging(5)}
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

                                <div className="personnel-detail__cv-block-head">
                                    <h6>Quá trình công tác</h6>
                                </div>

                                {workHistoryApi.byPersonnel.length > 0 ? (
                                    <Table
                                        rowKey="id"
                                        columns={workColumns}
                                        dataSource={workHistoryApi.byPersonnel}
                                        pagination={paging(5)}
                                        size="small"
                                        scroll={{ x: true }}
                                    />
                                ) : (
                                    <Alert
                                        type="info"
                                        showIcon
                                        message="Chưa có dữ liệu quá trình công tác."
                                    />
                                )}
                            </section>

                            <section
                                id="personnel-cv-day-gioi"
                                className="personnel-detail__cv-card"
                            >
                                <h5>Giáo viên dạy giỏi</h5>

                                {competitionApi.byPersonnel.length > 0 ? (
                                    <Table
                                        rowKey="id"
                                        columns={competitionColumns}
                                        dataSource={competitionApi.byPersonnel}
                                        pagination={paging(5)}
                                        size="small"
                                        scroll={{ x: true }}
                                    />
                                ) : (
                                    <Alert
                                        type="info"
                                        showIcon
                                        message="Chưa có kết quả hội thi giáo viên dạy giỏi."
                                    />
                                )}
                            </section>

                            <section
                                id="personnel-cv-khen-thuong"
                                className="personnel-detail__cv-card"
                            >
                                <h5>Thi đua & Khen thưởng</h5>

                                {rewardApi.byPersonnel.length > 0 ? (
                                    <Table
                                        rowKey="id"
                                        columns={rewardColumns}
                                        dataSource={rewardApi.byPersonnel}
                                        pagination={paging(5)}
                                        size="small"
                                        scroll={{ x: true }}
                                    />
                                ) : (
                                    <Alert
                                        type="info"
                                        showIcon
                                        message="Chưa có danh hiệu thi đua, khen thưởng."
                                    />
                                )}

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
                            </section>
                        </main>
                    </div>
                </div>
            ),
        },
        {
            key: "timetable",
            label: "Thời khóa biểu",
            children: calendarReady ? (
                <TimetableCalendar
                    key={personnelId}
                    entries={calendarEntries}
                    lookups={calendarLookups}
                    semester={calendarSemester}
                    semesterOptions={calendarSemesterOptions}
                    mode="teacher"
                    entityId={personnelId}
                    showRoom
                    showFilters
                    showSemesterFilter
                    showCampusFilter={false}
                    showGradeFilter
                    showSubjectFilter
                    scopeOptionsToEntries
                    emptyText="Giáo viên không có tiết nào trong tuần và bộ lọc đang chọn."
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Giáo viên chưa có tiết nào trong thời khóa biểu."
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
                            className="page-head__back"
                            onClick={goBackToList}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    goBackToList();
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
                tabBarStyle={{ margin: "0 0 24px" }}
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