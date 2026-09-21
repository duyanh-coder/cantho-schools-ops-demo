export interface FinanceItem {
    id: string;

    schoolId: string;

    campusId?: string;

    academicYear: string;

    category: "tuition" | "voluntary_fee" | "meal_fee" | "insurance" | "other";

    itemName: string;

    amountPerStudent?: number;

    totalAmount?: number;

    basis?: string;

    decisionNumber?: string;

    publicDate?: string;

    note?: string;
}