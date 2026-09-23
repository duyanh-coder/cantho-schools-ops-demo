import {
    useMemo,
} from "react";

import {
    canThoClassHistory,
} from "@/mock/canTho";

import type {
    ClassHistoryEntry,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const CLASS_HISTORY_STORAGE_KEY = "can-tho-class-history";

export interface ClassHistoryApi extends CrudApi<ClassHistoryEntry> {
    byClass: ClassHistoryEntry[];
}

export function useClassHistory(
    classId?: string,
): ClassHistoryApi {
    const base = useCrud<ClassHistoryEntry>(
        CLASS_HISTORY_STORAGE_KEY,
        canThoClassHistory,
    );

    const byClass = useMemo(() => {
        if (!classId) {
            return [];
        }

        return base.items
            .filter((entry) => entry.classId === classId)
            .sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt));
    }, [base.items, classId]);

    const api = useMemo<ClassHistoryApi>(
        () => ({
            ...base,
            byClass,
        }),
        [base, byClass],
    );

    return api;
}