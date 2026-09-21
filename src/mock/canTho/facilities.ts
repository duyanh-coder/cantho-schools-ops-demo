import type { Facility } from "../common/types";

export const canThoFacilities: Facility[] = [
    { id: "can-tho-fac-001", campusId: "can-tho-campus-001", type: "classroom", name: "Phòng học lý thuyết", quantity: 16, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-002", campusId: "can-tho-campus-001", type: "function_room", name: "Phòng thí nghiệm Hóa - Sinh", quantity: 2, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-003", campusId: "can-tho-campus-001", type: "function_room", name: "Phòng thực hành Tin học", quantity: 1, unit: "phòng", condition: "under_repair", note: "Đang nâng cấp 10 máy tính" },
    { id: "can-tho-fac-004", campusId: "can-tho-campus-001", type: "function_room", name: "Thư viện trường", quantity: 1, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-005", campusId: "can-tho-campus-001", type: "canteen", name: "Căn tin phục vụ ăn sáng, cơm trưa", quantity: 1, unit: "căn tin", condition: "good" },
    { id: "can-tho-fac-006", campusId: "can-tho-campus-001", type: "equipment", name: "Máy chiếu projector", quantity: 8, unit: "bộ", condition: "good" },
    { id: "can-tho-fac-007", campusId: "can-tho-campus-002", type: "classroom", name: "Phòng học lý thuyết", quantity: 12, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-008", campusId: "can-tho-campus-002", type: "function_room", name: "Phòng học bộ môn", quantity: 2, unit: "phòng", condition: "degraded", note: "Cần tu sửa trần, bàn ghế" },
    { id: "can-tho-fac-009", campusId: "can-tho-campus-003", type: "classroom", name: "Phòng học lý thuyết", quantity: 12, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-010", campusId: "can-tho-campus-003", type: "sport_field", name: "Sân bóng chuyền", quantity: 1, unit: "sân", condition: "good" },
    { id: "can-tho-fac-011", campusId: "can-tho-campus-004", type: "classroom", name: "Phòng học lý thuyết", quantity: 8, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-012", campusId: "can-tho-campus-004", type: "function_room", name: "Phòng đa năng", quantity: 1, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-013", campusId: "can-tho-campus-015", type: "classroom", name: "Phòng học lý thuyết", quantity: 8, unit: "phòng", condition: "good" },
    { id: "can-tho-fac-014", campusId: "can-tho-campus-015", type: "equipment", name: "Bộ thiết bị thí nghiệm Vật lý", quantity: 6, unit: "bộ", condition: "good" },
    { id: "can-tho-fac-015", campusId: "can-tho-campus-016", type: "classroom", name: "Phòng học lý thuyết", quantity: 8, unit: "phòng", condition: "degraded", note: "Kiểm tra lại mái, cửa sổ trước mùa mưa" },
    { id: "can-tho-fac-016", campusId: "can-tho-campus-016", type: "function_room", name: "Phòng thực hành Hóa học", quantity: 1, unit: "phòng", condition: "good" },
];