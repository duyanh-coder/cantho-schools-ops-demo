import {
    useMemo,
} from "react";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";

import {
    canThoCampusHistory,
} from "@/mock/canTho";

import type {
    CampusHistoryEntry,
} from "@/mock/common/types";


export const CAMPUS_HISTORY_STORAGE_KEY = "can-tho-campus-history";

export interface CampusHistoryApi extends CrudApi<CampusHistoryEntry> {
    byCampus: CampusHistoryEntry[];
}

export function useCampusHistory(
    campusId?: string,
): CampusHistoryApi {
    const base = useCrud<CampusHistoryEntry>(
        CAMPUS_HISTORY_STORAGE_KEY,
        canThoCampusHistory,
    );

    const byCampus =
        useMemo(() => {
            if (!campusId) {
                return [];
            }

            return base.items
                .filter((entry) => entry.campusId === campusId);
        }, [base.items, campusId]);

    const api = useMemo<
        CampusHistoryApi
    >(
        () => ({
            ...base,
            byCampus,
        }),
        [base, byCampus],
    );

    return api;
}