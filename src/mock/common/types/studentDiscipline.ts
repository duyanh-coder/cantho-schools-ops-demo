export interface StudentDiscipline {
    id: string;

    studentId: string;

    type: "reward" | "discipline";

    academicYear: string;

    title: string;

    level: "class" | "school";

    decisionNumber?: string;

    date: string;

    note?: string;
}