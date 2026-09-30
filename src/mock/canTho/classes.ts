import type {
    ClassType,
    Personnel,
    SchoolClass,
} from "../common/types";

import {
    canThoPersonnel,
} from "./personnel";

import {
    canThoRooms,
} from "./rooms";

import {
    gradeIdOf,
} from "./grades";

const SCHOOL_001 = "can-tho-school-001";
const ACADEMIC_YEAR = "2026-2027";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface CampusPlan {
    campusId: string;

    codePrefix: string;

    targetClasses: number;

    grades: number[];
}

/**
 * Phân bổ lớp của Trường THCS Ninh Kiều theo 6 cơ sở.
 * Tổng 142 lớp; mỗi cơ sở có dư phòng hơn số lớp để mở thêm khi cần.
 */
const CAMPUS_PLAN: CampusPlan[] = [
    { campusId: "campus-main", codePrefix: "NK", targetClasses: 40, grades: [6, 7, 8, 9] },
    { campusId: "campus-an-lac", codePrefix: "AL", targetClasses: 26, grades: [6, 7, 8, 9] },
    { campusId: "campus-chu-van-an", codePrefix: "CVA", targetClasses: 24, grades: [6, 7, 8, 9] },
    { campusId: "campus-huynh-thuc-khang", codePrefix: "HTK", targetClasses: 20, grades: [6, 7, 8, 9] },
    { campusId: "campus-thoi-binh", codePrefix: "TB", targetClasses: 17, grades: [6, 7, 8, 9] },
    { campusId: "campus-tran-hung-dao", codePrefix: "THD", targetClasses: 15, grades: [6, 7, 8, 9] },
];

/** Mỗi cơ sở đã có sẵn 6A1/6A2, 7A1/7A2, 8A1/8A2, 9A1/9A2. */
const EXISTING_PER_GRADE = 2;

const CAPACITY_BY_TYPE: Record<ClassType, number> = {
    REGULAR: 40,
    TWO_SESSION: 42,
    BOARDING: 45,
    SPECIAL: 36,
};

/** Lớp đặc biệt của các lớp sinh thêm: tổng 6 bán trú, 5 hai buổi, 3 chuyên. */
const GENERATED_TYPE_PLAN: Record<string, ClassType> = {
    "campus-main|8B1": "BOARDING",
    "campus-main|7B1": "BOARDING",
    "campus-main|9B1": "TWO_SESSION",
    "campus-an-lac|6B1": "BOARDING",
    "campus-huynh-thuc-khang|6B1": "BOARDING",
    "campus-chu-van-an|9B1": "TWO_SESSION",
    "campus-tran-hung-dao|9B1": "TWO_SESSION",
    "campus-thoi-binh|6B1": "SPECIAL",
};

const CLASS_TYPE_BY_ID = new Map<string, ClassType>([
    ["can-tho-class-024", "BOARDING"],
    ["can-tho-class-025", "BOARDING"],
    ["can-tho-class-026", "TWO_SESSION"],
    ["can-tho-class-027", "TWO_SESSION"],
    ["can-tho-class-039", "SPECIAL"],
    ["can-tho-class-045", "SPECIAL"],
]);

const CLASS_CAPACITY_BY_ID = new Map<string, number>([
    ["can-tho-class-024", 45],
    ["can-tho-class-025", 45],
    ["can-tho-class-026", 42],
    ["can-tho-class-027", 42],
    ["can-tho-class-039", 36],
    ["can-tho-class-045", 36],
]);

const letterOf = (index: number): string => LETTERS[Math.floor(index / 2)];

const suffixOf = (index: number): number => (index % 2) + 1;

const shortCodeOf = (
    grade: number,
    index: number,
): string => `${grade}${letterOf(index)}${suffixOf(index)}`;

/** Chia đều số lớp của một cơ sở cho từng khối, phần dư ưu tiên khối thấp. */
const classesPerGrade = (
    target: number,
    grades: number[],
): number[] => {
    const base = Math.floor(target / grades.length);
    const remainder = target % grades.length;

    return grades.map((_, index) => base + (index < remainder ? 1 : 0));
};

const baseClasses: SchoolClass[] = [
    { id: "can-tho-class-001", schoolId: "can-tho-school-001", campusId: "campus-main", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-002", schoolId: "can-tho-school-001", campusId: "campus-main", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-003", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-004", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-005", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-006", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-007", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-008", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-009", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-010", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-011", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-012", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-013", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", code: "CR6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-014", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", code: "CR7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-015", schoolId: "can-tho-school-002", campusId: "can-tho-campus-008", code: "CR8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-016", schoolId: "can-tho-school-002", campusId: "can-tho-campus-008", code: "CR9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-017", schoolId: "can-tho-school-003", campusId: "can-tho-campus-009", code: "BT6A1", name: "6A1", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-018", schoolId: "can-tho-school-003", campusId: "can-tho-campus-009", code: "BT7A1", name: "7A1", grade: 7, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-019", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", code: "CK10A1", name: "10A1", grade: 10, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-020", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", code: "CK11A1", name: "11A1", grade: 11, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-021", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", code: "CK12A1", name: "12A1", grade: 12, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-022", schoolId: "can-tho-school-001", campusId: "campus-main", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-023", schoolId: "can-tho-school-001", campusId: "campus-main", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-024", schoolId: "can-tho-school-001", campusId: "campus-main", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-025", schoolId: "can-tho-school-001", campusId: "campus-main", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-026", schoolId: "can-tho-school-001", campusId: "campus-main", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-027", schoolId: "can-tho-school-001", campusId: "campus-main", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-028", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-029", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-030", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-031", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-032", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-033", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-034", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-035", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-036", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-037", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-038", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-039", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-040", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-041", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-042", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-043", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-044", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-045", schoolId: "can-tho-school-001", campusId: "campus-an-lac", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-046", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-047", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-048", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-049", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-050", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-051", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },

    { id: "can-tho-class-052", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "6A2", name: "6A2", grade: 6, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-053", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "7A2", name: "7A2", grade: 7, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-054", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "8A1", name: "8A1", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-055", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "8A2", name: "8A2", grade: 8, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-056", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "9A1", name: "9A1", grade: 9, academicYear: "2026-2027", status: "active" },
    { id: "can-tho-class-057", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", code: "9A2", name: "9A2", grade: 9, academicYear: "2026-2027", status: "active" },
];

const generateCampusClasses = (plan: CampusPlan): SchoolClass[] => {
    const perGrade = classesPerGrade(plan.targetClasses, plan.grades);

    return plan.grades.flatMap((grade, gradeIndex) => {
        const total = perGrade[gradeIndex];

        return Array.from({ length: total - EXISTING_PER_GRADE }, (_, offset) => {
            const index = EXISTING_PER_GRADE + offset;
            const shortCode = shortCodeOf(grade, index);

            return {
                id: `can-tho-class-${plan.codePrefix.toLowerCase()}-${shortCode.toLowerCase()}`,
                schoolId: SCHOOL_001,
                campusId: plan.campusId,
                code: shortCode,
                name: shortCode,
                grade,
                academicYear: ACADEMIC_YEAR,
                status: "active" as const,
            };
        });
    });
};

const generatedClasses: SchoolClass[] = CAMPUS_PLAN.flatMap(
    generateCampusClasses,
);

const isManagerByRole = (roleTitle: string): boolean =>
    roleTitle.toLowerCase().includes("hiệu trưởng");

/**
 * Ứng viên chủ nhiệm: đang công tác, không phải lãnh đạo, có môn giảng dạy và
 * dạy đúng cơ sở của lớp. Trường lấy theo chính lớp nên các trường ngoài Ninh
 * Kiều cũng được phân công như bình thường.
 */
const homeroomCandidatesOf = (
    schoolId: string,
    campusId: string,
    personnel: Personnel[],
): Personnel[] => personnel.filter(
    (person) =>
        person.schoolId === schoolId &&
        person.status === "active" &&
        !isManagerByRole(person.roleTitle) &&
        person.subjectIds.length > 0 &&
        person.campusIds.includes(campusId),
);

/**
 * Mỗi giáo viên chỉ chủ nhiệm một lớp. Cơ sở có ít giáo viên nhất được xử lý
 * trước để không bị cạnh tranh nhân sự với cơ sở lớn.
 */
const assignHomeroomTeachers = (
    classes: SchoolClass[],
    personnel: Personnel[],
): Map<string, string> => {
    const assigned = new Map<string, string>();
    const taken = new Set<string>();

    const campusIds = [
        ...new Set(classes.map((classItem) => classItem.campusId)),
    ];

    const campusesByPoolSize = campusIds.map((campusId) => {
        const campusClasses = classes.filter(
            (classItem) => classItem.campusId === campusId,
        );

        const schoolId = campusClasses[0]?.schoolId ?? SCHOOL_001;

        return {
            campusId,
            schoolId,
            campusClasses,
            poolSize: homeroomCandidatesOf(schoolId, campusId, personnel)
                .length,
        };
    }).sort((left, right) => left.poolSize - right.poolSize);

    for (const { schoolId, campusId, campusClasses } of campusesByPoolSize) {
        const candidates = homeroomCandidatesOf(schoolId, campusId, personnel);

        let cursor = 0;

        for (const classItem of campusClasses) {
            while (cursor < candidates.length && taken.has(candidates[cursor].id)) {
                cursor += 1;
            }

            if (cursor >= candidates.length) {
                break;
            }

            taken.add(candidates[cursor].id);
            assigned.set(classItem.id, candidates[cursor].id);
            cursor += 1;
        }
    }

    return assigned;
};

/** Mỗi lớp chiếm một phòng học riêng; dư phòng để mở thêm lớp về sau. */
const assignRooms = (classes: SchoolClass[]): Map<string, string> => {
    const assigned = new Map<string, string>();

    const campusIds = [
        ...new Set(classes.map((classItem) => classItem.campusId)),
    ];

    for (const campusId of campusIds) {
        const classrooms = canThoRooms.filter(
            (room) =>
                room.campusId === campusId &&
                room.category === "classroom",
        ).sort((left, right) => left.id.localeCompare(right.id));

        const campusClasses = classes.filter(
            (classItem) => classItem.campusId === campusId,
        );

        campusClasses.forEach((classItem, index) => {
            if (index < classrooms.length) {
                assigned.set(classItem.id, classrooms[index].id);
            }
        });
    }

    return assigned;
};

const typeOf = (classItem: SchoolClass): ClassType => {
    const byId = CLASS_TYPE_BY_ID.get(classItem.id);

    if (byId) {
        return byId;
    }

    return GENERATED_TYPE_PLAN[`${classItem.campusId}|${classItem.name}`] ?? "REGULAR";
};

const school001Classes: SchoolClass[] = [
    ...generatedClasses,
    ...baseClasses.filter((classItem) => classItem.schoolId === SCHOOL_001),
];

const otherSchoolClasses: SchoolClass[] = baseClasses.filter(
    (classItem) => classItem.schoolId !== SCHOOL_001,
);

const campusRank = new Map<string, number>(
    CAMPUS_PLAN.map((plan, index) => [plan.campusId, index]),
);

const prefixByCampus = new Map<string, string>(
    CAMPUS_PLAN.map((plan) => [plan.campusId, plan.codePrefix]),
);

/**
 * Mã lớp phải duy nhất trong toàn hệ nên ghép tiền tố cơ sở: NK6A1, AL7B2...
 * Tên lớp giữ dạng ngắn để hiển thị và trao đổi.
 */
const codeOf = (classItem: SchoolClass): string => {
    const prefix = prefixByCampus.get(classItem.campusId);

    return prefix ? `${prefix}${classItem.name}` : classItem.code;
};

const byCampusThenGradeThenCode = (
    left: SchoolClass,
    right: SchoolClass,
): number => {
    const campusDiff = (campusRank.get(left.campusId) ?? 99)
        - (campusRank.get(right.campusId) ?? 99);

    if (campusDiff !== 0) {
        return campusDiff;
    }

    if (left.grade !== right.grade) {
        return left.grade - right.grade;
    }

    return left.name.localeCompare(right.name);
};

/**
 * GVCN và phòng học được phân công cho toàn bộ lớp của mọi trường, không chỉ
 * 6 cơ sở của Ninh Kiều, để danh sách lớp không có dòng "chưa phân công".
 */
const allClasses: SchoolClass[] = [
    ...school001Classes,
    ...otherSchoolClasses,
];

const homeroomByClassId = assignHomeroomTeachers(
    allClasses,
    canThoPersonnel,
);

const roomByClassId = assignRooms(allClasses);

const enrich = (classItem: SchoolClass): SchoolClass => {
    const classType = typeOf(classItem);

    return {
        ...classItem,
        code: codeOf(classItem),
        gradeId: gradeIdOf(classItem.schoolId, classItem.grade),
        homeroomTeacherId: homeroomByClassId.get(classItem.id),
        roomId: roomByClassId.get(classItem.id),
        classType,
        capacity: CLASS_CAPACITY_BY_ID.get(classItem.id)
            ?? CAPACITY_BY_TYPE[classType],
    };
};

export const canThoClasses: SchoolClass[] = [
    ...school001Classes.sort(byCampusThenGradeThenCode).map(enrich),
    ...otherSchoolClasses.map(enrich),
];

export const canThoCampusPlan = CAMPUS_PLAN;
