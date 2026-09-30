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
    computeQuotaUsage,
} from "@/utils/timetable";

import type {
    TimetableQuota,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const PERSONNEL_ASSIGNMENTS_STORAGE_KEY = "can-tho-personnel-assignments";

export interface PersonnelAssignmentFilters {
    academicYear?: string;

    semester?: 1 | 2;

    classId?: string;

    campusId?: string;
}

export interface PersonnelAssignmentsApi extends CrudApi<PersonnelAssignment> {
    byPersonnel: PersonnelAssignment[];

    byClass: PersonnelAssignment[];

    byTerm: PersonnelAssignment[];

    activeByTerm: PersonnelAssignment[];

    quota: TimetableQuota[];
}

export function usePersonnelAssignments(
    personnelId?: string,
    filters?: PersonnelAssignmentFilters,
): PersonnelAssignmentsApi {
    const base = useCrud<PersonnelAssignment>(
        PERSONNEL_ASSIGNMENTS_STORAGE_KEY,
        canThoPersonnelAssignments,
    );

    const {
        academicYear,
        semester,
        classId,
        campusId,
    } = filters ?? {};

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

    const byTerm = useMemo(
        () => base.items.filter((item) =>
            (academicYear
                ? item.academicYear === academicYear
                : true) &&
            (semester
                ? item.semester === semester
                : true) &&
            (classId
                ? item.classId === classId
                : true) &&
            (campusId
                ? item.campusId === campusId
                : true)),
        [base.items, academicYear, semester, classId, campusId],
    );

    const byClass = useMemo(
        () => byTerm
            .slice()
            .sort((a, b) => b.periodsPerWeek - a.periodsPerWeek),
        [byTerm],
    );

    const activeByTerm = useMemo(
        () => byTerm.filter((item) => item.status === "active"),
        [byTerm],
    );

    const quota = useMemo(
        () => computeQuotaUsage(
            [],
            activeByTerm.map((item) => ({
                teacherId: item.personnelId,
                classId: item.classId,
                subjectId: item.subjectId,
                periodsPerWeek: item.periodsPerWeek,
            })),
        ),
        [activeByTerm],
    );

    const api = useMemo<PersonnelAssignmentsApi>(
        () => ({
            ...base,
            byPersonnel,
            byClass,
            byTerm,
            activeByTerm,
            quota,
        }),
        [base, byPersonnel, byClass, byTerm, activeByTerm, quota],
    );

    return api;
}
