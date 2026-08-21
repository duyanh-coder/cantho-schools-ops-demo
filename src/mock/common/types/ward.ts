export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface Ward {
    id: string;
    regionId: string;

    code: string;
    name: string;

    center: GeoPoint;

    polygon?: GeoPoint[];
}