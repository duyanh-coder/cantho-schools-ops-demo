import {
    useMemo,
} from "react";

import {
    canThoPersonnelRewards,
} from "@/mock/canTho";

import type {
    PersonnelReward,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_REWARDS_STORAGE_KEY = "can-tho-personnel-rewards";

export interface PersonnelRewardsApi extends CrudApi<PersonnelReward> {
    byPersonnel: PersonnelReward[];
}

export function usePersonnelRewards(
    personnelId?: string,
): PersonnelRewardsApi {
    const base = useCrud<PersonnelReward>(
        PERSONNEL_REWARDS_STORAGE_KEY,
        canThoPersonnelRewards,
    );

    const byPersonnel =
        useMemo(() => {
            if (!personnelId) {
                return [];
            }

            return base.items
                .filter((item) => item.personnelId === personnelId)
                .sort((a, b) =>
                    b.academicYear.localeCompare(a.academicYear));
        }, [base.items, personnelId]);

    const api = useMemo<PersonnelRewardsApi>(
        () => ({
            ...base,
            byPersonnel,
        }),
        [base, byPersonnel],
    );

    return api;
}