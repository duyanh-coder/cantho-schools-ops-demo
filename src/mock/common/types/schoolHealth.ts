export interface SchoolHealthItem {
    id: string;

    campusId: string;

    type: "health_check" | "food_safety_inspection" | "insurance" | "first_aid";

    date: string;

    summary: string;

    studentsExamined?: number;

    issues?: string;

    status: "done" | "pending";
}