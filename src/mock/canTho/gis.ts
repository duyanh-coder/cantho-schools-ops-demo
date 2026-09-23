import type {
    GisCampus,
    GisMockData,
    GisMultiPolygon,
    GisPosition,
    GisProvince,
    GisWard,
} from "../common/types";

import type {
    GisGeoFeatureCollection,
} from "./types";

import canThoProvinceFeatureCollection from "@/assets/data/gis/cantho_geo.json";

import canThoWardFeatureCollection from "@/assets/data/gis/cantho_phuongxa_geo.json";


const wardGeo = canThoWardFeatureCollection as unknown as GisGeoFeatureCollection;

const provinceGeo = canThoProvinceFeatureCollection as unknown as GisGeoFeatureCollection;


const toPosition = (
    point: [number, number],
): GisPosition => {
    return [point[1], point[0]];
};


const toMultiPolygon = (
    coordinates: number[][][][],
): GisMultiPolygon => {
    return coordinates.map(
        (polygon) => polygon.map(
            (ring) => ring.map(
                (point) => toPosition(point as [number, number]),
            ),
        ),
    );
};


const provinceFeature = provinceGeo.features[0];

const province: GisProvince = {
    id: "can-tho",
    code: provinceFeature.properties.code,
    name: provinceFeature.properties.name,
    areaKm2: provinceFeature.properties.areaKm2,
    polygons: toMultiPolygon(provinceFeature.geometry.coordinates),
};


const wards: GisWard[] = wardGeo.features.map((feature) => ({
    id: `can-tho-${feature.properties.code}`,
    code: feature.properties.code,
    name: feature.properties.fullName,
    areaKm2: feature.properties.areaKm2,
    population: feature.properties.population,
    center: feature.properties.center,
    polygon: toMultiPolygon(feature.geometry.coordinates),
}));


const campuses: GisCampus[] = [
    { id: "campus-main", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-MAIN", name: "Trụ sở chính – THCS Ninh Kiều", address: "Phường An Hòa, TP. Cần Thơ", position: [10.0348, 105.7702], isMainCampus: true, status: "active" },
    { id: "campus-chu-van-an", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-CVA", name: "Phân hiệu Chu Văn An", address: "Phường An Cư, TP. Cần Thơ", position: [10.033488405660892, 105.78446902819987], isMainCampus: false, status: "active" },
    { id: "campus-thoi-binh", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-TB", name: "Phân hiệu Thới Bình", address: "Phường Thới Bình, TP. Cần Thơ", position: [10.0365, 105.776], isMainCampus: false, status: "active" },
    { id: "campus-an-lac", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-AL", name: "Phân hiệu An Lạc", address: "Phường An Lạc, TP. Cần Thơ", position: [10.027, 105.78], isMainCampus: false, status: "active" },
    { id: "campus-tran-hung-dao", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-THD", name: "Phân hiệu Trần Hưng Đạo", address: "Phường An Hòa, TP. Cần Thơ", position: [10.0415, 105.7715], isMainCampus: false, status: "active" },
    { id: "campus-huynh-thuc-khang", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-HTK", name: "Phân hiệu Huỳnh Thúc Kháng", address: "Phường Hưng Lợi, TP. Cần Thơ", position: [10.024, 105.7755], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-007", schoolId: "can-tho-school-002", schoolName: "Trường THCS Cái Răng", wardId: "can-tho-31186", code: "CT-CS-007", name: "Trụ sở chính – THCS Cái Răng", address: "Phường Cái Răng, TP. Cần Thơ", position: [10.0005, 105.792], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-008", schoolId: "can-tho-school-002", schoolName: "Trường THCS Cái Răng", wardId: "can-tho-31201", code: "CT-CS-008", name: "Phân hiệu Hưng Phú", address: "Phường Hưng Phú, TP. Cần Thơ", position: [9.991, 105.79], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-009", schoolId: "can-tho-school-003", schoolName: "Trường THCS Bình Thủy", wardId: "can-tho-31168", code: "CT-CS-009", name: "Trụ sở chính – THCS Bình Thủy", address: "Phường Bình Thuỷ, TP. Cần Thơ", position: [10.0725, 105.7565], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-010", schoolId: "can-tho-school-004", schoolName: "Trường THPT Cái Khế", wardId: "can-tho-31120", code: "CT-CS-010", name: "Trụ sở chính – THPT Cái Khế", address: "Phường Cái Khế, TP. Cần Thơ", position: [10.0502, 105.781], isMainCampus: true, status: "active" },
];


export const canThoGis: GisMockData = {
    province,
    wards,
    campuses,
};