export interface Teacher {
    id: string;

    schoolId: string;

    campusIds: string[];

    code: string;
    fullName: string;

    subjectIds: string[];

    status: "active" | "inactive";
}