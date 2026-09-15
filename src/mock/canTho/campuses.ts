import type { Campus } from "../common/types";

export const canThoCampuses: Campus[] = [
    {
        id: "can-tho-campus-001", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-001",
        name: "Cơ sở chính", address: "Phường Ninh Kiều, thành phố Cần Thơ",
        location: { lat: 10.0319, lng: 105.7842 }, managerId: "can-tho-user-001", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-002", schoolId: "can-tho-school-001", wardId: "can-tho-ward-001", code: "CT-CS-002",
        name: "Cơ sở phụ", address: "Phường Ninh Kiều, thành phố Cần Thơ",
        location: { lat: 10.039, lng: 105.786 }, managerId: "can-tho-user-001", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-003", schoolId: "can-tho-school-002", wardId: "can-tho-ward-001", code: "CT-CS-003",
        name: "Cơ sở chính", address: "Phường Ninh Kiều, thành phố Cần Thơ",
        location: { lat: 10.0375, lng: 105.777 }, managerId: "can-tho-user-003", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-004", schoolId: "can-tho-school-002", wardId: "can-tho-ward-001", code: "CT-CS-004",
        name: "Cơ sở phụ", address: "Phường Ninh Kiều, thành phố Cần Thơ",
        location: { lat: 10.0355, lng: 105.7825 }, managerId: "can-tho-user-003", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-005", schoolId: "can-tho-school-003", wardId: "can-tho-ward-003", code: "CT-CS-005",
        name: "Cơ sở chính", address: "Phường Tân An, thành phố Cần Thơ",
        location: { lat: 10.0115, lng: 105.765 }, managerId: "can-tho-user-005", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-006", schoolId: "can-tho-school-003", wardId: "can-tho-ward-003", code: "CT-CS-006",
        name: "Cơ sở phụ", address: "Phường Tân An, thành phố Cần Thơ",
        location: { lat: 10.015, lng: 105.771 }, managerId: "can-tho-user-005", isMainCampus: false, status: "active",
    },

    {
        id: "can-tho-campus-007", schoolId: "can-tho-school-004", wardId: "can-tho-ward-004", code: "CT-CS-007",
        name: "Cơ sở chính", address: "Phường Bình Thủy, thành phố Cần Thơ",
        location: { lat: 10.0715, lng: 105.757 }, managerId: "can-tho-user-007", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-008", schoolId: "can-tho-school-005", wardId: "can-tho-ward-004", code: "CT-CS-008",
        name: "Cơ sở chính", address: "Phường Bình Thủy, thành phố Cần Thơ",
        location: { lat: 10.0745, lng: 105.751 }, managerId: "can-tho-user-009", isMainCampus: true, status: "active",
    },

    {
        id: "can-tho-campus-009", schoolId: "can-tho-school-006", wardId: "can-tho-ward-002", code: "CT-CS-009",
        name: "Cơ sở chính", address: "Phường Cái Khế, thành phố Cần Thơ",
        location: { lat: 10.0522, lng: 105.779 }, managerId: "can-tho-user-011", isMainCampus: true, status: "active",
    },

];
