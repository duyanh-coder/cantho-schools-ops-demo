import {
    useMemo,
} from "react";

import {
    canThoStudentMovements,
} from "@/mock/canTho";

import type {
    StudentMovement,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const STUDENT_MOVEMENTS_STORAGE_KEY = "can-tho-student-movements";

export interface StudentMovementsApi extends CrudApi<StudentMovement> {
    byStudent: StudentMovement[];
}

export function useStudentMovements(
    studentId?: string,
): StudentMovementsApi {
    const base = useCrud<StudentMovement>(
        STUDENT_MOVEMENTS_STORAGE_KEY,
        canThoStudentMovements,
    );

    const byStudent = useMemo(
        () => {
            if (!studentId) {
                return [];
            }

            return base.items
                .filter((movement) => movement.studentId === studentId)
                .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
        },
        [base.items, studentId],
    );

    const api = useMemo<StudentMovementsApi>(
        () => ({
            ...base,
            byStudent,
        }),
        [base, byStudent],
    );

    return api;
}