export interface Facility {
    id: string;

    campusId: string;

    type: "classroom" | "function_room" | "equipment" | "sport_field" | "canteen" | "other";

    code?: string;

    name: string;

    quantity: number;

    unit: string;

    condition: "good" | "degraded" | "under_repair";

    note?: string;
}