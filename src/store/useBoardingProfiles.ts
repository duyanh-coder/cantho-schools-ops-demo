import {
    useMemo,
} from "react";

import {
    canThoBoardingProfiles,
} from "@/mock/canTho";

import type {
    BoardingProfile,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const BOARDING_PROFILES_STORAGE_KEY = "can-tho-boarding-profiles";

/** Seed 1: khóa cache cũ để hồ sơ nhu cầu khớp năm học của lớp. */
export const BOARDING_PROFILES_SEED_VERSION = 1;

export interface BoardingProfilesApi extends CrudApi<BoardingProfile> {
    byStudent: BoardingProfile[];
}

export function useBoardingProfiles(
    studentId?: string,
): BoardingProfilesApi {
    const base = useCrud<BoardingProfile>(
        BOARDING_PROFILES_STORAGE_KEY,
        canThoBoardingProfiles,
        BOARDING_PROFILES_SEED_VERSION,
    );

    const byStudent = useMemo(
        () => {
            if (!studentId) {
                return [];
            }

            return base.items
                .filter((profile) => profile.studentId === studentId)
                .sort((a, b) => b.academicYearId.localeCompare(a.academicYearId));
        },
        [base.items, studentId],
    );

    const api = useMemo<BoardingProfilesApi>(
        () => ({
            ...base,
            byStudent,
        }),
        [base, byStudent],
    );

    return api;
}