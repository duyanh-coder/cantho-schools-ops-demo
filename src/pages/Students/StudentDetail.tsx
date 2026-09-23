import {
    ArrowLeftOutlined,
    BookOutlined,
    EnvironmentOutlined,
    ReadOutlined,
    SwapOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Descriptions,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Timeline,
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

import type {
    ReactNode,
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

import {
    canThoWards,
} from "@/mock/canTho";

import type {
    Campus,
    StudentAchievement,
    StudentHistoryEntry,
    StudentMovement,
    StudentMovementType,
    TimetableItem,
} from "@/mock/common/types";

import {
    useAcademicYears,
} from "@/store/useAcademicYears";

import {
    useBoardingProfiles,
} from "@/store/useBoardingProfiles";

import {
    useCampuses,
    CAMPUS_LEGACY_ID_MAP,
} from "@/store/useCampuses";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import {
    useClasses,
} from "@/store/useClasses";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    useStudentAchievements,
} from "@/store/useStudentAchievements";

import {
    useStudentHistory,
} from "@/store/useStudentHistory";

import {
    useStudentMovements,
} from "@/store/useStudentMovements";

import {
    useStudents,
} from "@/store/useStudents";

import {
    useTranscripts,
} from "@/store/useTranscripts";

import { MOVEMENT_TYPE_LABEL } from "@/pages/Students/labels";

import "./style.scss";


const TAB_KEYS = [
    "overview",
    "profile",
    "progress",
    "transcript",
    "timetable",
    "movements",
    "boarding",
    "achievements",
    "history",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const PAGE_SIZE = {
    showSizeChanger: false,
    showTotal: (total: number, range: [number, number]) =>
        `${range[0]}–${range[1]} / ${total}`,
};

const STATUS_TONE: Record<string, string> = {
    studying: "green",
    transferred: "orange",
    dropped_out: "red",
    graduated: "blue",
    suspended: "orange",
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

const MOVEMENT_TYPE_TONE: Record<string, string> = {
    admitted: "green",
    class_transfer: "cyan",
    campus_transfer: "geekblue",
    school_transfer: "orange",
    drop_out: "red",
    withdraw: "volcano",
    graduate: "purple",
};

const HISTORY_EVENT: Record<string, { label: string; tone: string }> = {
    created: { label: "Tạo hồ sơ", tone: "green" },
    updated: { label: "Cập nhật", tone: "blue" },
    profile_changed: { label: "Hồ sơ", tone: "cyan" },
    status_changed: { label: "Trạng thái", tone: "orange" },
    class_changed: { label: "Chuyển lớp", tone: "geekblue" },
    campus_changed: { label: "Chuyển cơ sở", tone: "purple" },
    admitted: { label: "Nhập học", tone: "green" },
    transferred: { label: "Chuyển trường", tone: "orange" },
    graduated: { label: "Tốt nghiệp", tone: "purple" },
};

const campusName = (
    campusesById: Map<string, Campus>,
    campusId: string,
): string => {
    const normalized = CAMPUS_LEGACY_ID_MAP[campusId] ?? campusId;

    return campusesById.get(normalized)?.name
        ?? campusId;
};

const nowIso = (): string => new Date().toISOString();

const StudentDetail = () => {
    const { studentId = "" } = useParams();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const studentsApi = useStudents();

    const campusesApi = useCampuses();

    const yearsApi = useAcademicYears();

    const classesApi = useClasses();

    const personnelApi = usePersonnel();

    const transcriptsApi = useTranscripts(studentId);

    const movementsApi = useStudentMovements(studentId);

    const achievementsApi = useStudentAchievements(studentId);

    const boardingApi = useBoardingProfiles(studentId);

    const historyApi = useStudentHistory(studentId);

    const statusOptions = useCatalogOptions("student-status");

    const [movementModal, setMovementModal] = useState<boolean>(false);

    const [movementType, setMovementType] =
        useState<StudentMovementType>("class_transfer");

    const [movementForm] = Form.useForm<Record<string, unknown>>();

    const campusesById = campusesApi.byId;

    const classesById = classesApi.byId;

    const student = studentsApi.byId.get(studentId);

    const classItem = student?.classId
        ? classesById.get(student.classId)
        : undefined;

    const homeroomTeacher = classItem?.homeroomTeacherId
        ? personnelApi.byId.get(classItem.homeroomTeacherId)
        : undefined;

    const initialTab = useMemo<TabKey>(() => {
        const raw = searchParams.get("tab");

        return (TAB_KEYS as readonly string[]).includes(raw ?? "")
            ? raw as TabKey
            : "overview";
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

    useEffect(() => {
        if (!student && studentsApi.items.length > 0) {
            navigate("/operations/students", { replace: true });
        }
    }, [student, studentsApi.items.length, navigate]);

    const transcripts = useMemo(() => transcriptsApi.byStudent, [transcriptsApi.byStudent]);

    const movements = useMemo(() => movementsApi.byStudent, [movementsApi.byStudent]);

    const achievements = useMemo(() => achievementsApi.byStudent, [achievementsApi.byStudent]);

    const boardingProfiles = useMemo(() => boardingApi.byStudent, [boardingApi.byStudent]);

    const historyEntries = useMemo(() => historyApi.byStudent, [historyApi.byStudent]);

    const timetables = useMemo(
        () => canThoMockData.timetables.filter(
            (item) => item.classId === student?.classId,
        ),
        [student?.classId],
    );

    const [movementCampus, setMovementCampus] = useState<string | undefined>();

    const movementOptions = useMemo(
        () => (campusFilter: string | undefined) => {
            return classesApi.bySchool
                .filter((classItem) =>
                    classItem.academicYear === student?.academicYear &&
                    (campusFilter ? classItem.campusId === campusFilter : true))
                .map((classItem) => ({
                    value: classItem.id,
                    label: `${classItem.name} – ${campusName(campusesById, classItem.campusId)}`,
                }));
        },
        [classesApi.bySchool, student?.academicYear, campusesById],
    );

    const timelineItems = useMemo(() => {
        type Item = {
            key: string;

            color: string;

            children: ReactNode;
        };

        const fromMovement = movements.map<Item>((movement) => ({
            key: `m-${movement.id}`,
            color: MOVEMENT_TYPE_TONE[movement.type] ?? "gray",
            children: (
                <div>
                    <strong>{MOVEMENT_TYPE_LABEL[movement.type] ?? movement.type}</strong>
                    {" "}
                    <span className="students-muted">
                        {new Date(`${movement.effectiveDate}T00:00:00`).toLocaleDateString("vi-VN")}
                    </span>

                    <div>{movement.reason}</div>
                </div>
            ),
        }));

        const fromHistory = historyEntries.map<Item>((entry) => ({
            key: `h-${entry.id}`,
            color: HISTORY_EVENT[entry.type]?.tone ?? "gray",
            children: (
                <div>
                    <strong>
                        {HISTORY_EVENT[entry.type]?.label ?? entry.type}
                    </strong>
                    {" "}
                    <span className="students-muted">
                        {new Date(entry.createdAt).toLocaleString("vi-VN")}
                    </span>

                    <div>{entry.content}</div>
                </div>
            ),
        }));

        return [...fromMovement, ...fromHistory].sort(
            (a, b) => {
                const aKey = a.key.replace(/^[mh]-/, "");

                const bKey = b.key.replace(/^[mh]-/, "");

                return bKey.localeCompare(aKey);
            },
        );
    }, [movements, historyEntries]);

    const academicYear = student?.academicYear
        ? yearsApi.byId.get(student.academicYear)
        : undefined;

    const ward = student?.wardId
        ? canThoWards.find((item) => item.id === student.wardId)
        : undefined;

    if (!student) {
        return null;
    }

    const statusLabel = statusOptions.find(
        (option) => String(option.value) === student.status,
    )?.label
        ?? student.status;

    const averageScore = (() => {
        if (transcripts.length === 0) {
            return 0;
        }

        const total = transcripts.reduce(
            (sum, record) => sum + record.score,
            0,
        );

        return Math.round((total / transcripts.length) * 100) / 100;
    })();

    const activeBoarding = boardingProfiles.find(
        (profile) => profile.status === "active",
    );

    const kpis = [
        {
            title: "Môn học có điểm",
            value: transcripts.length,
            icon: <BookOutlined />,
            tone: "blue" as const,
            note: "bản ghi học bạ",
            tab: "transcript" as TabKey,
        },
        {
            title: "Điểm TB học bạ",
            value: averageScore > 0 ? averageScore.toFixed(2) : "—",
            icon: <ReadOutlined />,
            tone: "green" as const,
            note: "Học kỳ 1",
            tab: "transcript" as TabKey,
        },
        {
            title: "Số biến động",
            value: movements.length,
            icon: <SwapOutlined />,
            tone: "orange" as const,
            note: "lượt biến động",
            tab: "movements" as TabKey,
        },
        {
            title: "Thành tích",
            value: achievements.length,
            icon: <TrophyOutlined />,
            tone: "purple" as const,
            note: "giải thưởng",
            tab: "achievements" as TabKey,
        },
        {
            title: "Bán trú / 2 buổi",
            value: activeBoarding ? "Đang áp dụng" : "Không",
            icon: <TeamOutlined />,
            tone: "blue" as const,
            note: activeBoarding
                ? activeBoarding.twoSession ? "học 2 buổi" : "bán trú"
                : "chưa đăng ký",
            tab: "boarding" as TabKey,
        },
        {
            title: "GVCN",
            value: homeroomTeacher ? "Đã phân công" : "Chưa phân công",
            icon: <UserOutlined />,
            tone: "green" as const,
            note: homeroomTeacher?.fullName ?? "lớp hiện tại",
            tab: "overview" as TabKey,
        },
    ];

    const transcriptColumns: ColumnsType<typeof transcripts[number]> = [
        {
            title: "Môn",
            dataIndex: "subjectId",
            width: 140,
            render: (value: string) => (
                <Tag color="blue">{SUBJECT_NAME.get(value) ?? value}</Tag>
            ),
        },
        {
            title: "Học kỳ",
            dataIndex: "semester",
            width: 90,
            render: (value: number) => `HK${value}`,
        },
        {
            title: "Điểm",
            dataIndex: "score",
            width: 80,
            render: (value: number) => <strong>{value.toFixed(1)}</strong>,
        },
        {
            title: "Kết quả",
            dataIndex: "result",
            width: 90,
            render: (value: string) => (
                <Tag color="green">{value ?? "Đạt"}</Tag>
            ),
        },
        {
            title: "Hạnh kiểm",
            dataIndex: "conduct",
            width: 110,
            render: (value: string) => (
                <Tag color={value === "Tốt" ? "cyan" : "default"}>{value}</Tag>
            ),
        },
        {
            title: "Giáo viên",
            dataIndex: "teacherId",
            width: 180,
            render: (value: string | undefined) => {
                if (!value) {
                    return <span className="students-muted">—</span>;
                }

                const teacher = personnelApi.byId.get(value);

                return teacher?.fullName ?? value;
            },
        },
        {
            title: "Nhận xét",
            dataIndex: "comment",
        },
    ];

    const movementColumns: ColumnsType<StudentMovement> = [
        {
            title: "Ngày hiệu lực",
            dataIndex: "effectiveDate",
            width: 120,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Loại",
            dataIndex: "type",
            width: 140,
            render: (value: StudentMovementType) => (
                <Tag color={MOVEMENT_TYPE_TONE[value] ?? "default"}>
                    {MOVEMENT_TYPE_LABEL[value] ?? value}
                </Tag>
            ),
        },
        {
            title: "Từ / Đến (Cơ sở)",
            key: "__campuses",
            width: 220,
            render: (_: unknown, movement: StudentMovement) => {
                const from = movement.fromCampusId
                    ? campusName(campusesById, movement.fromCampusId)
                    : movement.fromSchoolName ?? "—";

                const to = movement.toCampusId
                    ? campusName(campusesById, movement.toCampusId)
                    : movement.toSchoolName ?? "—";

                return (
                    <span>{from} → {to}</span>
                );
            },
        },
        {
            title: "Từ / Đến (Lớp)",
            key: "__class",
            width: 150,
            render: (_: unknown, movement: StudentMovement) => {
                const fromClass = movement.fromClassId
                    ? classesById.get(movement.fromClassId)?.name
                    : "—";

                const toClass = movement.toClassId
                    ? classesById.get(movement.toClassId)?.name
                    : "—";

                return (
                    <span>{fromClass} → {toClass}</span>
                );
            },
        },
        {
            title: "Lý do",
            dataIndex: "reason",
        },
        {
            title: "Số QĐ",
            dataIndex: "decisionNo",
            width: 120,
            render: (value: string | undefined) => (
                <Tag>{value ?? "—"}</Tag>
            ),
        },
    ];

    const achievementColumns: ColumnsType<StudentAchievement> = [
        {
            title: "Ngày đạt",
            dataIndex: "achievedDate",
            width: 120,
            render: (value: string) =>
                new Date(value).toLocaleDateString("vi-VN"),
        },
        {
            title: "Thành tích",
            dataIndex: "title",
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 120,
            render: (value: string) => ({
                competition: "Thi đua",
                movement: "Phong trào",
                other: "Khác",
            })[value] ?? value,
        },
        {
            title: "Cấp",
            dataIndex: "level",
            width: 110,
            render: (value: string) => {
                const map: Record<string, string> = {
                    school: "Cấp trường",
                    district: "Cấp quận",
                    city: "Cấp thành phố",
                    province: "Cấp tỉnh",
                    national: "Quốc gia",
                };

                const tone: Record<string, string> = {
                    school: "green",
                    district: "blue",
                    city: "geekblue",
                    province: "purple",
                    national: "gold",
                };

                return (
                    <Tag color={tone[value] ?? "default"}>
                        {map[value] ?? value}
                    </Tag>
                );
            },
        },
        {
            title: "Kết quả",
            dataIndex: "result",
            width: 150,
        },
    ];

    const historyColumns: ColumnsType<StudentHistoryEntry> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 150,
            render: (value: StudentHistoryEntry["type"]) => {
                const meta = HISTORY_EVENT[value];

                return (
                    <Tag color={meta?.tone ?? "default"}>
                        {meta?.label ?? value}
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

    const openMovement = (type: StudentMovementType) => {
        setMovementType(type);

        movementForm.resetFields();

        movementForm.setFieldsValue({
            effectiveDate: new Date().toISOString().slice(0, 10),
        });

        setMovementModal(true);
    };

    const handleMovementFinish = (
        values: Record<string, unknown>,
    ) => {
        const effectiveDate = String(values.effectiveDate);

        const reason = String(values.reason ?? "").trim();

        const decisionNo = values.decisionNo
            ? String(values.decisionNo).trim()
            : undefined;

        if (!reason) {
            message.error("Vui lòng nhập lý do");

            return;
        }

        if (effectiveDate <= student.dob) {
            message.error("Ngày hiệu lực không hợp lệ");

            return;
        }

        const baseMovement: StudentMovement = {
            id: `can-tho-movement-${Date.now().toString(36)}`,
            studentId: student.id,
            academicYearId: student.academicYear ?? "2026-2027",
            type: movementType,
            effectiveDate,
            reason,
            decisionNo,
            status: "completed",
            createdAt: nowIso(),
        };

        if (movementType === "class_transfer" || movementType === "campus_transfer") {
            const toClassId = String(values.toClassId ?? "");

            const toClass = classesById.get(toClassId);

            if (!toClass) {
                message.error("Vui lòng chọn lớp chuyển đến");

                return;
            }

            const movement: StudentMovement = {
                ...baseMovement,
                fromCampusId: student.campusId,
                fromClassId: student.classId,
                toCampusId: toClass.campusId,
                toClassId,
            };

            movementsApi.create(movement);

            studentsApi.update({
                ...student,
                campusId: toClass.campusId,
                classId: toClass.id,
                grade: toClass.grade,
                academicYear: toClass.academicYear,
            });

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: student.id,
                type: movementType === "campus_transfer"
                    ? "campus_changed"
                    : "class_changed",
                actor: "Bộ phận tuyển sinh",
                content: `Chuyển ${student.fullName} đến lớp ${toClass.name} (${campusName(campusesById, toClass.campusId)}) theo QĐ-${decisionNo ?? effectiveDate}.`,
                createdAt: nowIso(),
            });

            message.success("Đã ghi nhận biến động và cập nhật lớp mới");
        } else if (movementType === "school_transfer") {
            const toSchoolName = String(values.toSchoolName ?? "").trim();

            if (!toSchoolName) {
                message.error("Vui lòng nhập tên trường chuyển đến");

                return;
            }

            movementsApi.create({
                ...baseMovement,
                fromCampusId: student.campusId,
                fromClassId: student.classId,
                fromSchoolName: "Trường THCS Ninh Kiều",
                toSchoolName,
            });

            studentsApi.update({
                ...student,
                status: "transferred",
            });

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: student.id,
                type: "transferred",
                actor: "Bộ phận tuyển sinh",
                content: `Chuyển trường ${student.fullName} đến ${toSchoolName} theo QĐ-${decisionNo ?? effectiveDate}.`,
                createdAt: nowIso(),
            });

            message.success("Đã ghi nhận chuyển trường");
        } else if (movementType === "graduate") {
            movementsApi.create({
                ...baseMovement,
                fromCampusId: student.campusId,
                fromClassId: student.classId,
            });

            studentsApi.update({
                ...student,
                status: "graduated",
            });

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: student.id,
                type: "graduated",
                actor: "Bộ phận tuyển sinh",
                content: `Tốt nghiệp ${student.fullName} theo QĐ-${decisionNo ?? effectiveDate}.`,
                createdAt: nowIso(),
            });

            message.success("Đã ghi nhận tốt nghiệp");
        } else if (movementType === "drop_out") {
            movementsApi.create({
                ...baseMovement,
                fromCampusId: student.campusId,
                fromClassId: student.classId,
            });

            studentsApi.update({
                ...student,
                status: "dropped_out",
            });

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: student.id,
                type: "status_changed",
                actor: "Bộ phận tuyển sinh",
                content: `Nghỉ học ${student.fullName} theo QĐ-${decisionNo ?? effectiveDate}.`,
                createdAt: nowIso(),
            });

            message.success("Đã ghi nhận nghỉ học");
        } else if (movementType === "admitted") {
            movementsApi.create(baseMovement);

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: student.id,
                type: "admitted",
                actor: "Bộ phận tuyển sinh",
                content: `Nhập học ${student.fullName} theo QĐ-${decisionNo ?? effectiveDate}.`,
                createdAt: nowIso(),
            });

            message.success("Đã ghi nhận nhập học");
        }

        setMovementModal(false);

        movementForm.resetFields();
    };

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

    const tabItems = [
        {
            key: "overview",
            label: "Tổng quan",
            children: (
                <div className="students-detail__tab">
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
                        <Descriptions.Item label="Họ và tên">
                            <strong>{student.fullName}</strong>
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã học sinh">
                            <Tag>{student.code}</Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Giới tính">
                            {student.gender === "male" ? "Nam" : "Nữ"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày sinh">
                            {new Date(`${student.dob}T00:00:00`).toLocaleDateString("vi-VN")}
                        </Descriptions.Item>

                        <Descriptions.Item label="Khối">
                            Khối {student.grade ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Năm học">
                            {academicYear?.name ?? student.academicYear ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Lớp">
                            {classItem ? (
                                <Button
                                    type="link"
                                    size="small"
                                    style={{ padding: 0 }}
                                    onClick={() =>
                                        navigate(`/operations/classes/${classItem.id}`)}
                                >
                                    {classItem.name}
                                </Button>
                            ) : (
                                <span className="students-muted">Chưa có</span>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            <Tag color={STATUS_TONE[student.status] ?? "default"}>
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
                                        `/operations/campuses/${student.campusId}?tab=overview`,
                                    )}
                            >
                                {campusName(campusesById, student.campusId)}
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
                                <span className="students-muted">Chưa phân công</span>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phường / xã">
                            {ward?.name ?? <span className="students-muted">—</span>}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            ),
        },
        {
            key: "profile",
            label: "Hồ sơ",
            children: (
                <div className="students-detail__tab">
                    <Descriptions
                        column={2}
                        size="small"
                        bordered
                        className="personnel-detail-tabs__descriptions"
                    >
                        <Descriptions.Item label="Dân tộc">
                            {student.ethnicity ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Nơi sinh">
                            {student.birthPlace ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {student.address ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Người giám hộ">
                            {student.guardianName ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="SĐT giám hộ">
                            {student.guardianPhone ?? "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Email">
                            {student.email ?? "—"}
                        </Descriptions.Item>
                    </Descriptions>

                    <Alert
                        type="info"
                        showIcon
                        message="Hồ sơ được cập nhật qua mục Chỉnh sửa trong danh sách học sinh."
                    />
                </div>
            ),
        },
        {
            key: "progress",
            label: "Quá trình học tập",
            children: (
                <div className="students-detail__tab">
                    <div className="students-detail__timeline-card">
                        <Timeline
                            items={timelineItems.length > 0
                                ? timelineItems
                                : [{
                                    key: "empty",
                                    color: "gray",
                                    children: "Chưa có ghi nhận quá trình.",
                                }]}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: "transcript",
            label: "Học bạ số",
            children: transcripts.length > 0 ? (
                <div className="students-detail__tab">
                    <Alert
                        type="success"
                        showIcon
                        message={`Trung bình học bạ: ${averageScore.toFixed(2)} – ${transcripts.length} môn.`}
                    />

                    <Table
                        rowKey="id"
                        columns={transcriptColumns}
                        dataSource={transcripts}
                        pagination={{
                            ...PAGE_SIZE,
                            pageSize: 8,
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </div>
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có bản ghi học bạ cho học sinh."
                />
            ),
        },
        {
            key: "timetable",
            label: "Lịch học",
            children: timetables.length > 0 ? (
                <div className="students-detail__tab">
                    <Alert
                        type="info"
                        showIcon
                        message={`Lịch học theo lớp ${classItem?.name ?? "hiện tại"} – ${timetables.length} tiết trong tuần.`}
                    />

                    <Table
                        rowKey="id"
                        columns={timetableColumns}
                        dataSource={timetables}
                        pagination={{
                            ...PAGE_SIZE,
                            pageSize: 12,
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </div>
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có thời khóa biểu cho lớp của học sinh."
                />
            ),
        },
        {
            key: "movements",
            label: "Biến động",
            children: (
                <div className="students-detail__tab">
                    <Space wrap>
                        <Button
                            type="primary"
                            icon={<SwapOutlined />}
                            onClick={() => openMovement("class_transfer")}
                        >
                            Chuyển lớp
                        </Button>

                        <Button
                            icon={<SwapOutlined />}
                            onClick={() => openMovement("campus_transfer")}
                        >
                            Chuyển cơ sở
                        </Button>

                        <Button
                            icon={<SwapOutlined />}
                            onClick={() => openMovement("school_transfer")}
                        >
                            Chuyển trường
                        </Button>

                        <Button
                            icon={<ReadOutlined />}
                            onClick={() => openMovement("graduate")}
                        >
                            Tốt nghiệp
                        </Button>

                        <Button
                            danger
                            icon={<SwapOutlined />}
                            onClick={() => openMovement("drop_out")}
                        >
                            Nghỉ học
                        </Button>
                    </Space>

                    {movements.length > 0 ? (
                        <Table
                            rowKey="id"
                            columns={movementColumns}
                            dataSource={movements}
                            pagination={{
                                ...PAGE_SIZE,
                                pageSize: 8,
                            }}
                            size="small"
                            scroll={{ x: true }}
                        />
                    ) : (
                        <Alert
                            type="info"
                            showIcon
                            message="Chưa có biến động nào được ghi nhận."
                        />
                    )}
                </div>
            ),
        },
        {
            key: "boarding",
            label: "Bán trú / 2 buổi",
            children: boardingProfiles.length > 0 ? (
                <div className="students-detail__tab">
                    {boardingProfiles.map((profile) => (
                        <div key={profile.id} className="students-detail__boarding-card">
                            <Descriptions
                                column={2}
                                size="small"
                                bordered
                            >
                                <Descriptions.Item label="Năm học">
                                    {profile.academicYearId}
                                </Descriptions.Item>

                                <Descriptions.Item label="Trạng thái">
                                    <Tag color={profile.status === "active" ? "green" : "default"}>
                                        {profile.status === "active" ? "Đang áp dụng" : "Đã kết thúc"}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Học 2 buổi">
                                    {profile.twoSession ? "Có" : "Không"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Bán trú">
                                    {profile.boarding ? "Có" : "Không"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Ăn trưa">
                                    {profile.mealRequired ? "Có" : "Không"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Bắt đầu">
                                    {new Date(`${profile.startDate}T00:00:00`).toLocaleDateString("vi-VN")}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    ))}
                </div>
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Học sinh chưa đăng ký bán trú hoặc học 2 buổi."
                />
            ),
        },
        {
            key: "achievements",
            label: "Thành tích",
            children: achievements.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={achievementColumns}
                    dataSource={achievements}
                    pagination={{
                        ...PAGE_SIZE,
                        pageSize: 8,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Alert
                    type="info"
                    showIcon
                    message="Chưa có thành tích nào được ghi nhận."
                />
            ),
        },
        {
            key: "history",
            label: "Lịch sử",
            children: historyEntries.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={historyColumns}
                    dataSource={historyEntries}
                    pagination={{
                        ...PAGE_SIZE,
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
        <div className="students-detail-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span
                            className="personnel-detail__breadcrumb"
                            onClick={() => navigate("/operations/students")}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    navigate("/operations/students");
                                }
                            }}
                        >
                            <ArrowLeftOutlined /> Danh sách học sinh
                        </span>

                        <div className="personnel-detail__identity">
                            <div>
                                <div className="personnel-detail__identity-name">
                                    {student.fullName}
                                </div>

                                <span className="personnel-detail__identity-meta">
                                    {student.code} · Khối {student.grade ?? "—"}{" "}
                                    {classItem ? `· Lớp ${classItem.name}` : ""}
                                </span>

                                <div className="personnel-detail__identity-tags">
                                    <Space size={4} wrap>
                                        <Tag color={STATUS_TONE[student.status] ?? "default"}>
                                            {statusLabel}
                                        </Tag>

                                        <Tag>
                                            {student.gender === "male" ? "Nam" : "Nữ"}
                                        </Tag>

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
                            {campusName(campusesById, student.campusId)}
                        </Tag>

                        <Tag color="cyan">
                            {academicYear?.name ?? student.academicYear}
                        </Tag>
                    </div>
                </header>
            </div>

            <Tabs
                key={student.id}
                className="classes-detail__tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: 0 }}
            />

            <Modal
                open={movementModal}
                title={`${MOVEMENT_TYPE_LABEL[movementType] ?? movementType}: ${student.fullName}`}
                okText="Ghi nhận"
                cancelText="Hủy"
                width={640}
                destroyOnHidden
                onCancel={() => setMovementModal(false)}
                onOk={() => movementForm.submit()}
            >
                <Form
                    form={movementForm}
                    layout="vertical"
                    onFinish={handleMovementFinish}
                >
                    <Form.Item
                        name="effectiveDate"
                        label="Ngày hiệu lực"
                        required
                        rules={[{ required: true, message: "Chọn ngày hiệu lực" }]}
                    >
                        <Input placeholder="VD: 2027-01-10" />
                    </Form.Item>

                    {(movementType === "class_transfer" || movementType === "campus_transfer") && (
                        <>
                            <Form.Item name="toCampusId" label="Cơ sở chuyển đến">
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    placeholder="Chọn cơ sở (để trống = cùng cơ sở)"
                                    options={campusesApi.bySchool.map((campus) => ({
                                        value: campus.id,
                                        label: campus.name,
                                    }))}
                                    onChange={(value) => {
                                        setMovementCampus(value);
                                    }}
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                name="toClassId"
                                label="Lớp chuyển đến"
                                required
                                rules={[{ required: true, message: "Chọn lớp chuyển đến" }]}
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    options={movementOptions(movementCampus)}
                                />
                            </Form.Item>
                        </>
                    )}

                    {movementType === "school_transfer" && (
                        <Form.Item name="toSchoolName" label="Tên trường chuyển đến">
                            <Input placeholder="VD: Trường THCS Đoàn Thị Điểm" />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="reason"
                        label="Lý do"
                        required
                        rules={[{ required: true, message: "Nhập lý do" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Lý do chuyển..." />
                    </Form.Item>

                    <Form.Item name="decisionNo" label="Số quyết định">
                        <Input placeholder="VD: QD-2027-033" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export { StudentDetail };

export default StudentDetail;