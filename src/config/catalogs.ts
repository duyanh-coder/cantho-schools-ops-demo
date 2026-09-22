import type {
    CrudFieldOption,
} from "@/components/dashboard/CrudManager";

import {
    subjects,
} from "@/mock/common";


export interface CatalogDef {
    key: string;

    title: string;

    description: string;

    storageKey: string;

    seed: CrudFieldOption[];
}

const educationLevelOptions: CrudFieldOption[] = [
    { value: "primary", label: "Tiểu học" },
    { value: "THCS", label: "THCS" },
    { value: "THPT", label: "THPT" },
    { value: "THCS_THPT", label: "THCS & THPT" },
];

const gradeOptions: CrudFieldOption[] = [
    { value: 6, label: "Khối 6" },
    { value: 7, label: "Khối 7" },
    { value: 8, label: "Khối 8" },
    { value: 9, label: "Khối 9" },
    { value: 10, label: "Khối 10" },
    { value: 11, label: "Khối 11" },
    { value: 12, label: "Khối 12" },
];

const subjectOptions: CrudFieldOption[] = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
}));

const roleTitleOptions: CrudFieldOption[] = [
    { value: "principal", label: "Hiệu trưởng" },
    { value: "vice_principal", label: "Phó hiệu trưởng" },
    { value: "head_teacher", label: "Tổ trưởng chuyên môn" },
    { value: "deputy_head_teacher", label: "Tổ phó chuyên môn" },
    { value: "grade_lead", label: "Trưởng khối" },
    { value: "teacher", label: "Giáo viên" },
    { value: "staff", label: "Nhân viên" },
];

const degreeOptions: CrudFieldOption[] = [
    { value: "college", label: "Cao đẳng" },
    { value: "bachelor", label: "Cử nhân / Đại học" },
    { value: "master", label: "Thạc sĩ" },
    { value: "doctor", label: "Tiến sĩ" },
];

const awardOptions: CrudFieldOption[] = [
    { value: "ctgd", label: "Chiến sĩ thi đua" },
    { value: "gvdg", label: "Giáo viên dạy giỏi" },
    { value: "cstd", label: "Có thạc đức - CSTĐ" },
    { value: "ldtt", label: "Lao động tiên tiến" },
    { value: "bang_khen", label: "Bằng khen" },
];

const statusOptions: CrudFieldOption[] = [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Tạm ngưng" },
];

const personnelStatusOptions: CrudFieldOption[] = [
    { value: "active", label: "Đang công tác" },
    { value: "inactive", label: "Đã nghỉ / tạm ngừng" },
];

const studentStatusOptions: CrudFieldOption[] = [
    { value: "studying", label: "Đang học" },
    { value: "suspended", label: "Tạm nghỉ" },
    { value: "graduated", label: "Đã tốt nghiệp" },
];

const genderOptions: CrudFieldOption[] = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
];

const sectorTypeOptions: CrudFieldOption[] = [
    { value: "grade", label: "Khối lớp" },
    { value: "subject_group", label: "Tổ bộ môn" },
];

const yesNoOptions: CrudFieldOption[] = [
    { value: "1", label: "Có" },
    { value: "0", label: "Không" },
];

const semesterOptions: CrudFieldOption[] = [
    { value: 1, label: "Học kỳ 1" },
    { value: 2, label: "Học kỳ 2" },
];

const conductOptions: CrudFieldOption[] = [
    { value: "Tốt", label: "Tốt" },
    { value: "Khá", label: "Khá" },
    { value: "Đạt", label: "Đạt" },
];

const changeTypeOptions: CrudFieldOption[] = [
    { value: "increase", label: "Nhập học / tăng" },
    { value: "decrease", label: "Thôi học / giảm" },
];

const changeStatusOptions: CrudFieldOption[] = [
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
];


export const CATALOG_DEFS: CatalogDef[] = [
    {
        key: "education-level",
        title: "Cấp trường",
        description: "Các cấp học của trường, dùng cho thông tin trường và lọc danh sách.",
        storageKey: "can-tho-catalog-education-level",
        seed: educationLevelOptions,
    },
    {
        key: "grade",
        title: "Khối lớp",
        description: "Các khối lớp trong trường, dùng cho phân chia khối và học sinh.",
        storageKey: "can-tho-catalog-grade",
        seed: gradeOptions,
    },
    {
        key: "subject",
        title: "Môn học",
        description: "Danh mục môn học giảng dạy, dùng cho phân công và học bạ.",
        storageKey: "can-tho-catalog-subject",
        seed: subjectOptions,
    },
    {
        key: "role-title",
        title: "Chức vụ / Cán bộ",
        description: "Các chức vụ, vị trí cán bộ – giáo viên – nhân viên trong trường.",
        storageKey: "can-tho-catalog-role-title",
        seed: roleTitleOptions,
    },
    {
        key: "degree",
        title: "Trình độ / Học vị",
        description: "Trình độ chuyên môn, học vị của đội ngũ nhân sự.",
        storageKey: "can-tho-catalog-degree",
        seed: degreeOptions,
    },
    {
        key: "award",
        title: "Danh hiệu thi đua – khen thưởng",
        description: "Các danh hiệu thi đua khen thưởng dùng cho nhân sự và học sinh.",
        storageKey: "can-tho-catalog-award",
        seed: awardOptions,
    },
    {
        key: "status",
        title: "Trạng thái hoạt động",
        description: "Trạng thái chung dùng cho khối/tổ, cơ sở vật chất và các danh mục khác.",
        storageKey: "can-tho-catalog-status",
        seed: statusOptions,
    },
    {
        key: "personnel-status",
        title: "Trạng thái nhân sự",
        description: "Trạng thái công tác của cán bộ, giáo viên, nhân viên.",
        storageKey: "can-tho-catalog-personnel-status",
        seed: personnelStatusOptions,
    },
    {
        key: "student-status",
        title: "Trạng thái học sinh",
        description: "Tình trạng học tập của học sinh trong trường.",
        storageKey: "can-tho-catalog-student-status",
        seed: studentStatusOptions,
    },
    {
        key: "gender",
        title: "Giới tính",
        description: "Danh mục giới tính dùng cho học sinh và nhân sự.",
        storageKey: "can-tho-catalog-gender",
        seed: genderOptions,
    },
    {
        key: "sector-type",
        title: "Loại hình khối / tổ",
        description: "Phân loại khối lớp hay tổ bộ môn trong trường.",
        storageKey: "can-tho-catalog-sector-type",
        seed: sectorTypeOptions,
    },
    {
        key: "yes-no",
        title: "Có / Không",
        description: "Danh mục nhị phân dùng cho cờ đánh dấu (bán trú, chính, giáo viên giỏi...).",
        storageKey: "can-tho-catalog-yes-no",
        seed: yesNoOptions,
    },
    {
        key: "semester",
        title: "Học kỳ",
        description: "Học kỳ trong năm học, dùng cho bảng điểm học sinh.",
        storageKey: "can-tho-catalog-semester",
        seed: semesterOptions,
    },
    {
        key: "conduct",
        title: "Xếp loại hạnh kiểm",
        description: "Xếp loại đạo đức / hạnh kiểm của học sinh.",
        storageKey: "can-tho-catalog-conduct",
        seed: conductOptions,
    },
    {
        key: "enrolment-type",
        title: "Loại biến động sĩ số",
        description: "Loại biến động học sinh (nhập học / thôi học...) để theo dõi sĩ số.",
        storageKey: "can-tho-catalog-enrolment-type",
        seed: changeTypeOptions,
    },
    {
        key: "enrolment-status",
        title: "Trạng thái duyệt biến động",
        description: "Trạng thái phê duyệt các đề nghị biến động sĩ số.",
        storageKey: "can-tho-catalog-enrolment-status",
        seed: changeStatusOptions,
    },
];


export const buildCatalogOption = (
    catalog: CatalogDef,
): CrudFieldOption => {
    return {
        value: catalog.key,
        label: catalog.title,
    };
};