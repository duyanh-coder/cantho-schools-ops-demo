export interface EnrollmentChange {
    id: string;

    schoolId: string;

    campusId: string;

    classId?: string;

    studentId?: string;

    type: "new_enrollment" | "transfer_in" | "transfer_out" | "dropout" | "class_change" | "suspend";

    date: string;

    reason?: string;

    note?: string;

    createdAt: string;
}