import CrudManager from "@/components/dashboard/CrudManager";

import {
    IdcardOutlined,
    ReadOutlined,
    TeamOutlined,
    TrophyOutlined,
} from "@ant-design/icons";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";

import type {
    Personnel,
} from "@/mock/common/types";

import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import {
    useCatalogOptions,
} from "@/store/useCatalog";



const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
}));


const buildPersonnelFields = (
    genderOptions: Array<{ value: string | number; label: string }>,
    yesNoOptions: Array<{ value: string | number; label: string }>,
    statusOptions: Array<{ value: string | number; label: string }>,
    campusOptionsArg: Array<{ value: string | number; label: string }>,
    sectorOptionsArg: Array<{ value: string | number; label: string }>,
): CrudField<Personnel>[] => [
    {
        name: "code",
        label: "Mã CB-GV",
        required: true,
        tableWidth: 130,
    },
    {
        name: "fullName",
        label: "Họ và tên",
        required: true,
        tableWidth: 200,
    },
    {
        name: "gender",
        label: "Giới tính",
        type: "select",
        options: genderOptions,
        tableWidth: 110,
        required: true,
        table: false,
    },
    {
        name: "roleTitle",
        label: "Chức vụ / Vị trí",
        required: true,
        tableWidth: 220,
    },
    {
        name: "degree",
        label: "Trình độ",
        required: true,
        tableWidth: 170,
        table: false,
    },
    {
        name: "subjectIds",
        label: "Môn giảng dạy",
        type: "multiselect",
        options: subjectOptions,
        tableWidth: 200,
        required: true,
    },
    {
        name: "teamId",
        label: "Tổ chuyên môn",
        type: "select",
        options: sectorOptionsArg,
        tableWidth: 170,
    },
    {
        name: "campusIds",
        label: "Cơ sở công tác",
        type: "multiselect",
        options: campusOptionsArg,
        tableWidth: 230,
        required: true,
        table: false,
    },
    {
        name: "phone",
        label: "Số điện thoại",
        tableWidth: 130,
        table: false,
    },
    {
        name: "email",
        label: "Email",
        tableWidth: 200,
        table: false,
    },
    {
        name: "isExcellentTeacher",
        label: "GV giỏi / CSTĐ",
        type: "select",
        options: yesNoOptions,
        tableWidth: 130,
        table: false,
    },
    {
        name: "achievements",
        label: "Thành tích",
        type: "textarea",
        table: false,
        hideInForm: false,
        span: 24,
        initialValue: "",
    },
    {
        name: "status",
        label: "Trạng thái",
        type: "select",
        options: statusOptions,
        required: true,
        tableWidth: 130,
        initialValue: "active",
    },
];


const personnelKpis: CrudKpi[] = [
    {
        title: "Tổng CB-GV",
        value: canThoMockData.personnel.length,
        icon: <TeamOutlined />,
        tone: "blue",
        note: "toàn trường THCS Ninh Kiều",
    },
    {
        title: "GV giỏi / CSTĐ",
        value: canThoMockData.personnel.filter(
            (item) => item.isExcellentTeacher,
        ).length,
        icon: <TrophyOutlined />,
        tone: "orange",
        note: "đạt danh hiệu tiêu biểu",
    },
    {
        title: "Cán bộ quản lý",
        value: canThoMockData.personnel.filter(
            (item) => item.roleTitle.includes("Hiệu trưởng"),
        ).length,
        icon: <IdcardOutlined />,
        tone: "green",
        note: "Ban giám hiệu",
    },
    {
        title: "Học vị Thạc sĩ +",
        value: canThoMockData.personnel.filter(
            (item) => item.degree.includes("Thạc sĩ"),
        ).length,
        icon: <ReadOutlined />,
        tone: "purple",
        note: "trình độ chuyên môn cao",
    },
];


const PersonnelPage = ({
    compact,
    schoolId,
}: {
    compact?: boolean;

    schoolId?: string;
}) => {
    const genderOptions =
        useCatalogOptions(
            "gender",
        );

    const yesNoOptions =
        useCatalogOptions(
            "yes-no",
        );

    const statusOptions =
        useCatalogOptions(
            "personnel-status",
        );

    const school =
        canThoMockData.schools.find(
            (candidate) => candidate.id === schoolId,
        );

    const scopedPersonnel =
        schoolId
            ? canThoMockData.personnel.filter(
                (item) => item.schoolId === schoolId,
            )
            : canThoMockData.personnel;

    const scopedCampuses =
        schoolId
            ? canThoMockData.campuses.filter(
                (candidate) => candidate.schoolId === schoolId,
            )
            : canThoMockData.campuses;

    const scopedSectors =
        schoolId
            ? canThoMockData.sectors.filter(
                (sector) =>
                    sector.schoolId === schoolId &&
                    sector.type === "subject_group",
            )
            : canThoMockData.sectors;

    const scopedCampusOptions = scopedCampuses.map((campus) => ({
        value: campus.id,
        label: campus.name,
    }));

    const scopedSectorOptions =
        scopedSectors.map((sector) => ({
            value: sector.id,
            label: sector.name,
        }));

    const scopedKpis: CrudKpi[] = schoolId
        ? [
            {
                title: "Tổng CB-GV",
                value: scopedPersonnel.length,
                icon: <TeamOutlined />,
                tone: "blue",
                note: school?.name ?? "toàn trường",
            },
            {
                title: "GV giỏi / CSTĐ",
                value: scopedPersonnel.filter(
                    (item) => item.isExcellentTeacher,
                ).length,
                icon: <TrophyOutlined />,
                tone: "orange",
                note: "đạt danh hiệu tiêu biểu",
            },
            {
                title: "Cán bộ quản lý",
                value: scopedPersonnel.filter(
                    (item) => item.roleTitle.includes("Hiệu trưởng"),
                ).length,
                icon: <IdcardOutlined />,
                tone: "green",
                note: "Ban giám hiệu",
            },
        ]
        : personnelKpis;

    const personnelFields =
        buildPersonnelFields(
            genderOptions,
            yesNoOptions,
            statusOptions,
            scopedCampusOptions,
            scopedSectorOptions,
        );

    return (
        <CrudManager<Personnel>
            compact={compact}
            eyebrow="QUẢN LÝ NHÂN SỰ"
            title="Cán bộ – giáo viên – nhân viên"
            description={
                schoolId
                    ? `Hồ sơ đội ngũ cán bộ quản lý, giáo viên và nhân viên của ${school?.name ?? "trường đang chọn"}, phân công theo hệ thống cơ sở.`
                    : "Hồ sơ đội ngũ cán bộ quản lý, giáo viên và nhân viên của Trường THCS Ninh Kiều, phân công theo hệ thống cơ sở."
            }
            storageKey="can-tho-personnel"
            seed={canThoMockData.personnel}
            itemFilter={
                schoolId
                    ? (item) => item.schoolId === schoolId
                    : undefined
            }
            createDefaults={
                schoolId
                    ? { schoolId }
                    : undefined
            }
            fields={personnelFields}
            kpis={scopedKpis}
            filters={[
                { field: "gender" },
                { field: "teamId" },
                {
                    field: "subjectIds",
                    multiple: true,
                },
                {
                    field: "campusIds",
                    multiple: true,
                },
                { field: "isExcellentTeacher" },
                { field: "status" },
            ]}
            entityName="cán bộ – giáo viên"
            newLabel="Thêm nhân sự"
            detail
            detailWidth={1000}
        />
    );
};


export default PersonnelPage;
