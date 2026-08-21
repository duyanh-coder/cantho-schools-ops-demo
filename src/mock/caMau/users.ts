import type {
    User,
} from "../common/types";


export const caMauUsers: User[] = [
    {
        id: "ca-mau-user-001",

        code: "HT001",

        fullName: "Nguyễn Văn Minh",

        role: "principal",

        schoolId: "ca-mau-school-001",

        managedCampusIds: [
            "ca-mau-campus-001",
            "ca-mau-campus-002",
            "ca-mau-campus-003",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-002",

        code: "HP001",

        fullName: "Trần Thị Lan",

        role: "vice_principal",

        schoolId: "ca-mau-school-001",

        managedCampusIds: [
            "ca-mau-campus-002",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-003",

        code: "HP002",

        fullName: "Lê Hoàng Nam",

        role: "vice_principal",

        schoolId: "ca-mau-school-001",

        managedCampusIds: [
            "ca-mau-campus-003",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-004",

        code: "HT002",

        fullName: "Phạm Quốc Huy",

        role: "principal",

        schoolId: "ca-mau-school-002",

        managedCampusIds: [
            "ca-mau-campus-004",
            "ca-mau-campus-005",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-005",

        code: "HP003",

        fullName: "Ngô Thị Mai",

        role: "vice_principal",

        schoolId: "ca-mau-school-002",

        managedCampusIds: [
            "ca-mau-campus-005",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-006",

        code: "IT001",

        fullName: "Võ Thanh Bình",

        role: "it_staff",

        schoolId: "ca-mau-school-001",

        managedCampusIds: [
            "ca-mau-campus-001",
            "ca-mau-campus-002",
            "ca-mau-campus-003",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-007",

        code: "HT003",

        fullName: "Đặng Văn Phúc",

        role: "principal",

        schoolId: "ca-mau-school-003",

        managedCampusIds: [
            "ca-mau-campus-006",
            "ca-mau-campus-007",
        ],

        status: "active",
    },

    {
        id: "ca-mau-user-008",

        code: "HP004",

        fullName: "Bùi Thị Hương",

        role: "vice_principal",

        schoolId: "ca-mau-school-003",

        managedCampusIds: [
            "ca-mau-campus-007",
        ],

        status: "active",
    },
];