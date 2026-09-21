export interface CareDemand {
    id: string;

    schoolId: string;

    campusId: string;

    academicYear: string;

    grade: number;

    twoSessionCount: number;

    boardingCount: number;

    breakfastCount: number;

    lunchCount: number;

    mealPlan: "school_cafeteria" | "outside";

    notes?: string;
}