export interface GisGeoProperties {
    code: string;

    name: string;

    fullName: string;

    areaKm2: number;

    population: number;

    center: [number, number];
}


export interface GisGeoFeature {
    id: string;

    type: string;

    properties: GisGeoProperties;

    geometry: {
        type: string;

        coordinates: number[][][][];
    };
}


export interface GisGeoFeatureCollection {
    type: string;

    features: GisGeoFeature[];
}