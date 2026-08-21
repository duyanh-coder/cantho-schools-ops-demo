export interface DocumentItem {
    id: string;

    campusId?: string;

    code: string;

    title: string;

    type: "incoming" | "outgoing" | "internal";

    issuedDate: string;

    status: "new" | "processing" | "completed";
}