import {
    useMemo,
} from "react";

import {
    canThoPersonnelCompetitions,
} from "@/mock/canTho";

import type {
    PersonnelCompetition,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_COMPETITIONS_STORAGE_KEY = "can-tho-personnel-competitions";

export interface PersonnelCompetitionsApi extends CrudApi<PersonnelCompetition> {
    byPersonnel: PersonnelCompetition[];
}

export function usePersonnelCompetitions(
    personnelId?: string,
): PersonnelCompetitionsApi {
    const base = useCrud<PersonnelCompetition>(
        PERSONNEL_COMPETITIONS_STORAGE_KEY,
        canThoPersonnelCompetitions,
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

    const api = useMemo<PersonnelCompetitionsApi>(
        () => ({
            ...base,
            byPersonnel,
        }),
        [base, byPersonnel],
    );

    return api;
}