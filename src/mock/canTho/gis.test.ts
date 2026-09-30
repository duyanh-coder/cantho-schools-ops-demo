import {
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoGis,
} from "@/mock/canTho";

import {
    canThoCampuses,
} from "@/mock/canTho";


const CAN_THO_WARD_CODE_MIN = 31120;

const CAN_THO_WARD_CODE_MAX = 31321;


describe("GIS ward polygons", () => {
    it("chỉ giữ đơn vị hành chính thuộc Cần Thơ", () => {
        expect(canThoGis.wards.length).toBe(33);

        canThoGis.wards.forEach((ward) => {
            const code = Number(ward.code);

            expect(code).toBeGreaterThanOrEqual(CAN_THO_WARD_CODE_MIN);

            expect(code).toBeLessThanOrEqual(CAN_THO_WARD_CODE_MAX);
        });
    });

    it("loại bỏ đơn vị của các tỉnh lân cận trong cùng file", () => {
        const codes = new Set(canThoGis.wards.map((ward) => ward.code));

        // Sóc Trăng và Vĩnh Long nằm ngoài dải mã của Cần Thơ.
        expect(codes.has("31415")).toBe(false);

        expect(codes.has("31570")).toBe(false);
    });

    it("mã đơn vị là duy nhất và đủ dữ liệu hình học", () => {
        const ids = new Set(canThoGis.wards.map((ward) => ward.id));

        expect(ids.size).toBe(canThoGis.wards.length);

        canThoGis.wards.forEach((ward) => {
            expect(ward.name.length).toBeGreaterThan(0);

            expect(ward.areaKm2).toBeGreaterThan(0);

            expect(ward.population).toBeGreaterThan(0);

            expect(ward.polygon.flat(2).length).toBeGreaterThanOrEqual(3);
        });
    });

    it("vẫn giữ đường viền tỉnh", () => {
        expect(canThoGis.province.name).toContain("Cần Thơ");

        expect(canThoGis.province.areaKm2).toBeGreaterThan(0);

        expect(canThoGis.province.polygons.flat(2).length).toBeGreaterThanOrEqual(3);
    });
});


describe("GIS campus markers", () => {
    it("mọi cơ sở có tọa độ hợp lệ để gắn marker", () => {
        canThoGis.campuses.forEach((campus) => {
            const entity = canThoCampuses.find((item) =>
                item.id === campus.id);

            expect(entity, `cơ sở ${campus.id} không có trong hồ sơ`).toBeDefined();

            expect(Number.isFinite(entity?.latitude)).toBe(true);

            expect(Number.isFinite(entity?.longitude)).toBe(true);

            expect(campus.position[0]).toBeCloseTo(entity?.latitude ?? 0, 5);

            expect(campus.position[1]).toBeCloseTo(entity?.longitude ?? 0, 5);
        });
    });

    it("wardId trên bản đồ trỏ tới một đơn vị hành chính có polygon", () => {
        const wardIds = new Set(canThoGis.wards.map((ward) => ward.id));

        canThoGis.campuses.forEach((campus) => {
            expect(
                wardIds.has(campus.wardId),
                `wardId ${campus.wardId} không có polygon`,
            ).toBe(true);
        });
    });
});