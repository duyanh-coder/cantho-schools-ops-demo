export type GisPosition = [
    number,
    number,
];


export interface GisWard {
    id: string;

    code: string;

    name: string;

    center: GisPosition;

    polygon: GisPosition[];
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
    wards: GisWard[];

    campuses: GisCampus[];
}