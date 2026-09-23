import {
    ApartmentOutlined,
    BankOutlined,
    ReadOutlined,
    TeamOutlined,
    ToolOutlined,
} from "@ant-design/icons";

import {
    Table,
    Tag,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
} from "react";

import StatCard from "@/components/dashboard/StatCard";

import {
    canThoMockData,
} from "@/mock";

import type {
    School,
    SchoolFacility,
} from "@/mock/common/types";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import "./overview.scss";


const educationLevelLabelMap: Record<string, string> = {
    primary: "Tiểu học",
    THCS: "THCS",
    THPT: "THPT",
    THCS_THPT: "THCS & THPT",
};

const facilityCategoryLabelMap: Record<string, string> = {
    classroom: "Phòng học",
    function_room: "Phòng chức năng",
    library: "Thư viện",
    playground: "Sân chơi",
    equipment: "Thiết bị",
    kitchen: "Bếp ăn",
};

const conditionLabelMap: Record<string, string> = {
    good: "Tốt",
    normal: "Bình thường",
    repair: "Cần sửa chữa",
};

const conditionToneMap: Record<string, string> = {
    good: "green",
    normal: "blue",
    repair: "orange",
};

const genderLabelMap: Record<string, string> = {
    male: "Nam",
    female: "Nữ",
};

const campusIdToName = (
    campusId: string,
): string => {
    return canThoMockData.campuses.find(
        (campus) => campus.id === campusId,
    )?.name ?? campusId;
};

const classIdToName = (
    classId: string | undefined,
): string => {
    if (!classId) {
        return "";
    }

    return canThoMockData.classes.find(
        (classItem) => classItem.id === classId,
    )?.name ?? classId;
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
    const statusOptions =
        useCatalogOptions("status");

    const statusLabelMap = useMemo(
        () => new Map<string, string>(
            statusOptions.map(
                (option) => [String(option.value), option.label],
            ),
        ),
        [statusOptions],
    );

    const schoolId = school?.id;

    const scope = useMemo(() => {
        if (!schoolId) {
            return {
                campuses: [] as typeof canThoMockData.campuses,
                personnel: [] as typeof canThoMockData.personnel,
                students: [] as typeof canThoMockData.students,
                facilities: [] as SchoolFacility[],
            };
        }

        return {
            campuses: canThoMockData.campuses.filter(
                (campus) => campus.schoolId === schoolId,
            ),
            personnel: canThoMockData.personnel.filter(
                (item) => item.schoolId === schoolId,
            ),
            students: canThoMockData.students.filter(
                (item) => item.schoolId === schoolId,
            ),
            facilities: canThoMockData.facilities.filter(
                (item) => item.schoolId === schoolId,
            ),
        };
    }, [schoolId]);

    if (!school) {
        return null;
    }

    const campusKpis = [
        {
            title: "Cơ sở",
            value: scope.campuses.length,
            icon: <ApartmentOutlined />,
            tone: "blue" as const,
            note: "cơ sở trực thuộc",
        },
        {
            title: "Nhân sự",
            value: scope.personnel.length,
            icon: <TeamOutlined />,
            tone: "green" as const,
            note: "cán bộ – giáo viên",
        },
        {
            title: "Học sinh",
            value: scope.students.length,
            icon: <ReadOutlined />,
            tone: "orange" as const,
            note: "đang theo học",
        },
        {
            title: "Cơ sở vật chất",
            value: scope.facilities.length,
            icon: <ToolOutlined />,
            tone: "purple" as const,
            note: "mục đã kiểm kê",
        },
    ];

    const campusColumns: ColumnsType<typeof canThoMockData.campuses[number]> = [
        {
            title: "Mã cơ sở",
            dataIndex: "code",
            width: 120,
        },
        {
            title: "Tên cơ sở",
            dataIndex: "name",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            responsive: ["md"],
        },
        {
            title: "Trụ sở chính",
            dataIndex: "isMainCampus",
            width: 120,
            render: (value: boolean) => (
                value ? (
                    <Tag color="green">Chính</Tag>
                ) : (
                    <Tag>Phân hiệu</Tag>
                )
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 110,
            render: (value: string) => (
                <Tag
                    color={
                        value === "active"
                            ? "green"
                            : "red"
                    }
                >
                    {statusLabelMap.get(value) ?? value}
                </Tag>
            ),
        },
    ];

    const personnelColumns: ColumnsType<typeof canThoMockData.personnel[number]> = [
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            width: 190,
        },
        {
            title: "Chức vụ / Vị trí",
            dataIndex: "roleTitle",
        },
        {
            title: "Trình độ",
            dataIndex: "degree",
            responsive: ["lg"],
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 110,
            render: (value: string) => (
                <Tag
                    color={
                        value === "active"
                            ? "green"
                            : "red"
                    }
                >
                    {statusLabelMap.get(value) ?? value}
                </Tag>
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
            width: 180,
        },
        {
            title: "Lớp",
            dataIndex: "classId",
            width: 80,
            render: (value: string | undefined) => classIdToName(value),
        },
        {
            title: "Cơ sở",
            dataIndex: "campusId",
            render: (value: string) => campusIdToName(value),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            width: 90,
            render: (value: string) => genderLabelMap[value] ?? value,
        },
    ];

    const facilityColumns: ColumnsType<SchoolFacility> = [
        {
            title: "Cơ sở",
            dataIndex: "campusId",
            render: (value: string) => campusIdToName(value),
        },
        {
            title: "Loại",
            dataIndex: "category",
            width: 150,
            render: (value: string) => facilityCategoryLabelMap[value] ?? value,
        },
        {
            title: "Hạng mục",
            dataIndex: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            width: 110,
            render: (value: number, row: SchoolFacility) => (
                <span>
                    {value} {row.unit}
                </span>
            ),
        },
        {
            title: "Tình trạng",
            dataIndex: "condition",
            width: 130,
            render: (value: string) => (
                <Tag color={conditionToneMap[value] ?? "default"}>
                    {conditionLabelMap[value] ?? value}
                </Tag>
            ),
        },
    ];

    return (
        <div className="school-overview">
            <div className="school-overview__head">
                <div className="school-overview__identity">
                    <span className="school-overview__code">
                        {school.code}
                    </span>

                    <h3>{school.name}</h3>

                    <p>
                        {educationLevelLabelMap[school.educationLevel] ?? school.educationLevel}
                        {" · "}
                        {wardIdToName(school.wardId)}
                        {" · "}
                        {statusLabelMap.get(school.status) ?? school.status}
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
                    scroll={{ x: true }}
                />
            </section>

            <section className="school-overview__section">
                <header>
                    <span>NHÂN SỰ</span>

                    <strong>Cán bộ, giáo viên, nhân viên</strong>
                </header>

                <Table
                    rowKey="id"
                    columns={personnelColumns}
                    dataSource={scope.personnel}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                />
            </section>

            <section className="school-overview__section">
                <header>
                    <span>HỌC SINH</span>

                    <strong>Học sinh theo lớp & cơ sở</strong>
                </header>

                <Table
                    rowKey="id"
                    columns={studentColumns}
                    dataSource={scope.students}
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                    size="small"
                    scroll={{ x: true }}
                />
            </section>

            <section className="school-overview__section">
                <header>
                    <span>CƠ SỞ VẬT CHẤT</span>

                    <strong>Hạng mục đã kiểm kê theo cơ sở</strong>
                </header>

                <Table
                    rowKey="id"
                    columns={facilityColumns}
                    dataSource={scope.facilities}
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                />
            </section>
        </div>
    );
};


export default SchoolOverview;