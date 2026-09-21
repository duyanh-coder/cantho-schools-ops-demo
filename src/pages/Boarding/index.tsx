import CrudManager from "@/components/dashboard/CrudManager";

import {
    CoffeeOutlined,
    GoldOutlined,
    RestOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

import type {
    BoardingRecord,
} from "@/mock/common/types";

import {
    canThoMockData,
} from "@/mock";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";



const campusOptions = canThoMockData.campuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
}));

const gradeOptions = [
    { value: 6, label: "Khối 6" },
    { value: 7, label: "Khối 7" },
    { value: 8, label: "Khối 8" },
    { value: 9, label: "Khối 9" },
];

const statusOptions = [
    { value: "active", label: "Triển khai" },
    { value: "inactive", label: "Tạm ngưng" },
];


const boardingFields: CrudField<BoardingRecord>[] = [
    {
        name: "campusId",
        label: "Cơ sở",
        required: true,
        type: "select",
        options: campusOptions,
        tableWidth: 200,
    },
    {
        name: "grade",
        label: "Khối lớp",
        required: true,
        type: "select",
        options: gradeOptions,
        tableWidth: 110,
    },
    {
        name: "academicYear",
        label: "Năm học",
        required: true,
        tableWidth: 110,
    },
    {
        name: "twoSessionCount",
        label: "Học 2 buổi",
        required: true,
        type: "number",
        tableWidth: 120,
    },
    {
        name: "boardingCount",
        label: "HS bán trú",
        required: true,
        type: "number",
        tableWidth: 120,
    },
    {
        name: "lunchCount",
        label: "Ăn trưa",
        required: true,
        type: "number",
        tableWidth: 110,
    },
    {
        name: "snackCount",
        label: "Ăn xế",
        required: true,
        type: "number",
        tableWidth: 110,
    },
    {
        name: "note",
        label: "Ghi chú",
        type: "textarea",
        span: 24,
        tableWidth: 240,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: statusOptions,
        tableWidth: 130,
    },
];


const boardingKpis: CrudKpi[] = [
    {
        title: "HS ăn trưa / ngày",
        value: canThoMockData.boarding.reduce(
            (sum, item) => sum + item.lunchCount,
            0,
        ),
                        icon: <RestOutlined />,
                        tone: "orange",
                        note: "lượt suất mỗi ngày",
    },
    {
        title: "HS bán trú (2 buổi)",
        value: canThoMockData.boarding.reduce(
            (sum, item) => sum + item.twoSessionCount,
            0,
        ),
        icon: <CoffeeOutlined />,
        tone: "green",
        note: "học cả ngày tại trường",
    },
    {
        title: "HS ngủ trưa",
        value: canThoMockData.boarding.reduce(
            (sum, item) => sum + item.boardingCount,
            0,
        ),
        icon: <SafetyCertificateOutlined />,
        tone: "purple",
        note: "đăng ký bán trú",
    },
    {
        title: "Bữa xế / tuần",
        value: canThoMockData.boarding.reduce(
            (sum, item) => sum + item.snackCount,
            0,
        ),
        icon: <GoldOutlined />,
        tone: "blue",
        note: "bữa phụ buổi chiều",
    },
];


const BoardingPage = () => {
    return (
        <CrudManager<BoardingRecord>
            eyebrow="BÁN TRÚ & CĂN TIN"
            title="Học sinh bán trú – ăn trưa, ngủ trưa, bữa xế"
            description="Quản lý học sinh đăng ký bán trú, ăn trưa, ngủ trưa và bữa phụ buổi chiều tại các cơ sở theo khối và năm học."
            storageKey="can-tho-boarding"
            seed={canThoMockData.boarding}
            fields={boardingFields}
            kpis={boardingKpis}
            entityName="suất bán trú"
            newLabel="Thêm suất bán trú"
        />
    );
};


export default BoardingPage;
