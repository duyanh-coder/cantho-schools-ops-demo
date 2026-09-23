export type CampusHistoryEventType =
    | "created"
    | "updated"
    | "address_changed"
    | "gis_changed"
    | "status_changed"
    | "manager_changed";


export interface CampusHistoryEntry {
    id: string;

    campusId: string;

    type: CampusHistoryEventType;

    actor: string;

    content: string;

    createdAt: string;
}