import {
    useMemo,
} from "react";

import {
    canThoTranscripts,
} from "@/mock/canTho";

import type {
    Transcript,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const TRANSCRIPTS_STORAGE_KEY = "can-tho-transcripts";

export interface TranscriptsApi extends CrudApi<Transcript> {
    byStudent: Transcript[];
}

export function useTranscripts(
    studentId?: string,
): TranscriptsApi {
    const base = useCrud<Transcript>(
        TRANSCRIPTS_STORAGE_KEY,
        canThoTranscripts,
    );

    const byStudent = useMemo(
        () => {
            if (!studentId) {
                return [];
            }

            return base.items
                .filter((record) => record.studentId === studentId)
                .sort(
                    (a, b) =>
                        b.academicYear.localeCompare(a.academicYear) ||
                        b.semester - a.semester,
                );
        },
        [base.items, studentId],
    );

    const api = useMemo<TranscriptsApi>(
        () => ({
            ...base,
            byStudent,
        }),
        [base, byStudent],
    );

    return api;
}