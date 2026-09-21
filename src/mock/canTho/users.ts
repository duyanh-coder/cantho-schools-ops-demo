import type { User } from "../common/types";

export const canThoUsers: User[] = [
    { id: "can-tho-user-001", code: "HT001", fullName: "Nguyễn Văn Minh", role: "principal", schoolId: "can-tho-school-001", managedCampusIds: ["can-tho-campus-001", "can-tho-campus-002", "can-tho-campus-003", "can-tho-campus-004", "can-tho-campus-005", "can-tho-campus-006"], status: "active" },

    { id: "can-tho-user-002", code: "HP002", fullName: "Trần Thị Lan", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["can-tho-campus-001", "can-tho-campus-002"], status: "active" },

    { id: "can-tho-user-003", code: "HP003", fullName: "Lê Hoàng Nam", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["can-tho-campus-003", "can-tho-campus-004"], status: "active" },

    { id: "can-tho-user-004", code: "HP004", fullName: "Phạm Quốc Huy", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["can-tho-campus-005", "can-tho-campus-006"], status: "active" },
];