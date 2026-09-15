import type {
    RegionMockData,
} from "./common/types";

export type {
    GisCampus,
    GisMockData,
    GisPosition,
    GisProvince,
    GisWard,
} from "./common/types";

import {
    canThoMockData,
} from "./canTho";


export const regionMockDataMap: Record<
    string,
    RegionMockData
> = {
    "can-tho": canThoMockData,
};


export const getRegionMockData = (
    regionId: string,
): RegionMockData | undefined => {
    return regionMockDataMap[regionId];
};


export {
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