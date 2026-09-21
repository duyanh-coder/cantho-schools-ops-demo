export interface SchoolClass {
    id: string;

    schoolId: string;
    campusId: string;

    code: string;
    name: string;

    grade: number;

    academicYear: string;

    homeroomTeacherId?: string;

    status: "active" | "inactive";
}