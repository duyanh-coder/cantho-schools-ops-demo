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
    { id: "can-tho-campus-001", schoolId: "can-tho-school-001", schoolName: "Trường THCS Chu Văn An", wardId: "can-tho-31135", code: "CT-CS-001", name: "Cơ sở chính", address: "Phường Ninh Kiều, TP. Cần Thơ", position: [10.0305, 105.7815], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-002", schoolId: "can-tho-school-001", schoolName: "Trường THCS Chu Văn An", wardId: "can-tho-31135", code: "CT-CS-002", name: "Cơ sở phụ", address: "Phường Ninh Kiều, TP. Cần Thơ", position: [10.0368, 105.7842], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-003", schoolId: "can-tho-school-002", schoolName: "Trường THCS Thới Bình", wardId: "can-tho-31135", code: "CT-CS-003", name: "Cơ sở chính", address: "Phường Ninh Kiều, TP. Cần Thơ", position: [10.028, 105.7746], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-004", schoolId: "can-tho-school-002", schoolName: "Trường THCS Thới Bình", wardId: "can-tho-31135", code: "CT-CS-004", name: "Cơ sở phụ", address: "Phường Ninh Kiều, TP. Cần Thơ", position: [10.0345, 105.7788], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-005", schoolId: "can-tho-school-003", schoolName: "Trường THCS Lương Thế Vinh", wardId: "can-tho-31147", code: "CT-CS-005", name: "Cơ sở chính", address: "Phường Tân An, TP. Cần Thơ", position: [10.0228, 105.762], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-006", schoolId: "can-tho-school-003", schoolName: "Trường THCS Lương Thế Vinh", wardId: "can-tho-31147", code: "CT-CS-006", name: "Cơ sở phụ", address: "Phường Tân An, TP. Cần Thơ", position: [10.0278, 105.7565], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-007", schoolId: "can-tho-school-004", schoolName: "Trường THPT Châu Văn Liêm", wardId: "can-tho-31168", code: "CT-CS-007", name: "Cơ sở chính", address: "Phường Bình Thuỷ, TP. Cần Thơ", position: [10.0742, 105.7518], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-008", schoolId: "can-tho-school-005", schoolName: "Trường THCS An Thới", wardId: "can-tho-31168", code: "CT-CS-008", name: "Cơ sở chính", address: "Phường Bình Thuỷ, TP. Cần Thơ", position: [10.069, 105.7468], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-009", schoolId: "can-tho-school-006", schoolName: "Trường THCS An Hoà 2", wardId: "can-tho-31120", code: "CT-CS-009", name: "Cơ sở chính", address: "Phường Cái Khế, TP. Cần Thơ", position: [10.0512, 105.7805], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-010", schoolId: "can-tho-school-007", schoolName: "Trường THCS Hưng Phú", wardId: "can-tho-31186", code: "CT-CS-010", name: "Cơ sở chính", address: "Phường Cái Răng, TP. Cần Thơ", position: [9.9905, 105.7585], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-011", schoolId: "can-tho-school-008", schoolName: "Trường THCS Trần Ngọc Quế", wardId: "can-tho-31201", code: "CT-CS-011", name: "Cơ sở chính", address: "Phường Hưng Phú, TP. Cần Thơ", position: [9.9912, 105.8008], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-012", schoolId: "can-tho-school-009", schoolName: "Trường THPT Lưu Hữu Phước", wardId: "can-tho-31153", code: "CT-CS-012", name: "Cơ sở chính", address: "Phường Ô Môn, TP. Cần Thơ", position: [10.1265, 105.6205], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-013", schoolId: "can-tho-school-010", schoolName: "Trường THCS Thốt Nốt", wardId: "can-tho-31207", code: "CT-CS-013", name: "Cơ sở chính", address: "Phường Thốt Nốt, TP. Cần Thơ", position: [10.2935, 105.5005], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-014", schoolId: "can-tho-school-011", schoolName: "Trường THCS Phong Điền", wardId: "can-tho-31299", code: "CT-CS-014", name: "Cơ sở chính", address: "Xã Phong Điền, TP. Cần Thơ", position: [10.0295, 105.665], isMainCampus: true, status: "active" },
];


export const canThoGis: GisMockData = {
    province,
    wards,
    campuses,
};