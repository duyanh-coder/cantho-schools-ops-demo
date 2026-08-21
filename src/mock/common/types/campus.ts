import type {
    GeoPoint,
} from "./ward";


export interface Campus {
    id: string;

    schoolId: string;

    wardId: string;

    code: string;

    name: string;

    address: string;

    location: GeoPoint;

    managerId?: string;

    isMainCampus: boolean;

    status: "active" | "inactive";
}