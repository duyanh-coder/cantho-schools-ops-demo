import type {
    Personnel,
} from "./types";

/**
 * Chức danh được coi là cán bộ quản lý. Danh sách này là nguồn duy nhất để phân
 * nhóm nhân sự, dùng chung cho tab Tổng quan, tab Nhân sự và số liệu thống kê
 * trường.
 */
export const MANAGER_ROLE_TITLES = [
    "Hiệu trưởng",
    "Phó hiệu trưởng",
    "Tổ trưởng chuyên môn",
    "Trưởng khối",
] as const;

export type PersonnelGroup = "manager" | "teacher" | "staff";

export interface PersonnelGroupSummary {
    group: PersonnelGroup;

    label: string;

    count: number;
}

export interface PersonnelRoleSummary {
    total: number;

    managers: number;

    teachers: number;

    staff: number;

    male: number;

    female: number;

    active: number;

    inactive: number;
}

export const PERSONNEL_GROUP_LABELS: Record<PersonnelGroup, string> = {
    manager: "Cán bộ quản lý",
    teacher: "Giáo viên",
    staff: "Nhân viên",
};

export const isManagerRole = (roleTitle: string): boolean =>
    MANAGER_ROLE_TITLES.some((title) => roleTitle.includes(title));

/**
 * Mỗi người chỉ thuộc một nhóm: cán bộ quản lý được xếp trước, kể cả khi vẫn
 * đang được giao môn giảng dạy. Quy tắc loại trừ này giúp số "giáo viên" ở
 * tab Tổng quan và tab Nhân sự không lệch nhau.
 */
export const personnelGroupOf = (person: Personnel): PersonnelGroup => {
    if (isManagerRole(person.roleTitle)) {
        return "manager";
    }

    if (person.subjectIds.length > 0) {
        return "teacher";
    }

    return "staff";
};

export const isTeachingRole = (person: Personnel): boolean =>
    personnelGroupOf(person) === "teacher";

export const summarizePersonnel = (
    personnel: Personnel[],
): PersonnelRoleSummary => {
    let managers = 0;
    let teachers = 0;
    let staff = 0;
    let male = 0;
    let active = 0;

    for (const person of personnel) {
        const group = personnelGroupOf(person);

        if (group === "manager") {
            managers += 1;
        } else if (group === "teacher") {
            teachers += 1;
        } else {
            staff += 1;
        }

        if (person.gender === "male") {
            male += 1;
        }

        if (person.status === "active") {
            active += 1;
        }
    }

    return {
        total: personnel.length,
        managers,
        teachers,
        staff,
        male,
        female: personnel.length - male,
        active,
        inactive: personnel.length - active,
    };
};

export const groupPersonnel = (
    personnel: Personnel[],
): PersonnelGroupSummary[] => {
    const summary = summarizePersonnel(personnel);

    return (["manager", "teacher", "staff"] as PersonnelGroup[]).map(
        (group) => ({
            group,
            label: PERSONNEL_GROUP_LABELS[group],
            count: summary[group === "manager"
                ? "managers"
                : group === "teacher"
                    ? "teachers"
                    : "staff"],
        }),
    );
};

export const personnelOfSchool = (
    personnel: Personnel[],
    schoolId: string | undefined,
): Personnel[] => (schoolId
    ? personnel.filter((person) => person.schoolId === schoolId)
    : personnel);
