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

/** Seed 2: thêm 3 giáo viên cho trường ngoài Ninh Kiều và dịch chuỗi id sinh tự động. */
export const PERSONNEL_SEED_VERSION = 2;

export interface PersonnelApi extends CrudApi<Personnel> {
    byId: Map<string, Personnel>;
}

export function usePersonnel(): PersonnelApi {
    const base = useCrud<Personnel>(
        PERSONNEL_STORAGE_KEY,
        canThoMockData.personnel,
        PERSONNEL_SEED_VERSION,
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