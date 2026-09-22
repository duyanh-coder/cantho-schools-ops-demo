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

    {
        id: "can-tho-campus-007", schoolId: "can-tho-school-002", wardId: "can-tho-ward-005", code: "CT-CS-007",
        name: "Trụ sở chính – THCS Cái Răng", address: "Phường Cái Răng, quận Cái Răng, TP. Cần Thơ",
        location: { lat: 10.0005, lng: 105.792 }, managerId: "can-tho-personnel-009", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-008", schoolId: "can-tho-school-002", wardId: "can-tho-ward-006", code: "CT-CS-008",
        name: "Phân hiệu Hưng Phú", address: "Phường Hưng Phú, quận Cái Răng, TP. Cần Thơ",
        location: { lat: 9.991, lng: 105.79 }, managerId: "can-tho-personnel-011", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-009", schoolId: "can-tho-school-003", wardId: "can-tho-ward-004", code: "CT-CS-009",
        name: "Trụ sở chính – THCS Bình Thủy", address: "Phường Bình Thủy, quận Bình Thủy, TP. Cần Thơ",
        location: { lat: 10.0725, lng: 105.7565 }, managerId: "can-tho-personnel-013", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-010", schoolId: "can-tho-school-004", wardId: "can-tho-ward-002", code: "CT-CS-010",
        name: "Trụ sở chính – THPT Cái Khế", address: "Phường Cái Khế, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0502, lng: 105.781 }, managerId: "can-tho-personnel-015", isMainCampus: true, status: "active",
    },
];