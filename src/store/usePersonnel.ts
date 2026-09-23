import {
    useMemo,
} from "react";

import {
    canThoMockData,
} from "@/mock";

import type {
    Personnel,
} from "@/mock/common/types";

import {
    useCrud,
} from "@/store/useCrud";

import type {
    CrudApi,
} from "@/store/useCrud";


export const PERSONNEL_STORAGE_KEY = "can-tho-personnel";

export interface PersonnelApi extends CrudApi<Personnel> {
    byId: Map<string, Personnel>;
}

export function usePersonnel(): PersonnelApi {
    const base = useCrud<Personnel>(
        PERSONNEL_STORAGE_KEY,
        canThoMockData.personnel,
    );

    const byId = useMemo(
        () => new Map<string, Personnel>(
            base.items.map((item) => [item.id, item]),
        ),
        [base.items],
    );

    const api = useMemo<PersonnelApi>(
        () => ({
            ...base,
            byId,
        }),
        [base, byId],
    );

    return api;
}