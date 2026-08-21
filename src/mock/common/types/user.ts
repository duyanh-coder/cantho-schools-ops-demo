export type UserRole =
    | "principal"
    | "vice_principal"
    | "it_staff";

export interface User {
    id: string;

    code: string;

    fullName: string;

    role: UserRole;

    schoolId?: string;

    managedCampusIds?: string[];

    status: "active" | "inactive";
}