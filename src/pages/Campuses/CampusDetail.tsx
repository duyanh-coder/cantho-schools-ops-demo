import {
    AimOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    HomeOutlined,
    PhoneOutlined,
    ReadOutlined,
    SwapOutlined,
    TeamOutlined,
    ToolOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Descriptions,
    Form,
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

import L from "leaflet";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import type {
    CampusHistoryEntry,
    CampusStatus,
    Personnel,
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

import "./style.scss";


const STATUS_TONE: Record<CampusStatus, string> = {
    ACTIVE: "green",
    SUSPENDED: "orange",
    INACTIVE: "red",
};

const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

const GRADE_OPTIONS = [6, 7, 8, 9].map((grade) => ({
    value: grade,
    label: `Khối ${grade}`,
}));

const TAB_KEYS = [
    "overview",
    "gis",
    "classes",
    "staff",
    "students",
    "facilities",
    "timetable",
    "history",
] as const;

type TabKey = (typeof TAB_KEYS)[number];

const PAGINATION = {
    showSizeChanger: false,
    showTotal: (total: number, range: [number, number]) =>
        `${range[0]}–${range[1]} / ${total}`,
};

const GradeFilter = ({
    value,
    onChange,
    placeholder = "Lọc theo khối",
}: {
    value?: number;

    onChange: (value: number | undefined) => void;

    placeholder?: string;
}) => (
    <Select
        allowClear
        placeholder={placeholder}
        options={GRADE_OPTIONS}
        value={value}
        onChange={onChange}
        size="small"
        style={{ width: 130 }}
    />
);

const COMPUTE_MARKER_SIZE = (campusName: string): string => {
    return `Trụ sở: ${campusName}`;
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

const buildStats = (campusId: string, allPersonnel: Personnel[]) => {
    const classCount = canThoMockData.classes.filter(
        (item) => item.campusId === campusId,
    ).length;

    const studentCount = canThoMockData.students.filter(
        (item) =>
            item.campusId === campusId &&
            item.status === "studying",
    ).length;

    const teacherCount = allPersonnel.filter(
        (item) =>
            item.campusIds.includes(campusId) &&
            item.subjectIds.length > 0,
    ).length;

    const facilityCount = canThoMockData.facilities.filter(
        (item) => item.campusId === campusId,
    ).reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const timetableCount = canThoMockData.timetables.filter(
        (item) => item.campusId === campusId,
    ).length;

    return {
        classCount,
        studentCount,
        teacherCount,
        facilityCount,
        timetableCount,
    };
};

const CampusDetail = () => {
    const { campusId = "" } = useParams();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const campusesApi = useCampuses();

    const historyApi = useCampusHistory(campusId);

    const personnelApi = usePersonnel();

    const campusStatusOptions =
        useCatalogOptions("campus-status");

    const studentStatusOptions =
        useCatalogOptions("student-status");

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

    const studentStatusLabelMap = useMemo(
        () => new Map<string, string>(
            studentStatusOptions.map(
                (option) => [String(option.value), option.label],
            ),
        ),
        [studentStatusOptions],
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

    const [classGrade, setClassGrade] = useState<number | undefined>();

    const [studentGrade, setStudentGrade] = useState<number | undefined>();

    const [timetableGrade, setTimetableGrade] = useState<number | undefined>();

    const gradeByClassId = useMemo(
        () => new Map<string, number>(
            canThoMockData.classes.map((item) => [item.id, item.grade]),
        ),
        [],
    );

    useEffect(() => {
        if (!campus && campusesApi.items.length > 0) {
            navigate("/operations/schools?tab=campuses", { replace: true });
        }
    }, [campus, campusesApi.items.length, navigate]);

    const stats = useMemo(
        () => campus ? buildStats(campus.id, personnelApi.items) : null,
        [campus, personnelApi.items],
    );

    if (!campus || !stats) {
        return null;
    }

    const kpis = [
        {
            title: "Lớp học",
            value: stats.classCount,
            icon: <HomeOutlined />,
            tone: "blue" as const,
            note: "lớp trực thuộc",
            tab: "classes" as TabKey,
        },
        {
            title: "Học sinh",
            value: stats.studentCount,
            icon: <ReadOutlined />,
            tone: "green" as const,
            note: "đang theo học",
            tab: "students" as TabKey,
        },
        {
            title: "Giáo viên",
            value: stats.teacherCount,
            icon: <TeamOutlined />,
            tone: "orange" as const,
            note: "giảng dạy tại cơ sở",
            tab: "staff" as TabKey,
        },
        {
            title: "Hạng mục CSVC",
            value: stats.facilityCount,
            icon: <ToolOutlined />,
            tone: "purple" as const,
            note: "đơn vị đã kiểm kê",
            tab: "facilities" as TabKey,
        },
    ];

    const classColumns: ColumnsType<typeof canThoMockData.classes[number]> = [
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
            title: "Khối",
            dataIndex: "grade",
            width: 80,
            render: (value: number) => `Khối ${value}`,
        },
        {
            title: "Loại lớp",
            dataIndex: "classType",
            width: 120,
            render: (value: string) =>
                value === "REGULAR"
                    ? "Lớp đại trà"
                    : value === "TWO_SESSION"
                        ? "Lớp 2 buổi"
                        : value === "BOARDING"
                            ? "Lớp nội trú"
                            : value === "SPECIAL"
                                ? "Lớp chuyên biệt"
                                : value,
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            width: 130,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 140,
            render: (value: string) => {
                const tone: Record<string, string> = {
                    active: "green",
                    inactive: "orange",
                    suspended: "orange",
                    closed: "red",
                };

                const labelMap: Record<string, string> = {
                    active: "Đang hoạt động",
                    inactive: "Ngừng",
                    suspended: "Tạm đình chỉ",
                    closed: "Kết thúc",
                };

                return (
                    <Tag color={tone[value] ?? "default"}>
                        {labelMap[value] ?? value}
                    </Tag>
                );
            },
        },
    ];

    const personnelColumns: ColumnsType<Personnel> = [
        {
            title: "Mã CB-GV",
            dataIndex: "code",
            width: 110,
            render: (value: string) => <Tag>{value}</Tag>,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 200,
        },
        {
            title: "Chức danh / Vị trí",
            dataIndex: "roleTitle",
            width: 190,
        },
        {
            title: "Môn dạy",
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
            title: "Trạng thái",
            dataIndex: "status",
            width: 120,
            render: (value: string) => (
                <Tag color={value === "active" ? "green" : "red"}>
                    {value === "active" ? "Đang công tác" : "Đã nghỉ"}
                </Tag>
            ),
        },
        {
            title: "",
            key: "__navigate",
            width: 60,
            align: "center",
            render: (_: unknown, row: Personnel) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() =>
                        navigate(`/operations/personnel/${row.id}?tab=overview`)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    const studentColumns: ColumnsType<typeof canThoMockData.students[number]> = [
        {
            title: "Mã HS",
            dataIndex: "code",
            width: 100,
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 200,
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
            title: "Lớp",
            dataIndex: "classId",
            width: 100,
            render: (value: string | undefined) => {
                const classItem =
                    canThoMockData.classes.find((item) => item.id === value);

                return classItem ? (
                    <Button
                        type="link"
                        size="small"
                        style={{ padding: 0 }}
                        onClick={() => navigate(`/operations/classes/${classItem.id}`)}
                    >
                        {classItem.name}
                    </Button>
                ) : (
                    value ?? "—"
                );
            },
        },
        {
            title: "Khối",
            dataIndex: "classId",
            width: 80,
            render: (value: string | undefined) =>
                value
                    ? `Khối ${gradeByClassId.get(value) ?? ""}`
                    : "—",
        },
        {
            title: "Ngày sinh",
            dataIndex: "dob",
            width: 110,
            render: (value: string) =>
                new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN"),
        },
        {
            title: "Tình trạng",
            dataIndex: "status",
            width: 130,
            render: (value: string) => (
                <Tag color={value === "studying" ? "green" : "orange"}>
                    {studentStatusLabelMap.get(value) ?? value}
                </Tag>
            ),
        },
        {
            title: "",
            width: 70,
            render: (_: unknown, row: typeof canThoMockData.students[number]) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => navigate(`/operations/students/${row.id}`)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    const facilityColumns: ColumnsType<typeof canThoMockData.facilities[number]> = [
        {
            title: "Hạng mục",
            dataIndex: "name",
            width: 240,
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 150,
            render: (value: string) => {
                const map: Record<string, string> = {
                    classroom: "Phòng học",
                    function_room: "Phòng chức năng",
                    library: "Thư viện",
                    playground: "Sân chơi",
                    equipment: "Thiết bị",
                    kitchen: "Bếp ăn",
                };

                return map[value] ?? value;
            },
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            width: 110,
            render: (value: number, row: typeof canThoMockData.facilities[number]) => (
                <span>{value} {row.unit}</span>
            ),
        },
        {
            title: "Tình trạng",
            dataIndex: "condition",
            width: 130,
            render: (value: string) => {
                const map: Record<string, string> = {
                    good: "Tốt",
                    normal: "Bình thường",
                    repair: "Cần sửa chữa",
                };

                const toneMap: Record<string, string> = {
                    good: "green",
                    normal: "blue",
                    repair: "orange",
                };

                return (
                    <Tag color={toneMap[value] ?? "default"}>
                        {map[value] ?? value}
                    </Tag>
                );
            },
        },
    ];

    const timetableColumns: ColumnsType<typeof canThoMockData.timetables[number]> = [
        {
            title: "Lớp",
            dataIndex: "classId",
            width: 140,
            render: (value: string) =>
                canThoMockData.classes.find((item) => item.id === value)?.name
                ?? value,
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            render: (value: string) => toSubjectName(value),
        },
        {
            title: "Ngày",
            dataIndex: "day",
            width: 130,
            render: (value: string) => {
                const map: Record<string, string> = {
                    monday: "Thứ Hai",
                    tuesday: "Thứ Ba",
                    wednesday: "Thứ Tư",
                    thursday: "Thứ Năm",
                    friday: "Thứ Sáu",
                    saturday: "Thứ Bảy",
                    sunday: "Chủ nhật",
                };

                return map[value] ?? value;
            },
        },
        {
            title: "Tiết",
            dataIndex: "period",
            width: 80,
        },
        {
            title: "Phòng",
            dataIndex: "room",
            width: 100,
        },
        {
            title: "Thời gian",
            width: 160,
            render: (_: unknown, row: typeof canThoMockData.timetables[number]) => (
                <span>{row.startTime} – {row.endTime}</span>
            ),
        },
    ];

    const historyColumns: ColumnsType<CampusHistoryEntry> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 150,
            render: (value: CampusHistoryEntry["type"]) => {
                const map: Record<string, string> = {
                    created: "Thành lập",
                    updated: "Cập nhật",
                    address_changed: "Địa chỉ",
                    gis_changed: "Tọa độ GIS",
                    status_changed: "Trạng thái",
                    manager_changed: "Cán bộ phụ trách",
                };

                const toneMap: Record<string, string> = {
                    created: "green",
                    updated: "blue",
                    address_changed: "cyan",
                    gis_changed: "geekblue",
                    status_changed: "orange",
                    manager_changed: "purple",
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

    const markerPosition: [number, number] = [
        campus.latitude,
        campus.longitude,
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
                            <Space size={4}>
                                <AimOutlined />
                                {campus.latitude.toFixed(4)}, {campus.longitude.toFixed(4)}
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
            key: "gis",
            label: "Địa chỉ & GIS",
            children: (
                <div className="campus-detail__gis">
                    <div className="campus-detail__gis-meta">
                        <Alert
                            type="info"
                            showIcon
                            message={COMPUTE_MARKER_SIZE(campus.name)}
                            description={
                                `Phường/Xã: ${toWardName(campus.wardId)} · ` +
                                `Tọa độ: ${campus.latitude.toFixed(4)}, ${campus.longitude.toFixed(4)}`
                            }
                        />

                        <p>
                            Điểm trường được xác định trên nền bản đồ nội thành
                            TP. Cần Thơ. Kéo thả không hỗ trợ trong demo; bạn có
                            thể hiệu chỉnh tọa độ bằng nút "Chỉnh vị trí".
                        </p>

                        <Space wrap>
                            <Button
                                type="primary"
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

                            <Button
                                icon={<EnvironmentOutlined />}
                                onClick={() =>
                                    navigate(`/operations/gis?campus=${campus.id}`)}
                            >
                                Xem trên bản đồ
                            </Button>
                        </Space>
                    </div>

                    <div className="campus-detail__map">
                        <MapContainer
                            center={markerPosition}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />

                            <Marker
                                position={markerPosition}
                                icon={L.divIcon({
                                    className: "campus-marker",
                                    html: `<div class="campus-marker__pin"><span></span></div>`,
                                    iconSize: [24, 34],
                                    iconAnchor: [12, 34],
                                    popupAnchor: [0, -30],
                                })}
                            >
                                <Popup>
                                    <strong>{campus.name}</strong>
                                    <br />
                                    {campus.address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            ),
        },
        {
            key: "classes",
            label: "Lớp học",
            children: (
                <div className="campus-detail__tab">
                    <div className="campus-detail__toolbar">
                        <GradeFilter
                            value={classGrade}
                            onChange={setClassGrade}
                        />

                        <Button
                            type="link"
                            size="small"
                            icon={<ReadOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/classes?campusId=${campus.id}`)}
                        >
                            Mở danh sách lớp theo cơ sở này
                        </Button>
                    </div>

                    <Table
                        rowKey="id"
                        columns={classColumns}
                        dataSource={canThoMockData.classes.filter(
                            (item) =>
                                item.campusId === campus.id &&
                                (classGrade === undefined
                                    || item.grade === classGrade),
                        )}
                        pagination={{
                            ...PAGINATION,
                            pageSize: 6,
                        }}
                        size="small"
                        scroll={{ x: true }}
                        onRow={(classItem) => ({
                            onDoubleClick: () =>
                                navigate(`/operations/classes/${classItem.id}`),
                        })}
                    />
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
            key: "students",
            label: "Học sinh",
            children: (
                <div className="campus-detail__tab">
                    <div className="campus-detail__toolbar">
                        <GradeFilter
                            value={studentGrade}
                            onChange={setStudentGrade}
                        />

                        <Button
                            icon={<ReadOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/students?campusId=${campus.id}`,
                                )}
                        >
                            Xem tất cả học sinh
                        </Button>
                    </div>

                    <Table
                        rowKey="id"
                        columns={studentColumns}
                        dataSource={canThoMockData.students.filter(
                            (item) => {
                                if (item.campusId !== campus.id) {
                                    return false;
                                }

                                if (studentGrade === undefined) {
                                    return true;
                                }

                                return item.classId
                                    ? gradeByClassId.get(item.classId) === studentGrade
                                    : false;
                            },
                        )}
                        pagination={{
                            ...PAGINATION,
                            pageSize: 10,
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </div>
            ),
        },
        {
            key: "facilities",
            label: "Phòng & CSVC",
            children: (
                <Table
                    rowKey="id"
                    columns={facilityColumns}
                    dataSource={canThoMockData.facilities.filter(
                        (item) => item.campusId === campus.id,
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
            key: "timetable",
            label: "Thời khóa biểu",
            children: (
                <div className="campus-detail__tab">
                    <div className="campus-detail__toolbar">
                        <GradeFilter
                            value={timetableGrade}
                            onChange={setTimetableGrade}
                        />
                    </div>

                    <Table
                        rowKey="id"
                        columns={timetableColumns}
                        dataSource={canThoMockData.timetables.filter(
                            (item) => {
                                if (item.campusId !== campus.id) {
                                    return false;
                                }

                                if (timetableGrade === undefined) {
                                    return true;
                                }

                                return gradeByClassId.get(item.classId) === timetableGrade;
                            },
                        )}
                        pagination={{
                            ...PAGINATION,
                            pageSize: 10,
                        }}
                        size="small"
                        scroll={{ x: true }}
                    />
                </div>
            ),
        },
        {
            key: "history",
            label: "Lịch sử",
            children: (
                <Table
                    rowKey="id"
                    columns={historyColumns}
                    dataSource={historyApi.byCampus.sort(
                        (a, b) => b.createdAt.localeCompare(a.createdAt),
                    )}
                    pagination={{
                        ...PAGINATION,
                        pageSize: 10,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ),
        },
    ];

    return (
        <div className="campus-detail">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            CAMPUS DETAIL
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

                        <Button
                            icon={<SwapOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/schools?tab=campuses&school=${campus.schoolId}`,
                                )}
                        >
                            Quản lý cơ sở
                        </Button>
                    </div>
                </header>
            </div>

            <Tabs
                key={campus.id}
                className="campus-detail__tabs"
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={tabItems}
                tabBarStyle={{ margin: 0 }}
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