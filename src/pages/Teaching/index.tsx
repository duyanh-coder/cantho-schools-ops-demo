import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FilterOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

import {
    Badge,
    Card,
    Col,
    Empty,
    Row,
    Select,
} from "antd";

import {
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

        </div>
    );
}


export default TeachingPage;