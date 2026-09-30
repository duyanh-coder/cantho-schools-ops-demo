import {
    BookOutlined,
    ReadOutlined,
    TeamOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Avatar,
    Button,
    Descriptions,
    Space,
    Table,
    Tag,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import type {
    ReactNode,
} from "react";

import StatsCard from "@/components/dashboard/StatCard";

import type {
    BoardingProfile,
    Personnel,
    SchoolClass,
    Student,
    StudentAchievement,
    StudentHistoryEntry,
    StudentMovement,
} from "@/mock/common/types";

import {
    HISTORY_EVENT,
    MOVEMENT_TYPE_LABEL,
    STATUS_TONE,
} from "@/pages/Students/labels";

/**
 * Ngày dương lịch từ chuỗi ngày ISO, rỗng hoặc ngày không đọc được thì "—".
 */
const formatDate = (value?: string): string => {
    if (!value) {
        return "—";
    }

    const date = new Date(
        value.length > 10 ? value : `${value}T00:00:00`,
    );

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("vi-VN");
};

/** Chữ cái đầu của họ tên, dùng cho Avatar. */
const toInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Màu nền Avatar theo giới tính, đồng bộ với hồ sơ nhân sự. */
const avatarColor = (gender: "male" | "female"): string =>
    gender === "female" ? "#eb2f96" : "#1677ff";

const SUMMARY_LIMIT = 5;

export type StudentCvTab =
    | "overview"
    | "progress"
    | "transcript"
    | "timetable"
    | "movements"
    | "boarding"
    | "achievements"
    | "history";

interface StudentCvProps {
    student: Student;

    classItem?: SchoolClass;

    homeroomTeacher?: Personnel;

    campusName?: string;

    academicYearLabel?: string;

    wardName?: string;

    statusLabel: string;

    averageScore: number;

    activeBoarding?: BoardingProfile;

    movements: StudentMovement[];

    achievements: StudentAchievement[];

    historyEntries: StudentHistoryEntry[];

    /** Chuyển sang các tab chi tiết, CV chỉ tóm tắt. */
    onOpenTab: (tab: StudentCvTab) => void;

    /** Mở trang chi tiết khác (lớp, hồ sơ giáo viên). */
    onNavigate: (to: string) => void;
}

const scrollToCvCard = (anchor: string) => {
    document.getElementById(`student-cv-${anchor}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * Lý lịch học sinh dạng CV, cùng bố cục với hồ sơ nhân sự: cột trái là
 * danh tính dính, cột phải là các khối thông tin. Mỗi khối chỉ tóm tắt rồi
 * dẫn sang tab chi tiết tương ứng.
 */
const StudentCv = ({
    student,
    classItem,
    homeroomTeacher,
    campusName,
    academicYearLabel,
    wardName,
    statusLabel,
    averageScore,
    activeBoarding,
    movements,
    achievements,
    historyEntries,
    onOpenTab,
    onNavigate,
}: StudentCvProps) => {
    const movementColumns: ColumnsType<StudentMovement> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 130,
            render: (value: string) => (
                <Tag
                    color={
                        HISTORY_EVENT[value]?.tone
                        ?? STATUS_TONE[value]
                        ?? "default"
                    }
                >
                    {MOVEMENT_TYPE_LABEL[value] ?? value}
                </Tag>
            ),
        },
        {
            title: "Lớp đến",
            dataIndex: "toClassId",
            render: (value?: string) =>
                value && value === classItem?.id
                    ? "Lớp hiện tại"
                    : value ?? "—",
        },
        {
            title: "Hiệu lực",
            dataIndex: "effectiveDate",
            width: 130,
            render: (value: string) => formatDate(value),
        },
        {
            title: "Lý do",
            dataIndex: "reason",
            render: (value?: string) => value ?? "—",
        },
    ];

    const achievementColumns: ColumnsType<StudentAchievement> = [
        {
            title: "Thành tích",
            dataIndex: "title",
            render: (value: string) => <strong>{value}</strong>,
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 140,
            render: (value: string) => value ?? "—",
        },
        {
            title: "Cấp",
            dataIndex: "level",
            width: 110,
            render: (value: string) => value ?? "—",
        },
        {
            title: "Kết quả",
            dataIndex: "result",
            width: 150,
        },
        {
            title: "Ngày",
            dataIndex: "achievedDate",
            width: 130,
            render: (value: string) => formatDate(value),
        },
    ];

    const historyColumns: ColumnsType<StudentHistoryEntry> = [
        {
            title: "Loại",
            dataIndex: "type",
            width: 140,
            render: (value: string) => (
                <Tag color={HISTORY_EVENT[value]?.tone ?? "default"}>
                    {HISTORY_EVENT[value]?.label ?? value}
                </Tag>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            render: (value: string) => value ?? "—",
        },
        {
            title: "Người thực hiện",
            dataIndex: "actor",
            width: 180,
            render: (value?: string) => value ?? "—",
        },
        {
            title: "Thời điểm",
            dataIndex: "createdAt",
            width: 170,
            render: (value: string) => formatDate(value),
        },
    ];

    const identityFields: { label: string; value: ReactNode }[] = [
        { label: "Mã học sinh", value: student.code },
        {
            label: "Họ và tên",
            value: (
                <span className="students-detail__cv-strong">
                    {student.fullName}
                </span>
            ),
        },
        {
            label: "Giới tính",
            value: student.gender === "male" ? "Nam" : "Nữ",
        },
        { label: "Ngày sinh", value: formatDate(student.dob) },
        { label: "Nơi sinh", value: student.birthPlace || "—" },
        { label: "Dân tộc", value: student.ethnicity || "—" },
        { label: "Địa chỉ", value: student.address || "—" },
        { label: "Phường/Xã", value: wardName || "—" },
        { label: "Email", value: student.email || "—" },
        { label: "Trạng thái", value: statusLabel },
    ];

    const studyFields: { label: string; value: ReactNode }[] = [
        { label: "Khối", value: `Khối ${student.grade ?? "—"}` },
        {
            label: "Lớp",
            value: classItem ? (
                <a
                    href={`/operations/classes/${classItem.id}?tab=students`}
                    onClick={(event) => {
                        event.preventDefault();

                        onNavigate(
                            `/operations/classes/${classItem.id}?tab=students`,
                        );
                    }}
                >
                    {classItem.name}
                </a>
            ) : (
                "Chưa vào lớp"
            ),
        },
        {
            label: "GVCN",
            value: homeroomTeacher ? (
                <a
                    href={`/operations/personnel/${homeroomTeacher.id}`}
                    onClick={(event) => {
                        event.preventDefault();

                        onNavigate(
                            `/operations/personnel/${homeroomTeacher.id}`,
                        );
                    }}
                >
                    {homeroomTeacher.fullName}
                </a>
            ) : (
                "Chưa phân công"
            ),
        },
        { label: "Cơ sở", value: campusName || "—" },
        { label: "Năm học", value: academicYearLabel || "—" },
    ];

    const guardianFields: { label: string; value: ReactNode }[] = [
        { label: "Người giám hộ", value: student.guardianName || "—" },
        { label: "SĐT giám hộ", value: student.guardianPhone || "—" },
        { label: "Email học sinh", value: student.email || "—" },
    ];

    const boardingFields: { label: string; value: ReactNode }[] = activeBoarding
        ? [
            {
                label: "Bán trú",
                value: activeBoarding.boarding ? "Có" : "Không",
            },
            {
                label: "Hai buổi",
                value: activeBoarding.twoSession ? "Có" : "Không",
            },
            {
                label: "Ăn cơm",
                value: activeBoarding.mealRequired ? "Có" : "Không",
            },
            {
                label: "Từ ngày",
                value: formatDate(activeBoarding.startDate),
            },
        ]
        : [];

    return (
        <div className="students-detail__tab">
            <div className="page-kpi">
                <StatsCard
                    title="Lớp"
                    value={classItem?.name ?? "—"}
                    icon={<TeamOutlined />}
                    tone="blue"
                    note={
                        campusName
                            ? `${campusName}`
                            : "chưa có lớp"
                    }
                    onClick={() => scrollToCvCard("hoc-tap")}
                />

                <StatsCard
                    title="Năm học"
                    value={academicYearLabel || "—"}
                    icon={<BookOutlined />}
                    tone="green"
                    note="năm học đang theo học"
                    onClick={() => scrollToCvCard("hoc-tap")}
                />

                <StatsCard
                    title="Điểm TB"
                    value={averageScore > 0 ? averageScore.toFixed(2) : "—"}
                    icon={<ReadOutlined />}
                    tone="purple"
                    note="trung bình học bạ"
                    onClick={() => scrollToCvCard("ly-lich")}
                />
            </div>

            <div className="students-detail__cv">
                <aside className="students-detail__cv-side">
                    <Avatar
                        size={120}
                        style={{
                            backgroundColor: avatarColor(student.gender),
                        }}
                    >
                        {toInitials(student.fullName)}
                    </Avatar>

                    <h4>{student.fullName}</h4>

                    <span className="students-detail__cv-side-role">
                        {classItem
                            ? `Lớp ${classItem.name} · Khối ${classItem.grade}`
                            : "Chưa vào lớp"}
                    </span>

                    <div className="students-detail__cv-side-tags">
                        <Space size={4} wrap>
                            <Tag
                                color={
                                    STATUS_TONE[student.status] ?? "default"
                                }
                            >
                                {statusLabel}
                            </Tag>

                            {activeBoarding?.boarding && (
                                <Tag color="purple">Bán trú</Tag>
                            )}

                            {activeBoarding?.twoSession && (
                                <Tag color="geekblue">Hai buổi</Tag>
                            )}

                            {activeBoarding?.mealRequired && (
                                <Tag color="orange">Ăn cơm</Tag>
                            )}
                        </Space>
                    </div>

                    <dl className="students-detail__cv-side-facts">
                        <div>
                            <dt>Mã học sinh</dt>
                            <dd>{student.code}</dd>
                        </div>

                        <div>
                            <dt>Ngày sinh</dt>
                            <dd>{formatDate(student.dob)}</dd>
                        </div>

                        <div>
                            <dt>SĐT giám hộ</dt>
                            <dd>{student.guardianPhone || "—"}</dd>
                        </div>
                    </dl>

                    <Alert
                        type="info"
                        showIcon
                        message="Hồ sơ được cập nhật qua mục Chỉnh sửa trong danh sách học sinh."
                    />
                </aside>

                <main className="students-detail__cv-main">
                    <section
                        id="student-cv-ly-lich"
                        className="students-detail__cv-card"
                    >
                        <h5>Lý lịch</h5>

                        <Descriptions
                            column={2}
                            size="small"
                            bordered
                            className="personnel-detail-tabs__descriptions"
                        >
                            {identityFields.map((field, index) => (
                                <Descriptions.Item
                                    key={field.label}
                                    label={field.label}
                                    span={
                                        field.label === "Địa chỉ" ? 2 : 1
                                    }
                                    className={
                                        index === 1
                                            ? "students-detail__cv-strong-item"
                                            : undefined
                                    }
                                >
                                    {field.value}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </section>

                    <section
                        id="student-cv-hoc-tap"
                        className="students-detail__cv-card"
                    >
                        <h5>Học tập</h5>

                        <Descriptions
                            column={2}
                            size="small"
                            bordered
                            className="personnel-detail-tabs__descriptions"
                        >
                            {studyFields.map((field) => (
                                <Descriptions.Item
                                    key={field.label}
                                    label={field.label}
                                >
                                    {field.value}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>

                        <div className="students-detail__cv-block-head">
                            <h6>Biến động gần đây</h6>

                            <Button
                                size="small"
                                onClick={() => onOpenTab("movements")}
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        {movements.length > 0 ? (
                            <Table
                                rowKey="id"
                                size="small"
                                columns={movementColumns}
                                dataSource={movements.slice(0, 3)}
                                pagination={false}
                                scroll={{ x: true }}
                            />
                        ) : (
                            <Alert
                                type="info"
                                showIcon
                                message="Học sinh chưa có biến động nào."
                            />
                        )}
                    </section>

                    <section
                        id="student-cv-nguoi-giam-ho"
                        className="students-detail__cv-card"
                    >
                        <h5>Người giám hộ</h5>

                        <Descriptions
                            column={2}
                            size="small"
                            bordered
                            className="personnel-detail-tabs__descriptions"
                        >
                            {guardianFields.map((field) => (
                                <Descriptions.Item
                                    key={field.label}
                                    label={field.label}
                                >
                                    {field.value}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>

                        {!student.guardianName && (
                            <Alert
                                type="warning"
                                showIcon
                                message="Hồ sơ chưa có tên người giám hộ."
                            />
                        )}
                    </section>

                    <section
                        id="student-cv-ban-tru"
                        className="students-detail__cv-card"
                    >
                        <div className="students-detail__cv-block-head">
                            <h5>Bán trú / Hai buổi</h5>

                            <Button
                                size="small"
                                onClick={() => onOpenTab("boarding")}
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        {activeBoarding ? (
                            <Descriptions
                                column={2}
                                size="small"
                                bordered
                                className="personnel-detail-tabs__descriptions"
                            >
                                {boardingFields.map((field) => (
                                    <Descriptions.Item
                                        key={field.label}
                                        label={field.label}
                                    >
                                        {field.value}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        ) : (
                            <Alert
                                type="info"
                                showIcon
                                message="Học sinh chưa đăng ký bán trú hoặc hai buổi."
                            />
                        )}
                    </section>

                    <section
                        id="student-cv-thanh-tich"
                        className="students-detail__cv-card"
                    >
                        <div className="students-detail__cv-block-head">
                            <h5>Thành tích</h5>

                            <Button
                                size="small"
                                onClick={() => onOpenTab("achievements")}
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        {achievements.length > 0 ? (
                            <Table
                                rowKey="id"
                                size="small"
                                columns={achievementColumns}
                                dataSource={achievements.slice(
                                    0,
                                    SUMMARY_LIMIT,
                                )}
                                pagination={false}
                                scroll={{ x: true }}
                            />
                        ) : (
                            <Alert
                                type="info"
                                showIcon
                                message="Chưa có thành tích nào."
                            />
                        )}
                    </section>

                    <section
                        id="student-cv-lich-su"
                        className="students-detail__cv-card"
                    >
                        <div className="students-detail__cv-block-head">
                            <h5>Lịch sử hồ sơ</h5>

                            <Button
                                size="small"
                                onClick={() => onOpenTab("history")}
                            >
                                Xem tất cả
                            </Button>
                        </div>

                        {historyEntries.length > 0 ? (
                            <Table
                                rowKey="id"
                                size="small"
                                columns={historyColumns}
                                dataSource={historyEntries.slice(
                                    0,
                                    SUMMARY_LIMIT,
                                )}
                                pagination={false}
                                scroll={{ x: true }}
                            />
                        ) : (
                            <Alert
                                type="info"
                                showIcon
                                message="Chưa có lịch sử cập nhật."
                            />
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export { StudentCv };

export default StudentCv;