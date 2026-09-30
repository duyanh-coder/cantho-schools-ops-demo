import {
    ApartmentOutlined,
    BankOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    ReadOutlined,
    TeamOutlined,
    ToolOutlined,
} from "@ant-design/icons";

import {
    Avatar,
    Button,
    Popover,
    Space,
    Table,
    Tooltip,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import StatCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import {
    getSchoolOverviewStats,
} from "@/mock/canTho";

import {
    groupPersonnel,
    subjects,
    summarizePersonnel,
} from "@/mock/common";

import type {
    School,
} from "@/mock/common/types";

import {
    useAcademicYears,
} from "@/store/useAcademicYears";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    buildCampusScale,
} from "@/utils/campusScale";

import "./overview.scss";


/**
 * Tab Tổng quan chỉ hiện sẵn 10 nhân sự, phần còn lại mở sang tab Nhân sự để
 * tránh bảng dài chiếm hết trang.
 */
const PERSONNEL_PREVIEW = 10;


const educationLevelLabelMap: Record<string, string> = {
    primary: "Tiểu học",
    THCS: "THCS",
    THPT: "THPT",
    THCS_THPT: "THCS & THPT",
};

const campusTypeLabelMap: Record<string, string> = {
    HEADQUARTERS: "Trụ sở chính",
    BRANCH: "Phân hiệu",
};

const subjectNameMap = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

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

const formatVnNumber = (value: number): string => {
    return value.toLocaleString("vi-VN");
};

interface KpiBranch {
    label: string;

    value: string;
}

interface KpiGroup {
    title?: string;

    branches: KpiBranch[];
}

const KpiTree = ({
    groups,
    vertical = false,
}: {
    groups: KpiGroup[];

    vertical?: boolean;
}) => (
    <div className="school-overview__tree">
        {groups.map((group, groupIndex) => (
            <div
                className="school-overview__tree-group"
                key={groupIndex}
            >
                {group.title && (
                    <span className="school-overview__tree-title">
                        {group.title}
                    </span>
                )}

                <div
                    className={
                        vertical
                            ? "school-overview__tree-branches school-overview__tree-branches--vertical"
                            : "school-overview__tree-branches"
                    }
                >
                    {group.branches.map((branch, branchIndex) => (
                        <div
                            className="school-overview__tree-branch"
                            key={branchIndex}
                        >
                            <span className="school-overview__tree-node">
                                <span className="school-overview__tree-label">
                                    {branch.label}
                                </span>

                                <strong className="school-overview__tree-value">
                                    {branch.value}
                                </strong>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const campusIdToName = (
    campusId: string,
): string => {
    return canThoMockData.campuses.find(
        (campus) => campus.id === campusId,
    )?.name ?? campusId;
};

const wardIdToName = (
    wardId: string,
): string => {
    return canThoMockData.wards.find(
        (ward) => ward.id === wardId,
    )?.name ?? wardId;
};


const SchoolOverview = ({
    school,
}: {
    school: School | undefined;
}) => {
    const navigate =
        useNavigate();

    const schoolId = school?.id;

    const yearsApi =
        useAcademicYears(schoolId);

    const personnelApi =
        usePersonnel();

    const personnelItems = personnelApi.items;

    const activeYear = yearsApi.activeYear;

    const stats =
        schoolId ? getSchoolOverviewStats(schoolId) : undefined;

    const scope = useMemo(() => {
        if (!schoolId) {
            return {
                campuses: [] as typeof canThoMockData.campuses,
                personnel: [] as typeof personnelItems,
                classes: [] as typeof canThoMockData.classes,
                students: [] as typeof canThoMockData.students,
            };
        }

        return {
            campuses: canThoMockData.campuses.filter(
                (campus) => campus.schoolId === schoolId,
            ),
            /**
             * Nhân sự lấy từ store để nhận đúng các thay đổi đã lưu, giống hệt
             * nguồn dữ liệu của tab Nhân sự.
             */
            personnel: personnelItems.filter(
                (item) => item.schoolId === schoolId,
            ),
            classes: canThoMockData.classes.filter(
                (classItem) => classItem.schoolId === schoolId,
            ),
            students: canThoMockData.students.filter(
                (item) => item.schoolId === schoolId,
            ),
        };
    }, [schoolId, personnelItems]);

    if (!school) {
        return null;
    }

    /**
     * Số nhân sự hiển thị ở tab Tổng quan lấy từ cùng nguồn và cùng quy tắc
     * phân nhóm với tab Nhân sự, nên tổng, số giáo viên và số cán bộ luôn khớp
     * với danh sách chi tiết.
     */
    const personnelSummary =
        summarizePersonnel(scope.personnel);

    const personnelTotal =
        personnelSummary.total;

    const personnelByRole = groupPersonnel(scope.personnel).map(
        (group) => ({
            label: group.label,
            value: group.count >= 10
                ? String(group.count)
                : String(group.count).padStart(2, "0"),
        }),
    );

    const studentsTotal =
        stats?.students.total ?? scope.students.filter(
            (item) => item.status === "studying",
        ).length;

    const campusTotal =
        stats?.campuses.total ?? scope.campuses.length;

    const classTotal =
        stats?.classes.total ?? scope.classes.length;

    const campusKpis = [
        {
            title: "Cơ sở",
            value: String(campusTotal).padStart(2, "0"),
            icon: <ApartmentOutlined />,
            tone: "orange" as const,
        },
        {
            title: "Lớp học",
            value: String(classTotal).padStart(2, "0"),
            icon: <ToolOutlined />,
            tone: "purple" as const,
            note: (
                stats && stats.classes.grades.length > 0
                    ? (
                        <KpiTree
                            vertical
                            groups={[
                                {
                                    branches: stats.classes.grades.map(
                                        (grade) => ({
                                            label: `Khối ${grade.grade}`,
                                            value: `${grade.count} lớp`,
                                        }),
                                    ),
                                },
                            ]}
                        />
                    )
                    : (
                        <span className="school-overview__kpi-line">
                            lớp đang hoạt động
                        </span>
                    )
            ),
        },
        {
            title: "Nhân sự",
            value: formatVnNumber(personnelTotal),
            icon: <TeamOutlined />,
            tone: "green" as const,
            titleExtra: stats ? (
                <span className="school-overview__gender">
                    <span>Nam {stats.personnel.male}</span>
                    <span>·</span>
                    <span>Nữ {stats.personnel.female}</span>
                </span>
            ) : undefined,
            note: (
                <>
                    {stats ? (
                        <KpiTree
                            groups={[
                                {
                                    branches: [...personnelByRole],
                                },
                            ]}
                        />
                    ) : (
                        <span className="school-overview__kpi-line">
                            cán bộ – giáo viên – nhân viên
                        </span>
                    )}
                </>
            ),
        },
        {
            title: "Học sinh",
            value: formatVnNumber(studentsTotal),
            icon: <ReadOutlined />,
            tone: "blue" as const,
            titleExtra: stats ? (
                <span className="school-overview__gender">
                    <span>Nam {formatVnNumber(stats.students.male)}</span>
                    <span>·</span>
                    <span>Nữ {formatVnNumber(stats.students.female)}</span>
                </span>
            ) : undefined,
            note: (
                <>
                    {stats ? (
                        <KpiTree
                            groups={[
                                {
                                    branches: stats.students.grades.map(
                                        (grade) => ({
                                            label: `Khối ${grade.grade}`,
                                            value: formatVnNumber(grade.count),
                                        }),
                                    ),
                                },
                            ]}
                        />
                    ) : (
                        <span className="school-overview__kpi-line">
                            đang theo học
                        </span>
                    )}
                </>
            ),
        },
    ];

    const campusColumns: ColumnsType<typeof canThoMockData.campuses[number]> = [
        {
            title: "Tên cơ sở",
            dataIndex: "name",
            width: 220,
        },
        {
            title: "Loại cơ sở",
            dataIndex: "type",
            width: 140,
            render: (value: string) => (
                campusTypeLabelMap[value] ?? value
            ),
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            responsive: ["md"],
        },
        {
            title: "Quy mô",
            width: 150,
            render: (_, row) => {
                const scale = buildCampusScale(row.id);

                const hasData =
                    scale.classCount > 0 ||
                    scale.studentCount > 0 ||
                    scale.teacherCount > 0;

                if (!hasData) {
                    return (
                        <Tooltip title="Cơ sở chưa có dữ liệu lớp, học sinh, giáo viên">
                            <span style={{ color: "#9ca3af" }}>
                                —
                            </span>
                        </Tooltip>
                    );
                }

                return (
                    <Popover
                        trigger="click"
                        placement="bottomLeft"
                        title={`${row.name}: số lượng`}
                        content={(
                            <div className="school-overview__campus-scale">
                                <ul>
                                    <li>
                                        <span>Lớp học</span>

                                        <strong>
                                            {scale.classCount} lớp
                                        </strong>
                                    </li>

                                    <li>
                                        <span>Học sinh</span>

                                        <strong>
                                            {scale.studentCount} HS
                                        </strong>
                                    </li>

                                    <li>
                                        <span>CB-GV-NV</span>

                                        <strong>
                                            {scale.teacherCount} người
                                        </strong>
                                    </li>
                                </ul>

                                <Space wrap>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<ReadOutlined />}
                                        onClick={() =>
                                            navigate(
                                                `/operations/schools?tab=classes&campusId=${row.id}`,
                                            )}
                                    >
                                        Xem lớp học
                                    </Button>

                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<TeamOutlined />}
                                        onClick={() =>
                                            navigate(
                                                `/operations/campuses/${row.id}?tab=staff`,
                                            )}
                                    >
                                        Xem giáo viên
                                    </Button>
                                </Space>
                            </div>
                        )}
                    >
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 0 }}
                        >
                            {scale.classCount} lớp · {scale.studentCount} HS
                        </Button>
                    </Popover>
                );
            },
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            width: 150,
        },
        {
            title: "Chi tiết",
            width: 90,
            align: "center",
            render: (_, row) => (
                <Tooltip title="Xem chi tiết cơ sở">
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() =>
                            navigate(`/operations/campuses/${row.id}`)}
                    />
                </Tooltip>
            ),
        },
        {
            title: "Bản đồ",
            width: 90,
            align: "center",
            render: (_, row) => (
                <Tooltip title="Xem vị trí trên bản đồ">
                    <Button
                        type="text"
                        size="small"
                        icon={<EnvironmentOutlined />}
                        onClick={() =>
                            navigate(`/operations/gis?campus=${row.id}`)}
                    />
                </Tooltip>
            ),
        },
    ];

    const personnelColumns: ColumnsType<typeof canThoMockData.personnel[number]> = [
        {
            title: "",
            width: 48,
            render: (_, item) => (
                <Avatar
                    size={30}
                    style={{
                        backgroundColor: item.gender === "female"
                            ? "#eb2f96"
                            : "#1677ff",
                    }}
                >
                    {initials(item.fullName)}
                </Avatar>
            ),
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 200,
            render: (value: string, item) => (
                <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, fontWeight: 600 }}
                    onClick={() => navigate(`/operations/personnel/${item.id}`)}
                >
                    {value}
                </Button>
            ),
        },
        {
            title: "Chức vụ / Vai trò",
            dataIndex: "roleTitle",
            width: 220,
        },
        {
            title: "Bộ môn / Chuyên môn",
            dataIndex: "subjectIds",
            width: 180,
            render: (value: string[] | undefined) => {
                if (!value || value.length === 0) {
                    return (
                        <span style={{ color: "#9ca3af" }}>
                            Chưa cập nhật
                        </span>
                    );
                }

                return value
                    .map((subjectId) => subjectNameMap.get(subjectId) ?? subjectId)
                    .join(" · ");
            },
        },
        {
            title: "Cơ sở",
            dataIndex: "campusIds",
            responsive: ["lg"],
            render: (value: string[] | undefined) => {
                if (!value || value.length === 0) {
                    return "—";
                }

                return value.map(campusIdToName).join(", ");
            },
        },
        {
            title: "Chi tiết",
            width: 90,
            align: "center",
            render: (_, item) => (
                <Tooltip title="Xem hồ sơ cán bộ/giáo viên">
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() =>
                            navigate(`/operations/personnel/${item.id}`)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="school-overview">
            <div className="school-overview__head">
                <div className="school-overview__identity">
                    <span className="school-overview__code">
                        TỔNG QUAN TRƯỜNG
                    </span>

                    <h3>{school.name}</h3>

                    <p>
                        {educationLevelLabelMap[school.educationLevel] ?? school.educationLevel}
                        {" · "}
                        {wardIdToName(school.wardId)}
                        {" · "}
                        {activeYear?.name ?? "Năm học 2026 - 2027"}
                    </p>
                </div>

                <div className="school-overview__principal">
                    <BankOutlined />

                    <span>
                        Hiệu trưởng:{" "}
                        {canThoMockData.personnel.find(
                            (item) => item.id === school.principalId,
                        )?.fullName ?? "Chưa cập nhật"}
                    </span>
                </div>
            </div>

            <div className="school-overview__kpis">
                {campusKpis.map((kpi) => (
                    <StatCard
                        key={kpi.title}
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                        tone={kpi.tone}
                        note={kpi.note}
                    />
                ))}
            </div>

            <section className="school-overview__section">
                <header>
                    <span>DANH SÁCH CƠ SỞ</span>

                    <strong>Cơ sở trực thuộc trường</strong>
                </header>

                <Table
                    rowKey="id"
                    columns={campusColumns}
                    dataSource={scope.campuses}
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    scroll={{ x: true }}
                    locale={{
                        emptyText: "Chưa có dữ liệu cơ sở.",
                    }}
                />
            </section>

            <section className="school-overview__section">
                <header>
                    <span>NHÂN SỰ</span>

                    <strong>
                        Cán bộ, giáo viên, nhân viên
                        {" ("}
                        {formatVnNumber(personnelTotal)}
                        {")"}
                    </strong>
                </header>

                <Table
                    rowKey="id"
                    columns={personnelColumns}
                    dataSource={scope.personnel.slice(0, PERSONNEL_PREVIEW)}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                    locale={{
                        emptyText: "Chưa có dữ liệu nhân sự.",
                    }}
                />

                {personnelTotal > PERSONNEL_PREVIEW && (
                    <div className="school-overview__more">
                        <Button
                            type="link"
                            icon={<TeamOutlined />}
                            onClick={() =>
                                navigate(
                                    `/operations/schools?tab=personnel&school=${schoolId}`,
                                )}
                        >
                            Xem thêm{" "}
                            {formatVnNumber(personnelTotal - PERSONNEL_PREVIEW)}{" "}
                            nhân sự
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};


export default SchoolOverview;