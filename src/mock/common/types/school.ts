export type EducationLevel =
    | "THCS"
    | "THPT"
    | "THCS_THPT";


export interface School {
    id: string;

    regionId: string;

    wardId: string;

    code: string;

    name: string;

    educationLevel: EducationLevel;

    principalId?: string;

    status: "active" | "inactive";
}