import {
    useMemo,
} from "react";

import {
    canThoPersonnelAssignments,
} from "@/mock/canTho";

import type {
    PersonnelAssignment,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_ASSIGNMENTS_STORAGE_KEY = "can-tho-personnel-assignments";

export interface PersonnelAssignmentsApi extends CrudApi<PersonnelAssignment> {
    byPersonnel: PersonnelAssignment[];
}

export function usePersonnelAssignments(
    personnelId?: string,
): PersonnelAssignmentsApi {
    const base = useCrud<PersonnelAssignment>(
        PERSONNEL_ASSIGNMENTS_STORAGE_KEY,
        canThoPersonnelAssignments,
    );

    const byPersonnel =
        useMemo(() => {
            if (!personnelId) {
                return [];
            }

            return base.items
                .filter((item) => item.personnelId === personnelId)
                .sort(
                    (a, b) =>
                        b.academicYear.localeCompare(a.academicYear) ||
                        b.semester - a.semester,
                );
        }, [base.items, personnelId]);

    const api = useMemo<PersonnelAssignmentsApi>(
        () => ({
            ...base,
            byPersonnel,
        }),
        [base, byPersonnel],
    );

    return api;
}