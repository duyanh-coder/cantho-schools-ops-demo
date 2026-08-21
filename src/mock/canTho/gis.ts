import type { GisMockData } from "../common/types";

export const canThoGis: GisMockData = {
    wards: [
        { id: "can-tho-ward-001", code: "CT-W001", name: "Phường Ninh Kiều", center: [10.0338, 105.783], polygon: [[10.0258, 105.775], [10.041799999999999, 105.775], [10.041799999999999, 105.791], [10.0258, 105.791]] },
        { id: "can-tho-ward-002", code: "CT-W002", name: "Phường Cái Khế", center: [10.0502, 105.781], polygon: [[10.042200000000001, 105.77300000000001], [10.0582, 105.77300000000001], [10.0582, 105.789], [10.042200000000001, 105.789]] },
        { id: "can-tho-ward-003", code: "CT-W003", name: "Phường Tân An", center: [10.0128, 105.768], polygon: [[10.004800000000001, 105.76], [10.0208, 105.76], [10.0208, 105.776], [10.004800000000001, 105.776]] },
        { id: "can-tho-ward-004", code: "CT-W004", name: "Phường Bình Thủy", center: [10.0725, 105.7565], polygon: [[10.0645, 105.7485], [10.080499999999999, 105.7485], [10.080499999999999, 105.7645], [10.0645, 105.7645]] },
        { id: "can-tho-ward-005", code: "CT-W005", name: "Phường Cái Răng", center: [10.0005, 105.792], polygon: [[9.992500000000001, 105.784], [10.0085, 105.784], [10.0085, 105.8], [9.992500000000001, 105.8]] },
        { id: "can-tho-ward-006", code: "CT-W006", name: "Phường Hưng Phú", center: [9.991, 105.79], polygon: [[9.983, 105.78200000000001], [9.998999999999999, 105.78200000000001], [9.998999999999999, 105.798], [9.983, 105.798]] },
    ],

    campuses: [
        { id: "can-tho-campus-001", schoolId: "can-tho-school-001", schoolName: "Trường THCS Chu Văn An", wardId: "can-tho-ward-001", code: "CT-CS-001", name: "Cơ sở chính", address: "Phường Ninh Kiều, thành phố Cần Thơ", position: [10.0319, 105.7842], isMainCampus: true, status: "active" },
        { id: "can-tho-campus-002", schoolId: "can-tho-school-001", schoolName: "Trường THCS Chu Văn An", wardId: "can-tho-ward-001", code: "CT-CS-002", name: "Cơ sở phụ", address: "Phường Ninh Kiều, thành phố Cần Thơ", position: [10.039, 105.786], isMainCampus: false, status: "active" },
        { id: "can-tho-campus-003", schoolId: "can-tho-school-002", schoolName: "Trường THCS Thới Bình", wardId: "can-tho-ward-001", code: "CT-CS-003", name: "Cơ sở chính", address: "Phường Ninh Kiều, thành phố Cần Thơ", position: [10.0375, 105.777], isMainCampus: true, status: "active" },
        { id: "can-tho-campus-004", schoolId: "can-tho-school-002", schoolName: "Trường THCS Thới Bình", wardId: "can-tho-ward-001", code: "CT-CS-004", name: "Cơ sở phụ", address: "Phường Ninh Kiều, thành phố Cần Thơ", position: [10.051, 105.7818], isMainCampus: false, status: "active" },
        { id: "can-tho-campus-005", schoolId: "can-tho-school-003", schoolName: "Trường THCS Lương Thế Vinh", wardId: "can-tho-ward-003", code: "CT-CS-005", name: "Cơ sở chính", address: "Phường Tân An, thành phố Cần Thơ", position: [10.0115, 105.765], isMainCampus: true, status: "active" },
        { id: "can-tho-campus-006", schoolId: "can-tho-school-003", schoolName: "Trường THCS Lương Thế Vinh", wardId: "can-tho-ward-003", code: "CT-CS-006", name: "Cơ sở phụ", address: "Phường Tân An, thành phố Cần Thơ", position: [10.015, 105.771], isMainCampus: false, status: "active" },
        { id: "can-tho-campus-007", schoolId: "can-tho-school-004", schoolName: "Trường THPT Châu Văn Liêm", wardId: "can-tho-ward-004", code: "CT-CS-007", name: "Cơ sở chính", address: "Phường Bình Thủy, thành phố Cần Thơ", position: [10.0285, 105.7695], isMainCampus: true, status: "active" },
        { id: "can-tho-campus-008", schoolId: "can-tho-school-005", schoolName: "Trường THCS An Thới", wardId: "can-tho-ward-004", code: "CT-CS-008", name: "Cơ sở chính", address: "Phường Bình Thủy, thành phố Cần Thơ", position: [10.0745, 105.751], isMainCampus: true, status: "active" },
        { id: "can-tho-campus-009", schoolId: "can-tho-school-006", schoolName: "Trường THCS An Hòa 2", wardId: "can-tho-ward-002", code: "CT-CS-009", name: "Cơ sở chính", address: "Phường Cái Khế, thành phố Cần Thơ", position: [10.079, 105.759], isMainCampus: true, status: "active" },
    ],
};
