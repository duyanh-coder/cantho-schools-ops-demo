import type {
    Campus,
    Personnel,
    School,
    SchoolClass,
    SchoolRoom,
    Student,
    Ward,
} from "@/mock/common/types";

import {
    groupPersonnel,
    summarizePersonnel,
} from "@/mock/common/personnelRole";


/**
 * Nhãn hiển thị cho loại cơ sở và trạng thái.
 *
 * Đặt ở đây thay vì trong trang GIS để phần tính toán có thể kiểm thử
 * độc lập với giao diện.
 */
export const CAMPUS_TYPE_LABELS: Record<Campus["type"], string> = {
    HEADQUARTERS: "Trụ sở chính",
    BRANCH: "Phân hiệu",
};

export const CAMPUS_STATUS_LABELS: Record<Campus["status"], string> = {
    ACTIVE: "Đang hoạt động",
    SUSPENDED: "Tạm ngừng",
    INACTIVE: "Ngừng hoạt động",
};

const EMPTY = "Chưa có dữ liệu";


export interface CampusDetailInput {
    campus: Campus;

    school?: School;

    ward?: Ward;

    classes?: SchoolClass[];

    rooms?: SchoolRoom[];

    personnel?: Personnel[];

    students?: Student[];
}


/**
 * Chi tiết một cơ sở đã quy đổi sẵn sang chuỗi hiển thị.
 *
 * Các số liệu đều suy ra từ dữ liệu đầu vào, không có giá trị viết tay.
 */
export interface CampusDetail {
    campusId: string;

    code: string;

    name: string;

    historicalName: string;

    campusType: string;

    status: string;

    schoolName: string;

    wardName: string;

    address: string;

    coordinates: string;

    phone: string;

    email: string;

    managerName: string;

    classCount: number;

    studentCount: number;

    classroomCount: number;

    functionRoomCount: number;

    roomCount: number;

    personnelSummary: string;
}


export interface CampusDetailField {
    key: string;

    label: string;

    value: string;
}


const formatNumber = (
    value: number,
): string => value.toLocaleString("vi-VN");


/**
 * Tọa độ dạng 6 chữ số thập phân, đủ chính xác cho toạ độ GIS nhưng
 * không làm dài dòng trong bảng chi tiết.
 */
export const formatCoordinates = (
    latitude: number,
    longitude: number,
): string => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return EMPTY;
    }

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};


/**
 * Tóm tắt nhân sự của một cơ sở.
 *
 * Một nhân sự phụ trách nhiều cơ sở sẽ được tính cho từng cơ sở, đúng với
 * cách `campusIds` được dùng ở các màn khác.
 */
export const summarizeCampusPersonnel = (
    personnel: Personnel[],
    campusId: string,
): string => {
    const assigned = personnel.filter((person) =>
        person.campusIds.includes(campusId));

    const summary = summarizePersonnel(assigned);

    return groupPersonnel(assigned)
        .map((group) => `${group.label}: ${group.count}`)
        .concat(`Tổng: ${summary.total}`)
        .join(" · ");
};


/**
 * Dựng chi tiết một cơ sở.
 *
 * `managerId` trỏ tới `Personnel` của trường, còn `school.principalId`
 * là dự phòng cho cơ sở chưa gán người quản lý.
 */
export const buildCampusDetail = (
    input: CampusDetailInput,
): CampusDetail => {
    const { campus, school, ward } = input;

    const classes = input.classes ?? [];

    const rooms = input.rooms ?? [];

    const personnel = input.personnel ?? [];

    const classIds = new Set(classes.map((item) => item.id));

    const students = (input.students ?? []).filter((student) =>
        student.classId !== undefined && classIds.has(student.classId));

    const classrooms = rooms.filter((room) => room.category === "classroom");

    const functionRooms = rooms.filter((room) =>
        room.category === "function_room");

    const manager = personnel.find((person) =>
        person.id === campus.managerId);

    return {
        campusId: campus.id,

        code: campus.code,

        name: campus.name,

        historicalName: campus.historicalName ?? EMPTY,

        campusType: CAMPUS_TYPE_LABELS[campus.type] ?? EMPTY,

        status: CAMPUS_STATUS_LABELS[campus.status] ?? EMPTY,

        schoolName: school?.name ?? EMPTY,

        wardName: ward?.name ?? EMPTY,

        address: campus.address,

        coordinates: formatCoordinates(campus.latitude, campus.longitude),

        phone: campus.phone ?? EMPTY,

        email: campus.email ?? EMPTY,

        managerName: manager?.fullName
            ?? (school?.principalId
                ? personnel.find((person) =>
                    person.id === school.principalId)?.fullName
                : undefined)
            ?? EMPTY,

        classCount: classes.length,

        studentCount: students.length,

        classroomCount: classrooms.length,

        functionRoomCount: functionRooms.length,

        roomCount: rooms.length,

        personnelSummary: summarizeCampusPersonnel(personnel, campus.id),
    };
};


/**
 * Đúng 16 trường hiển thị ở panel chi tiết của bản đồ.
 *
 * Giữ thứ tự cố định để giao diện và kiểm thử cùng dựa vào một danh sách.
 */
export const campusDetailFields = (
    detail: CampusDetail,
): CampusDetailField[] => [
    { key: "code", label: "Mã cơ sở", value: detail.code },
    { key: "name", label: "Tên cơ sở", value: detail.name },
    { key: "campusType", label: "Loại cơ sở", value: detail.campusType },
    { key: "status", label: "Trạng thái", value: detail.status },
    { key: "schoolName", label: "Trường phụ trách", value: detail.schoolName },
    { key: "wardName", label: "Phường / Xã", value: detail.wardName },
    { key: "address", label: "Địa chỉ", value: detail.address },
    { key: "coordinates", label: "Tọa độ", value: detail.coordinates },
    { key: "phone", label: "Điện thoại", value: detail.phone },
    { key: "email", label: "Email", value: detail.email },
    { key: "managerName", label: "Người quản lý", value: detail.managerName },
    { key: "classCount", label: "Lớp học", value: formatNumber(detail.classCount) },
    { key: "studentCount", label: "Học sinh", value: formatNumber(detail.studentCount) },
    { key: "classroomCount", label: "Phòng học", value: formatNumber(detail.classroomCount) },
    { key: "functionRoomCount", label: "Phòng chức năng", value: formatNumber(detail.functionRoomCount) },
    { key: "personnelSummary", label: "Nhân sự", value: detail.personnelSummary },
];