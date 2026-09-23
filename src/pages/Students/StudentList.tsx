import {
    EditOutlined,
    EyeOutlined,
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

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoWards,
} from "@/mock/canTho";

import type {
    Campus,
    Student,
    StudentMovement,
    StudentStatus,
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
    useClasses,
} from "@/store/useClasses";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    useStudentHistory,
} from "@/store/useStudentHistory";

import {
    useStudentMovements,
} from "@/store/useStudentMovements";

import {
    useStudents,
    isActiveStudent,
} from "@/store/useStudents";

import {
    MOVEMENT_TYPE_LABEL,
    movementTypeTone,
} from "@/pages/Students/labels";

import "./style.scss";


const SCHOOL_ID = "can-tho-school-001";

const CURRENT_ACADEMIC_YEAR = "2026-2027";

const normalizeText = (
    value: string,
): string => {
    const map: Record<string, string> = {
        "à": "a", "á": "a", "ả": "a", "ã": "a", "ạ": "a",
        "ă": "a", "ằ": "a", "ắ": "a", "ẳ": "a", "ẵ": "a", "ặ": "a",
        "â": "a", "ầ": "a", "ấ": "a", "ẩ": "a", "ẫ": "a", "ậ": "a",
        "è": "e", "é": "e", "ẻ": "e", "ẽ": "e", "ẹ": "e",
        "ê": "e", "ề": "e", "ế": "e", "ể": "e", "ễ": "e", "ệ": "e",
        "ì": "i", "í": "i", "ỉ": "i", "ĩ": "i", "ị": "i",
        "ò": "o", "ó": "o", "ỏ": "o", "õ": "o", "ọ": "o",
        "ô": "o", "ồ": "o", "ố": "o", "ổ": "o", "ỗ": "o", "ộ": "o",
        "ơ": "o", "ờ": "o", "ớ": "o", "ở": "o", "ỡ": "o", "ợ": "o",
        "ù": "u", "ú": "u", "ủ": "u", "ũ": "u", "ụ": "u",
        "ư": "u", "ừ": "u", "ứ": "u", "ử": "u", "ữ": "u", "ự": "u",
        "ỳ": "y", "ý": "y", "ỷ": "y", "ỹ": "y", "ỵ": "y",
        "đ": "d",
    };

    return value
        .toLowerCase()
        .split("")
        .map((char) => map[char] ?? char)
        .join("")
        .replace(/\s+/g, " ");
};

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

const studentStatusTone: Record<string, string> = {
    studying: "green",
    transferred: "orange",
    dropped_out: "red",
    graduated: "blue",
    suspended: "orange",
};

const TAB_KEYS = [
    "list",
    "stats",
    "movements",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const StudentList = ({
    compact = false,
    schoolId = SCHOOL_ID,
}: {
    compact?: boolean;

    schoolId?: string;
}) => {
    const navigate = useNavigate();

    const studentsApi = useStudents(schoolId);

    const campusesApi = useCampuses(schoolId);

    const yearsApi = useAcademicYears(schoolId);

    const classesApi = useClasses(schoolId);

    const personnelApi = usePersonnel();

    const movementApi = useStudentMovements();

    const historyApi = useStudentHistory();

    const gradeOptions = useCatalogOptions("grade");

    const genderOptions = useCatalogOptions("gender");

    const statusOptions = useCatalogOptions("student-status");

    const [searchParams] = useSearchParams();

    const items = studentsApi.bySchool;

    const campuses = campusesApi.bySchool;

    const campusesById = campusesApi.byId;

    const classes = classesApi.bySchool;

    const yearOptions = useMemo(
        () => yearsApi.items.map((year) => ({
            value: year.id,
            label: year.name,
        })),
        [yearsApi.items],
    );

    const wardOptions = useMemo(
        () => canThoWards.map((ward) => ({
            value: ward.id,
            label: ward.name,
        })),
        [],
    );

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

    const [classFilter, setClassFilter] =
        useState<string | undefined>(() => readDeepParam("classId"));

    const [wardFilter, setWardFilter] =
        useState<string | undefined>(() => readDeepParam("wardId"));

    const [genderFilter, setGenderFilter] =
        useState<string | undefined>(() => readDeepParam("gender"));

    const [statusFilter, setStatusFilter] =
        useState<string | undefined>(() => readDeepParam("status"));

    const [keyword, setKeyword] = useState("");

    const [activeTab, setActiveTab] = useState<TabKey>(
        () => {
            const raw = searchParams.get("tab");

            return (TAB_KEYS as readonly string[]).includes(raw ?? "")
                ? raw as TabKey
                : "list";
        },
    );

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<Student | null>(null);

    const [form] = Form.useForm<Record<string, unknown>>();

    const campusOptions = useMemo(
        () => campuses.map((campus) => ({
            value: campus.id,
            label: campus.name,
        })),
        [campuses],
    );

    const classesOfCampus = useMemo(
        () => classes.filter(
            (classItem) =>
                classItem.campusId === campusFilter &&
                classItem.academicYear === academicYear,
        ),
        [classes, campusFilter, academicYear],
    );

    const gradesOfCampus = useMemo(
        () => {
            const grades = new Set<number>(
                classesOfCampus.map((classItem) => classItem.grade),
            );

            return gradeOptions.filter((option) =>
                grades.has(Number(option.value)));
        },
        [classesOfCampus, gradeOptions],
    );

    const classesOfCampusGrade = useMemo(
        () => classesOfCampus.filter(
            (classItem) => String(classItem.grade) === gradeFilter,
        ),
        [classesOfCampus, gradeFilter],
    );

    const gradeOptionsForStats = useMemo(
        () => {
            const grades = new Set<number>(
                items.map((item) => item.grade).filter((value): value is number => value !== undefined),
            );

            return gradeOptions
                .map((option) => ({
                    option,
                    num: Number(option.value),
                }))
                .filter(({ num }) => grades.has(num))
                .map(({ option }) => option);
        },
        [items, gradeOptions],
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

        navigate(`/operations/students?${params.toString()}`, { replace: true });
    };

    const filtered = useMemo(() => {
        const kw = normalizeText(keyword.trim());

        return items.filter((student) => {
            if (student.academicYear !== academicYear) {
                return false;
            }

            if (campusFilter && student.campusId !== campusFilter) {
                return false;
            }

            if (gradeFilter && String(student.grade) !== gradeFilter) {
                return false;
            }

            if (classFilter && student.classId !== classFilter) {
                return false;
            }

            if (wardFilter && student.wardId !== wardFilter) {
                return false;
            }

            if (genderFilter && student.gender !== genderFilter) {
                return false;
            }

            if (statusFilter && student.status !== statusFilter) {
                return false;
            }

            if (kw) {
                const classItem = student.classId
                    ? classesApi.byId.get(student.classId)
                    : undefined;

                const haystack = normalizeText([
                    student.code,
                    student.fullName,
                    student.guardianName ?? "",
                    `Khối ${student.grade ?? ""}`,
                    classItem?.name ?? "",
                    campusName(campusesById, student.campusId),
                ].join(" "));

                if (!haystack.includes(kw)) {
                    return false;
                }
            }

            return true;
        });
    }, [
        items,
        classesApi.byId,
        campusesById,
        keyword,
        academicYear,
        campusFilter,
        gradeFilter,
        classFilter,
        wardFilter,
        genderFilter,
        statusFilter,
    ]);

    const kpis = useMemo(() => {
        const total = filtered.length;

        const maleCount = filtered.filter(
            (student) => student.gender === "male",
        ).length;

        const femaleCount = total - maleCount;

        const studying = filtered.filter(
            (student) => isActiveStudent(student.status),
        ).length;

        const transferred = filtered.filter(
            (student) => student.status === "transferred",
        ).length;

        const droppedOut = filtered.filter(
            (student) => student.status === "dropped_out",
        ).length;

        const graduated = filtered.filter(
            (student) => student.status === "graduated",
        ).length;

        return [
            {
                title: "Tổng học sinh",
                value: total,
                icon: <TeamOutlined />,
                tone: "blue" as const,
                note: "trong bộ lọc",
            },
            {
                title: "Nam / Nữ",
                value: `${maleCount}/${femaleCount}`,
                icon: <UserOutlined />,
                tone: "green" as const,
                note: "học sinh",
            },
            {
                title: "Đang học",
                value: studying,
                icon: <ReadOutlined />,
                tone: "green" as const,
                note: "đang theo học",
            },
            {
                title: "Chuyển trường",
                value: transferred,
                icon: <SwapOutlined />,
                tone: "orange" as const,
                note: "chuyển đi",
            },
            {
                title: "Nghỉ học",
                value: droppedOut,
                icon: <UserOutlined />,
                tone: "orange" as const,
                note: "bỏ dở",
            },
            {
                title: "Tốt nghiệp",
                value: graduated,
                icon: <ReadOutlined />,
                tone: "purple" as const,
                note: "hoàn thành THCS",
            },
        ];
    }, [filtered]);

    const handleClearFilters = () => {
        setKeyword("");

        setAcademicYear(CURRENT_ACADEMIC_YEAR);

        setCampusFilter(undefined);

        setGradeFilter(undefined);

        setClassFilter(undefined);

        setWardFilter(undefined);

        setGenderFilter(undefined);

        setStatusFilter(undefined);

        navigate("/operations/students", { replace: true });
    };

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        form.setFieldsValue({
            academicYear,
            campusId: campusFilter ?? campuses[0]?.id ?? "campus-main",
            gender: "male",
            status: "studying",
        });

        setOpen(true);
    };

    const openEdit = (student: Student) => {
        setEditing(student);

        form.setFieldsValue({
            ...student,
            grade: student.grade !== undefined ? String(student.grade) : undefined,
        });

        setOpen(true);
    };

    const validateCodeUniqueness = (
        student: Student,
    ): string | null => {
        const duplicate = items.find(
            (entry) =>
                entry.id !== student.id &&
                entry.code.trim().toLowerCase() ===
                    student.code.trim().toLowerCase(),
        );

        return duplicate
            ? "Mã học sinh đã tồn tại"
            : null;
    };

    const handleFinish = (
        values: Record<string, unknown>,
    ) => {
        const selectedClass = classFilter
            ? classesApi.byId.get(classFilter)
            : undefined;

        if (editing) {
            const updated = {
                ...editing,
                ...values,
                grade: values.grade ? Number(values.grade) : undefined,
                schoolId,
            } as Student;

            const duplicateError = validateCodeUniqueness(updated);

            if (duplicateError) {
                message.error(duplicateError);

                return;
            }

            studentsApi.update(updated);

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: updated.id,
                type: "updated",
                actor: "Bộ phận tuyển sinh",
                content: `Cập nhật thông tin hồ sơ học sinh ${updated.fullName} (${updated.code}).`,
                createdAt: new Date().toISOString(),
            });

            message.success("Đã cập nhật hồ sơ học sinh");
        } else {
            const id = `can-tho-student-${Date.now().toString(36)}`;

            const created = {
                ...values,
                id,
                schoolId,
                code: String(values.code),
                fullName: String(values.fullName),
                gender: String(values.gender) as Student["gender"],
                dob: String(values.dob),
                address: String(values.address ?? ""),
                guardianPhone: String(values.guardianPhone ?? ""),
                grade: values.grade ? Number(values.grade) : undefined,
                campusId: String(values.campusId),
                classId: selectedClass?.id,
                academicYear: String(values.academicYear),
                wardId: values.wardId ? String(values.wardId) : undefined,
                birthPlace: values.birthPlace ? String(values.birthPlace) : undefined,
                ethnicity: values.ethnicity ? String(values.ethnicity) : undefined,
                guardianName: values.guardianName ? String(values.guardianName) : undefined,
                email: values.email ? String(values.email) : undefined,
                status: String(values.status) as StudentStatus,
            } as Student;

            const duplicateError = validateCodeUniqueness(created);

            if (duplicateError) {
                message.error(duplicateError);

                return;
            }

            studentsApi.create(created);

            historyApi.create({
                id: `student-history-${Date.now().toString(36)}`,
                studentId: id,
                type: "created",
                actor: "Bộ phận tuyển sinh",
                content: `Tạo hồ sơ học sinh ${created.fullName} (${created.code}).`,
                createdAt: new Date().toISOString(),
            });

            message.success("Đã thêm học sinh mới");
        }

        setOpen(false);

        setEditing(null);

        form.resetFields();
    };

    const statusLabelFor = (
        status: string,
    ): string => {
        return statusOptions.find(
            (option) => String(option.value) === status,
        )?.label
            ?? status;
    };

    const studentColumns: ColumnsType<Student> = [
        {
            title: "STT",
            key: "__index",
            width: 48,
            render: (_: unknown, __: Student, index: number) => index + 1,
        },
        {
            title: "Mã HS",
            dataIndex: "code",
            width: 100,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 220,
            render: (value: string, student: Student) => (
                <Space size={8}>
                    <Avatar
                        size={26}
                        style={{
                            backgroundColor:
                                student.gender === "female" ? "#eb2f96" : "#1677ff",
                            flexShrink: 0,
                        }}
                    >
                        {initials(value)}
                    </Avatar>

                    <a onClick={() => navigate(`/operations/students/${student.id}`)}>
                        {value}
                    </a>
                </Space>
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            width: 80,
            render: (value: string) => (value === "male" ? "Nam" : "Nữ"),
        },
        {
            title: "Khối",
            dataIndex: "grade",
            width: 70,
            render: (value: number | undefined) => value ? `Khối ${value}` : "—",
        },
        {
            title: "Lớp",
            dataIndex: "classId",
            width: 110,
            render: (value: string | undefined) => {
                const classItem = value
                    ? classesApi.byId.get(value)
                    : undefined;

                if (!classItem) {
                    return <span className="students-muted">Chưa có</span>;
                }

                return (
                    <a
                        onClick={() =>
                            navigate(`/operations/classes/${classItem.id}`)}
                    >
                        {classItem.name}
                    </a>
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
            title: "GVCN",
            key: "__gvcn",
            width: 160,
            render: (_: unknown, student: Student) => {
                const classItem = student.classId
                    ? classesApi.byId.get(student.classId)
                    : undefined;

                const teacher = classItem?.homeroomTeacherId
                    ? personnelApi.byId.get(classItem.homeroomTeacherId)
                    : undefined;

                return teacher?.fullName
                    ?? <span className="students-muted">—</span>;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 120,
            render: (value: string) => (
                <Tag color={studentStatusTone[value] ?? "default"}>
                    {statusLabelFor(value)}
                </Tag>
            ),
        },
        {
            title: "",
            key: "__actions",
            width: 56,
            align: "right",
            render: (_: unknown, student: Student) => (
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: [
                            {
                                key: "view",
                                icon: <EyeOutlined />,
                                label: "Xem chi tiết",
                                onClick: () =>
                                    navigate(`/operations/students/${student.id}`),
                            },
                            {
                                key: "edit",
                                icon: <EditOutlined />,
                                label: "Chỉnh sửa hồ sơ",
                                onClick: () => openEdit(student),
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

    const movementColumns: ColumnsType<StudentMovement> = [
        {
            title: "Ngày",
            dataIndex: "effectiveDate",
            width: 120,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Loại biến động",
            dataIndex: "type",
            width: 150,
            render: (value: StudentMovement["type"]) => (
                <Tag color={movementTypeTone[value] ?? "default"}>
                    {MOVEMENT_TYPE_LABEL[value] ?? value}
                </Tag>
            ),
        },
        {
            title: "Học sinh",
            dataIndex: "studentId",
            width: 220,
            render: (value: string) => {
                const student = studentsApi.byId.get(value);

                if (!student) {
                    return value;
                }

                return (
                    <a onClick={() => navigate(`/operations/students/${student.id}`)}>
                        {student.fullName}
                    </a>
                );
            },
        },
        {
            title: "Lớp đến / đi",
            key: "__classes",
            width: 160,
            render: (_: unknown, movement: StudentMovement) => {
                const fromClass = movement.fromClassId
                    ? classesApi.byId.get(movement.fromClassId)
                    : undefined;

                const toClass = movement.toClassId
                    ? classesApi.byId.get(movement.toClassId)
                    : undefined;

                return (
                    <span>
                        {fromClass ? fromClass.name : "—"}
                        {" → "}
                        {toClass ? toClass.name : "—"}
                    </span>
                );
            },
        },
        {
            title: "Cơ sở đến / đi",
            key: "__campuses",
            width: 200,
            render: (_: unknown, movement: StudentMovement) => {
                const fromCampus = movement.fromCampusId
                    ? campusName(campusesById, movement.fromCampusId)
                    : "—";

                const toCampus = movement.toCampusId
                    ? campusName(campusesById, movement.toCampusId)
                    : "—";

                return (
                    <span>
                        {fromCampus}
                        {" → "}
                        {toCampus}
                    </span>
                );
            },
        },
        {
            title: "Lý do",
            dataIndex: "reason",
        },
    ];

    const buildStats = (
        label: string,
        value: string | undefined,
    ) => {
        const rows = new Map<string, { label: string; total: number; male: number; female: number }>();

        for (const student of filtered) {
            let key = value;

            if (label === "Khối" && key === undefined) {
                key = String(student.grade ?? "chưa rõ");
            } else if (label === "Cơ sở" && key === undefined) {
                key = student.campusId;
            } else if (label === "Lớp" && key === undefined) {
                key = student.classId ?? "chưa rõ";
            } else if (label === "Phường / xã" && key === undefined) {
                key = student.wardId ?? "chưa rõ";
            }

            const rowKey = key ?? "chưa rõ";

            const current = rows.get(rowKey) ?? { label: rowKey, total: 0, male: 0, female: 0 };

            current.total += 1;

            if (student.gender === "male") {
                current.male += 1;
            } else {
                current.female += 1;
            }

            rows.set(rowKey, current);
        }

        const displayLabel = (rowKey: string): string => {
            if (label === "Khối") {
                return `Khối ${rowKey}`;
            }

            if (label === "Cơ sở") {
                return campusName(campusesById, rowKey);
            }

            if (label === "Lớp") {
                return classesApi.byId.get(rowKey)?.name ?? rowKey;
            }

            if (label === "Phường / xã") {
                return canThoWards.find((ward) => ward.id === rowKey)?.name ?? rowKey;
            }

            return rowKey;
        };

        const data = Array.from(rows.entries())
            .map(([rowKey, row]) => ({
                key: rowKey,
                label: displayLabel(rowKey),
                total: row.total,
                male: row.male,
                female: row.female,
            }))
            .sort((a, b) => b.total - a.total);

        return {
            title: label,
            data,
            columns: [
                {
                    title: label,
                    dataIndex: "label",
                    key: "label",
                },
                {
                    title: "Tổng",
                    dataIndex: "total",
                    key: "total",
                    width: 80,
                },
                {
                    title: "Nam",
                    dataIndex: "male",
                    key: "male",
                    width: 80,
                },
                {
                    title: "Nữ",
                    dataIndex: "female",
                    key: "female",
                    width: 80,
                },
            ] as ColumnsType<{ key: string; label: string; total: number; male: number; female: number }>,
        };
    };

    const statsSections = [
        buildStats("Khối", undefined),
        buildStats("Cơ sở", undefined),
        buildStats("Lớp", undefined),
        buildStats("Phường / xã", undefined),
    ];

    const tabItems = [
        {
            key: "list",
            label: "Danh sách học sinh",
            children: (
                <div className="crud-panel__body">
                    <Table<Student>
                        rowKey="id"
                        columns={studentColumns}
                        dataSource={filtered}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total: number) => `Tổng ${total} học sinh`,
                        }}
                        onRow={(student) => ({
                            onDoubleClick: () =>
                                navigate(`/operations/students/${student.id}`),
                        })}
                    />
                </div>
            ),
        },
        {
            key: "stats",
            label: "Thống kê",
            children: (
                <div className="students-stats-grid">
                    {statsSections.map((section) => (
                        <div key={section.title} className="students-stats-box">
                            <Divider titlePlacement="left" plain>
                                {section.title}
                            </Divider>

                            <Table
                                rowKey="key"
                                size="small"
                                columns={section.columns}
                                dataSource={section.data}
                                pagination={false}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: "movements",
            label: "Biến động học sinh",
            children: (
                <div className="crud-panel__body">
                    <Alert
                        type="info"
                        showIcon
                        message="Toàn bộ biến động của học sinh trong trường."
                    />

                    <Table<StudentMovement>
                        rowKey="id"
                        columns={movementColumns}
                        dataSource={movementApi.items}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                        }}
                    />
                </div>
            ),
        },
    ];

    const studentYearOptions = useMemo(
        () => yearOptions,
        [yearOptions],
    );

    return (
        <div className="students-page">
            {!compact && (
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            QUẢN LÝ HỌC SINH
                        </span>

                        <h2>Danh sách học sinh</h2>

                        <p>
                            Theo dõi hồ sơ, học bạ, lịch học, biến động, bán trú và
                            thành tích của học sinh Trường THCS Ninh Kiều.
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
                            HỒ SƠ HỌC SINH
                        </span>

                        <h3>Học sinh theo năm học {academicYear ?? "—"}</h3>
                    </div>

                    <div className="crud-panel__actions">
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm tên, mã HS, GVCN..."
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
                            Thêm học sinh
                        </Button>
                    </div>
                </div>

                <div className="crud-panel__filters">
                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Năm học"
                        options={studentYearOptions}
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

                            setGradeFilter(undefined);

                            setClassFilter(undefined);

                            syncParam("campusId", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Khối"
                        options={gradesOfCampus}
                        value={gradeFilter}
                        onChange={(value) => {
                            const next = value ? String(value) : undefined;

                            setGradeFilter(next);

                            setClassFilter(undefined);

                            syncParam("grade", next);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Lớp"
                        options={classesOfCampusGrade.map((classItem) => ({
                            value: classItem.id,
                            label: classItem.name,
                        }))}
                        value={classFilter}
                        onChange={(value) => {
                            setClassFilter(value);

                            syncParam("classId", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Giới tính"
                        options={genderOptions}
                        value={genderFilter}
                        onChange={(value) => {
                            setGenderFilter(value);

                            syncParam("gender", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        placeholder="Trạng thái"
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(value) => {
                            setStatusFilter(value);

                            syncParam("status", value);
                        }}
                        className="crud-panel__filter"
                    />

                    <Select
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        placeholder="Phường / xã"
                        options={wardOptions}
                        value={wardFilter}
                        onChange={(value) => {
                            setWardFilter(value);

                            syncParam("wardId", value);
                        }}
                        className="crud-panel__filter"
                    />
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key as TabKey);

                        syncParam("tab", key);
                    }}
                    items={tabItems}
                />
            </section>

            <Modal
                open={open}
                title={editing ? `Cập nhật học sinh: ${editing.fullName ?? ""}` : "Thêm mới học sinh"}
                okText="Lưu"
                cancelText="Hủy"
                width={760}
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
                            Thông tin cá nhân
                        </Divider>

                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                        >
                            <Input placeholder="VD: Nguyễn Thu Hà" />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            label="Mã học sinh"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập mã học sinh" }]}
                        >
                            <Input placeholder="VD: CT-HS-700" />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                        >
                            <Select options={genderOptions} />
                        </Form.Item>

                        <Form.Item
                            name="dob"
                            label="Ngày sinh"
                            required
                            rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                        >
                            <Input placeholder="VD: 2014-03-12" />
                        </Form.Item>

                        <Form.Item name="ethnicity" label="Dân tộc">
                            <Input placeholder="VD: Kinh" />
                        </Form.Item>

                        <Form.Item name="birthPlace" label="Nơi sinh">
                            <Input placeholder="VD: Cần Thơ" />
                        </Form.Item>
                    </div>

                    <div className="personnel-form-section">
                        <Divider titlePlacement="left" plain>
                            Học tập
                        </Divider>

                        <Form.Item
                            name="academicYear"
                            label="Năm học"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn năm học" }]}
                        >
                            <Select options={yearOptions} />
                        </Form.Item>

                        <Form.Item
                            name="campusId"
                            label="Cơ sở"
                            required
                            rules={[{ required: true, message: "Vui lòng chọn cơ sở" }]}
                        >
                            <Select options={campusOptions} />
                        </Form.Item>

                        <Form.Item name="grade" label="Khối">
                            <Select options={gradeOptionsForStats} allowClear />
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
                            Cư trú & liên hệ
                        </Divider>

                        <Form.Item name="address" label="Địa chỉ">
                            <Input placeholder="VD: Phường An Hòa, quận Ninh Kiều" />
                        </Form.Item>

                        <Form.Item name="wardId" label="Phường / xã">
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={wardOptions}
                            />
                        </Form.Item>

                        <Form.Item name="guardianName" label="Người giám hộ">
                            <Input placeholder="VD: Nguyễn Văn Bình" />
                        </Form.Item>

                        <Form.Item name="guardianPhone" label="SĐT giám hộ">
                            <Input placeholder="VD: 0901234567" />
                        </Form.Item>

                        <Form.Item name="email" label="Email">
                            <Input placeholder="VD: student@ninhkieu.edu.vn" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export { StudentList };

export default StudentList;