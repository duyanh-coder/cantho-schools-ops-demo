import type {
    WardStats,
} from "./wardStats";


export type GisPosition = [
    number,
    number,
];


export type GisRing = GisPosition[];


export type GisMultiPolygon = GisRing[][];


export interface GisWard {
    id: string;

    code: string;

    name: string;

    areaKm2: number;

    population: number;

    center: GisPosition;

    polygon: GisMultiPolygon;
}


export interface GisProvince {
    id: string;

    code: string;

    name: string;

    areaKm2: number;

    polygons: GisMultiPolygon;
}


export interface GisCampus {
    id: string;

    schoolId: string;

    schoolName: string;

    wardId: string;

    code: string;

    name: string;

    address: string;

    position: GisPosition;

    isMainCampus: boolean;

    status: "active" | "inactive";
}


export interface GisMockData {
    province: GisProvince;

    wards: GisWard[];

    campuses: GisCampus[];

    wardStats: WardStats[];
}