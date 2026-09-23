import type {
    GeoPoint,
} from "./ward";


export type CampusType =
    | "HEADQUARTERS"
    | "BRANCH";


export type CampusStatus =
    | "ACTIVE"
    | "SUSPENDED"
    | "INACTIVE";


export interface Campus {
    id: string;

    schoolId: string;

    wardId: string;

    code: string;

    name: string;

    historicalName?: string;

    type: CampusType;

    address: string;

    location: GeoPoint;

    latitude: number;

    longitude: number;

    phone?: string;

    email?: string;

    managerId?: string;

    isMainCampus: boolean;

    status: CampusStatus;
}