import {
    useMemo,
} from "react";

import {
    canThoSemesters,
} from "@/mock/canTho";

import type {
    Semester,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const SEMESTERS_STORAGE_KEY = "can-tho-semesters";

export interface SemestersApi extends CrudApi<Semester> {
    byAcademicYear: Semester[];
}

export function useSemesters(
    academicYearId?: string,
): SemestersApi {
    const base = useCrud<Semester>(
        SEMESTERS_STORAGE_KEY,
        canThoSemesters,
    );

    const byAcademicYear = useMemo(
        () => {
            if (!academicYearId) {
                return [];
            }

            return base.items
                .filter((semester) =>
                    semester.academicYearId === academicYearId)
                .sort((a, b) => a.code.localeCompare(b.code));
        },
        [base.items, academicYearId],
    );

    const api = useMemo<SemestersApi>(
        () => ({
            ...base,
            byAcademicYear,
        }),
        [base, byAcademicYear],
    );

    return api;
}