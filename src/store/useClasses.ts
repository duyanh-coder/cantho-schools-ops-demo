import {
    useCallback,
    useMemo,
} from "react";

import {
    canThoMockData,
} from "@/mock";

import {
    gradeIdOf,
} from "@/mock/canTho/grades";

import type {
    ClassStatus,
    Personnel,
    SchoolClass,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const CLASSES_STORAGE_KEY = "can-tho-classes-v2";

/** Seed 3: bổ sung GVCN và phòng học cho lớp của 3 trường ngoài Ninh Kiều. */
export const CLASSES_SEED_VERSION = 3;

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

/**
 * Bổ sung `gradeId` cho dữ liệu lưu từ phiên bản trước: `grade` số vẫn là
 * nguồn sự thật, `gradeId` chỉ là khóa tra cứu suy ra từ nó.
 */
const normalizeClass = (classItem: SchoolClass): SchoolClass => ({
    ...classItem,
    status: normalizeStatus(classItem.status),
    classType: classItem.classType ?? "REGULAR",
    capacity: classItem.capacity ?? 40,
    gradeId: classItem.gradeId ??
        gradeIdOf(classItem.schoolId, classItem.grade),
});

/**
 * Trả về lý do không xóa được lớp, hoặc `null` nếu lớp không còn tham chiếu
 * nào. Lớp còn học sinh, thời khóa biểu, phân công giảng dạy hoặc biến động
 * thì không được xóa.
 */
export const classBlockers = (
    classId: string,
    references: {
        studentClassIds: Set<string>;

        timetableClassIds: Set<string>;

        assignmentClassIds: Set<string>;

        historyClassIds: Set<string>;
    },
): string[] => {
    const blockers: string[] = [];

    if (references.studentClassIds.has(classId)) {
        blockers.push("Lớp còn học sinh đang theo học.");
    }

    if (references.timetableClassIds.has(classId)) {
        blockers.push("Lớp còn thời khóa biểu.");
    }

    if (references.assignmentClassIds.has(classId)) {
        blockers.push("Lớp còn phân công giảng dạy.");
    }

    if (references.historyClassIds.has(classId)) {
        blockers.push("Lớp còn biến động khối/lớp học.");
    }

    return blockers;
};

export interface ClassReferences {
    studentClassIds: Set<string>;

    timetableClassIds: Set<string>;

    assignmentClassIds: Set<string>;

    historyClassIds: Set<string>;
}

export type ClassDraft = Omit<SchoolClass, "id" | "gradeId"> & { id?: string };

/**
 * Sinh mã lớp ổn định từ trường, năm học và mã lớp. Lớp tạo mới không dùng
 * dải `can-tho-class-0xx` của dữ liệu mẫu để tránh đè ID.
 */
export const classIdOf = (
    schoolId: string,
    academicYear: string,
    code: string,
): string => {
    const slug = (value: string): string => value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return [
        "can-tho-class",
        slug(schoolId.replace(/^can-tho-school-/, "s")),
        slug(academicYear),
        slug(code),
    ].filter(Boolean).join("-");
};

/**
 * Kiểm tra dữ liệu lớp mới trước khi lưu: tên/mã bắt buộc, khối và cơ sở hợp
 * lệ, mã lớp duy nhất trong năm học và GVCN phải là nhân sự đang hoạt động
 * thuộc đúng trường, cơ sở của lớp.
 */
export const classDraftBlockers = (
    draft: ClassDraft,
    context: {
        classes: SchoolClass[];
        personnel: Personnel[];
    },
): string[] => {
    const blockers: string[] = [];
    const name = draft.name?.trim() ?? "";
    const code = draft.code?.trim() ?? "";
    const academicYear = draft.academicYear?.trim() ?? "";

    if (!name) {
        blockers.push("Tên lớp là bắt buộc.");
    }

    if (!code) {
        blockers.push("Mã lớp là bắt buộc.");
    } else if (/\s/.test(code)) {
        blockers.push("Mã lớp không được chứa khoảng trắng.");
    }

    if (!Number.isInteger(draft.grade) || draft.grade < 1) {
        blockers.push("Khối của lớp không hợp lệ.");
    }

    if (!draft.campusId) {
        blockers.push("Lớp phải thuộc một cơ sở.");
    }

    if (!academicYear) {
        blockers.push("Lớp phải thuộc một năm học.");
    }

    const duplicated = name && code && academicYear
        ? context.classes.some((classItem) =>
            classItem.schoolId === draft.schoolId &&
            classItem.academicYear === academicYear &&
            (
                classItem.code?.trim().toUpperCase() === code.toUpperCase() ||
                classItem.name?.trim().toUpperCase() === name.toUpperCase()
            ))
        : false;

    if (duplicated) {
        blockers.push("Mã hoặc tên lớp đã tồn tại trong năm học này.");
    }

    if (!draft.homeroomTeacherId) {
        blockers.push("Lớp phải có giáo viên chủ nhiệm.");

        return blockers;
    }

    const teacher = context.personnel.find(
        (person) => person.id === draft.homeroomTeacherId,
    );

    if (!teacher) {
        blockers.push("GVCN không tồn tại trong danh sách nhân sự.");

        return blockers;
    }

    if (teacher.status !== "active") {
        blockers.push(`GVCN ${teacher.fullName} đang không hoạt động.`);
    }

    if (teacher.schoolId !== draft.schoolId) {
        blockers.push(`GVCN ${teacher.fullName} không thuộc trường của lớp.`);
    }

    if (draft.campusId && !teacher.campusIds.includes(draft.campusId)) {
        blockers.push(
            `GVCN ${teacher.fullName} không được phân công tại cơ sở của lớp.`,
        );
    }

    return blockers;
};

export interface ClassesApi extends CrudApi<SchoolClass> {
    byId: Map<string, SchoolClass>;

    bySchool: SchoolClass[];

    byCampus: Map<string, SchoolClass[]>;

    /**
     * Tạo lớp mới, trả về lý do nếu dữ liệu không hợp lệ. Mã lớp phải duy
     * nhất trong cùng trường và năm học, GVCN phải là nhân sự đang hoạt động
     * thuộc đúng trường và cơ sở của lớp.
     */
    createClass: (
        draft: ClassDraft,
        personnel: Personnel[],
    ) => string | null;

    removeClass: (
        classId: string,
        references: ClassReferences,
    ) => string | null;
}

export function useClasses(
    schoolId?: string,
): ClassesApi {
    const base = useCrud<SchoolClass>(
        CLASSES_STORAGE_KEY,
        canThoMockData.classes,
        CLASSES_SEED_VERSION,
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

    const byCampus = useMemo(
        () => new Map<string, SchoolClass[]>(
            bySchool.reduce((acc, classItem) => {
                const group = acc.get(classItem.campusId) ?? [];

                group.push(classItem);
                acc.set(classItem.campusId, group);

                return acc;
            }, new Map<string, SchoolClass[]>()),
        ),
        [bySchool],
    );

    const createClass = useCallback((
        draft: ClassDraft,
        personnel: Personnel[],
    ): string | null => {
        const blockers = classDraftBlockers(draft, {
            classes: items,
            personnel,
        });

        if (blockers.length > 0) {
            return blockers.join(" ");
        }

        const code = draft.code.trim();
        const academicYear = draft.academicYear.trim();

        base.create({
            ...draft,
            code,
            name: draft.name.trim(),
            id: draft.id ??
                classIdOf(draft.schoolId, academicYear, code),
            gradeId: gradeIdOf(draft.schoolId, draft.grade),
        });

        return null;
    }, [base, items]);

    const removeClass = useCallback((
        classId: string,
        references: ClassReferences,
    ): string | null => {
        if (!byId.has(classId)) {
            return "Không tìm thấy lớp cần xóa.";
        }

        const blockers = classBlockers(classId, references);

        if (blockers.length > 0) {
            return blockers.join(" ");
        }

        base.remove(classId);

        return null;
    }, [base, byId]);

    const api = useMemo<ClassesApi>(
        () => ({
            ...base,
            items,
            byId,
            bySchool,
            byCampus,
            createClass,
            removeClass,
        }),
        [base, items, byId, bySchool, byCampus, createClass, removeClass],
    );

    return api;
}
