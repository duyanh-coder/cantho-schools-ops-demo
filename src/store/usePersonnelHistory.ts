import {
    useMemo,
} from "react";

import {
    canThoPersonnelHistory,
} from "@/mock/canTho";

import type {
    PersonnelHistoryEntry,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_HISTORY_STORAGE_KEY = "can-tho-personnel-history";

export interface PersonnelHistoryApi extends CrudApi<PersonnelHistoryEntry> {
    byPersonnel: PersonnelHistoryEntry[];
}

export function usePersonnelHistory(
    personnelId?: string,
): PersonnelHistoryApi {
    const base = useCrud<PersonnelHistoryEntry>(
        PERSONNEL_HISTORY_STORAGE_KEY,
        canThoPersonnelHistory,
    );

    const byPersonnel =
        useMemo(() => {
            if (!personnelId) {
                return [];
            }

            return base.items
                .filter((entry) => entry.personnelId === personnelId)
                .sort((a, b) =>
                    b.createdAt.localeCompare(a.createdAt));
        }, [base.items, personnelId]);

    const api = useMemo<PersonnelHistoryApi>(
        () => ({
            ...base,
            byPersonnel,
        }),
        [base, byPersonnel],
    );

    return api;
}