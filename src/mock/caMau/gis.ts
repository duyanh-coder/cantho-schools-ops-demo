import type {
    GisMockData,
} from "../common/types";


export const caMauGis: GisMockData = {
    wards: [
        {
            id: "ca-mau-ward-001",

            code: "CM-W001",

            name: "Phường An Xuyên",

            center: [
                9.1805,
                105.1505,
            ],

            polygon: [
                [
                    9.172,
                    105.142,
                ],
                [
                    9.190,
                    105.142,
                ],
                [
                    9.190,
                    105.159,
                ],
                [
                    9.172,
                    105.159,
                ],
            ],
        },

        {
            id: "ca-mau-ward-002",

            code: "CM-W002",

            name: "Phường Tân Xuyên",

            center: [
                9.167,
                105.157,
            ],

            polygon: [
                [
                    9.158,
                    105.148,
                ],
                [
                    9.176,
                    105.148,
                ],
                [
                    9.176,
                    105.166,
                ],
                [
                    9.158,
                    105.166,
                ],
            ],
        },

        {
            id: "ca-mau-ward-003",

            code: "CM-W003",

            name: "Phường Lý Văn Lâm",

            center: [
                9.151,
                105.163,
            ],

            polygon: [
                [
                    9.143,
                    105.154,
                ],
                [
                    9.160,
                    105.154,
                ],
                [
                    9.160,
                    105.173,
                ],
                [
                    9.143,
                    105.173,
                ],
            ],
        },

        {
            id: "ca-mau-ward-004",

            code: "CM-W004",

            name: "Phường Tắc Vân",

            center: [
                9.111,
                105.127,
            ],

            polygon: [
                [
                    9.102,
                    105.118,
                ],
                [
                    9.120,
                    105.118,
                ],
                [
                    9.120,
                    105.138,
                ],
                [
                    9.102,
                    105.138,
                ],
            ],
        },
    ],


    campuses: [
        {
            id: "ca-mau-campus-001",

            schoolId:
                "ca-mau-school-001",

            schoolName:
                "Trường THCS An Xuyên",

            wardId:
                "ca-mau-ward-001",

            code:
                "CM-CS-001",

            name:
                "Cơ sở chính",

            address:
                "Phường An Xuyên, tỉnh Cà Mau",

            position: [
                9.1805,
                105.1505,
            ],

            isMainCampus: true,

            status: "active",
        },

        {
            id: "ca-mau-campus-002",

            schoolId:
                "ca-mau-school-001",

            schoolName:
                "Trường THCS An Xuyên",

            wardId:
                "ca-mau-ward-001",

            code:
                "CM-CS-002",

            name:
                "Cơ sở 2",

            address:
                "Phường An Xuyên, tỉnh Cà Mau",

            position: [
                9.184,
                105.156,
            ],

            isMainCampus: false,

            status: "active",
        },

        {
            id: "ca-mau-campus-003",

            schoolId:
                "ca-mau-school-001",

            schoolName:
                "Trường THCS An Xuyên",

            wardId:
                "ca-mau-ward-001",

            code:
                "CM-CS-003",

            name:
                "Cơ sở 3",

            address:
                "Phường An Xuyên, tỉnh Cà Mau",

            position: [
                9.176,
                105.145,
            ],

            isMainCampus: false,

            status: "active",
        },

        {
            id: "ca-mau-campus-004",

            schoolId:
                "ca-mau-school-002",

            schoolName:
                "Trường Tiểu học Tân Xuyên",

            wardId:
                "ca-mau-ward-002",

            code:
                "CM-CS-004",

            name:
                "Cơ sở chính",

            address:
                "Phường Tân Xuyên, tỉnh Cà Mau",

            position: [
                9.167,
                105.157,
            ],

            isMainCampus: true,

            status: "active",
        },

        {
            id: "ca-mau-campus-005",

            schoolId:
                "ca-mau-school-002",

            schoolName:
                "Trường Tiểu học Tân Xuyên",

            wardId:
                "ca-mau-ward-002",

            code:
                "CM-CS-005",

            name:
                "Cơ sở 2",

            address:
                "Phường Tân Xuyên, tỉnh Cà Mau",

            position: [
                9.171,
                105.163,
            ],

            isMainCampus: false,

            status: "active",
        },

        {
            id: "ca-mau-campus-006",

            schoolId:
                "ca-mau-school-003",

            schoolName:
                "Trường THCS Lý Văn Lâm",

            wardId:
                "ca-mau-ward-003",

            code:
                "CM-CS-006",

            name:
                "Cơ sở chính",

            address:
                "Phường Lý Văn Lâm, tỉnh Cà Mau",

            position: [
                9.151,
                105.163,
            ],

            isMainCampus: true,

            status: "active",
        },

        {
            id: "ca-mau-campus-007",

            schoolId:
                "ca-mau-school-003",

            schoolName:
                "Trường THCS Lý Văn Lâm",

            wardId:
                "ca-mau-ward-003",

            code:
                "CM-CS-007",

            name:
                "Cơ sở 2",

            address:
                "Phường Lý Văn Lâm, tỉnh Cà Mau",

            position: [
                9.155,
                105.169,
            ],

            isMainCampus: false,

            status: "active",
        },
    ],
};