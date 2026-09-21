import {
    SCHOOL_FOCUS,
    WARD_FOCUS,
} from "@/config";

import type {
    Campus,
    School,
    Ward,
} from "./common/types";

import {
    getCurrentRegionMockData,
} from "./getCurrentRegionMockData";


const getFocusSchoolId = (): string => {
    return SCHOOL_FOCUS.id;
};


const getFocusWardId = (): string => {
    return WARD_FOCUS.id;
};


export const getCurrentSchools = (): School[] => {
    return getCurrentRegionMockData().schools;
};


export const getCurrentCampuses = (): Campus[] => {
    return getCurrentRegionMockData().campuses;
};


export const getCurrentWards = (): Ward[] => {
    return getCurrentRegionMockData().wards;
};


export const getCampusById = (
    campusId: string,
): Campus | undefined => {
    return getCurrentCampuses().find(
        (campus) => campus.id === campusId,
    );
};


export const getSchoolById = (
    schoolId: string,
): School | undefined => {
    return getCurrentSchools().find(
        (school) => school.id === schoolId,
    );
};


export const getWardById = (
    wardId: string,
): Ward | undefined => {
    return getCurrentWards().find(
        (ward) => ward.id === wardId,
    );
};


export const getCampusesBySchoolId = (
    schoolId: string,
): Campus[] => {
    return getCurrentCampuses().filter(
        (campus) => campus.schoolId === schoolId,
    );
};


export const getCampusesByWardId = (
    wardId: string,
): Campus[] => {
    return getCurrentCampuses().filter(
        (campus) => campus.wardId === wardId,
    );
};


export const getSchoolByCampusId = (
    campusId: string,
): School | undefined => {
    const campus = getCampusById(campusId);

    if (!campus) {
        return undefined;
    }

    return getSchoolById(
        campus.schoolId,
    );
};


export const getFocusSchool = (): School | undefined => {
    return getSchoolById(
        getFocusSchoolId(),
    );
};


export const getFocusCampuses = (): Campus[] => {
    return getCampusesBySchoolId(
        getFocusSchoolId(),
    );
};


export const getFocusWard = (): Ward | undefined => {
    return getWardById(
        getFocusWardId(),
    );
};