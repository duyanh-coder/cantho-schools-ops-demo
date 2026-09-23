import {
    useMemo,
} from "react";

import {
    canThoStudents,
} from "@/mock/canTho";

import type {
    Student,
    StudentStatus,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const STUDENTS_STORAGE_KEY = "can-tho-students";

export interface StudentsApi extends CrudApi<Student> {
    byId: Map<string, Student>;

    bySchool: Student[];

    byCampus: Student[];

    byClass: Student[];
}

export function useStudents(
    schoolId?: string,
    campusId?: string,
    classId?: string,
): StudentsApi {
    const base = useCrud<Student>(
        STUDENTS_STORAGE_KEY,
        canThoStudents,
    );

    const byId = useMemo(
        () => new Map<string, Student>(
            base.items.map((student) => [student.id, student]),
        ),
        [base.items],
    );

    const bySchool = useMemo(
        () => schoolId
            ? base.items.filter((student) => student.schoolId === schoolId)
            : base.items,
        [base.items, schoolId],
    );

    const byCampus = useMemo(
        () => campusId
            ? bySchool.filter((student) => student.campusId === campusId)
            : bySchool,
        [bySchool, campusId],
    );

    const byClass = useMemo(
        () => classId
            ? byCampus.filter((student) => student.classId === classId)
            : byCampus,
        [byCampus, classId],
    );

    const api = useMemo<StudentsApi>(
        () => ({
            ...base,
            byId,
            bySchool,
            byCampus,
            byClass,
        }),
        [base, byId, bySchool, byCampus, byClass],
    );

    return api;
}

export const isActiveStudent = (status: StudentStatus | undefined): boolean =>
    status === "studying";