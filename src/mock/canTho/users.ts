import type { User } from "../common/types";

export const canThoUsers: User[] = [
    { id: "can-tho-user-001", code: "HT001", fullName: "Nguyễn Văn Minh", role: "principal", schoolId: "can-tho-school-001", managedCampusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], status: "active" },

    { id: "can-tho-user-002", code: "HP002", fullName: "Trần Thị Lan", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["campus-main", "campus-chu-van-an"], status: "active" },

    { id: "can-tho-user-003", code: "HP003", fullName: "Lê Hoàng Nam", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["campus-thoi-binh", "campus-an-lac"], status: "active" },

    { id: "can-tho-user-004", code: "HP004", fullName: "Phạm Quốc Huy", role: "vice_principal", schoolId: "can-tho-school-001", managedCampusIds: ["campus-tran-hung-dao", "campus-huynh-thuc-khang"], status: "active" },
];