export interface Student {
    id: string;

    schoolId: string;

    campusId: string;

    classId?: string;

    code: string;

    fullName: string;

    gender: "male" | "female";

    dob: string;

    address: string;

    guardianPhone: string;

    status: "studying" | "pending" | "suspended";
}

export interface Transcript {
    id: string;

    studentId: string;

    subjectId: string;

    semester: 1 | 2;

    academicYear: string;

    score: number;

    conduct: string;
}

export type EnrolmentChangeType =
    | "increase"
    | "decrease";

export interface EnrolmentChange {
    id: string;

    schoolId: string;

    campusId: string;

    classId?: string;

    changeType: EnrolmentChangeType;

    studentName: string;

    effectiveDate: string;

    reason: string;

    status: "completed" | "pending";
}