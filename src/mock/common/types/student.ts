export type StudentStatus =
    | "studying"
    | "pending"
    | "suspended"
    | "transferred"
    | "dropped_out"
    | "graduated";

export interface Student {
    id: string;

    schoolId: string;

    campusId: string;

    classId?: string;

    academicYear?: string;

    grade?: number;

    code: string;

    fullName: string;

    gender: "male" | "female";

    dob: string;

    birthPlace?: string;

    ethnicity?: string;

    address: string;

    wardId?: string;

    guardianName?: string;

    guardianPhone: string;

    email?: string;

    status: StudentStatus;
}

export interface Transcript {
    id: string;

    studentId: string;

    subjectId: string;

    semester: 1 | 2;

    semesterId?: string;

    academicYear: string;

    score: number;

    conduct: string;

    teacherId?: string;

    comment?: string;

    result?: string;
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

export type StudentMovementType =
    | "admitted"
    | "class_transfer"
    | "campus_transfer"
    | "school_transfer"
    | "drop_out"
    | "withdraw"
    | "graduate";

export interface StudentMovement {
    id: string;

    studentId: string;

    academicYearId: string;

    type: StudentMovementType;

    fromCampusId?: string;

    toCampusId?: string;

    fromClassId?: string;

    toClassId?: string;

    fromSchoolName?: string;

    toSchoolName?: string;

    effectiveDate: string;

    reason: string;

    decisionNo?: string;

    status: "completed" | "pending";

    createdAt: string;
}

export type StudentAchievementCategory =
    | "competition"
    | "movement"
    | "other";

export type StudentAchievementLevel =
    | "school"
    | "district"
    | "city"
    | "province"
    | "national";

export interface StudentAchievement {
    id: string;

    studentId: string;

    academicYearId: string;

    title: string;

    category: StudentAchievementCategory;

    result: string;

    level: StudentAchievementLevel;

    achievedDate: string;

    evidence?: string;
}

export interface BoardingProfile {
    id: string;

    studentId: string;

    academicYearId: string;

    twoSession: boolean;

    boarding: boolean;

    mealRequired: boolean;

    startDate: string;

    endDate?: string;

    status: "active" | "inactive";
}

export type StudentHistoryEventType =
    | "created"
    | "updated"
    | "profile_changed"
    | "status_changed"
    | "class_changed"
    | "campus_changed"
    | "admitted"
    | "transferred"
    | "graduated";

export interface StudentHistoryEntry {
    id: string;

    studentId: string;

    type: StudentHistoryEventType;

    actor: string;

    content: string;

    createdAt: string;
}