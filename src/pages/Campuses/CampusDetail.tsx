import {
    AimOutlined,
    ArrowLeftOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    HomeOutlined,
    IdcardOutlined,
    PhoneOutlined,
    ReadOutlined,
    SafetyCertificateOutlined,
    SwapOutlined,
    TeamOutlined,
    ToolOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";

import {
    Breadcrumb,
    Button,
    Collapse,
    Descriptions,
    Empty,
    Form,
    InputNumber,
    Modal,
    Segmented,
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
    CampusStatus,
    Personnel,
    SchoolClass,
    SchoolRoom,
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

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    useRooms,
} from "@/store/useRooms";

import {
    useSemesters,
} from "@/store/useSemesters";

import {
    useTimetables,
} from "@/store/useTimetables";

import {
    buildCampusKpis,
} from "@/utils/campusScale";

import "./style.scss";


const STATUS_TONE: Record<CampusStatus, string> = {
    ACTIVE: "green",
    SUSPENDED: "orange",
    INACTIVE: "red",
};

const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

const TAB_KEYS = [
    "overview",
    "staff",
    "classes",
    "facilities",
    "timetable",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const PAGINATION = {
    showSizeChanger: false,
    showTotal: (total: number, range: [number, number]) =>
        `${range[0]}–${range[1]} / ${total}`,
};

const ROOM_CATEGORY_LABEL: Record<string, string> = {
    classroom: "Phòng học",
    function_room: "Phòng chức năng",
};

const ROOM_CONDITION_LABEL: Record<string, string> = {
    good: "Tốt",
    normal: "Bình thường",
    repair: "Cần sửa chữa",
};

const ROOM_CONDITION_TONE: Record<string, string> = {
    good: "green",
    normal: "blue",
    repair: "orange",
};

const TKB_VIEW_OPTIONS: { label: string; value: TkbView }[] = [
    { label: "Theo lớp", value: "class" },
    { label: "Theo giáo viên", value: "teacher" },
    { label: "Theo phòng", value: "room" },
];

type TkbView = "class" | "teacher" | "room";

const toWardName = (
    wardId: string,
): string => {
    return canThoMockData.wards.find(
        (ward) => ward.id === wardId,
    )?.name
        ?? wardId;
};

const toSubjectName = (
    subjectId: string,
): string => {
    return SUBJECT_NAME.get(subjectId) ?? subjectId;
};

const toSchoolName = (
    schoolId: string,
): string => {
    return canThoMockData.schools.find(
        (school) => school.id === schoolId,
    )?.name
        ?? schoolId;
};

const toManagerName = (
    managerId: string | undefined,
): string => {
    if (!managerId) {
        return "Chưa phân công";
    }

    const manager = canThoMockData.users.find(
        (user) => user.id === managerId,
    );

    if (manager) {
        return manager.fullName;
    }

    return canThoMockData.personnel.find(
        (item) => item.id === managerId,
    )?.fullName
        ?? "Chưa phân công";
};

const CampusDetail = () => {
    const { campusId = "" } = useParams();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const campusesApi = useCampuses();

    const historyApi = useCampusHistory(campusId);

    const personnelApi = usePersonnel();

    const roomsApi = useRooms(campusId);

    const semestersApi = useSemesters();

    const timetablesApi = useTimetables({
        campusId,
    });

    const campusStatusOptions =
        useCatalogOptions("campus-status");

    const campusTypeOptions =
        useCatalogOptions("campus-type");

    const statusLabelMap = useMemo(
        () => new Map<string, string>(
            campusStatusOptions.map(
                (option) => [String(option.value), option.label],
            ),
        ),
        [campusStatusOptions],
    );

    const typeLabelMap = useMemo(
        () => new Map<string, string>(
            campusTypeOptions.map(
                (option) => [String(option.value), option.label],
            ),
        ),
        [campusTypeOptions],
    );

    const campus = campusesApi.byId.get(campusId);

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return (TAB_KEYS as readonly string[]).includes(raw ?? "")
            ? raw as TabKey
            : "overview";
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    const [editPositionOpen, setEditPositionOpen] = useState(false);

    const [positionForm] = Form.useForm<{ latitude: number; longitude: number }>();

    const [tkbView, setTkbView] = useState<TkbView>("class");

    const stats = useMemo(
        () => campus
            ? buildCampusKpis(campus.id)
            : null,
        [campus],
    );

    const sectorNameById = useMemo(
        () => new Map<string, string>(
            canThoMockData.sectors.map(
                (sector) => [sector.id, sector.name],
            ),
        ),
        [],
    );

    const classById = useMemo(
        () => new Map<string, SchoolClass>(
            canThoMockData.classes.map((classItem) => [classItem.id, classItem]),
        ),
        [],
    );

    const campusClasses = useMemo(
        () => campus
            ? canThoMockData.classes.filter(
                (classItem) => classItem.campusId === campus.id,
            )
            : [],
        [campus],
    );

    const grades = useMemo(
        () => Array.from(
            new Set(campusClasses.map((classItem) => classItem.grade)),
        ).sort((a, b) => a - b),
        [campusClasses],
    );

    const studentCountByClass = useMemo(() => {
        const map = new Map<string, number>();

        for (const student of canThoMockData.students) {
            if (
                !student.classId ||
                student.status !== "studying"
            ) {
                continue;
            }

            map.set(
                student.classId,
                (map.get(student.classId) ?? 0) + 1,
            );
        }

        return map;
    }, []);

    const classCountByGrade = useMemo(() => {
        const map = new Map<number, number>();

        for (const classItem of campusClasses) {
            map.set(
                classItem.grade,
                (map.get(classItem.grade) ?? 0) + 1,
            );
        }

        return map;
    }, [campusClasses]);

    const studentCountByGrade = useMemo(() => {
        const map = new Map<number, number>();

        for (const classItem of campusClasses) {
            const count =
                studentCountByClass.get(classItem.id) ?? 0;

            map.set(
                classItem.grade,
                (map.get(classItem.grade) ?? 0) + count,
            );
        }

        return map;
    }, [campusClasses, studentCountByClass]);

    const timetableEntries = timetablesApi.effective;

    const timetableLookups = useMemo(
        () => buildTimetableLookups(
            subjects,
            campusClasses,
            personnelApi.items,
            campusesApi.items,
            roomsApi.items,
        ),
        [campusClasses, personnelApi.items, campusesApi.items, roomsApi.items],
    );

    const timetableSemester = useMemo(() => {
        const referenced = new Set(
            timetableEntries.map((entry) => entry.semesterId),
        );

        return semestersApi.items.find(
            (semester) => semester.status === "ACTIVE" &&
                referenced.has(semester.id),
        ) ?? semestersApi.items.find(
            (semester) => semester.status === "ACTIVE",
        );
    }, [timetableEntries, semestersApi.items]);

    const timetableRows = useMemo(() => {
        const counts = new Map<string, number>();

        for (const entry of timetableEntries) {
            const key = tkbView === "class"
                ? entry.classId
                : tkbView === "teacher"
                    ? entry.teacherId
                    : entry.roomId;

            if (!key) {
                continue;
            }

            counts.set(key, (counts.get(key) ?? 0) + 1);
        }

        const labelOf = (key: string): string => {
            if (tkbView === "class") {
                return classById.get(key)?.name ?? key;
            }

            if (tkbView === "teacher") {
                return personnelApi.byId.get(key)?.fullName ?? key;
            }

            return roomsApi.byId.get(key)?.code ?? key;
        };

        return Array.from(counts.entries())
            .map(([key, count]) => ({
                key,
                name: labelOf(key),
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }, [tkbView, timetableEntries, classById, personnelApi.byId, roomsApi.byId]);

    if (!campus || !stats) {
        return (
            <div className="campus-detail campus-detail--empty">
                <div className="campus-detail__empty">
                    <WarningOutlined />

                    <strong>Không tìm thấy cơ sở.</strong>

                    <span>
                        Cơ sở được yêu cầu không tồn tại hoặc đã bị xóa.
                    </span>

                    <Button
                        type="primary"
                        icon={<SwapOutlined />}
                        onClick={() =>
                            navigate("/operations/schools?tab=campuses")}
                    >
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    const kpis: {
        title: string;
        value: number;
        icon: ReactNode;
        tone: "blue" | "green" | "orange" | "purple";
        note: string;
        tab: TabKey;
    }[] = [
        {
            title: "Tổng nhân sự",
            value: stats.totalPersonnel,
            icon: <TeamOutlined />,
            tone: "blue",
            note: "CB-GV-NV trực thuộc cơ sở",
            tab: "staff",
        },
        {
            title: "Giáo viên",
            value: stats.teachers,
            icon: <ReadOutlined />,
            tone: "orange",
            note: "giảng dạy tại cơ sở",
            tab: "staff",
        },
        {
            title: "Cán bộ quản lý",
            value: stats.managers,
            icon: <SafetyCertificateOutlined />,
            tone: "purple",
            note: "ban giám hiệu / tổ trưởng",
            tab: "staff",
        },
        {
            title: "Nhân viên",
            value: stats.staff,
            icon: <IdcardOutlined />,
            tone: "blue",
            note: "phục vụ, hỗ trợ cơ sở",
            tab: "staff",
        },
        {
            title: "Lớp học",
            value: stats.classCount,
            icon: <HomeOutlined />,
            tone: "green",
            note: "lớp trực thuộc cơ sở",
            tab: "classes",
        },
        {
            title: "Học sinh",
            value: stats.studentCount,
            icon: <UserOutlined />,
            tone: "green",
            note: "đang theo học",
            tab: "classes",
        },
        {
            title: "Phòng học",
            value: stats.roomCount,
            icon: <ToolOutlined />,
            tone: "blue",
            note: "phòng phục vụ dạy học",
            tab: "facilities",
        },
    ];

    const personnelColumns: ColumnsType<Personnel> = [
        {
            title: "Họ tên",
            dataIndex: "fullName",
            render: (value: string, row) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() =>
                        navigate(`/operations/personnel/${row.id}?tab=overview`)}
                >
                    {value}
                </Button>
            ),
        },
        {
            title: "Vai trò",
            dataIndex: "roleTitle",
            width: 220,
        },
        {
            title: "Chuyên môn",
            dataIndex: "subjectIds",
            render: (value: string[]) => (
                <Space size={4} wrap>
                    {value.map((subjectId) => (
                        <Tag key={subjectId}>{toSubjectName(subjectId)}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Tổ bộ môn",
            dataIndex: "teamId",
            width: 200,
            render: (value: string | undefined) => {
                if (!value) {
                    return <span className="crud-panel__muted">—</span>;
                }

                return sectorNameById.get(value) ?? value;
            },
        },
        {
            title: "Chi tiết",
            key: "__navigate",
            width: 90,
            align: "center",
            render: (_: unknown, row: Personnel) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() =>
                        navigate(`/operations/personnel/${row.id}?tab=overview`)}
                >
                    Xem hồ sơ
                </Button>
            ),
        },
    ];

    const classColumns: ColumnsType<SchoolClass> = [
        {
            title: "Mã lớp",
            dataIndex: "code",
            width: 110,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Tên lớp",
            dataIndex: "name",
            render: (value: string, row) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() =>
                        navigate(`/operations/classes/${row.id}`)}
                >
                    {value}
                </Button>
            ),
        },
        {
            title: "Loại lớp",
            dataIndex: "classType",
            width: 130,
            render: (value: string) => {
                const map: Record<string, string> = {
                    REGULAR: "Lớp đại trà",
                    TWO_SESSION: "Lớp 2 buổi",
                    BOARDING: "Lớp nội trú",
                    SPECIAL: "Lớp chuyên biệt",
                };

                return map[value] ?? value;
            },
        },
        {
            title: "Giáo viên chủ nhiệm",
            dataIndex: "homeroomTeacherId",
            width: 180,
            render: (value: string | undefined) =>
                value
                    ? personnelApi.byId.get(value)?.fullName ?? value
                    : "—",
        },
        {
            title: "Sĩ số",
            width: 90,
            render: (_: unknown, row: SchoolClass) =>
                studentCountByClass.get(row.id) ?? 0,
        },
        {
            title: "",
            key: "__navigate",
            width: 70,
            align: "center",
            render: (_: unknown, row: SchoolClass) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() =>
                        navigate(`/operations/classes/${row.id}`)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    const roomColumns: ColumnsType<SchoolRoom> = [
        {
            title: "Mã phòng",
            dataIndex: "code",
            width: 120,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Tên phòng",
            key: "name",
            render: (_: unknown, row: SchoolRoom) =>
                `${ROOM_CATEGORY_LABEL[row.category] ?? row.category} ${row.code}`,
        },
        {
            title: "Loại phòng",
            dataIndex: "category",
            width: 160,
            render: (value: string) =>
                ROOM_CATEGORY_LABEL[value] ?? value,
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            width: 110,
            render: (value: number) => `${value} chỗ`,
        },
        {
            title: "Trạng thái sử dụng",
            dataIndex: "condition",
            width: 170,
            render: (value: string) => (
                <Tag color={ROOM_CONDITION_TONE[value] ?? "default"}>
                    {ROOM_CONDITION_LABEL[value] ?? value}
                </Tag>
            ),
        },
    ];

    const tkbSummaryColumns: ColumnsType<{
        key: string;
        name: string;
        count: number;
    }> = [
        {
            title: tkbView === "class"
                ? "Lớp"
                : tkbView === "teacher"
                    ? "Giáo viên"
                    : "Phòng",
            dataIndex: "name",
        },
        {
            title: "Số tiết",
            dataIndex: "count",
            width: 100,
            align: "right",
        },
    ];

    const tabItems = [
        {
            key: "overview",
            label: "Tổng quan",
            children: (
                <div className="campus-detail__overview">
                    <div className="page-kpi">
                        {kpis.map((kpi) => (
                            <StatsCard
                                key={kpi.title}
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
                        className="campus-detail__descriptions"
                    >
                        <Descriptions.Item label="Mã cơ sở">
                            <Tag>{campus.code}</Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tên cơ sở">
                            <strong>{campus.name}</strong>
                        </Descriptions.Item>

                        {campus.historicalName && (
                            <Descriptions.Item label="Tên lịch sử" span={2}>
                                {campus.historicalName}
                            </Descriptions.Item>
                        )}

                        <Descriptions.Item label="Loại cơ sở">
                            {typeLabelMap.get(campus.type) ?? campus.type}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            <Tag color={STATUS_TONE[campus.status]}>
                                {statusLabelMap.get(campus.status) ?? campus.status}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Đơn vị quản lý">
                            {toSchoolName(campus.schoolId)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ" span={2}>
                            <EnvironmentOutlined /> {campus.address}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phường/Xã">
                            {toWardName(campus.wardId)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Cán bộ phụ trách">
                            {toManagerName(campus.managerId)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tọa độ GIS">
                            <Space size={8}>
                                <Space size={4}>
                                    <AimOutlined />
                                    {campus.latitude.toFixed(4)}, {campus.longitude.toFixed(4)}
                                </Space>

                                <Button
                                    type="link"
                                    size="small"
                                    icon={<GlobalOutlined />}
                                    onClick={() => {
                                        setEditPositionOpen(true);

                                        positionForm.setFieldsValue({
                                            latitude: campus.latitude,
                                            longitude: campus.longitude,
                                        });
                                    }}
                                >
                                    Chỉnh vị trí
                                </Button>
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Liên hệ">
                            <Space direction="vertical" size={0}>
                                {campus.phone ? (
                                    <span><PhoneOutlined /> {campus.phone}</span>
                                ) : (
                                    <span className="crud-panel__muted">—</span>
                                )}

                                {campus.email ? (
                                    <span>{campus.email}</span>
                                ) : null}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: "staff",
            label: "Nhân sự",
            children: (
                <Table
                    rowKey="id"
                    columns={personnelColumns}
                    dataSource={personnelApi.items.filter(
                        (item) => item.campusIds.includes(campus.id),
                    )}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 8,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ),
        },
        {
            key: "classes",
            label: "Khối / Lớp",
            children: (
                <div className="campus-detail__tab">
                    {grades.length === 0 ? (
                        <Empty description="Cơ sở chưa có lớp học" />
                    ) : (
                        <Collapse
                            defaultActiveKey={[String(grades[0])]}
                            items={grades.map((grade) => {
                                const classesOfGrade = campusClasses.filter(
                                    (classItem) => classItem.grade === grade,
                                );

                                return {
                                    key: String(grade),
                                    label: (
                                        <Space size={16} wrap>
                                            <strong>Khối {grade}</strong>

                                            <span className="campus-detail__grade-count">
                                                {classCountByGrade.get(grade) ?? 0} lớp
                                            </span>

                                            <span className="campus-detail__grade-count">
                                                {studentCountByGrade.get(grade) ?? 0} học sinh
                                            </span>
                                        </Space>
                                    ),
                                    children: (
                                        <Table
                                            rowKey="id"
                                            columns={classColumns}
                                            dataSource={classesOfGrade}
                                            pagination={false}
                                            size="small"
                                            scroll={{ x: true }}
                                        />
                                    ),
                                };
                            })}
                        />
                    )}
                </div>
            ),
        },
        {
            key: "facilities",
            label: "Phòng & CSVC",
            children: (
                <Table
                    rowKey="id"
                    columns={roomColumns}
                    dataSource={roomsApi.byCampus}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 8,
                    }}
                    size="small"
                    scroll={{ x: true }}
                    locale={{
                        emptyText: (
                            <Empty description="Cơ sở chưa có dữ liệu phòng học" />
                        ),
                    }}
                />
            ),
        },
        {
            key: "timetable",
            label: "Thời khóa biểu",
            children: (
                <div className="campus-detail__tab">
                    <div className="campus-detail__toolbar">
                        <Segmented
                            size="small"
                            options={TKB_VIEW_OPTIONS}
                            value={tkbView}
                            onChange={(value) => setTkbView(value as TkbView)}
                        />

                        <Button
                            type="primary"
                            size="small"
                            icon={<ReadOutlined />}
                            onClick={() => navigate("/operations/timetable")}
                        >
                            Mở Thời khóa biểu
                        </Button>
                    </div>

                    <TimetableCalendar
                        entries={timetableEntries}
                        lookups={timetableLookups}
                        semester={timetableSemester}
                        mode="campus"
                        entityId={campusId}
                        showFilters
                        showCampusFilter={false}
                        showRoom={tkbView === "room"}
                        emptyText="Cơ sở chưa có tiết dạy trong tuần đang xem."
                    />

                    <Table
                        rowKey="key"
                        columns={tkbSummaryColumns}
                        dataSource={timetableRows}
                        pagination={{
                            ...PAGINATION,
                            pageSize: 10,
                        }}
                        size="small"
                        scroll={{ x: true }}
                        locale={{
                            emptyText: (
                                <Empty description="Cơ sở chưa có tiết dạy trong thời khóa biểu" />
                            ),
                        }}
                    />
                </div>
            ),
        },
    ];

    const breadcrumbItems = [
        {
            title: (
                <a
                    href="/operations/schools"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate("/operations/schools");
                    }}
                >
                    Trường & Phân hiệu
                </a>
            ),
        },
        {
            title: (
                <a
                    href="/operations/schools?tab=campuses"
                    onClick={(event) => {
                        event.preventDefault();
                        navigate("/operations/schools?tab=campuses");
                    }}
                >
                    Danh sách cơ sở
                </a>
            ),
        },
        {
            title: campus.name,
        },
    ];

    return (
        <div className="campus-detail">
            <Breadcrumb
                className="campus-detail__breadcrumb"
                items={breadcrumbItems}
            />

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            CHI TIẾT CƠ SỞ
                        </span>

                        <h2>{campus.name}</h2>

                        <p>{campus.address}</p>
                    </div>

                    <div className="page-head__meta">
                        <Tag color={STATUS_TONE[campus.status]}>
                            {statusLabelMap.get(campus.status) ?? campus.status}
                        </Tag>

                        <Tag color={campus.type === "HEADQUARTERS" ? "purple" : "default"}>
                            {typeLabelMap.get(campus.type) ?? campus.type}
                        </Tag>

                        {campus.phone && (
                            <span className="page-head__meta-phone">
                                <PhoneOutlined /> {campus.phone}
                            </span>
                        )}

                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() =>
                                navigate("/operations/schools?tab=campuses")}
                        >
                            Quay lại danh sách
                        </Button>

                        <Button
                            type="primary"
                            icon={<EnvironmentOutlined />}
                            onClick={() =>
                                navigate(`/operations/gis?campus=${campus.id}`)}
                        >
                            Xem trên GIS
                        </Button>
                    </div>
                </header>
            </div>

            <Tabs
                key={campus.id}
                className="campus-detail__tabs page-tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: "0 0 24px" }}
            />

            <Modal
                open={editPositionOpen}
                title="Chỉnh vị trí trên bản đồ"
                okText="Lưu tọa độ"
                cancelText="Hủy"
                width={460}
                destroyOnHidden
                onCancel={() => setEditPositionOpen(false)}
                onOk={() => positionForm.submit()}
            >
                <Form
                    form={positionForm}
                    layout="vertical"
                    onFinish={(values: { latitude: number; longitude: number }) => {
                        campusesApi.update({
                            ...campus,
                            ...values,
                        });

                        historyApi.create({
                            id: `campus-history-${Date.now().toString(36)}`,
                            campusId: campus.id,
                            type: "gis_changed",
                            actor: "Ban Giám hiệu",
                            content:
                                `Cập nhật tọa độ GIS sang ` +
                                `${Number(values.latitude).toFixed(4)}, ` +
                                `${Number(values.longitude).toFixed(4)}.`,
                            createdAt: new Date().toISOString(),
                        });

                        message.success("Đã cập nhật vị trí");

                        setEditPositionOpen(false);
                    }}
                >
                    <Form.Item
                        name="latitude"
                        label="Vĩ độ"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập vĩ độ" }]}
                    >
                        <InputNumber min={8} max={24} step={0.0001} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="longitude"
                        label="Kinh độ"
                        required
                        rules={[{ required: true, message: "Vui lòng nhập kinh độ" }]}
                    >
                        <InputNumber min={103} max={110} step={0.0001} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export { CampusDetail };

export default CampusDetail;