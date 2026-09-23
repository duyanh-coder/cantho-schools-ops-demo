import {
    useMemo,
} from "react";

import {
    canThoMockData,
} from "@/mock";

import type {
    Campus,
} from "@/mock/common/types";

import {
    useCrud,
} from "@/store/useCrud";

import type {
    CrudApi,
} from "@/store/useCrud";


export const CAMPUSES_STORAGE_KEY = "can-tho-campuses";

export const CAMPUS_LEGACY_ID_MAP: Record<string, string> = {
    "can-tho-campus-001": "campus-main",
    "can-tho-campus-002": "campus-chu-van-an",
    "can-tho-campus-003": "campus-thoi-binh",
    "can-tho-campus-004": "campus-an-lac",
    "can-tho-campus-005": "campus-tran-hung-dao",
    "can-tho-campus-006": "campus-huynh-thuc-khang",
};

const normalizeStatus = (
    status: unknown,
): Campus["status"] => {
    const normalized = String(status ?? "").toUpperCase();

    if (
        normalized === "ACTIVE" ||
        normalized === "SUSPENDED" ||
        normalized === "INACTIVE"
    ) {
        return normalized as Campus["status"];
    }

    if (normalized === "INACTIVE") {
        return "INACTIVE";
    }

    if (normalized === "SUSPENDED") {
        return "SUSPENDED";
    }

    return "ACTIVE";
};

const normalizeType = (
    campus: Campus,
): Campus["type"] => {
    const type = campus.type;

    if (type === "HEADQUARTERS" || type === "BRANCH") {
        return type;
    }

    return campus.isMainCampus ? "HEADQUARTERS" : "BRANCH";
};

const normalizeCampus = (input: Campus): Campus => {
    const id = CAMPUS_LEGACY_ID_MAP[input.id] ?? input.id;

    const location = input.location &&
        Number.isFinite(input.location?.lat) &&
        Number.isFinite(input.location?.lng)
        ? input.location
        : {
            lat: Number.isFinite(input.latitude)
                ? input.latitude
                : 10.0348,
            lng: Number.isFinite(input.longitude)
                ? input.longitude
                : 105.7702,
        };

    return {
        ...input,
        id,
        status: normalizeStatus(input.status),
        type: normalizeType(input),
        isMainCampus:
            typeof input.isMainCampus === "boolean"
                ? input.isMainCampus
                : normalizeType(input) === "HEADQUARTERS",
        location,
        latitude: Number.isFinite(input.latitude)
            ? input.latitude
            : location.lat,
        longitude: Number.isFinite(input.longitude)
            ? input.longitude
            : location.lng,
    };
};

export interface CampusesApi extends CrudApi<Campus> {
    bySchool: Campus[];

    byId: Map<string, Campus>;
}

export function useCampuses(
    schoolId?: string,
): CampusesApi {
    const base = useCrud<Campus>(
        CAMPUSES_STORAGE_KEY,
        canThoMockData.campuses,
    );

    const items = useMemo(
        () => base.items.map(normalizeCampus),
        [base.items],
    );

    const byId = useMemo(
        () => new Map<string, Campus>(
            items.map((campus) => [campus.id, campus]),
        ),
        [items],
    );

    const bySchool = useMemo(
        () => schoolId
            ? items.filter((campus) => campus.schoolId === schoolId)
            : items,
        [items, schoolId],
    );

    const api = useMemo<CampusesApi>(
        () => ({
            ...base,
            items,
            bySchool,
            byId,
        }),
        [base, items, bySchool, byId],
    );

    return api;
}