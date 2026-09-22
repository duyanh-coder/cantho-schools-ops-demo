export type RoleKey =
    | "admin"
    | "hieutruong"
    | "vanthu";

export interface RoleInfo {
    key: RoleKey;

    label: string;
}

export const ROLE_OPTIONS: RoleInfo[] = [
    {
        key: "admin",
        label: "Quản trị viên",
    },
    {
        key: "hieutruong",
        label: "Hiệu trưởng",
    },
    {
        key: "vanthu",
        label: "Văn thư",
    },
];

const ROLE_ACCESS: Record<RoleKey, string[]> = {
    admin: [
        "/operations/documents",
        "/operations/timetable",
        "/operations/schools",
        "/operations/personnel",
        "/operations/sectors",
        "/operations/students",
        "/operations/boarding",
        "/operations/gis",
        "/operations/reports",
        "/operations/alerts",
        "/operations/chatbot",
    ],
    hieutruong: [
        "/operations/documents",
        "/operations/timetable",
        "/operations/schools",
        "/operations/personnel",
        "/operations/sectors",
        "/operations/students",
        "/operations/boarding",
        "/operations/gis",
        "/operations/reports",
        "/operations/chatbot",
    ],
    vanthu: [
        "/operations/documents",
        "/operations/timetable",
        "/operations/personnel",
        "/operations/sectors",
        "/operations/students",
        "/operations/boarding",
        "/operations/chatbot",
    ],
};

export const getRoleLabel = (
    role: RoleKey,
): string => {
    const info =
        ROLE_OPTIONS.find(
            (option) =>
                option.key === role,
        );

    return info?.label ?? role;
};

export const canAccess = (
    role: RoleKey,
    path: string,
): boolean => {
    return (
        ROLE_ACCESS[role]?.includes(
            path,
        ) ?? false
    );
};

export const getAccessiblePaths = (
    role: RoleKey,
): string[] => {
    return ROLE_ACCESS[role] ?? [];
};