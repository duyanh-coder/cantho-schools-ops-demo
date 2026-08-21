import type {
    RegionMockData,
} from "./common/types";

import {
    caMauMockData,
} from "./caMau";

import {
    canThoMockData,
} from "./canTho";


export const regionMockDataMap: Record<
    string,
    RegionMockData
> = {
    "ca-mau": caMauMockData,

    "can-tho": canThoMockData,
};


export const getRegionMockData = (
    regionId: string,
): RegionMockData | undefined => {
    return regionMockDataMap[regionId];
};


export {
    caMauMockData,
    canThoMockData,
};

export {
    getCurrentRegionMockData,
} from "./getCurrentRegionMockData";

export {
    useRegionMockData,
} from "./useRegionMockData";

export {
    getCurrentSchools,
    getCurrentCampuses,
    getCurrentWards,
    getCampusById,
    getSchoolById,
    getWardById,
    getCampusesBySchoolId,
    getCampusesByWardId,
    getSchoolByCampusId,
} from "./selectors";