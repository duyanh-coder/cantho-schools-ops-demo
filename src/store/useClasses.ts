import {
    useMemo,
} from "react";

import {
    canThoMockData,
} from "@/mock";

import type {
    ClassStatus,
    SchoolClass,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const CLASSES_STORAGE_KEY = "can-tho-classes";

const normalizeStatus = (
    status: unknown,
): ClassStatus => {
    const normalized = String(status ?? "active");

    if (
        normalized === "active" ||
        normalized === "inactive" ||
        normalized === "suspended" ||
        normalized === "closed"
    ) {
        return normalized as ClassStatus;
    }

    return "active";
};

const normalizeClass = (classItem: SchoolClass): SchoolClass => ({
    ...classItem,
    status: normalizeStatus(classItem.status),
    classType: classItem.classType ?? "REGULAR",
    capacity: classItem.capacity ?? 40,
});

export interface ClassesApi extends CrudApi<SchoolClass> {
    byId: Map<string, SchoolClass>;

    bySchool: SchoolClass[];
}

export function useClasses(
    schoolId?: string,
): ClassesApi {
    const base = useCrud<SchoolClass>(
        CLASSES_STORAGE_KEY,
        canThoMockData.classes,
    );

    const items = useMemo(
        () => base.items.map(normalizeClass),
        [base.items],
    );

    const byId = useMemo(
        () => new Map<string, SchoolClass>(
            items.map((classItem) => [classItem.id, classItem]),
        ),
        [items],
    );

    const bySchool = useMemo(
        () => schoolId
            ? items.filter((classItem) => classItem.schoolId === schoolId)
            : items,
        [items, schoolId],
    );

    const api = useMemo<ClassesApi>(
        () => ({
            ...base,
            items,
            byId,
            bySchool,
        }),
        [base, items, byId, bySchool],
    );

    return api;
}