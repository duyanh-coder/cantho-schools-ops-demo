export interface Teacher {
    id: string;

    schoolId: string;

    campusIds: string[];

    code: string;
    fullName: string;

    gender?: "male" | "female";

    birthDate?: string;

    ethnicGroup?: string;

    qualification?: "college" | "university" | "master" | "doctor";

    teacherRank?: string;

    subjectIds: string[];

    departmentId?: string;

    appointmentDate?: string;

    hireDate?: string;

    status: "active" | "inactive";
}