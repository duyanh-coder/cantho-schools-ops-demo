import type { Grade } from "../common/types";

interface SchoolGradeSpec {
    schoolId: string;
    codePrefix: string;
    grades: number[];
}

const SCHOOL_GRADE_SPEC: SchoolGradeSpec[] = [
    { schoolId: "can-tho-school-001", codePrefix: "NK", grades: [6, 7, 8, 9] },
    { schoolId: "can-tho-school-002", codePrefix: "CR", grades: [6, 7, 8, 9] },
    { schoolId: "can-tho-school-003", codePrefix: "BT", grades: [6, 7] },
    { schoolId: "can-tho-school-004", codePrefix: "CK", grades: [10, 11, 12] },
];

const gradeId = (schoolId: string, grade: number): string =>
    `${schoolId}-g${grade}`;

export const canThoGrades: Grade[] = SCHOOL_GRADE_SPEC.flatMap(
    (spec) => spec.grades.map((grade) => ({
        id: gradeId(spec.schoolId, grade),
        schoolId: spec.schoolId,
        code: `${spec.codePrefix}-K${grade}`,
        name: `Khối ${grade}`,
        sortOrder: grade,
        status: "active" as const,
    })),
);

export const gradeCodePrefixOf = (schoolId: string): string => {
    const spec = SCHOOL_GRADE_SPEC.find((item) => item.schoolId === schoolId);

    if (spec) {
        return spec.codePrefix;
    }

    const token = schoolId
        .split("-")
        .find((part) => /^[A-Za-z]{2,}$/.test(part));

    return (token ?? "NK").toUpperCase();
};

export const gradeIdOf = (
    schoolId: string,
    grade: number,
): string => gradeId(schoolId, grade);

export const gradeByNumberOf = (
    schoolId: string,
    grade: number,
): Grade | undefined => canThoGrades.find(
    (item) => item.schoolId === schoolId && item.sortOrder === grade,
);
