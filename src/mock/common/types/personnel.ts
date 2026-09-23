export interface Personnel {
    id: string;

    schoolId: string;

    code: string;

    fullName: string;

    gender: "male" | "female";

    dob: string;

    roleTitle: string;

    degree: string;

    subjectIds: string[];

    teamId?: string;

    campusIds: string[];

    phone: string;

    email: string;

    address?: string;

    wardId?: string;

    careerStartDate?: string;

    schoolStartDate?: string;

    isExcellentTeacher: boolean;

    achievements: string;

    status: "active" | "inactive";
}