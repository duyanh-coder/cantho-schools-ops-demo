import type { Sector } from "../common/types";

export const canThoSectors: Sector[] = [
    { id: "can-tho-sector-k6", schoolId: "can-tho-school-001", type: "grade", code: "KH-6", name: "Khối 6", grade: 6, hasBoarding: "0", managerId: "can-tho-personnel-006", memberIds: ["can-tho-personnel-003", "can-tho-personnel-006"], about: "Khối lớp đầu cấp THCS, năm học 2026-2027", status: "active" },

    { id: "can-tho-sector-k7", schoolId: "can-tho-school-001", type: "grade", code: "KH-7", name: "Khối 7", grade: 7, hasBoarding: "0", managerId: "can-tho-personnel-007", memberIds: ["can-tho-personnel-007"], about: "Khối lớp 7 gồm các lớp 7A1 tại các cơ sở", status: "active" },

    { id: "can-tho-sector-k8", schoolId: "can-tho-school-001", type: "grade", code: "KH-8", name: "Khối 8", grade: 8, hasBoarding: "0", managerId: "can-tho-personnel-008", memberIds: ["can-tho-personnel-008"], about: "Khối lớp 8 – giai đoạn chuyển tiếp lên cấp cuối cấp", status: "active" },

    { id: "can-tho-sector-k9", schoolId: "can-tho-school-001", type: "grade", code: "KH-9", name: "Khối 9", grade: 9, hasBoarding: "0", managerId: "can-tho-personnel-001", memberIds: ["can-tho-personnel-001"], about: "Khối lớp cuối cấp – trọng tâm ôn thi tốt nghiệp THCS", status: "active" },

    { id: "can-tho-sector-ts01", schoolId: "can-tho-school-001", type: "subject_group", hasBoarding: "0", code: "TCM-TN", name: "Tổ Toán – Lý – Hóa – Sinh", managerId: "can-tho-personnel-003", memberIds: ["can-tho-personnel-003", "can-tho-personnel-005", "can-tho-personnel-006", "can-tho-personnel-007"], about: "Tổ chuyên môn khối Tự nhiên", status: "active" },

    { id: "can-tho-sector-ts02", schoolId: "can-tho-school-001", type: "subject_group", hasBoarding: "0", code: "TCM-XH", name: "Tổ Ngữ văn – Sử – Địa", managerId: "can-tho-personnel-002", memberIds: ["can-tho-personnel-002", "can-tho-personnel-008", "can-tho-personnel-001"], about: "Tổ chuyên môn khối Xã hội", status: "active" },

    { id: "can-tho-sector-ts03", schoolId: "can-tho-school-001", type: "subject_group", hasBoarding: "0", code: "TCM-NN", name: "Tổ Ngoại ngữ – Tin học", managerId: "can-tho-personnel-004", memberIds: ["can-tho-personnel-004"], about: "Tổ chuyên môn Ngoại ngữ và Tin học", status: "active" },

    { id: "can-tho-sector-ts04", schoolId: "can-tho-school-001", type: "subject_group", hasBoarding: "0", code: "TCM-TD", name: "Tổ Thể dục – Nghệ thuật – Ngoài giờ", managerId: "can-tho-personnel-005", memberIds: [], about: "Tổ chuyên môn Thể chất, Âm nhạc, Mỹ thuật và hoạt động ngoài giờ", status: "inactive" },
];