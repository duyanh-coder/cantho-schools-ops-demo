import {
    ArrowLeftOutlined,
    BookOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    ReadOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Avatar,
    Button,
    Descriptions,
    Empty,
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
    ClassHistoryEntry,
    EnrolmentChange,
    StudentMovement,
    TeachingAttendance,
} from "@/mock/common/types";

import {
    buildClassEnrolment,
    buildClassNeeds,
    buildClassRosterIntegrity,
    buildClassRosterStats,
    buildClassWarnings,
} from "@/utils/classRoster";

import {
    useAcademicYears,
} from "@/store/useAcademicYears";

import {
    useBoardingProfiles,
} from "@/store/useBoardingProfiles";

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
    useEnrolmentChanges,
} from "@/store/useEnrolmentChanges";

import {
    useGrades,
} from "@/store/useGrades";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    usePersonnelAssignments,
} from "@/store/usePersonnelAssignments";

import {
    useRooms,
} from "@/store/useRooms";

import {
    useSemesters,
} from "@/store/useSemesters";

import {
    useStudents,
} from "@/store/useStudents";

import {
    useStudentMovements,
} from "@/store/useStudentMovements";

import {
    useTimetables,
} from "@/store/useTimetables";

import StudentList from "@/pages/Students/StudentList";

import "./style.scss";


const TAB_KEYS = [
    "overview",
    "students",
    "teachers",
    "timetable",
    "enrollment",
    "needs",
    "records",
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

const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

const MOVEMENT_NAME: Record<string, string> = {
    admitted: "Tiếp nhận",
    class_transfer: "Chuyển lớp",
    campus_transfer: "Chuyển cơ sở",
    school_transfer: "Chuyển trường",
    drop_out: "Bỏ học",
    withdraw: "Rút học",
    graduate: "Tốt nghiệp",
};

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

    const gradesApi = useGrades();

    const campusesApi = useCampuses();

    const yearsApi = useAcademicYears();

    const personnelApi = usePersonnel();

    const assignmentApi = usePersonnelAssignments();

    const historyApi = useClassHistory(classId);

    const timetablesApi = useTimetables({
        classId,
    });

    const classTypeOptions = useCatalogOptions("class-type");

    const classStatusOptions = useCatalogOptions("class-status");

    const classItem = classesApi.byId.get(classId);

    const roomsApi = useRooms(classItem?.campusId);

    const studentsApi = useStudents(
        classItem?.schoolId,
        classItem?.campusId,
        classId,
    );

    const boardingApi = useBoardingProfiles();

    const movementApi = useStudentMovements();

    const enrolmentApi = useEnrolmentChanges(classId);

    const campusesById = campusesApi.byId;

    const semestersApi = useSemesters(classItem?.academicYear);

    const timetableLookups = useMemo(
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

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return (TAB_KEYS as readonly string[]).includes(raw ?? "")
            ? raw as TabKey
            : "overview";
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    useEffect(() => {
        if (!classItem && classesApi.items.length > 0) {
            navigate("/operations/schools?tab=classes", { replace: true });
        }
    }, [classItem, classesApi.items.length, navigate]);

    const students = useMemo(
        () => classId
            ? studentsApi.byClass
            : [],
        [classId, studentsApi.byClass],
    );

    const studyingStudents = useMemo(
        () => students.filter(
            (student) => student.status === "studying",
        ),
        [students],
    );

    const profileByStudent = useMemo(
        () => new Map(
            boardingApi.items
                .filter((profile) =>
                    profile.academicYearId === classItem?.academicYear)
                .map((profile) => [profile.studentId, profile] as const),
        ),
        [boardingApi.items, classItem?.academicYear],
    );

    const rosterRows = useMemo(
        () => studyingStudents.map((student) => ({
            student,
            profile: profileByStudent.get(student.id),
        })),
        [studyingStudents, profileByStudent],
    );

    const rosterStats = useMemo(
        () => classItem
            ? buildClassRosterStats(students, classItem)
            : null,
        [students, classItem],
    );

    const rosterIntegrity = useMemo(
        () => classItem
            ? buildClassRosterIntegrity(students, classItem)
            : null,
        [students, classItem],
    );

    const needs = useMemo(
        () => buildClassNeeds(rosterRows),
        [rosterRows],
    );

    const enrolment = useMemo(
        () => buildClassEnrolment(
            enrolmentApi.byClass,
            movementApi.items,
            classId,
        ),
        [enrolmentApi.byClass, movementApi.items, classId],
    );

    const timetables = timetablesApi.effective;

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

    const classSemester =
        semestersApi.items.find(
            (semester) => semester.id === timetables[0]?.semesterId,
        ) ??
        semestersApi.byAcademicYear.find(
            (semester) => semester.status === "ACTIVE",
        );

    const homeroomTeacher = classItem.homeroomTeacherId
        ? personnelApi.byId.get(classItem.homeroomTeacherId)
        : undefined;

    const grade = classItem.gradeId
        ? gradesApi.byId.get(classItem.gradeId)
        : undefined;

    const stats = rosterStats ?? {
        total: 0,
        male: 0,
        female: 0,
        capacity: classItem.capacity ?? 40,
        remaining: classItem.capacity ?? 40,
        fillRate: 0,
    };

    const studentCount = stats.total;

    const maleCount = stats.male;

    const femaleCount = stats.female;

    const capacity = stats.capacity;

    const warnings = buildClassWarnings(stats, {
        homeroomTeacherId: classItem.homeroomTeacherId,
        needs,
        netPending: enrolment.netPending,
        ...(rosterIntegrity ? { integrity: rosterIntegrity } : {}),
    });

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
            tab: "enrollment" as TabKey,
        },
        {
            title: "GVCN",
            value: homeroomTeacher ? "Đã phân công" : "Chưa phân công",
            icon: <ReadOutlined />,
            tone: "purple" as const,
            note: "giáo viên chủ nhiệm",
            tab: "teachers" as TabKey,
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
            tab: "records" as TabKey,
        },
        {
            title: "Bán trú / 2 buổi",
            value: `${needs.boarding}/${needs.twoSession}`,
            icon: <HomeOutlined />,
            tone: "orange" as const,
            note: "học sinh",
            tab: "needs" as TabKey,
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
                const timetable = timetablesApi.byId.get(value);

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

    const enrolmentColumns: ColumnsType<EnrolmentChange> = [
        {
            title: "Học sinh",
            dataIndex: "studentName",
        },
        {
            title: "Loại",
            dataIndex: "changeType",
            width: 140,
            render: (value: EnrolmentChange["changeType"]) => (
                <Tag color={value === "increase" ? "green" : "orange"}>
                    {value === "increase" ? "Tăng sĩ số" : "Giảm sĩ số"}
                </Tag>
            ),
        },
        {
            title: "Hiệu lực",
            dataIndex: "effectiveDate",
            width: 130,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Lý do",
            dataIndex: "reason",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 130,
            render: (value: string) => (
                <Tag color={value === "pending" ? "orange" : "green"}>
                    {value === "pending" ? "Chờ duyệt" : "Đã xử lý"}
                </Tag>
            ),
        },
    ];

    const movementColumns: ColumnsType<StudentMovement> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 170,
            render: (value: StudentMovement["type"]) => (
                <Tag>{MOVEMENT_NAME[value] ?? value}</Tag>
            ),
        },
        {
            title: "Từ lớp",
            dataIndex: "fromClassId",
            width: 190,
            render: (value: string | undefined) =>
                classesApi.byId.get(value ?? "")?.name ?? "—",
        },
        {
            title: "Đến lớp",
            dataIndex: "toClassId",
            width: 190,
            render: (value: string | undefined) =>
                classesApi.byId.get(value ?? "")?.name ?? "—",
        },
        {
            title: "Hiệu lực",
            dataIndex: "effectiveDate",
            width: 130,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Lý do",
            dataIndex: "reason",
        },
    ];

    const needColumns: ColumnsType<typeof rosterRows[number]> = [
        {
            title: "Học sinh",
            dataIndex: "student",
            render: (value: typeof rosterRows[number]["student"]) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() =>
                        navigate(`/operations/students/${value.id}?tab=profile`)}
                >
                    {value.fullName}
                </Button>
            ),
        },
        {
            title: "Mã",
            dataIndex: ["student", "code"],
            width: 120,
        },
        {
            title: "Bán trú",
            dataIndex: ["profile", "boarding"],
            width: 110,
            render: (value: boolean | undefined) =>
                value ? <Tag color="blue">Có</Tag> : <Tag>Không</Tag>,
        },
        {
            title: "2 buổi",
            dataIndex: ["profile", "twoSession"],
            width: 100,
            render: (value: boolean | undefined) =>
                value ? <Tag color="purple">Có</Tag> : <Tag>Không</Tag>,
        },
        {
            title: "Ăn sáng",
            dataIndex: ["profile", "mealRequired"],
            width: 110,
            render: (value: boolean | undefined) =>
                value ? <Tag color="orange">Có</Tag> : <Tag>Không</Tag>,
        },
        {
            title: "Bắt đầu",
            dataIndex: ["profile", "startDate"],
            width: 130,
            render: (value: string | undefined) =>
                value
                    ? new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN")
                    : "—",
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
                            {grade
                                ? `${grade.name} (${grade.code})`
                                : `Khối ${classItem.grade}`}
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

                    {warnings.length > 0 && (
                        <div className="classes-detail__warnings">
                            {warnings.map((warning) => (
                                <Alert
                                    key={warning.title}
                                    type={warning.tone}
                                    showIcon
                                    message={warning.title}
                                    description={warning.detail}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "students",
            label: "Học sinh",
            children: (
                <div className="classes-detail__tab">
                    <div className="classes-detail__students-context">
                        <strong>
                            HỌC SINH – LỚP {classItem.name.toUpperCase()}
                        </strong>

                        <span>
                            Khối {classItem.grade} ·{" "}
                            {campusName(
                                campusesById,
                                classItem.campusId,
                            )} · Năm học{" "}
                            {classItem.academicYear} · GVCN:{" "}
                            {homeroomTeacher
                                ? homeroomTeacher.fullName
                                : "Chưa phân công"}
                        </span>
                    </div>

                    {rosterStats && (
                        <div className="page-kpi">
                            <StatsCard
                                title="Sĩ số"
                                value={`${rosterStats.total} / ${rosterStats.capacity}`}
                                icon={<TeamOutlined />}
                                tone="blue"
                                note={
                                    rosterStats.total > rosterStats.capacity
                                        ? "vượt sức chứa"
                                        : `${rosterStats.fillRate}% sức chứa`
                                }
                            />

                            <StatsCard
                                title="Nam"
                                value={rosterStats.male}
                                icon={<UserOutlined />}
                                tone="blue"
                                note="học sinh đang học"
                            />

                            <StatsCard
                                title="Nữ"
                                value={rosterStats.female}
                                icon={<TeamOutlined />}
                                tone="purple"
                                note="học sinh đang học"
                            />

                            <StatsCard
                                title="Còn trống"
                                value={rosterStats.remaining}
                                icon={<ReadOutlined />}
                                tone="green"
                                note="chỉ tiêu tiếp nhận"
                            />

                            <StatsCard
                                title="Bán trú"
                                value={needs.boarding}
                                icon={<HomeOutlined />}
                                tone="blue"
                                note="có hồ sơ nhu cầu"
                            />

                            <StatsCard
                                title="2 buổi"
                                value={needs.twoSession}
                                icon={<CalendarOutlined />}
                                tone="purple"
                                note="có hồ sơ nhu cầu"
                            />

                            <StatsCard
                                title="Ăn uống"
                                value={needs.meal}
                                icon={<EnvironmentOutlined />}
                                tone="orange"
                                note="có hồ sơ nhu cầu"
                            />
                        </div>
                    )}

                    <StudentList
                        compact
                        schoolId={classItem.schoolId}
                        classId={classItem.id}
                    />
                </div>
            ),
        },
        {
            key: "teachers",
            label: "Giáo viên",
            children: (
                <div className="classes-detail__tab">
                    {homeroomTeacher && (
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
                                        GVCN · {homeroomTeacher.code} ·{" "}
                                        {homeroomTeacher.roleTitle}
                                    </span>

                                    <Space
                                        size={4}
                                        wrap
                                        className="classes-detail__teacher-tags"
                                    >
                                        {homeroomTeacher.subjectIds.map(
                                            (subjectId) => (
                                                <Tag
                                                    key={subjectId}
                                                    color="blue"
                                                >
                                                    {SUBJECT_NAME.get(subjectId)
                                                        ?? subjectId}
                                                </Tag>
                                            ),
                                        )}
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
                            </Space>
                        </div>
                    )}

                    {assignments.length > 0 ? (
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
                                        `/operations/personnel/${assignment.personnelId}?tab=personal`,
                                    ),
                            })}
                        />
                    ) : (
                        <Alert
                            type="info"
                            showIcon
                            message="Chưa có phân công giảng dạy cho lớp."
                        />
                    )}
                </div>
            ),
        },
        {
            key: "timetable",
            label: "Thời khóa biểu",
            children: timetables.length > 0 ? (
                <TimetableCalendar
                    entries={timetables}
                    lookups={timetableLookups}
                    semester={classSemester}
                    mode="class"
                    entityId={classId}
                    showFilters={false}
                    showClass={false}
                    showRoom
                    onNavigate={(to) => navigate(to)}
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
            key: "enrollment",
            label: "Tiếp nhận",
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
                            {stats.remaining}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tỷ lệ">
                            {capacity > 0 ? `${stats.fillRate}%` : "—"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Alert
                        type={studentCount >= capacity ? "warning" : "success"}
                        showIcon
                        message={
                            studentCount >= capacity
                                ? "Lớp đã đạt hoặc vượt sức chứa."
                                : "Lớp còn chỗ tiếp nhận học sinh."
                        }
                    />

                    <Alert
                        type="info"
                        showIcon
                        message={
                            enrolment.netPending === 0
                                ? "Không có thay đổi tiếp nhận nào đang chờ duyệt."
                                : `Còn ${enrolment.netPending} thay đổi tiếp nhận đang chờ duyệt `
                                    + `(tăng ${enrolment.pendingIn.length}, `
                                    + `giảm ${enrolment.pendingOut.length}).`
                        }
                    />

                    {enrolmentApi.byClass.length > 0 ? (
                        <Table
                            rowKey="id"
                            columns={enrolmentColumns}
                            dataSource={enrolmentApi.byClass}
                            pagination={{
                                ...PAGINATION,
                                pageSize: 8,
                            }}
                            size="small"
                            scroll={{ x: true }}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Lớp chưa có thay đổi tiếp nhận nào."
                        />
                    )}

                    {enrolment.movements.length > 0 && (
                        <Table
                            rowKey="id"
                            columns={movementColumns}
                            dataSource={enrolment.movements}
                            pagination={{
                                ...PAGINATION,
                                pageSize: 8,
                            }}
                            size="small"
                            scroll={{ x: true }}
                        />
                    )}
                </div>
            ),
        },
        {
            key: "needs",
            label: "Nhu cầu",
            children: (
                <div className="classes-detail__tab">
                    <div className="page-kpi">
                        <StatsCard
                            title="Bán trú"
                            value={needs.boarding}
                            icon={<HomeOutlined />}
                            tone="blue"
                            note="học sinh có hồ sơ"
                        />

                        <StatsCard
                            title="Học 2 buổi"
                            value={needs.twoSession}
                            icon={<CalendarOutlined />}
                            tone="purple"
                            note="học sinh có hồ sơ"
                        />

                        <StatsCard
                            title="Ăn sáng"
                            value={needs.meal}
                            icon={<TeamOutlined />}
                            tone="orange"
                            note="học sinh có hồ sơ"
                        />
                    </div>

                    <Alert
                        type={
                            needs.inactiveProfile > 0 ? "warning" : "info"
                        }
                        showIcon
                        message={
                            needs.inactiveProfile > 0
                                ? `${needs.inactiveProfile} hồ sơ bán trú đã hết hiệu lực.`
                                : "Hồ sơ bán trú của lớp đều đang có hiệu lực."
                        }
                        description={
                            `Lớp ${classTypeLabel.toLowerCase()} của cơ sở `
                            + `${campusName(campusesById, classItem.campusId)}.`
                        }
                    />

                    {rosterRows.length > 0 ? (
                        <Table
                            rowKey={(row) => row.student.id}
                            columns={needColumns}
                            dataSource={rosterRows}
                            pagination={{
                                ...PAGINATION,
                                pageSize: 10,
                            }}
                            size="small"
                            scroll={{ x: true }}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Lớp chưa có học sinh đang học."
                        />
                    )}
                </div>
            ),
        },
        {
            key: "records",
            label: "Hồ sơ",
            children: (
                <div className="classes-detail__tab">
                    <section className="classes-detail__section">
                        <h3>Lịch sử khối/lớp học</h3>

                        {historyApi.byClass.length > 0 ? (
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
                        )}
                    </section>

                    <section className="classes-detail__section">
                        <h3>Hoạt động giảng dạy</h3>

                        {activities.length > 0 ? (
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
                        )}
                    </section>

                    <section className="classes-detail__section">
                        <h3>Phòng học của cơ sở</h3>

                        <Alert
                            type="info"
                            showIcon
                            message={
                                room
                                    ? `Phòng chính của lớp: ${room.code} – sức chứa ${room.capacity}.`
                                    : "Lớp chưa được chỉ định phòng học chính."
                            }
                            description={
                                `Cơ sở ${campusName(campusesById, classItem.campusId)} có `
                                + `${roomsApi.byCampus.length} phòng học / phòng chức năng.`
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
                    </section>
                </div>
            ),
        },
    ];

    return (
        <div className="classes-detail-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span
                            className="page-head__back"
                            onClick={() => navigate("/operations/schools?tab=classes")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate("/operations/schools?tab=classes");
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
                                    {classItem.code} ·{" "}
                                    {grade?.name ?? `Khối ${classItem.grade}`} ·{" "}
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
                className="classes-detail__tabs page-tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: "0 0 24px" }}
            />
        </div>
    );
};

export { ClassDetail };

export default ClassDetail;