export interface AlertItem {
    id: string;

    campusId?: string;

    title: string;

    description: string;

    level: "info" | "warning" | "danger";

    createdAt: string;

    status: "new" | "processing" | "resolved";
}