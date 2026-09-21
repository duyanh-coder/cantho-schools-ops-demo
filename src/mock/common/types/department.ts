export interface Department {
    id: string;

    schoolId: string;

    code: string;

    name: string;

    type: "subject" | "administration";

    subjectIds: string[];

    headTeacherId?: string;

    viceHeadTeacherId?: string;

    memberIds: string[];

    gradeScope?: number[];

    tasks?: string;

    status: "active" | "inactive";
}