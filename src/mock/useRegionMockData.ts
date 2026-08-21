import {
    getCurrentRegionMockData,
} from "./getCurrentRegionMockData";

import type {
    RegionMockData,
} from "./common/types";


export const useRegionMockData = (): RegionMockData => {
    return getCurrentRegionMockData();
};