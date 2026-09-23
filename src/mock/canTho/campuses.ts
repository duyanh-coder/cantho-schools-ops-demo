import type { Campus } from "../common/types";

export const canThoCampuses: Campus[] = [
    {
        id: "campus-main", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-an-hoa", code: "NK-MAIN",
        name: "Trường THCS Ninh Kiều", historicalName: "THCS Đoàn Thị Điểm", type: "HEADQUARTERS",
        address: "56 Đ. Ngô Quyền, P. Ninh Kiều, TP Cần Thơ",
        location: { lat: 10.03580839481783, lng: 105.78470548758524 }, latitude: 10.03580839481783, longitude: 105.78470548758524,
        phone: "02923 823 456", email: "main@ninhkieu.edu.vn", managerId: "can-tho-user-001", isMainCampus: true, status: "ACTIVE",
    },

    {
        id: "campus-an-lac", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-an-lac", code: "NK-AL",
        name: "Phân hiệu An Lạc", type: "BRANCH",
        address: "Phường An Lạc, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.027, lng: 105.78 }, latitude: 10.027, longitude: 105.78,
        phone: "02923 823 459", email: "al@ninhkieu.edu.vn", managerId: "can-tho-user-003", isMainCampus: false, status: "ACTIVE",
    },

    {
        id: "campus-tran-hung-dao", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-an-hoa", code: "NK-THD",
        name: "Phân hiệu Trần Hưng Đạo", type: "BRANCH",
        address: "Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.03484793343452, lng: 105.77695885963567 }, latitude: 10.03484793343452, longitude: 105.77695885963567,
        phone: "02923 823 460", email: "thd@ninhkieu.edu.vn", managerId: "can-tho-user-004", isMainCampus: false, status: "ACTIVE",
    },

    {
        id: "campus-huynh-thuc-khang", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-hung-loi", code: "NK-HTK",
        name: "Phân hiệu Huỳnh Thúc Kháng", type: "BRANCH",
        address: "Phường Hưng Lợi, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.024, lng: 105.7755 }, latitude: 10.024, longitude: 105.7755,
        phone: "02923 823 461", email: "htk@ninhkieu.edu.vn", managerId: "can-tho-user-004", isMainCampus: false, status: "ACTIVE",
    },

    {
        id: "campus-thoi-binh", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-thoi-binh", code: "NK-TB",
        name: "Phân hiệu Thới Bình", type: "BRANCH",
        address: "Phường Thới Bình, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0365, lng: 105.776 }, latitude: 10.0365, longitude: 105.776,
        phone: "02923 823 458", email: "tb@ninhkieu.edu.vn", managerId: "can-tho-user-003", isMainCampus: false, status: "ACTIVE",
    },

    {
        id: "campus-chu-van-an", schoolId: "can-tho-school-001", wardId: "can-tho-ward-nk-an-cu", code: "NK-CVA",
        name: "Phân hiệu Chu Văn An", type: "BRANCH",
        address: "9 Đại lộ Hoà Bình, P. Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0382, lng: 105.7865 }, latitude: 10.0382, longitude: 105.7865,
        phone: "02923 823 457", email: "cva@ninhkieu.edu.vn", managerId: "can-tho-user-002", isMainCampus: false, status: "ACTIVE",
    },

    {
        id: "can-tho-campus-007", schoolId: "can-tho-school-002", wardId: "can-tho-ward-005", code: "CT-CS-007",
        name: "Trụ sở chính – THCS Cái Răng", address: "Phường Cái Răng, quận Cái Răng, TP. Cần Thơ",
        location: { lat: 10.0005, lng: 105.792 }, latitude: 10.0005, longitude: 105.792, managerId: "can-tho-personnel-009", isMainCampus: true, type: "HEADQUARTERS", status: "ACTIVE",
    },

    {
        id: "can-tho-campus-008", schoolId: "can-tho-school-002", wardId: "can-tho-ward-006", code: "CT-CS-008",
        name: "Phân hiệu Hưng Phú", address: "Phường Hưng Phú, quận Cái Răng, TP. Cần Thơ",
        location: { lat: 9.991, lng: 105.79 }, latitude: 9.991, longitude: 105.79, managerId: "can-tho-personnel-011", isMainCampus: false, type: "BRANCH", status: "ACTIVE",
    },

    {
        id: "can-tho-campus-009", schoolId: "can-tho-school-003", wardId: "can-tho-ward-004", code: "CT-CS-009",
        name: "Trụ sở chính – THCS Bình Thủy", address: "Phường Bình Thủy, quận Bình Thủy, TP. Cần Thơ",
        location: { lat: 10.0725, lng: 105.7565 }, latitude: 10.0725, longitude: 105.7565, managerId: "can-tho-personnel-013", isMainCampus: true, type: "HEADQUARTERS", status: "ACTIVE",
    },

    {
        id: "can-tho-campus-010", schoolId: "can-tho-school-004", wardId: "can-tho-ward-002", code: "CT-CS-010",
        name: "Trụ sở chính – THPT Cái Khế", address: "Phường Cái Khế, quận Ninh Kiều, TP. Cần Thơ",
        location: { lat: 10.0502, lng: 105.781 }, latitude: 10.0502, longitude: 105.781, managerId: "can-tho-personnel-015", isMainCampus: true, type: "HEADQUARTERS", status: "ACTIVE",
    },
];