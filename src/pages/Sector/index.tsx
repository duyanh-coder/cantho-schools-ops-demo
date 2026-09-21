import CrudManager from "@/components/dashboard/CrudManager";

import {
    ApartmentOutlined,
    BookOutlined,
    PartitionOutlined,
    TrophyOutlined,
} from "@ant-design/icons";

import type {
    Sector,
} from "@/mock/common/types";

import {
    canThoMockData,
} from "@/mock";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";


const sectorTypeOptions = [
    { value: "grade", label: "Khối lớp" },
    { value: "subject_group", label: "Tổ bộ môn" },
];

const statusOptions = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Tạm ngưng" },
];

const managerOptions = canThoMockData.personnel
    .filter((item) => item.status === "active")
    .map((item) => ({
        value: item.id,
        label: item.fullName,
    }));

const memberOptions = canThoMockData.personnel
    .filter((item) => item.status === "active")
    .map((item) => ({
        value: item.id,
        label: item.fullName,
    }));

const gradeOptions = [
    { value: 6, label: "Khối 6" },
    { value: 7, label: "Khối 7" },
    { value: 8, label: "Khối 8" },
    { value: 9, label: "Khối 9" },
];


const sectorFields: CrudField<Sector>[] = [
    {
        name: "name",
        label: "Tên tổ / khối",
        required: true,
        tableWidth: 220,
    },
    {
        name: "type",
        label: "Loại hình",
        required: true,
        type: "select",
        options: sectorTypeOptions,
        tableWidth: 140,
    },
    {
        name: "grade",
        label: "Khối lớp",
        type: "select",
        options: gradeOptions,
        tableWidth: 110,
        hideInForm: false,
    },
    {
        name: "managerId",
        label: "Trưởng khối / tổ trưởng",
        type: "select",
        options: managerOptions,
        tableWidth: 190,
    },
    {
        name: "memberIds",
        label: "Thành viên",
        type: "multiselect",
        options: memberOptions,
        tableWidth: 240,
    },
    {
        name: "about",
        label: "Mô tả nhiệm vụ",
        type: "textarea",
        span: 24,
        tableWidth: 260,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: statusOptions,
        tableWidth: 130,
        initialValue: "active",
    },
];


const kpis: CrudKpi[] = [
    {
        title: "Tổng khối & tổ chuyên môn",
        value: canThoMockData.sectors.length,
        icon: <PartitionOutlined />,
        tone: "blue",
        note: "khối 6–9 + tổ bộ môn",
    },
    {
        title: "Khối lớp",
        value: canThoMockData.sectors.filter(
            (item) => item.type === "grade",
        ).length,
        icon: <BookOutlined />,
        tone: "green",
        note: "khối 6, 7, 8, 9",
    },
    {
        title: "Tổ chuyên môn",
        value: canThoMockData.sectors.filter(
            (item) => item.type === "subject_group",
        ).length,
        icon: <ApartmentOutlined />,
        tone: "orange",
        note: "tổ bộ môn giảng dạy",
    },
    {
        title: "Tổ trưởng – Trưởng khối",
        value: canThoMockData.personnel.filter(
            (item) =>
                ["Tổ trưởng chuyên môn", "Trưởng khối"].includes(
                    item.roleTitle,
                ),
        ).length,
        icon: <TrophyOutlined />,
        tone: "purple",
        note: "đang quản lý",
    },
];


const SectorPage = () => {
    return (
        <CrudManager<Sector>
            eyebrow="KHỐI NGÀNH & TỔ CHUYÊN MÔN"
            title="Khối lớp & tổ bộ môn"
            description="Phân chia khối ngành theo khối lớp 6–9 và tổ chuyên môn/bộ môn của Trường THCS Ninh Kiều, gắn với phân công giáo viên."
            entityName="khối/tổ"
            newLabel="Thêm khối/tổ mới"
            storageKey="can-tho-sectors"
            seed={canThoMockData.sectors}
            fields={sectorFields}
            kpis={kpis}
        />
    );
};


export default SectorPage;
