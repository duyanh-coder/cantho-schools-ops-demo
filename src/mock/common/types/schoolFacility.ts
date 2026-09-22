export type SchoolFacilityCategory =
    | "classroom"
    | "function_room"
    | "library"
    | "playground"
    | "equipment"
    | "kitchen";


export interface SchoolFacility {
    id: string;

    schoolId: string;

    campusId: string;

    category: SchoolFacilityCategory;

    name: string;

    quantity: number;

    unit: string;

    condition: "good" | "normal" | "repair";

    note?: string;
}