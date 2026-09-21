import type { Campus } from "../common/types";

export const canThoCampuses: Campus[] = [
    {
        id: "can-tho-campus-001", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-001",
        name: "Trụ sở chính – THCS Đoàn Thị Điểm", address: "Số 15 Nguyễn Đệ, Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0348, lng: 105.7702 }, managerId: "can-tho-user-001", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-002", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-002",
        name: "Phân hiệu Chu Văn An", address: "Phường An Khánh, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.039, lng: 105.782 }, managerId: "can-tho-user-002", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-003", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-003",
        name: "Phân hiệu Thới Bình", address: "Phường Thới Bình, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0365, lng: 105.776 }, managerId: "can-tho-user-003", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-004", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-004",
        name: "Phân hiệu An Lạc", address: "Phường An Lạc, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.027, lng: 105.78 }, managerId: "can-tho-user-003", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-005", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-005",
        name: "Phân hiệu Trần Hưng Đạo", address: "Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0415, lng: 105.7715 }, managerId: "can-tho-user-004", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-006", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-006",
        name: "Phân hiệu Huỳnh Thúc Kháng", address: "Phường Hưng Lợi, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.024, lng: 105.7755 }, managerId: "can-tho-user-004", isMainCampus: false, status: "active",
    },
];