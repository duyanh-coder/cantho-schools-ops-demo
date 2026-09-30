import {
    useCallback,
    useMemo,
} from "react";

import {
    canThoGrades,
    gradeCodePrefixOf,
} from "@/mock/canTho";

import type {
    Grade,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const GRADES_STORAGE_KEY = "can-tho-grades";

/** Seed 2: bổ sung khối của 3 trường ngoài Ninh Kiều. */
export const GRADES_SEED_VERSION = 2;

const MAX_GRADE = 12;

const normalizeGrade = (grade: Grade): Grade => ({
    ...grade,
    sortOrder: Math.min(MAX_GRADE, Math.max(1, Math.round(grade.sortOrder))),
    status: grade.status === "inactive" ? "inactive" : "active",
});

/**
 * Trả về lý do không xóa được khối, hoặc `null` nếu khối không còn lớp nào
 * tham chiếu tới. Khối đang có lớp thì không được xóa để tránh lớp mất khối.
 */
export const gradeBlockers = (
    grade: Grade,
    classes: { gradeId?: string; grade: number }[],
): string[] => {
    const used = classes.filter((classItem) =>
        classItem.gradeId === grade.id ||
        (!classItem.gradeId && classItem.grade === grade.sortOrder));

    if (used.length === 0) {
        return [];
    }

    return [`Khối đang có ${used.length} lớp học tham chiếu.`];
};

export interface GradesApi extends CrudApi<Grade> {
    byId: Map<string, Grade>;

    bySchool: Grade[];

    /**
     * Thêm khối mới cho trường, trả về khối vừa tạo hoặc `null` nếu trùng khối
     * đang có.
     */
    createGrade: (
        schoolId: string,
        grade: number,
    ) => Grade | null;

    /**
     * Xóa khối, trả về lý do nếu khối vẫn còn lớp tham chiếu.
     */
    removeGrade: (
        gradeId: string,
        classes: { gradeId?: string; grade: number }[],
    ) => string | null;
}

export function useGrades(
    schoolId?: string,
): GradesApi {
    const base = useCrud<Grade>(
        GRADES_STORAGE_KEY,
        canThoGrades,
        GRADES_SEED_VERSION,
    );

    const items = useMemo(
        () => base.items.map(normalizeGrade),
        [base.items],
    );

    const byId = useMemo(
        () => new Map<string, Grade>(items.map((grade) => [grade.id, grade])),
        [items],
    );

    const bySchool = useMemo(
        () => (schoolId
            ? items.filter((grade) => grade.schoolId === schoolId)
            : items)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        [items, schoolId],
    );

    const createGrade = useCallback((
        targetSchoolId: string,
        grade: number,
    ): Grade | null => {
        const normalized = Math.min(MAX_GRADE, Math.max(1, Math.round(grade)));

        const duplicated = items.some((item) =>
            item.schoolId === targetSchoolId &&
            item.sortOrder === normalized);

        if (duplicated) {
            return null;
        }

        const prefix = gradeCodePrefixOf(targetSchoolId);

        const created: Grade = {
            id: `${targetSchoolId}-g${normalized}`,
            schoolId: targetSchoolId,
            code: `${prefix}-K${normalized}`,
            name: `Khối ${normalized}`,
            sortOrder: normalized,
            status: "active",
        };

        base.create(created);

        return created;
    }, [base, items]);

    const removeGrade = useCallback((
        gradeId: string,
        classes: { gradeId?: string; grade: number }[],
    ): string | null => {
        const grade = byId.get(gradeId);

        if (!grade) {
            return "Không tìm thấy khối cần xóa.";
        }

        const blockers = gradeBlockers(grade, classes);

        if (blockers.length > 0) {
            return blockers[0];
        }

        base.remove(gradeId);

        return null;
    }, [base, byId]);

    const api = useMemo<GradesApi>(
        () => ({
            ...base,
            items,
            byId,
            bySchool,
            createGrade,
            removeGrade,
        }),
        [base, items, byId, bySchool, createGrade, removeGrade],
    );

    return api;
}
