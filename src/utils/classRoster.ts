import type {
    BoardingProfile,
    EnrolmentChange,
    SchoolClass,
    Student,
    StudentMovement,
} from "@/mock/common/types";


export type ClassRosterWarningTone = "error" | "warning" | "info";

export interface ClassRosterWarning {
    tone: ClassRosterWarningTone;

    title: string;

    detail: string;
}

export interface ClassRosterStats {
    total: number;

    male: number;

    female: number;

    capacity: number;

    remaining: number;

    /** Phần trăm sĩ số so với sức chứa, làm tròn. */
    fillRate: number;
}

export interface ClassNeedSummary {
    boarding: number;

    twoSession: number;

    meal: number;

    /** Học sinh có hồ sơ bán trú nhưng hồ sơ đã hết hiệu lực. */
    inactiveProfile: number;
}

export interface ClassRosterRow {
    student: Student;

    profile: BoardingProfile | undefined;
}

export interface ClassEnrolment {
    pendingIn: EnrolmentChange[];

    pendingOut: EnrolmentChange[];

    movements: StudentMovement[];

    netPending: number;
}

/**
 * Sĩ số lớp học chỉ tính học sinh đang học, nam/nữ và sức chứa suy ra từ
 * `SchoolClass`. Không có mảng sĩ số riêng để lệch với danh sách học sinh.
 */
export const buildClassRosterStats = (
    students: Student[],
    classItem: SchoolClass,
): ClassRosterStats => {
    const studying = students.filter(
        (student) => student.status === "studying",
    );

    const capacity = classItem.capacity ?? 40;

    return {
        total: studying.length,
        male: studying.filter((student) => student.gender === "male").length,
        female: studying.filter((student) => student.gender === "female").length,
        capacity,
        remaining: Math.max(0, capacity - studying.length),
        fillRate: capacity > 0
            ? Math.round((studying.length / capacity) * 100)
            : 0,
    };
};

/**
 * Nhu cầu của lớp suy ra từ hồ sơ bán trú của từng học sinh, không lưu
 * thêm cờ riêng trên lớp để tránh hai nguồn sự thật.
 */
export const buildClassNeeds = (
    rows: ClassRosterRow[],
): ClassNeedSummary => {
    const active = rows.filter(
        (row) => row.profile?.status === "active",
    );

    return {
        boarding: active.filter((row) => row.profile?.boarding).length,
        twoSession: active.filter((row) => row.profile?.twoSession).length,
        meal: active.filter((row) => row.profile?.mealRequired).length,
        inactiveProfile: rows.filter(
            (row) => row.profile !== undefined &&
                row.profile.status !== "active",
        ).length,
    };
};

/**
 * Biến động tiếp nhận của lớp: thay đổi chưa xử lý và các lần chuyển lớp
 * đã ghi nhận. `netPending` là số học sinh sẽ cộng thêm khi các thay đổi
 * đang chờ được duyệt.
 */
export const buildClassEnrolment = (
    changes: EnrolmentChange[],
    movements: StudentMovement[],
    classId: string,
): ClassEnrolment => {
    const scoped = changes.filter(
        (change) => change.classId === classId,
    );

    const pendingIn = scoped.filter(
        (change) =>
            change.status === "pending" &&
            change.changeType === "increase",
    );

    const pendingOut = scoped.filter(
        (change) =>
            change.status === "pending" &&
            change.changeType === "decrease",
    );

    return {
        pendingIn,
        pendingOut,
        movements: movements.filter(
            (movement) =>
                movement.fromClassId === classId ||
                movement.toClassId === classId,
        ),
        netPending: pendingIn.length - pendingOut.length,
    };
};

/**
 * Sai lệch dữ liệu học sinh so với lớp. Không bỏ qua âm thầm: mỗi sai lệch
 * phát sinh một cảnh báo để người dùng sửa hồ sơ hoặc chuyển lớp/cơ sở.
 */
export interface ClassRosterIntegrity {
    missingClass: number;

    campusMismatch: number;

    schoolMismatch: number;

    yearMismatch: number;

    gradeMismatch: number;
}

export const EMPTY_ROSTER_INTEGRITY: ClassRosterIntegrity = {
    missingClass: 0,
    campusMismatch: 0,
    schoolMismatch: 0,
    yearMismatch: 0,
    gradeMismatch: 0,
};

/**
 * Đếm sai lệch giữa hồ sơ học sinh và lớp đang chọn.
 * `students` là toàn bộ học sinh thuộc lớp (mọi trạng thái).
 * Lưu ý: `missingClass` chỉ khác 0 khi dữ liệu đầu vào có học sinh đang học mà
 * `classId` rỗng. Màn hình lớp truyền `studentsApi.byClass(...)` nên mọi hồ sơ
 * đã có `classId`; muốn phát hiện học sinh đang học chưa có lớp phải gọi hàm ở
 * phạm vi toàn hệ rồi lọc theo trường.
 */
export const buildClassRosterIntegrity = (
    students: Student[],
    classItem: SchoolClass,
): ClassRosterIntegrity => {
    const integrity: ClassRosterIntegrity = {
        ...EMPTY_ROSTER_INTEGRITY,
    };

    for (const student of students) {
        if (!student.classId) {
            integrity.missingClass += 1;

            continue;
        }

        if (student.campusId !== classItem.campusId) {
            integrity.campusMismatch += 1;
        }

        if (student.schoolId !== classItem.schoolId) {
            integrity.schoolMismatch += 1;
        }

        if (student.academicYear !== classItem.academicYear) {
            integrity.yearMismatch += 1;
        }

        if (
            student.grade !== undefined
            && student.grade !== classItem.grade
        ) {
            integrity.gradeMismatch += 1;
        }
    }

    return integrity;
};

/**
 * Cảnh báo sĩ số: vượt sức chứa, chưa có GVCN, thiếu hồ sơ bán trú hoặc còn
 * biến động chờ duyệt. Trả về danh sách rỗng khi lớp ổn định.
 */
export const buildClassWarnings = (
    stats: ClassRosterStats,
    options: {
        homeroomTeacherId?: string;

        needs: ClassNeedSummary;

        netPending: number;

        integrity?: ClassRosterIntegrity;
    },
): ClassRosterWarning[] => {
    const warnings: ClassRosterWarning[] = [];

    if (stats.total > stats.capacity) {
        warnings.push({
            tone: "error",
            title: "Lớp vượt sức chứa",
            detail: `Đang có ${stats.total} học sinh so với sức chứa ${stats.capacity} em.`,
        });
    } else if (stats.total === stats.capacity) {
        warnings.push({
            tone: "warning",
            title: "Lớp đã đầy",
            detail: `Đủ ${stats.capacity} học sinh, không còn chỗ tiếp nhận.`,
        });
    } else if (stats.fillRate >= 95) {
        warnings.push({
            tone: "warning",
            title: "Lớp sắp đầy",
            detail: `Đang dùng ${stats.fillRate}% sức chứa.`,
        });
    }

    if (!options.homeroomTeacherId) {
        warnings.push({
            tone: "error",
            title: "Chưa phân công GVCN",
            detail: "Lớp chưa có giáo viên chủ nhiệm được giao.",
        });
    }

    if (options.needs.inactiveProfile > 0) {
        warnings.push({
            tone: "warning",
            title: "Hồ sơ bán trú hết hiệu lực",
            detail:
                `${options.needs.inactiveProfile} học sinh có hồ sơ bán trú đã kết thúc.`,
        });
    }

    if (options.netPending > 0) {
        warnings.push({
            tone: "info",
            title: "Còn biến động chờ duyệt",
            detail: `${options.netPending} thay đổi tiếp nhận đang chờ xử lý.`,
        });
    }

    const integrity = options.integrity;

    if (integrity) {
        if (integrity.missingClass > 0) {
            warnings.push({
                tone: "error",
                title: "Học sinh chưa thuộc lớp",
                detail:
                    `${integrity.missingClass} hồ sơ đang học chưa có lớp. Cần chuyển lớp hoặc cập nhật hồ sơ.`,
            });
        }

        if (integrity.campusMismatch > 0) {
            warnings.push({
                tone: "error",
                title: "Lệch cơ sở học sinh",
                detail:
                    `${integrity.campusMismatch} học sinh có cơ sở khác cơ sở của lớp.`,
            });
        }

        if (integrity.schoolMismatch > 0) {
            warnings.push({
                tone: "error",
                title: "Lệch trường học sinh",
                detail:
                    `${integrity.schoolMismatch} học sinh thuộc trường khác trường của lớp.`,
            });
        }

        if (integrity.yearMismatch > 0) {
            warnings.push({
                tone: "warning",
                title: "Lệch năm học",
                detail:
                    `${integrity.yearMismatch} học sinh không cùng năm học với lớp.`,
            });
        }

        if (integrity.gradeMismatch > 0) {
            warnings.push({
                tone: "warning",
                title: "Lệch khối học sinh",
                detail:
                    `${integrity.gradeMismatch} học sinh có khối khác khối của lớp.`,
            });
        }
    }

    return warnings;
};
