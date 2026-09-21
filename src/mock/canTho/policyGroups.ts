import type { PolicyGroup } from "../common/types";

export const canThoPolicyGroups: PolicyGroup[] = [
    { id: "can-tho-policy-001", code: "CS-N", name: "HS thuộc hộ nghèo", reductionPercent: 50, note: "Miễn, giảm các khoản thu theo quy định" },
    { id: "can-tho-policy-002", code: "CS-CN", name: "HS thuộc hộ cận nghèo", reductionPercent: 30, note: "Giảm một phần các khoản thu" },
    { id: "can-tho-policy-003", code: "CS-TBLS", name: "Con thương binh - liệt sĩ", reductionPercent: 100, note: "Miễn toàn bộ học phí" },
    { id: "can-tho-policy-004", code: "CS-DTTS", name: "HS dân tộc thiểu số", reductionPercent: 70, note: "Hỗ trợ chi phí học tập" },
    { id: "can-tho-policy-005", code: "CS-GĐCC", name: "Con gia đình có công", reductionPercent: 50, note: "Theo danh sách xác nhận của địa phương" },
];