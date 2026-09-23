import {
    useMemo,
} from "react";

import {
    canThoStudentHistory,
} from "@/mock/canTho";

import type {
    StudentHistoryEntry,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const STUDENT_HISTORY_STORAGE_KEY = "can-tho-student-history";

export interface StudentHistoryApi extends CrudApi<StudentHistoryEntry> {
    byStudent: StudentHistoryEntry[];
}

export function useStudentHistory(
    studentId?: string,
): StudentHistoryApi {
    const base = useCrud<StudentHistoryEntry>(
        STUDENT_HISTORY_STORAGE_KEY,
        canThoStudentHistory,
    );

    const byStudent = useMemo(
        () => {
            if (!studentId) {
                return [];
            }

            return base.items
                .filter((entry) => entry.studentId === studentId)
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        },
        [base.items, studentId],
    );

    const api = useMemo<StudentHistoryApi>(
        () => ({
            ...base,
            byStudent,
        }),
        [base, byStudent],
    );

    return api;
}