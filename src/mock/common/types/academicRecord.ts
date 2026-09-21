export interface SubjectScore {
    subjectId: string;

    score15?: number;

    score45?: number;

    final?: number;

    semester: number;
}

export interface AcademicRecord {
    id: string;

    studentId: string;

    academicYear: string;

    semester: "1" | "2" | "full_year";

    subjectScores: SubjectScore[];

    conduct: "good" | "fair" | "pass" | "fail";

    learningGrade: "excellent" | "good" | "fair" | "pass" | "fail";

    honor?: "excellent_student" | "advanced_student" | "none";

    unexcusedAbsences: number;

    excusedAbsences: number;
}