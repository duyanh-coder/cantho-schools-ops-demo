import {
    REGION_CONFIG,
} from "../config";

import {
    getRegionMockData,
} from "./index";

import type {
    RegionMockData,
} from "./common/types";


export const getCurrentRegionMockData = (): RegionMockData => {
    const mockData = getRegionMockData(
        REGION_CONFIG.id,
    );

    if (!mockData) {
        throw new Error(
            `Không tìm thấy Mock Data cho vùng: ${REGION_CONFIG.id}`,
        );
    }

    return mockData;
};