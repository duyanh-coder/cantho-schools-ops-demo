import {
    useMemo,
} from "react";

import {
    canThoStudentAchievements,
} from "@/mock/canTho";

import type {
    StudentAchievement,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const STUDENT_ACHIEVEMENTS_STORAGE_KEY = "can-tho-student-achievements";

export interface StudentAchievementsApi extends CrudApi<StudentAchievement> {
    byStudent: StudentAchievement[];
}

export function useStudentAchievements(
    studentId?: string,
): StudentAchievementsApi {
    const base = useCrud<StudentAchievement>(
        STUDENT_ACHIEVEMENTS_STORAGE_KEY,
        canThoStudentAchievements,
    );

    const byStudent = useMemo(
        () => {
            if (!studentId) {
                return [];
            }

            return base.items
                .filter((record) => record.studentId === studentId)
                .sort((a, b) => b.achievedDate.localeCompare(a.achievedDate));
        },
        [base.items, studentId],
    );

    const api = useMemo<StudentAchievementsApi>(
        () => ({
            ...base,
            byStudent,
        }),
        [base, byStudent],
    );

    return api;
}