import {
    useMemo,
} from "react";

import {
    canThoAcademicYears,
} from "@/mock/canTho";

import type {
    AcademicYear,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const ACADEMIC_YEARS_STORAGE_KEY = "can-tho-academic-years";

export interface AcademicYearsApi extends CrudApi<AcademicYear> {
    byId: Map<string, AcademicYear>;

    activeYear: AcademicYear | undefined;
}

export function useAcademicYears(
    schoolId?: string,
): AcademicYearsApi {
    const base = useCrud<AcademicYear>(
        ACADEMIC_YEARS_STORAGE_KEY,
        canThoAcademicYears,
    );

    const items = useMemo(
        () => schoolId
            ? base.items.filter((year) => year.schoolId === schoolId)
            : base.items,
        [base.items, schoolId],
    );

    const byId = useMemo(
        () => new Map<string, AcademicYear>(
            items.map((year) => [year.id, year]),
        ),
        [items],
    );

    const activeYear = useMemo(
        () => items.find((year) => year.status === "ACTIVE"),
        [items],
    );

    const api = useMemo<AcademicYearsApi>(
        () => ({
            ...base,
            items,
            byId,
            activeYear,
        }),
        [base, items, byId, activeYear],
    );

    return api;
}