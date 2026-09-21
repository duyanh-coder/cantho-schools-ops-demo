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
    { id: "can-tho-campus-001", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-001", name: "Trụ sở chính – THCS Đoàn Thị Điểm", address: "Số 15 Nguyễn Đệ, Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", position: [10.0348, 105.7702], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-002", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-002", name: "Phân hiệu Chu Văn An", address: "Phường An Khánh, quận Ninh Kiều, TP. Cần Thơ", position: [10.039, 105.782], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-003", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-003", name: "Phân hiệu Thới Bình", address: "Phường Thới Bình, quận Ninh Kiều, TP. Cần Thơ", position: [10.0365, 105.776], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-004", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-004", name: "Phân hiệu An Lạc", address: "Phường An Lạc, quận Ninh Kiều, TP. Cần Thơ", position: [10.027, 105.78], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-005", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-005", name: "Phân hiệu Trần Hưng Đạo", address: "Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", position: [10.0415, 105.7715], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-006", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "CT-CS-006", name: "Phân hiệu Huỳnh Thúc Kháng", address: "Phường Hưng Lợi, quận Ninh Kiều, TP. Cần Thơ", position: [10.024, 105.7755], isMainCampus: false, status: "active" },
];


export const canThoGis: GisMockData = {
    province,
    wards,
    campuses,
};