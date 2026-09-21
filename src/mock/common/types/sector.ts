export type SectorType =
    | "grade"
    | "subject_group";


export interface Sector {
    id: string;

    schoolId: string;

    type: SectorType;

    code: string;

    name: string;

    grade?: number;

    managerId?: string;

    memberIds?: string[];

    about?: string;

    status: "active" | "inactive";
}