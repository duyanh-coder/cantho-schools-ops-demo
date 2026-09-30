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

/**
 * Chuẩn hoá toạ độ về `[lat, lng]`.
 *
 * GeoJSON lưu `[lng, lat]` còn Leaflet dùng `[lat, lng]`.
 */
const toPosition = (
    point: number[],
): GisPosition => {
    return [point[1], point[0]];
};


/**
 * Chuẩn hoá đa giác nhiều vòng về đúng cấu trúc
 * `polygon -> ring -> point` và bỏ ring không kín.
 *
 * `cantho_phuongxa_geo.json` có một đơn vị (xã Cờ Đỏ) bị lồng thừa một
 * cấp so với phần còn lại: `MultiPolygon` chuẩn là depth 4
 * (`[polygon][ring][point]`), còn đơn vị này là depth 5. Không chuẩn hoá
 * thì Leaflet vẽ ra đường nét đứt đoạn vì mỗi "vòng" chỉ còn một điểm.
 *
 * Ring dưới 4 điểm không tạo thành vùng kín nên bị loại.
 */
const MIN_RING_POINTS = 4;

const toMultiPolygon = (
    coordinates: number[][][][] | number[][][][][],
): GisMultiPolygon => {
    const polygons = ringDepthOf(coordinates) > 4
        ? (coordinates as number[][][][][]).map((group) => group[0])
        : coordinates as number[][][][];

    return polygons
        .map(
            (polygon) => polygon
                .filter(
                    (ring) => ring.length >= MIN_RING_POINTS,
                )
                .map(
                    (ring) => ring.map(toPosition),
                ),
        )
        .filter(
            (polygon) => polygon.length > 0,
        );
};


/**
 * Độ sâu mảng lồng nhau của cấu trúc toạ độ.
 *
 * `MultiPolygon` chuẩn có depth 4: `[polygon][ring][point]` và mỗi điểm là
 * mảng hai số nên `point[0]` là số, không còn mảng nào sâu hơn.
 */
const ringDepthOf = (
    coordinates: unknown,
): number => {
    let depth = 0;

    let current = coordinates;

    while (Array.isArray(current)) {
        depth += 1;

        current = current[0];
    }

    return depth;
};


const provinceFeature = provinceGeo.features[0];

const province: GisProvince = {
    id: "can-tho",
    code: provinceFeature.properties.code,
    name: provinceFeature.properties.name,
    areaKm2: provinceFeature.properties.areaKm2,
    polygons: toMultiPolygon(provinceFeature.geometry.coordinates),
};


/**
 * `cantho_phuongxa_geo.json` gộp đơn vị hành chính cấp xã của cả vùng
 * đồng bằng Cần Thơ: Cần Thơ, Sóc Trăng, Vĩnh Long, Bến Tre, Kiên
 * Giang, Tiền Giang, Hậu Giang, Long An, Trà Vinh và Bạc Liêu.
 *
 * Bản đồ trong ứng dụng chỉ phủ Cần Thơ nên chỉ giữ đơn vị thuộc thành
 * phố: mã từ 31120 đến 31321, tức 33 đơn vị hành chính cấp xã theo mô
 * hình trước tháng 7/2025. Không lọc thì bản đồ vẽ thêm 70 đơn vị của
 * các tỉnh khác nằm ngoài vùng nghiệp vụ.
 */
const CAN_THO_WARD_CODE_MIN = 31120;

const CAN_THO_WARD_CODE_MAX = 31321;

const isCanThoWard = (
    code: string,
): boolean => {
    const value = Number(code);

    return Number.isFinite(value)
        && value >= CAN_THO_WARD_CODE_MIN
        && value <= CAN_THO_WARD_CODE_MAX;
};

const wards: GisWard[] = wardGeo.features
    .filter((feature) => isCanThoWard(feature.properties.code))
    .map((feature) => ({
        id: `can-tho-${feature.properties.code}`,
        code: feature.properties.code,
        name: feature.properties.fullName,
        areaKm2: feature.properties.areaKm2,
        population: feature.properties.population,
        center: feature.properties.center,
        polygon: toMultiPolygon(feature.geometry.coordinates),
    }));


const campuses: GisCampus[] = [
    { id: "campus-main", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-MAIN", name: "Trường THCS Ninh Kiều", address: "56 Ngô Quyền, phường Ninh Kiều, TP Cần Thơ", position: [10.03580839481783, 105.78470548758524], isMainCampus: true, status: "active" },
    { id: "campus-an-lac", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-AL", name: "Phân hiệu An Lạc", address: "96 Trần Văn Khéo, phường An Lạc, quận Ninh Kiều, TP. Cần Thơ", position: [10.027, 105.78], isMainCampus: false, status: "active" },
    { id: "campus-tran-hung-dao", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-THD", name: "Phân hiệu Trần Hưng Đạo", address: "40 Trần Hoàng Na, phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", position: [10.03484793343452, 105.77695885963567], isMainCampus: false, status: "active" },
    { id: "campus-huynh-thuc-khang", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-HTK", name: "Phân hiệu Huỳnh Thúc Kháng", address: "228 Nguyễn Văn Linh, phường Hưng Lợi, quận Ninh Kiều, TP. Cần Thơ", position: [10.024, 105.7755], isMainCampus: false, status: "active" },
    { id: "campus-thoi-binh", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-TB", name: "Phân hiệu Thới Bình", address: "Nguyễn Trãi, phường Thới Bình, quận Ninh Kiều, TP. Cần Thơ", position: [10.0365, 105.776], isMainCampus: false, status: "active" },
    { id: "campus-chu-van-an", schoolId: "can-tho-school-001", schoolName: "Trường THCS Ninh Kiều", wardId: "can-tho-31135", code: "NK-CVA", name: "Phân hiệu Chu Văn An", address: "9 Đại lộ Hòa Bình, phường An Cư, quận Ninh Kiều, TP. Cần Thơ", position: [10.0382, 105.7865], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-007", schoolId: "can-tho-school-002", schoolName: "Trường THCS Cái Răng", wardId: "can-tho-31186", code: "CT-CS-007", name: "Trường THCS Cái Răng", address: "Phường Cái Răng, TP. Cần Thơ", position: [10.0005, 105.792], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-008", schoolId: "can-tho-school-002", schoolName: "Trường THCS Cái Răng", wardId: "can-tho-31201", code: "CT-CS-008", name: "Phân hiệu Hưng Phú", address: "Phường Hưng Phú, TP. Cần Thơ", position: [9.991, 105.79], isMainCampus: false, status: "active" },
    { id: "can-tho-campus-009", schoolId: "can-tho-school-003", schoolName: "Trường THCS Bình Thủy", wardId: "can-tho-31168", code: "CT-CS-009", name: "Trường THCS Bình Thủy", address: "Phường Bình Thuỷ, TP. Cần Thơ", position: [10.0725, 105.7565], isMainCampus: true, status: "active" },
    { id: "can-tho-campus-010", schoolId: "can-tho-school-004", schoolName: "Trường THPT Cái Khế", wardId: "can-tho-31120", code: "CT-CS-010", name: "Trường THPT Cái Khế", address: "Phường Cái Khế, TP. Cần Thơ", position: [10.0502, 105.781], isMainCampus: true, status: "active" },
];


export const canThoGis: GisMockData = {
    province,
    wards,
    campuses,
};