export interface SchoolClass {
    id: string;

    schoolId: string;
    campusId: string;

    code: string;
    name: string;

    grade: number;

    academicYear: string;

    status: "active" | "inactive";
}