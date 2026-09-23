import {
    ArrowLeftOutlined,
    BookOutlined,
    CalendarOutlined,
    EditOutlined,
    EnvironmentOutlined,
    ReadOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Avatar,
    Button,
    Descriptions,
    Space,
    Table,
    Tabs,
    Tag,
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
    ClassHistoryEntry,
    TeachingAttendance,
    TimetableItem,
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
    usePersonnelAssignments,
} from "@/store/usePersonnelAssignments";

import {
    useRooms,
} from "@/store/useRooms";

import "./style.scss";


const TAB_KEYS = [
    "overview",
    "students",
    "homeroom",
    "teachers",
    "timetable",
    "room",
    "roster",
    "activities",
    "history",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const PAGINATION = {
    showSizeChanger: false,
    showTotal: (total: number, range: [number, number]) =>
        `${range[0]}–${range[1]} / ${total}`,
};

const STATUS_TONE: Record<string, string> = {
    active: "green",
    inactive: "orange",
    suspended: "orange",
    closed: "red",
};

const DAY_LABEL: Record<string, string> = {
    monday: "Thứ Hai",
    tuesday: "Thứ Ba",
    wednesday: "Thứ Tư",
    thursday: "Thứ Năm",
    friday: "Thứ Sáu",
    saturday: "Thứ Bảy",
    sunday: "Chủ nhật",
};

const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

const campusName = (
    campusesById: Map<string, Campus>,
    campusId: string,
): string => {
    const normalized = CAMPUS_LEGACY_ID_MAP[campusId] ?? campusId;

    return campusesById.get(normalized)?.name
        ?? campusId;
};

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

const ClassDetail = () => {
    const { classId = "" } = useParams();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const classesApi = useClasses();

    const campusesApi = useCampuses();

    const yearsApi = useAcademicYears();

    const personnelApi = usePersonnel();

    const assignmentApi = usePersonnelAssignments();

    const historyApi = useClassHistory(classId);

    const classTypeOptions = useCatalogOptions("class-type");

    const classStatusOptions = useCatalogOptions("class-status");

    const studentStatusOptions = useCatalogOptions("student-status");

    const classItem = classesApi.byId.get(classId);

    const roomsApi = useRooms(classItem?.campusId);

    const campusesById = campusesApi.byId;

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return (TAB_KEYS as readonly string[]).includes(raw ?? "")
            ? raw as TabKey
            : "overview";
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    useEffect(() => {
        if (!classItem && classesApi.items.length > 0) {
            navigate("/operations/classes", { replace: true });
        }
    }, [classItem, classesApi.items.length, navigate]);

    const students = useMemo(
        () => canThoMockData.students.filter(
            (student) =>
                student.classId === classId &&
                student.campusId === classItem?.campusId,
        ),
        [classId, classItem?.campusId],
    );

    const studyingStudents = useMemo(
        () => students.filter(
            (student) => student.status === "studying",
        ),
        [students],
    );

    const timetables = useMemo(
        () => canThoMockData.timetables.filter(
            (item) => item.classId === classId,
        ),
        [classId],
    );

    const activities = useMemo(
        () => canThoMockData.teachingAttendance.filter(
            (item) => item.classId === classId,
        ),
        [classId],
    );

    const assignments = useMemo(
        () => assignmentApi.items.filter(
            (item) => item.classId === classId,
        ),
        [assignmentApi.items, classId],
    );

    const subjectTeachers = useMemo(() => {
        const map = new Map<string, string>();

        for (const assignment of assignments) {
            if (assignment.status !== "active") {
                continue;
            }

            map.set(assignment.subjectId, assignment.personnelId);
        }

        return map;
    }, [assignments]);

    const room = classItem?.roomId
        ? roomsApi.byId.get(classItem.roomId)
        : undefined;

    if (!classItem) {
        return null;
    }

    const statusLabel = classStatusOptions.find(
        (option) => String(option.value) === classItem.status,
    )?.label
        ?? classItem.status;

    const classTypeLabel = classTypeOptions.find(
        (option) => String(option.value) === classItem.classType,
    )?.label
        ?? "Lớp đại trà";

    const academicYear = yearsApi.byId.get(classItem.academicYear);

    const homeroomTeacher = classItem.homeroomTeacherId
        ? personnelApi.byId.get(classItem.homeroomTeacherId)
        : undefined;

    const studentCount = studyingStudents.length;

    const maleCount = studyingStudents.filter(
        (student) => student.gender === "male",
    ).length;

    const femaleCount = studyingStudents.filter(
        (student) => student.gender === "female",
    ).length;

    const capacity = classItem.capacity ?? 40;

    const kpis = [
        {
            title: "Học sinh",
            value: studentCount,
            icon: <TeamOutlined />,
            tone: "blue" as const,
            note: `sức chứa ${capacity}`,
            tab: "students" as TabKey,
        },
        {
            title: "Nam / Nữ",
            value: `${maleCount}/${femaleCount}`,
            icon: <UserOutlined />,
            tone: "green" as const,
            note: "học sinh",
            tab: "roster" as TabKey,
        },
        {
            title: "GVCN",
            value: homeroomTeacher ? "Đã phân công" : "Chưa phân công",
            icon: <ReadOutlined />,
            tone: "purple" as const,
            note: "giáo viên chủ nhiệm",
            tab: "homeroom" as TabKey,
        },
        {
            title: "Môn được phân công",
            value: subjectTeachers.size,
            icon: <BookOutlined />,
            tone: "orange" as const,
            note: "giáo viên bộ môn",
            tab: "teachers" as TabKey,
        },
        {
            title: "Tiết TKB",
            value: timetables.length,
            icon: <CalendarOutlined />,
            tone: "purple" as const,
            note: "tiết trong tuần",
            tab: "timetable" as TabKey,
        },
        {
            title: "Hoạt động giảng dạy",
            value: activities.length,
            icon: <CalendarOutlined />,
            tone: "blue" as const,
            note: "lượt ghi nhận",
            tab: "activities" as TabKey,
        },
    ];

    const studentColumns: ColumnsType<typeof students[number]> = [
        {
            title: "Mã HS",
            dataIndex: "code",
            width: 110,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 220,
            render: (value: string, row) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() => navigate(`/operations/students/${row.id}`)}
                >
                    {value}
                </Button>
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            width: 100,
            render: (value: string) =>
                value === "male" ? "Nam" : "Nữ",
        },
        {
            title: "Năm sinh",
            dataIndex: "dob",
            width: 120,
            render: (value: string) => {
                const year = new Date(`${value}T00:00:00`).getFullYear();

                return Number.isNaN(year) ? value : String(year);
            },
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            width: 140,
            render: (value: string) => (
                <Tag color={value === "studying" ? "green" : "orange"}>
                    {studentStatusOptions.find(
                        (option) => String(option.value) === value,
                    )?.label ?? value}
                </Tag>
            ),
        },
    ];

    const assignmentColumns: ColumnsType<typeof assignments[number]> = [
        {
            title: "Môn",
            dataIndex: "subjectId",
            width: 160,
            render: (value: string) => (
                <Tag color="blue">{SUBJECT_NAME.get(value) ?? value}</Tag>
            ),
        },
        {
            title: "Giáo viên",
            dataIndex: "personnelId",
            render: (value: string) => {
                const teacher = personnelApi.byId.get(value);

                return teacher?.fullName ?? value;
            },
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 110,
        },
        {
            title: "Học kỳ",
            dataIndex: "semester",
            width: 90,
            render: (value: number) => `HK${value}`,
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

    const timetableColumns: ColumnsType<TimetableItem> = [
        {
            title: "Ngày",
            dataIndex: "day",
            width: 110,
            render: (value: string) => DAY_LABEL[value] ?? value,
        },
        {
            title: "Tiết",
            dataIndex: "period",
            width: 70,
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            width: 140,
            render: (value: string) => (
                <Tag color="blue">{SUBJECT_NAME.get(value) ?? value}</Tag>
            ),
        },
        {
            title: "Giáo viên",
            dataIndex: "teacherId",
            width: 200,
            render: (value: string) => {
                const teacher = personnelApi.byId.get(value);

                return teacher?.fullName ?? value;
            },
        },
        {
            title: "Phòng",
            dataIndex: "room",
            width: 90,
        },
        {
            title: "Thời gian",
            width: 150,
            render: (_: unknown, row: TimetableItem) => (
                <span>{row.startTime} – {row.endTime}</span>
            ),
        },
    ];

    const activityColumns: ColumnsType<TeachingAttendance> = [
        {
            title: "Ngày",
            dataIndex: "date",
            width: 130,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Môn",
            dataIndex: "timetableId",
            width: 140,
            render: (value: string) => {
                const timetable = canThoMockData.timetables.find(
                    (item) => item.id === value,
                );

                return timetable
                    ? <Tag color="blue">{SUBJECT_NAME.get(timetable.subjectId) ?? timetable.subjectId}</Tag>
                    : value;
            },
        },
        {
            title: "Giáo viên",
            dataIndex: "teacherId",
            render: (value: string) => {
                const teacher = personnelApi.byId.get(value);

                return teacher?.fullName ?? value;
            },
        },
        {
            title: "Kết quả",
            dataIndex: "status",
            width: 130,
            render: (value: string) => {
                const map: Record<string, string> = {
                    present: "Đứng lớp",
                    late: "Vào muộn",
                    absent: "Nghỉ",
                };

                const tone: Record<string, string> = {
                    present: "green",
                    late: "orange",
                    absent: "red",
                };

                return (
                    <Tag color={tone[value] ?? "default"}>
                        {map[value] ?? value}
                    </Tag>
                );
            },
        },
    ];

    const historyColumns: ColumnsType<ClassHistoryEntry> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 150,
            render: (value: ClassHistoryEntry["type"]) => {
                const map: Record<string, string> = {
                    created: "Thành lập",
                    updated: "Cập nhật",
                    status_changed: "Trạng thái",
                    teacher_changed: "GVCN",
                    room_changed: "Phòng học",
                };

                const toneMap: Record<string, string> = {
                    created: "green",
                    updated: "blue",
                    status_changed: "orange",
                    teacher_changed: "purple",
                    room_changed: "cyan",
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

    const roomColumns: ColumnsType<typeof roomsApi.byCampus[number]> = [
        {
            title: "Mã phòng",
            dataIndex: "code",
            width: 100,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 150,
            render: (value: string) =>
                value === "classroom" ? "Phòng học" : "Phòng chức năng",
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            width: 100,
        },
        {
            title: "Tình trạng",
            dataIndex: "condition",
            width: 120,
            render: (value: string) => {
                const map: Record<string, string> = {
                    good: "Tốt",
                    normal: "Bình thường",
                    repair: "Cần sửa chữa",
                };

                const tone: Record<string, string> = {
                    good: "green",
                    normal: "blue",
                    repair: "orange",
                };

                return (
                    <Tag color={tone[value] ?? "default"}>
                        {map[value] ?? value}
                    </Tag>
                );
            },
        },
    ];

    const tabItems = [
        {
            key: "overview",
            label: "Tổng quan",
            children: (
                <div className="classes-detail__tab">
                    <div className="page-kpi">
                        {kpis.map((kpi) => (
                            <StatsCard
                                key={kpi.tab + kpi.title}
                                title={kpi.title}
                                value={kpi.value}
                                icon={kpi.icon}
                                tone={kpi.tone}
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
                        <Descriptions.Item label="Tên lớp">
                            <strong>{classItem.name}</strong>
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã lớp">
                            <Tag>{classItem.code}</Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Khối">
                            Khối {classItem.grade}
                        </Descriptions.Item>

                        <Descriptions.Item label="Năm học">
                            {academicYear?.name ?? classItem.academicYear}
                        </Descriptions.Item>

                        <Descriptions.Item label="Loại lớp">
                            {classTypeLabel}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            <Tag color={STATUS_TONE[classItem.status] ?? "default"}>
                                {statusLabel}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Cơ sở" span={2}>
                            <Button
                                type="link"
                                size="small"
                                style={{ padding: 0 }}
                                icon={<EnvironmentOutlined />}
                                onClick={() =>
                                    navigate(
                                        `/operations/campuses/${classItem.campusId}?tab=overview`,
                                    )}
                            >
                                {campusName(campusesById, classItem.campusId)}
                            </Button>
                        </Descriptions.Item>

                        <Descriptions.Item label="GVCN">
                            {homeroomTeacher ? (
                                <Button
                                    type="link"
                                    size="small"
                                    style={{ padding: 0 }}
                                    onClick={() =>
                                        navigate(
                                            `/operations/personnel/${homeroomTeacher.id}?tab=overview`,
                                        )}
                                >
                                    {homeroomTeacher.fullName}
                                </Button>
                            ) : (
                                <span className="classes-muted">Chưa phân công</span>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phòng học chính">
                            {room
                                ? `${room.code} (${room.category === "classroom" ? "Phòng học" : "Phòng chức năng"})`
                                : <span className="classes-muted">Chưa có</span>}
                        </Descriptions.Item>

                        <Descriptions.Item label="Sức chứa">
                            {capacity} học sinh (đang có {studentCount})
                        </Descriptions.Item>

                        <Descriptions.Item label="Sĩ số">
                            Nam {maleCount} · Nữ {femaleCount}
                        </Descriptions.Item>

                        {classItem.note && (
                            <Descriptions.Item label="Ghi chú" span={2}>
                                {classItem.note}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </div>
            ),
        },
        {
            key: "students",
            label: "Học sinh",
            children: students.length > 0 ? (
                <div className="classes-detail__tab">
                    <div className="students-detail__toolbar">
                        <Button
                            icon={<TeamOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/students?classId=${classItem.id}`,
                                )}
                        >
                            Xem tất cả học sinh
                        </Button>
                    </div>

                    <Table
                        rowKey="id"
                        columns={studentColumns}
                        dataSource={students}
                        pagination={{
                            ...PAGINATION,
                            pageSize: 10,
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </div>
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có học sinh trong lớp."
                />
            ),
        },
        {
            key: "homeroom",
            label: "GVCN",
            children: homeroomTeacher ? (
                <div className="classes-detail__teacher">
                    <div className="classes-detail__teacher-card">
                        <Avatar
                            size={54}
                            style={{
                                backgroundColor:
                                    homeroomTeacher.gender === "female"
                                        ? "#eb2f96"
                                        : "#1677ff",
                                flexShrink: 0,
                            }}
                        >
                            {toName(homeroomTeacher.fullName)}
                        </Avatar>

                        <div className="classes-detail__teacher-info">
                            <div className="classes-detail__teacher-name">
                                {homeroomTeacher.fullName}
                            </div>

                            <span className="classes-detail__teacher-meta">
                                {homeroomTeacher.code} · {homeroomTeacher.roleTitle}
                            </span>

                            <Space size={4} wrap className="classes-detail__teacher-tags">
                                {homeroomTeacher.subjectIds.map((subjectId) => (
                                    <Tag key={subjectId} color="blue">
                                        {SUBJECT_NAME.get(subjectId) ?? subjectId}
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    </div>

                    <Space wrap>
                        <Button
                            type="primary"
                            icon={<ReadOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/personnel/${homeroomTeacher.id}?tab=overview`,
                                )}
                        >
                            Xem hồ sơ GVCN
                        </Button>

                        <Button
                            icon={<EditOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/personnel/${homeroomTeacher.id}?tab=assignment`,
                                )}
                        >
                            Xem phân công giảng dạy
                        </Button>
                    </Space>
                </div>
            ) : (
                <Alert
                    type="warning"
                    showIcon
                    message="Lớp chưa được phân công GVCN."
                />
            ),
        },
        {
            key: "teachers",
            label: "Giáo viên bộ môn",
            children: assignments.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={assignmentColumns}
                    dataSource={assignments}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 8,
                    }}
                    size="small"
                    scroll={{ x: true }}
                    onRow={(assignment) => ({
                        onDoubleClick: () =>
                            navigate(
                                `/operations/personnel/${assignment.personnelId}?tab=assignment`,
                            ),
                    })}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có phân công giảng dạy cho lớp."
                />
            ),
        },
        {
            key: "timetable",
            label: "Thời khóa biểu",
            children: timetables.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={timetableColumns}
                    dataSource={timetables}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 12,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có thời khóa biểu cho lớp."
                />
            ),
        },
        {
            key: "room",
            label: "Phòng học",
            children: (
                <div className="classes-detail__tab">
                    <Alert
                        type="info"
                        showIcon
                        message={
                            room
                                ? `Phòng chính của lớp: ${room.code} – sức chứa ${room.capacity}.`
                                : "Lớp chưa được chỉ định phòng học chính."
                        }
                        description={
                            `Cơ sở ${campusName(campusesById, classItem.campusId)} có ` +
                            `${roomsApi.byCampus.length} phòng học / phòng chức năng.`
                        }
                    />

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
                    />
                </div>
            ),
        },
        {
            key: "roster",
            label: "Sĩ số",
            children: (
                <div className="classes-detail__tab">
                    <Descriptions
                        column={3}
                        size="small"
                        bordered
                        className="personnel-detail-tabs__descriptions"
                    >
                        <Descriptions.Item label="Tổng học sinh">
                            {studentCount}
                        </Descriptions.Item>

                        <Descriptions.Item label="Nam">
                            {maleCount}
                        </Descriptions.Item>

                        <Descriptions.Item label="Nữ">
                            {femaleCount}
                        </Descriptions.Item>

                        <Descriptions.Item label="Sức chứa">
                            {capacity}
                        </Descriptions.Item>

                        <Descriptions.Item label="Còn trống">
                            {Math.max(0, capacity - studentCount)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tỷ lệ">
                            {capacity > 0
                                ? `${Math.round((studentCount / capacity) * 100)}%`
                                : "—"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Alert
                        type={
                            studentCount >= capacity
                                ? "warning"
                                : "success"
                        }
                        showIcon
                        message={
                            studentCount >= capacity
                                ? "Lớp đã đạt hoặc vượt sức chứa."
                                : "Lớp còn chỗ tiếp nhận học sinh."
                        }
                    />
                </div>
            ),
        },
        {
            key: "activities",
            label: "Hoạt động",
            children: activities.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={activityColumns}
                    dataSource={activities}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 10,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có ghi nhận hoạt động giảng dạy của lớp."
                />
            ),
        },
        {
            key: "history",
            label: "Lịch sử",
            children: historyApi.byClass.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={historyColumns}
                    dataSource={historyApi.byClass}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 10,
                    }}
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
        <div className="classes-detail-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span
                            className="personnel-detail__breadcrumb"
                            onClick={() => navigate("/operations/classes")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate("/operations/classes");
                                }
                            }}
                        >
                            <ArrowLeftOutlined /> Danh sách lớp học
                        </span>

                        <div className="personnel-detail__identity">
                            <div>
                                <div className="personnel-detail__identity-name">
                                    Lớp {classItem.name}
                                </div>

                                <span className="personnel-detail__identity-meta">
                                    {classItem.code} · Khối {classItem.grade} ·{" "}
                                    {academicYear?.name ?? classItem.academicYear}
                                </span>

                                <div className="personnel-detail__identity-tags">
                                    <Space size={4} wrap>
                                        <Tag color={STATUS_TONE[classItem.status] ?? "default"}>
                                            {statusLabel}
                                        </Tag>

                                        <Tag>{classTypeLabel}</Tag>

                                        {homeroomTeacher && (
                                            <Tag color="purple">
                                                GVCN: {homeroomTeacher.fullName}
                                            </Tag>
                                        )}
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-head__meta">
                        <Tag color="geekblue">
                            {campusName(campusesById, classItem.campusId)}
                        </Tag>

                        <Tag color="cyan">
                            {studentCount} học sinh
                        </Tag>
                    </div>
                </header>
            </div>

            <Tabs
                key={classItem.id}
                className="classes-detail__tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: 0 }}
            />
        </div>
    );
};

export { ClassDetail };

export default ClassDetail;