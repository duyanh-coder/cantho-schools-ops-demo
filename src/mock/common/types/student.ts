export interface Guardian {
    id: string;

    studentId: string;

    relation: "father" | "mother" | "guardian";

    fullName: string;

    phone: string;

    isPrimary: boolean;
}

export interface Student {
    id: string;

    schoolId: string;

    campusId: string;

    classId: string;

    wardId: string;

    code: string;

    fullName: string;

    gender: "male" | "female";

    birthDate: string;

    ethnicGroup?: string;

    religion?: string;

    address: string;

    guardianIds: string[];

    policyGroupIds: string[];

    status: "studying" | "transferred" | "dropped" | "graduated" | "paused";

    enrolledDate: string;
}