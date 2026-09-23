import {
    useMemo,
} from "react";

import {
    canThoPersonnelWorkHistory,
} from "@/mock/canTho";

import type {
    PersonnelWorkHistory,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_WORK_HISTORY_STORAGE_KEY = "can-tho-personnel-work-history";

export interface PersonnelWorkHistoryApi extends CrudApi<PersonnelWorkHistory> {
    byPersonnel: PersonnelWorkHistory[];
}

export function usePersonnelWorkHistory(
    personnelId?: string,
): PersonnelWorkHistoryApi {
    const base = useCrud<PersonnelWorkHistory>(
        PERSONNEL_WORK_HISTORY_STORAGE_KEY,
        canThoPersonnelWorkHistory,
    );

    const byPersonnel =
        useMemo(() => {
            if (!personnelId) {
                return [];
            }

            return base.items
                .filter((item) => item.personnelId === personnelId)
                .sort((a, b) =>
                    b.startDate.localeCompare(a.startDate));
        }, [base.items, personnelId]);

    const api = useMemo<PersonnelWorkHistoryApi>(
        () => ({
            ...base,
            byPersonnel,
        }),
        [base, byPersonnel],
    );

    return api;
}