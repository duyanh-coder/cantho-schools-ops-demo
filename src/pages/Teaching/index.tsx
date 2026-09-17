import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FilterOutlined,
    QrcodeOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

import {
    Badge,
    Button,
    Card,
    Col,
    Empty,
    Modal,
    Row,
    Select,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import "./style.scss";

import StatsCard from "@/components/dashboard/StatCard";

import {
    getCurrentRegionMockData,
} from "@/mock";


type AttendanceStatus =
    | "present"
    | "late"
    | "absent";


const ATTENDANCE_STATUS_CONFIG: Record<
    AttendanceStatus,
    {
        label: string;
        color: string;
        icon: React.ReactNode;
    }
> = {
    present: {
        label: "Có mặt",
        color: "success",
        icon: <CheckCircleOutlined />,
    },

    late: {
        label: "Đi trễ",
        color: "warning",
        icon: <ClockCircleOutlined />,
    },

    absent: {
        label: "Vắng",
        color: "error",
        icon: <CloseCircleOutlined />,
    },
};


const SUBJECT_LABELS: Record<string, string> = {
    math: "Toán",
    literature: "Ngữ văn",
    english: "Tiếng Anh",
    physics: "Vật lý",
    chemistry: "Hóa học",
    biology: "Sinh học",
    history: "Lịch sử",
    geography: "Địa lý",
    civic_education: "Giáo dục công dân",
    informatics: "Tin học",
    technology: "Công nghệ",
    physical_education: "Thể dục",
    music: "Âm nhạc",
    art: "Mỹ thuật",
};


/* ============================================================
   FAKE QR — mã QR minh họa (demo), vẽ bằng SVG thuần, không
   phải mã QR chuẩn có thể quét thật. Dựa trên seed sinh từ
   chuỗi mã điểm danh để cùng mã → cùng pattern.
============================================================ */

const QR_GRID_SIZE = 25;

const hashStringToSeed = (
    value: string,
): number => {
    let hash = 2166136261;

    for (
        let i = 0;
        i < value.length;
        i += 1
    ) {
        hash ^= value.charCodeAt(i);

        hash = Math.imul(
            hash,
            16777619,
        );
    }

    return hash >>> 0;
};

const mulberry32 = (
    seed: number,
): () => number => {
    let state = seed;

    return () => {
        state |= 0;

        state =
            (state + 0x6d2b79f5) | 0;

        let t = Math.imul(
            state ^ (state >>> 15),
            1 | state,
        );

        t =
            (t +
                Math.imul(
                    t ^ (t >>> 7),
                    61 | t,
                )) ^
            t;

        return (
            (t ^ (t >>> 14)) >>> 0
        ) / 4294967296;
    };
};

interface FakeQrCodeProps {
    value: string;
    size?: number;
}

function FakeQrCode({
    value,
    size = 224,
}: FakeQrCodeProps) {
    const darkCells = useMemo(
        () => {
            const random = mulberry32(
                hashStringToSeed(value),
            );

            const insideFinder = (
                x: number,
                y: number,
            ) => {
                const inside = (
                    originX: number,
                    originY: number,
                ) =>
                    x >= originX &&
                    x < originX + 8 &&
                    y >= originY &&
                    y < originY + 8;

                return (
                    inside(0, 0) ||
                    inside(
                        QR_GRID_SIZE - 8,
                        0,
                    ) ||
                    inside(
                        0,
                        QR_GRID_SIZE - 8,
                    )
                );
            };

            const isFinderDark = (
                x: number,
                y: number,
            ) => {
                const at = (
                    originX: number,
                    originY: number,
                ) => {
                    const dx = x - originX;
                    const dy = y - originY;

                    const ring =
                        dx >= 0 &&
                        dx < 7 &&
                        dy >= 0 &&
                        dy < 7;

                    const border =
                        dx >= 1 &&
                        dx < 6 &&
                        dy >= 1 &&
                        dy < 6;

                    const core =
                        dx >= 2 &&
                        dx < 5 &&
                        dy >= 2 &&
                        dy < 5;

                    return (
                        ring &&
                        (!border || core)
                    );
                };

                return (
                    at(0, 0) ||
                    at(
                        QR_GRID_SIZE - 7,
                        0,
                    ) ||
                    at(
                        0,
                        QR_GRID_SIZE - 7,
                    )
                );
            };

            const cells: Array<{
                x: number;
                y: number;
            }> = [];

            for (
                let y = 0;
                y < QR_GRID_SIZE;
                y += 1
            ) {
                for (
                    let x = 0;
                    x < QR_GRID_SIZE;
                    x += 1
                ) {
                    if (
                        insideFinder(x, y)
                    ) {
                        if (
                            isFinderDark(x, y)
                        ) {
                            cells.push({ x, y });
                        }

                        continue;
                    }

                    if (
                        random() < 0.42
                    ) {
                        cells.push({ x, y });
                    }
                }
            }

            return cells;
        },
        [value],
    );

    return (
        <svg
            className="fake-qr"
            viewBox={`0 0 ${QR_GRID_SIZE} ${QR_GRID_SIZE}`}
            width={size}
            height={size}
            shapeRendering="crispEdges"
            role="img"
            aria-label="Mã QR điểm danh (minh họa)"
        >
            <rect
                x={0}
                y={0}
                width={QR_GRID_SIZE}
                height={QR_GRID_SIZE}
                fill="#ffffff"
            />

            {darkCells.map((cell) => (
                <rect
                    key={`${cell.x}-${cell.y}`}
                    x={cell.x}
                    y={cell.y}
                    width={1}
                    height={1}
                    fill="#0f172a"
                />
            ))}
        </svg>
    );
}

const generateAttendanceCode =
    (): string => {
        const alphabet =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let suffix = "";

        for (
            let i = 0;
            i < 4;
            i += 1
        ) {
            suffix += alphabet[
                Math.floor(
                    Math.random() *
                        alphabet.length,
                )
            ];
        }

        const date = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");

        return (
            `CT-${date}-${suffix}`
        );
    };


function TeachingPage() {
    const {
        teachingAttendance,
        campuses,
        classes,
        teachers,
        timetables,
    } = getCurrentRegionMockData();


    const [
        selectedCampus,
        setSelectedCampus,
    ] = useState("all");

    const [
        selectedClass,
        setSelectedClass,
    ] = useState("all");

    const [
        selectedTeacher,
        setSelectedTeacher,
    ] = useState("all");

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState<
        AttendanceStatus | "all"
    >("all");

    const [
        qrOpen,
        setQrOpen,
    ] = useState(false);

    const [
        attendanceCode,
        setAttendanceCode,
    ] = useState(
        generateAttendanceCode,
    );

    const openQrModal = () => {
        setAttendanceCode(
            generateAttendanceCode(),
        );

        setQrOpen(true);
    };

    const regenerateCode = () => {
        setAttendanceCode(
            generateAttendanceCode(),
        );
    };


    const availableClasses =
        selectedCampus === "all"
            ? classes
            : classes.filter(
                (item) =>
                    item.campusId === selectedCampus,
            );


    const teachingTeacherIds =
        selectedCampus === "all"
            ? null
            : new Set(
                teachingAttendance
                    .filter(
                        (item) =>
                            item.campusId === selectedCampus,
                    )
                    .map(
                        (item) =>
                            item.teacherId,
                    ),
            );

    const availableTeachers =
        teachingTeacherIds === null
            ? teachers
            : teachers.filter(
                (item) =>
                    teachingTeacherIds.has(item.id),
            );


    const filteredAttendance =
        teachingAttendance.filter(
            (item) => {
                const matchCampus =
                    selectedCampus === "all" ||
                    item.campusId === selectedCampus;

                const matchClass =
                    selectedClass === "all" ||
                    item.classId === selectedClass;

                const matchTeacher =
                    selectedTeacher === "all" ||
                    item.teacherId === selectedTeacher;

                const matchStatus =
                    selectedStatus === "all" ||
                    item.status === selectedStatus;

                return (
                    matchCampus &&
                    matchClass &&
                    matchTeacher &&
                    matchStatus
                );
            },
        );


    const statistics = {
        total: teachingAttendance.length,

        present: teachingAttendance.filter(
            (item) =>
                item.status === "present",
        ).length,

        late: teachingAttendance.filter(
            (item) =>
                item.status === "late",
        ).length,

        absent: teachingAttendance.filter(
            (item) =>
                item.status === "absent",
        ).length,
    };


    return (
        <div className="teaching-page">

            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            TEACHING
                        </span>

                        <h2>Điểm danh giảng dạy</h2>

                        <p>
                            Theo dõi tình hình thực hiện giảng dạy và trạng thái
                            điểm danh của giáo viên.
                        </p>
                    </div>

                    <div className="page-head__actions">
                        <Button
                            type="primary"
                            icon={<QrcodeOutlined />}
                            onClick={openQrModal}
                        >
                            Điểm danh
                        </Button>
                    </div>
                </header>

            <Card className="teaching-page__filters">

                <div className="teaching-page__filter-header">
                    <FilterOutlined />

                    <span>
                        Bộ lọc
                    </span>
                </div>


                <Row gutter={[12, 12]}>

                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                    >
                        <Select
                            value={selectedCampus}
                            onChange={(value) => {
                                setSelectedCampus(value);

                                setSelectedClass("all");

                                setSelectedTeacher("all");
                            }}
                            className="teaching-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả cơ sở",
                                },

                                ...campuses.map(
                                    (item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }),
                                ),
                            ]}
                        />
                    </Col>


                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                    >
                        <Select
                            value={selectedClass}
                            onChange={setSelectedClass}
                            className="teaching-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả lớp",
                                },

                                ...availableClasses.map(
                                    (item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }),
                                ),
                            ]}
                        />
                    </Col>


                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                    >
                        <Select
                            value={selectedTeacher}
                            onChange={setSelectedTeacher}
                            showSearch
                            optionFilterProp="label"
                            className="teaching-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả giáo viên",
                                },

                                ...availableTeachers.map(
                                    (item) => ({
                                        value: item.id,
                                        label: item.fullName,
                                    }),
                                ),
                            ]}
                        />
                    </Col>


                    <Col
                        xs={24}
                        sm={12}
                        lg={6}
                    >
                        <Select
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            className="teaching-page__select"
                            options={[
                                {
                                    value: "all",
                                    label: "Tất cả trạng thái",
                                },
                                {
                                    value: "present",
                                    label: "Có mặt",
                                },
                                {
                                    value: "late",
                                    label: "Đi trễ",
                                },
                                {
                                    value: "absent",
                                    label: "Vắng",
                                },
                            ]}
                        />
                    </Col>

                </Row>

            </Card>
            </div>

            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Tổng lượt"
                    value={statistics.total}
                    note="Phiếu điểm danh trong ngày"
                    icon={<SafetyCertificateOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Có mặt"
                    value={statistics.present}
                    icon={<CheckCircleOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Đi trễ"
                    value={statistics.late}
                    icon={<ClockCircleOutlined />}
                />

                <StatsCard
                    tone="purple"
                    title="Vắng"
                    value={statistics.absent}
                    icon={<CloseCircleOutlined />}
                />
            </div>

            <div className="teaching-page__list">

                {filteredAttendance.length === 0 ? (
                    <Empty
                        description="Không có dữ liệu phù hợp"
                    />
                ) : (
                    <Row gutter={[16, 16]}>

                        {filteredAttendance.map(
                            (item) => {
                                const classItem =
                                    classes.find(
                                        (value) =>
                                            value.id ===
                                            item.classId,
                                    );

                                const teacher =
                                    teachers.find(
                                        (value) =>
                                            value.id ===
                                            item.teacherId,
                                    );

                                const campus =
                                    campuses.find(
                                        (value) =>
                                            value.id ===
                                            item.campusId,
                                    );

                                const timetable =
                                    timetables.find(
                                        (value) =>
                                            value.id ===
                                            item.timetableId,
                                    );

                                const statusConfig =
                                    ATTENDANCE_STATUS_CONFIG[
                                        item.status
                                    ];

                                return (
                                    <Col
                                        key={item.id}
                                        xs={24}
                                        md={12}
                                        xl={8}
                                    >
                                        <Card className="teaching-item">

                                            <div className="teaching-item__header">

                                                <div>
                                                    <h3>
                                                        {
                                                            teacher?.fullName ??
                                                            "-"
                                                        }
                                                    </h3>

                                                    <span>
                                                        {
                                                            campus?.name ??
                                                            "-"
                                                        }
                                                    </span>
                                                </div>

                                                <Badge
                                                    status={
                                                        statusConfig.color as
                                                            | "success"
                                                            | "warning"
                                                            | "error"
                                                    }
                                                    text={
                                                        statusConfig.label
                                                    }
                                                />

                                            </div>


                                            <div className="teaching-item__content">

                                                <div>
                                                    <span>
                                                        Lớp
                                                    </span>

                                                    <strong>
                                                        {
                                                            classItem?.name ??
                                                            "-"
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Môn học
                                                    </span>

                                                    <strong>
                                                        {
                                                            timetable
                                                                ? SUBJECT_LABELS[
                                                                    timetable.subjectId
                                                                ] ??
                                                                  timetable.subjectId
                                                                : "-"
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Thời gian
                                                    </span>

                                                    <strong>
                                                        {timetable
                                                            ? `${timetable.startTime} - ${timetable.endTime}`
                                                            : "-"}
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Phòng
                                                    </span>

                                                    <strong>
                                                        {
                                                            timetable?.room ??
                                                            "-"
                                                        }
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Ngày
                                                    </span>

                                                    <strong>
                                                        {item.date}
                                                    </strong>
                                                </div>

                                            </div>

                                        </Card>
                                    </Col>
                                );
                            },
                        )}

                    </Row>
                )}

            </div>

            <Modal
                open={qrOpen}
                title="Điểm danh giảng dạy"
                className="teaching-qr-modal"
                onCancel={() =>
                    setQrOpen(false)
                }
                footer={[
                    <Button
                        key="regenerate"
                        type="primary"
                        icon={<QrcodeOutlined />}
                        onClick={regenerateCode}
                    >
                        Tạo mã mới
                    </Button>,

                    <Button
                        key="close"
                        onClick={() =>
                            setQrOpen(false)
                        }
                    >
                        Đóng
                    </Button>,
                ]}
            >
                <div className="teaching-qr">
                    <div className="teaching-qr__role">
                        <SafetyCertificateOutlined />

                        <span>
                            Dành cho giáo viên, nhân viên
                        </span>
                    </div>

                    <div className="teaching-qr__box">
                        <FakeQrCode
                            value={attendanceCode}
                        />
                    </div>

                    <div className="teaching-qr__info">
                        <span>Mã điểm danh</span>

                        <strong>
                            {attendanceCode}
                        </strong>
                    </div>

                    <p className="teaching-qr__note">
                        <QrcodeOutlined />

                        <span>
                            Giáo viên, nhân viên dùng điện thoại quét mã QR
                            này khi đến lớp để hoàn tất điểm danh. Mã minh họa,
                            hiệu lực 60 giây.
                        </span>
                    </p>
                </div>
            </Modal>

        </div>
    );
}


export default TeachingPage;