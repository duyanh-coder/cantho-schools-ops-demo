import {
    canThoClasses,
} from "./classes";

import {
    canThoPersonnel,
} from "./personnel";

import {
    canThoRooms,
} from "./rooms";

import type {
    SchoolClass,
    TimetableEntry,
    WeekDay,
} from "../common/types";

import {
    AFTERNOON_PERIODS,
    PERIOD_TIME,
} from "../common/types";


const SCHOOL_001 = "can-tho-school-001";

const ACADEMIC_YEAR_ID = "2026-2027";

const SEMESTER_ID = "2026-2027-HK1";

const DAYS: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

/**
 * Tiết trọng tâm khi phân bổ kế hoạch: ưu tiên buổi sáng.
 *
 * Cố tình tách khỏi `ALL_PERIODS` để thứ tự ưu tiên của kế hoạch nền
 * tảng và kế hoạch sinh tự động giữ nguyên khi khung tiết mở rộng
 * thêm buổi chiều.
 */
const PERIODS = [1, 2, 3, 4, 5];

/**
 * Toàn bộ khung tiết trong tuần: buổi sáng 1-5 và buổi chiều 6-10.
 *
 * Ô trống của thời khóa biểu được quét trên khung này nên mọi lớp đều
 * có thể nhận tiết ở cả hai buổi, không riêng buổi sáng.
 */
const ALL_PERIODS: number[] = PERIOD_TIME.map((item) => item.period);

const AFTERNOON_SLOT_PERIODS = AFTERNOON_PERIODS.map(
    (item) => item.period,
);


/**
 * Thời khóa biểu chỉ xếp cho một phần lớp của từng cơ sở (tổng 64 lớp).
 * Phần lớp còn lại chưa có thời khóa biểu để màn hình lớp học còn trạng thái
 * "chờ xếp thời khóa biểu" và cảnh báo thiếu phân công hoạt động đúng như
 * tình huống năm học mới.
 */
const TKB_QUOTA_BY_CAMPUS: Record<string, number> = {
    "campus-main": 18,
    "campus-an-lac": 12,
    "campus-chu-van-an": 11,
    "campus-huynh-thuc-khang": 9,
    "campus-thoi-binh": 8,
    "campus-tran-hung-dao": 6,
};

const TKB_SUBJECTS = [
    "math",
    "literature",
    "english",
    "physics",
    "biology",
] as const;

const isManagerByRole = (roleTitle: string): boolean =>
    roleTitle.toLowerCase().includes("hiệu trưởng");

/**
 * Kho giáo viên theo cơ sở và môn, lấy từ 204 giáo viên có sẵn trong
 * `personnel.ts`.
 *
 * Mỗi giáo viên chỉ được xếp dạy ở một cơ sở duy nhất trong kế hoạch: giáo
 * viên nhiều cơ sở sẽ chiếm hết lịch và làm phát sinh cảnh báo đi nhiều cơ
 * sở ở khắp nơi. Cảnh báo đa cơ sở còn lại đến từ nhóm giáo viên cố ý dạy
 * liên cơ sở ở `BASE_PLAN` và các kịch bản thời khóa biểu.
 */
const teachersByCampusAndSubject = ((): Map<string, string[]> => {
    const map = new Map<string, string[]>();

    const used = new Set<string>();

    for (const subjectId of TKB_SUBJECTS) {
        for (const [campusId, quota] of Object.entries(TKB_QUOTA_BY_CAMPUS)) {
            const wanted = Math.max(1, Math.round(quota / 6));

            const pool = canThoPersonnel
                .filter((person) =>
                    person.schoolId === SCHOOL_001 &&
                    person.status === "active" &&
                    !isManagerByRole(person.roleTitle) &&
                    !used.has(person.id) &&
                    person.subjectIds.includes(subjectId) &&
                    person.campusIds.includes(campusId))
                .slice(0, wanted)
                .map((person) => {
                    used.add(person.id);

                    return person.id;
                });

            if (pool.length > 0) {
                map.set(`${campusId}|${subjectId}`, pool);
            }
        }
    }

    return map;
})();

const subjectTeachersOf = (
    campusId: string,
    subjectId: string,
): string[] =>
    teachersByCampusAndSubject.get(`${campusId}|${subjectId}`) ?? [];

const CYCLE_A = [
    "math",
    "literature",
    "english",
    "math",
    "literature",
    "biology",
    "literature",
    "physics",
];

const CYCLE_B = [
    "literature",
    "math",
    "physics",
    "literature",
    "english",
    "literature",
    "math",
    "biology",
];

const CYCLE_C = [
    "math",
    "literature",
    "english",
    "physics",
    "math",
    "literature",
    "biology",
    "literature",
];

/** `canThoClasses` đã được sắp xếp ổn định, nên thứ tự mảng là thứ tự ưu tiên. */
const schoolClasses: SchoolClass[] = canThoClasses.filter(
    (item) => item.schoolId === SCHOOL_001,
);

const classOrder = new Map<string, number>(
    schoolClasses.map((item, index) => [item.id, index]),
);

export const classSeq = (classId: string): number =>
    classOrder.get(classId) ?? Number.MAX_SAFE_INTEGER;

/**
 * Chọn lớp được xếp thời khóa biểu: ưu tiên lớp đặc biệt (bán trú, hai
 * buổi, chuyên) rồi tới lớp thường, tới đủ hạn mức của từng cơ sở.
 */
const coveredClasses: SchoolClass[] = (() => {
    const byCampus = new Map<string, SchoolClass[]>();

    for (const classItem of schoolClasses) {
        const list = byCampus.get(classItem.campusId) ?? [];

        list.push(classItem);

        byCampus.set(classItem.campusId, list);
    }

    const picked: SchoolClass[] = [];

    for (const [campusId, list] of byCampus) {
        const quota = TKB_QUOTA_BY_CAMPUS[campusId] ?? 0;

        const special = list.filter(
            (classItem) =>
                classItem.classType !== undefined &&
                classItem.classType !== "REGULAR",
        );

        const regular = list.filter(
            (classItem) => classItem.classType === "REGULAR",
        );

        picked.push(...[...special, ...regular].slice(0, quota));
    }

    return picked;
})();

const padIndex = (value: number): string =>
    String(value).padStart(3, "0");

const roomsByCampus = new Map<string, string[]>();

for (const room of canThoRooms) {
    if (room.schoolId !== SCHOOL_001) {
        continue;
    }

    const list = roomsByCampus.get(room.campusId) ?? [];

    list.push(room.id);

    roomsByCampus.set(room.campusId, list);
}

const campusByClass = new Map(
    schoolClasses.map((item) => [item.id, item.campusId]),
);

interface Slot {
    day: WeekDay;

    period: number;
}

const teacherBusy = new Set<string>();

const classBusy = new Set<string>();

const roomBusy = new Set<string>();

const slotIndex = (
    day: WeekDay,
    period: number,
): number => DAYS.indexOf(day) * PERIODS.length
    + Math.max(0, PERIODS.indexOf(period));

const isFree = (
    slot: Slot,
    classId: string,
    teacherId: string,
    campusId: string,
): boolean => {
    if (classBusy.has(`${classId}|${slot.day}|${slot.period}`)) {
        return false;
    }

    if (teacherBusy.has(`${teacherId}|${slot.day}|${slot.period}`)) {
        return false;
    }

    return (roomsByCampus.get(campusId) ?? []).some((roomId) =>
        !roomBusy.has(`${roomId}|${slot.day}|${slot.period}`));
};

const firstFreeRoom = (
    slot: Slot,
    campusId: string,
    skip: string[] = [],
): string | undefined =>
    (roomsByCampus.get(campusId) ?? []).find((roomId) =>
        !skip.includes(roomId) &&
        !roomBusy.has(`${roomId}|${slot.day}|${slot.period}`));

const claim = (
    entry: Pick<TimetableEntry, "classId" | "teacherId" | "roomId" | "dayOfWeek" | "period">,
): void => {
    classBusy.add(`${entry.classId}|${entry.dayOfWeek}|${entry.period}`);

    teacherBusy.add(`${entry.teacherId}|${entry.dayOfWeek}|${entry.period}`);

    roomBusy.add(`${entry.roomId}|${entry.dayOfWeek}|${entry.period}`);
};

/**
 * Toàn bộ khung tiết trong tuần: buổi sáng 1-5 và buổi chiều 6-10.
 *
 * Khung này dành cho kịch bản cố ý, được xếp sau cùng nên có thể rơi
 * vào bất kỳ ô nào còn trống.
 */
const allSlots = (): Slot[] =>
    DAYS.flatMap((day) =>
        ALL_PERIODS.map((period) => ({ day, period })));

/**
 * Khung tiết buổi sáng.
 *
 * Kế hoạch nền tảng và kế hoạch sinh tự động chỉ quét khung này để giữ
 * nguyên phân bố cũ và không tranh chỗ với kịch bản buổi chiều. Tiết
 * chiều do `buildDayFill` cấp thêm.
 */
const morningSlots = (): Slot[] =>
    DAYS.flatMap((day) =>
        PERIODS.map((period) => ({ day, period })));

/**
 * Tìm ô trống theo thứ tự ưu tiên xoay vòng để lớp không dồn tiết
 * vào cùng một ngày.
 *
 * Mặc định quét khung tiết buổi sáng; truyền `slots` khác để quét khung
 * riêng. `offset` luôn tính trên khung tiết buổi sáng nên thứ tự ưu
 * tiên của kế hoạch không đổi theo khung được quét.
 */
const findFreeSlot = (
    classId: string,
    teacherId: string,
    offset: number,
    slots: Slot[] = morningSlots(),
): Slot | null => {
    const campusId = campusByClass.get(classId) ?? "campus-main";

    const start = slots.length === 0
        ? 0
        : ((offset % slots.length) + slots.length) % slots.length;

    for (let step = 0; step < slots.length; step += 1) {
        const slot = slots[(start + step) % slots.length];

        if (isFree(slot, classId, teacherId, campusId)) {
            return slot;
        }
    }

    return null;
};

/**
 * 31 tiết nền tảng. Giữ nguyên id / lớp / giáo viên / môn / cơ sở vì
 * dữ liệu điểm danh tham chiếu theo id và theo giáo viên + lớp;
 * ô thời gian được xếp lại để bảo đảm thời khóa biểu nền tảng hợp lệ.
 */
const BASE_PLAN: Array<{
    id: string;

    classId: string;

    teacherId: string;

    subjectId: string;
}> = [
    { id: "can-tho-timetable-001", classId: "can-tho-class-001", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-002", classId: "can-tho-class-001", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-003", classId: "can-tho-class-001", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-004", classId: "can-tho-class-002", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-005", classId: "can-tho-class-002", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-006", classId: "can-tho-class-002", teacherId: "can-tho-personnel-002", subjectId: "literature" },

    { id: "can-tho-timetable-007", classId: "can-tho-class-003", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-008", classId: "can-tho-class-003", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-009", classId: "can-tho-class-004", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-010", classId: "can-tho-class-004", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-011", classId: "can-tho-class-003", teacherId: "can-tho-personnel-003", subjectId: "math" },

    { id: "can-tho-timetable-012", classId: "can-tho-class-005", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-013", classId: "can-tho-class-005", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-014", classId: "can-tho-class-006", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-015", classId: "can-tho-class-006", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-016", classId: "can-tho-class-005", teacherId: "can-tho-personnel-004", subjectId: "english" },

    { id: "can-tho-timetable-017", classId: "can-tho-class-007", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-018", classId: "can-tho-class-007", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-019", classId: "can-tho-class-008", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-020", classId: "can-tho-class-008", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-021", classId: "can-tho-class-007", teacherId: "can-tho-personnel-003", subjectId: "math" },

    { id: "can-tho-timetable-022", classId: "can-tho-class-009", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-023", classId: "can-tho-class-009", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-024", classId: "can-tho-class-010", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-025", classId: "can-tho-class-010", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-026", classId: "can-tho-class-009", teacherId: "can-tho-personnel-003", subjectId: "math" },

    { id: "can-tho-timetable-027", classId: "can-tho-class-011", teacherId: "can-tho-personnel-005", subjectId: "physics" },
    { id: "can-tho-timetable-028", classId: "can-tho-class-011", teacherId: "can-tho-personnel-004", subjectId: "english" },
    { id: "can-tho-timetable-029", classId: "can-tho-class-012", teacherId: "can-tho-personnel-002", subjectId: "literature" },
    { id: "can-tho-timetable-030", classId: "can-tho-class-012", teacherId: "can-tho-personnel-003", subjectId: "math" },
    { id: "can-tho-timetable-031", classId: "can-tho-class-011", teacherId: "can-tho-personnel-005", subjectId: "physics" },
];

const buildEntry = (
    id: string,
    classId: string,
    teacherId: string,
    subjectId: string,
    slot: Slot,
    week: number,
): TimetableEntry => {
    const campusId = campusByClass.get(classId) ?? "campus-main";

    const roomId = firstFreeRoom(slot, campusId) ?? "room-main-01";

    return {
        id,
        academicYearId: ACADEMIC_YEAR_ID,
        semesterId: SEMESTER_ID,
        campusId,
        classId,
        teacherId,
        subjectId,
        roomId,
        dayOfWeek: slot.day,
        period: slot.period,
        week,
        status: "PUBLISHED",
        version: 1,
    };
};

const buildBase = (): TimetableEntry[] =>
    BASE_PLAN.map((item, index) => {
        const slot = findFreeSlot(
            item.classId,
            item.teacherId,
            index * 3,
        ) ?? { day: DAYS[index % DAYS.length], period: PERIODS[index % PERIODS.length] };

        const entry = buildEntry(
            item.id,
            item.classId,
            item.teacherId,
            item.subjectId,
            slot,
            0,
        );

        claim(entry);

        return entry;
    });

const statusFor = (
    index: number,
): TimetableEntry["status"] => {
    if (index % 29 === 0) {
        return "DRAFT";
    }

    if (index % 23 === 0) {
        return "CHECKING";
    }

    if (index % 19 === 0) {
        return "PENDING_APPROVAL";
    }

    if (index % 17 === 0) {
        return "ADJUSTING";
    }

    if (index % 13 === 0) {
        return "APPROVED";
    }

    return "PUBLISHED";
};

const buildGenerated = (): TimetableEntry[] => {
    const generated: TimetableEntry[] = [];

    let index = 0;

    coveredClasses.forEach((classItem, classIndex) => {
        const plan: string[] = [
            CYCLE_A[classIndex % CYCLE_A.length],
            CYCLE_B[classIndex % CYCLE_B.length],
        ];

        if (classItem.grade >= 8) {
            plan.push(CYCLE_C[classIndex % CYCLE_C.length]);
        }

        plan.forEach((subjectId, lessonIndex) => {
            const pool = subjectTeachersOf(classItem.campusId, subjectId);

            if (pool.length === 0) {
                return;
            }

            const teacherId = pool[(classIndex + lessonIndex) % pool.length];

            const slot = findFreeSlot(
                classItem.id,
                teacherId,
                slotIndex(
                    DAYS[(classIndex + lessonIndex * 2) % DAYS.length],
                    PERIODS[(classIndex + lessonIndex) % PERIODS.length],
                ),
            );

            if (!slot) {
                return;
            }

            const week = index % 11 === 0 ? 4 : 0;

            const entry = buildEntry(
                `can-tho-timetable-${padIndex(32 + index)}`,
                classItem.id,
                teacherId,
                subjectId,
                slot,
                week,
            );

            claim(entry);

            generated.push({
                ...entry,
                status: statusFor(index),
            });

            index += 1;
        });
    });

    return generated;
};

/**
 * Buổi chiều (tiết 6-10) cho lớp học hai buổi mỗi ngày.
 *
 * Lớp 026 nhận một tiết toán mỗi chiều để giữ hình dạng lịch
 * thực tế. Lớp 027 dồn năm tiết toán vào một ngày: giáo viên phụ
 * trách vốn đã dạy đủ năm tiết sáng nên chạm ngưỡng quá tải
 * (10 tiết/ngày) - đây là kịch bản cố ý để lớp hiển thị thời
 * khóa biểu thể hiện được trạng thái WORKLOAD_STRAIN.
 *
 * Cả hai bộ ba giáo viên - lớp - môn đều chưa có phân công cố định
 * trong học kỳ 1, nên `plannedPeriods` tự đếm lại và
 * `personnelAssignments` sinh khớp hạn mức: không phát sinh thêm
 * xung đột quota hay thiếu phân công.
 */
const buildAfternoonSession = (): TimetableEntry[] => {
    const strain = TIMETABLE_SCENARIOS.workloadStrain;

    const twoSessionClass = TIMETABLE_SCENARIOS.twoSessionClasses[0];

    const plan: Slot[] = DAYS.map((day) => ({
        day,
        period: AFTERNOON_SLOT_PERIODS[0],
    }));

    const strainPlan: Slot[] = AFTERNOON_SLOT_PERIODS.map((period) => ({
        day: strain.dayOfWeek,
        period,
    }));

    const entries: TimetableEntry[] = [];

    const push = (
        id: string,
        classId: string,
        teacherId: string,
        subjectId: string,
        slot: Slot,
    ): void => {
        if (!isFree(slot, classId, teacherId, campusByClass.get(classId) ?? "campus-main")) {
            return;
        }

        const entry = buildEntry(id, classId, teacherId, subjectId, slot, 0);

        claim(entry);

        entries.push(entry);
    };

    plan.forEach((slot, index) => {
        push(
            `can-tho-timetable-a${padIndex(index + 1)}`,
            twoSessionClass,
            "can-tho-personnel-006",
            "math",
            slot,
        );
    });

    strainPlan.forEach((slot, index) => {
        push(
            `can-tho-timetable-a${padIndex(plan.length + index + 1)}`,
            strain.classId,
            strain.teacherId,
            strain.subjectId,
            slot,
        );
    });

    return entries;
};

export const TIMETABLE_SCENARIOS = {
    teacherConflict: [
        "can-tho-timetable-b01",
        "can-tho-timetable-b02",
    ],
    classConflict: [
        "can-tho-timetable-c01",
        "can-tho-timetable-c02",
    ],
    roomConflict: [
        "can-tho-timetable-d01",
        "can-tho-timetable-d02",
    ],
    adjustmentVersion: "can-tho-timetable-v01",
    missingPeriod: {
        teacherId: "can-tho-personnel-005",

        classId: "can-tho-class-055",

        subjectId: "physics",
    },
    exceededPeriod: {
        teacherId: "can-tho-personnel-005",

        classId: "can-tho-class-011",

        subjectId: "physics",
    },
    crossCampus: "can-tho-personnel-002",
    twoSessionClasses: [
        "can-tho-class-026",
        "can-tho-class-027",
    ],
    workloadStrain: {
        teacherId: "can-tho-personnel-003",

        classId: "can-tho-class-027",

        subjectId: "math",

        dayOfWeek: "wednesday",
    },
} as const;

/**
 * Kịch bản cố ý: mỗi tình huống được xếp vào một ô thời gian còn trống
 * để không phát sinh thêm xung đột ngoài dự kiến.
 */
const buildScenarios = (): TimetableEntry[] => {
    const scenarios: TimetableEntry[] = [];

    const slotOpen = (
        classId: string,
        day: WeekDay,
        period: number,
    ): boolean =>
        !classBusy.has(`${classId}|${day}|${period}`);

    const teacherOpen = (
        teacherId: string,
        day: WeekDay,
        period: number,
    ): boolean =>
        !teacherBusy.has(`${teacherId}|${day}|${period}`);

    /**
     * Tìm ô thời gian thoả mọi ràng buộc cùng lúc để kịch bản cố ý
     * không phát sinh thêm xung đột ngoài dự kiến.
     */
    const findSlot = (
        options: {
            classIds: string[];

            teacherIds: string[];

            campusId: string;

            needRooms: number;

            offset: number;
        },
    ): {
        slot: Slot;

        rooms: string[];
    } | null => {
        const slots = allSlots();

        const start = slots.length === 0
            ? 0
            : ((options.offset % slots.length) + slots.length) % slots.length;

        for (let step = 0; step < slots.length; step += 1) {
            const slot = slots[(start + step) % slots.length];

            const classOk = options.classIds.every((classId) =>
                slotOpen(classId, slot.day, slot.period));

            if (!classOk) {
                continue;
            }

            const teacherOk = options.teacherIds.every((teacherId) =>
                teacherOpen(teacherId, slot.day, slot.period));

            if (!teacherOk) {
                continue;
            }

            const rooms = (roomsByCampus.get(options.campusId) ?? [])
                .filter((roomId) =>
                    !roomBusy.has(`${roomId}|${slot.day}|${slot.period}`));

            if (rooms.length < options.needRooms) {
                continue;
            }

            return {
                slot,
                rooms: rooms.slice(0, options.needRooms),
            };
        }

        return null;
    };

    const scenarioEntry = (
        id: string,
        classId: string,
        teacherId: string,
        subjectId: string,
        roomId: string,
        slot: Slot,
    ): TimetableEntry => ({
        id,
        academicYearId: ACADEMIC_YEAR_ID,
        semesterId: SEMESTER_ID,
        campusId: campusByClass.get(classId) ?? "campus-main",
        classId,
        teacherId,
        subjectId,
        roomId,
        dayOfWeek: slot.day,
        period: slot.period,
        week: 0,
        status: "CONFLICT",
        version: 1,
    });

    const pushPair = (first: TimetableEntry, second: TimetableEntry): void => {
        claim(first);
        claim(second);
        scenarios.push(first, second);
    };

    // B. Trùng giáo viên: một giáo viên, hai lớp khác nhau, cùng thứ và tiết.
    const teacherScenario = findSlot({
        classIds: ["can-tho-class-029", "can-tho-class-035"],
        teacherIds: ["can-tho-personnel-006"],
        campusId: campusByClass.get("can-tho-class-029") ?? "campus-main",
        needRooms: 1,
        offset: 3,
    });

    if (teacherScenario) {
        const otherCampus = campusByClass.get("can-tho-class-035") ?? "campus-main";

        const otherRoom = (roomsByCampus.get(otherCampus) ?? []).find((roomId) =>
            !roomBusy.has(`${roomId}|${teacherScenario.slot.day}|${teacherScenario.slot.period}`));

        if (otherRoom) {
            pushPair(
                scenarioEntry(
                    TIMETABLE_SCENARIOS.teacherConflict[0],
                    "can-tho-class-029",
                    "can-tho-personnel-006",
                    "math",
                    teacherScenario.rooms[0],
                    teacherScenario.slot,
                ),
                scenarioEntry(
                    TIMETABLE_SCENARIOS.teacherConflict[1],
                    "can-tho-class-035",
                    "can-tho-personnel-006",
                    "math",
                    otherRoom,
                    teacherScenario.slot,
                ),
            );
        }
    }

    // C. Trùng lớp: một lớp, hai giáo viên và hai phòng, cùng thứ và tiết.
    const classScenario = findSlot({
        classIds: ["can-tho-class-033"],
        teacherIds: [
            "can-tho-personnel-001",
            "can-tho-personnel-005",
        ],
        campusId: campusByClass.get("can-tho-class-033") ?? "campus-main",
        needRooms: 2,
        offset: 7,
    });

    if (classScenario) {
        pushPair(
            scenarioEntry(
                TIMETABLE_SCENARIOS.classConflict[0],
                "can-tho-class-033",
                "can-tho-personnel-001",
                "literature",
                classScenario.rooms[0],
                classScenario.slot,
            ),
            scenarioEntry(
                TIMETABLE_SCENARIOS.classConflict[1],
                "can-tho-class-033",
                "can-tho-personnel-005",
                "physics",
                classScenario.rooms[1],
                classScenario.slot,
            ),
        );
    }

    // D. Trùng phòng: hai lớp, hai giáo viên, dùng chung một phòng học.
    const roomScenario = findSlot({
        classIds: ["can-tho-class-053", "can-tho-class-054"],
        teacherIds: [
            "can-tho-personnel-001",
            "can-tho-personnel-002",
        ],
        campusId: campusByClass.get("can-tho-class-053") ?? "campus-main",
        needRooms: 1,
        offset: 11,
    });

    if (roomScenario) {
        pushPair(
            scenarioEntry(
                TIMETABLE_SCENARIOS.roomConflict[0],
                "can-tho-class-053",
                "can-tho-personnel-001",
                "literature",
                roomScenario.rooms[0],
                roomScenario.slot,
            ),
            scenarioEntry(
                TIMETABLE_SCENARIOS.roomConflict[1],
                "can-tho-class-054",
                "can-tho-personnel-002",
                "literature",
                roomScenario.rooms[0],
                roomScenario.slot,
            ),
        );
    }

    return scenarios;
};

const buildAdjustment = (): TimetableEntry[] => {
    const source = plannedBaseEntries[0];

    if (!source) {
        return [];
    }

    const campusId = campusByClass.get(source.classId) ?? source.campusId;

    /**
     * Phiên bản điều chỉnh giữ nguyên ô thời gian và bộ ba giáo viên -
     * lớp - môn của bản đã xuất bản để tiếp tục điểm danh, chỉ chuyển
     * sang phòng học còn trống tại ô đó. Nếu không còn phòng trống thì
     * giữ nguyên phòng gốc, để phiên bản điều chỉnh luôn được tạo ra
     * thay cho bản đã xuất bản.
     */
    const rooms = (roomsByCampus.get(campusId) ?? []).filter((roomId) =>
        !roomBusy.has(`${roomId}|${source.dayOfWeek}|${source.period}`));

    const roomId = rooms[0] ?? source.roomId;

    const entry: TimetableEntry = {
        id: TIMETABLE_SCENARIOS.adjustmentVersion,
        academicYearId: ACADEMIC_YEAR_ID,
        semesterId: SEMESTER_ID,
        campusId,
        classId: source.classId,
        teacherId: source.teacherId,
        subjectId: source.subjectId,
        roomId,
        dayOfWeek: source.dayOfWeek,
        period: source.period,
        week: source.week,
        status: "ADJUSTING",
        version: 2,
        supersedesId: source.id,
        updatedAt: "2026-09-18T02:15:00",
    };

    claim(entry);

    return [entry];
};

/**
 * Chọn môn và giáo viên cho một tiết bổ sung, bám theo đúng vòng môn mà
 * `buildGenerated` đang dùng cho lớp đó.
 */
const fillLessonOf = (
    classItem: SchoolClass,
    classIndex: number,
    dayIndex: number,
): { subjectId: string; teacherId: string } | null => {
    const plan: string[] = [
        CYCLE_A[classIndex % CYCLE_A.length],
        CYCLE_B[classIndex % CYCLE_B.length],
    ];

    if (classItem.grade >= 8) {
        plan.push(CYCLE_C[classIndex % CYCLE_C.length]);
    }

    for (const subjectId of plan) {
        const pool = subjectTeachersOf(classItem.campusId, subjectId);

        if (pool.length > 0) {
            return {
                subjectId,
                teacherId: pool[(classIndex + dayIndex) % pool.length],
            };
        }
    }

    return null;
};

/**
 * Lấp tiết cho những ngày trong tuần lớp chưa có tiết nào.
 *
 * Kế hoạch nền tảng và kế hoạch sinh tự động bám tiết buổi sáng, nên
 * một lớp có thể trống trọn cột của một ngày. Mỗi lớp được cấp phụ
 * một tiết cho từng ngày còn trống, ưu tiên buổi chiều để dải "Buổi
 * chiều" trên lưới có dữ liệu ở hầu hết lớp thay vì toàn ô trống.
 *
 * Pass chạy sau mọi kịch bản cố ý nên không chiếm ô mà kịch bản cần,
 * và vẫn dùng `isFree` / `claim` sẵn có nên không phát sinh trùng lịch
 * lớp, giáo viên hay phòng.
 */
const buildDayFill = (): TimetableEntry[] => {
    const daysByClass = new Map<string, Set<WeekDay>>();

    for (const key of classBusy) {
        const [classId, day] = key.split("|");

        if (classId === undefined || day === undefined) {
            continue;
        }

        const days = daysByClass.get(classId) ?? new Set<WeekDay>();

        days.add(day as WeekDay);

        daysByClass.set(classId, days);
    }

    const entries: TimetableEntry[] = [];

    let index = 0;

    coveredClasses.forEach((classItem, classIndex) => {
        const days = daysByClass.get(classItem.id) ?? new Set<WeekDay>();

        daysByClass.set(classItem.id, days);

        const campusId = campusByClass.get(classItem.id) ?? "campus-main";

        DAYS.forEach((day, dayIndex) => {
            if (days.has(day)) {
                return;
            }

            const lesson = fillLessonOf(classItem, classIndex, dayIndex);

            if (lesson === null) {
                return;
            }

            // Ưu tiên buổi chiều trước, quay lại toàn khung tiết khi hết.
            let slot: Slot | null = null;

            for (const period of AFTERNOON_SLOT_PERIODS) {
                const candidate: Slot = { day, period };

                if (isFree(candidate, classItem.id, lesson.teacherId, campusId)) {
                    slot = candidate;

                    break;
                }
            }

            if (slot === null) {
                slot = findFreeSlot(
                    classItem.id,
                    lesson.teacherId,
                    slotIndex(
                        day,
                        PERIODS[(classIndex + dayIndex) % PERIODS.length],
                    ),
                );
            }

            if (slot === null) {
                return;
            }

            const entry = buildEntry(
                `can-tho-timetable-f${padIndex(index + 1)}`,
                classItem.id,
                lesson.teacherId,
                lesson.subjectId,
                slot,
                0,
            );

            claim(entry);

            days.add(day);

            entries.push({
                ...entry,
                status: statusFor(index),
            });

            index += 1;
        });
    });

    return entries;
};

export const plannedBaseEntries: TimetableEntry[] = buildBase();

export const plannedGeneratedEntries: TimetableEntry[] = buildGenerated();

export const plannedAfternoonEntries: TimetableEntry[] =
    buildAfternoonSession();

export const plannedAdjustmentEntries: TimetableEntry[] = buildAdjustment();

export const plannedScenarioEntries: TimetableEntry[] = buildScenarios();

/**
 * Pass lấp ngày trống đặt cuối danh sách: mọi kịch bản cố ý đã chiếm
 * ô của mình trước, nên tiết bổ sung không làm lệch bất kỳ kịch bản
 * nào.
 */
export const plannedDayFillEntries: TimetableEntry[] = buildDayFill();

export const plannedTimetables: TimetableEntry[] = [
    ...plannedBaseEntries,
    ...plannedGeneratedEntries,
    ...plannedAfternoonEntries,
    ...plannedAdjustmentEntries,
    ...plannedScenarioEntries,
    ...plannedDayFillEntries,
];

const winners = new Map<string, TimetableEntry>();

for (const entry of plannedTimetables) {
    const rootId = entry.supersedesId ?? entry.id;

    const current = winners.get(rootId);

    if (!current || entry.version > current.version) {
        winners.set(rootId, entry);
    }
}

const periodsByTriple = new Map<string, number>();

for (const entry of winners.values()) {
    const key = [entry.teacherId, entry.classId, entry.subjectId].join("|");

    periodsByTriple.set(key, (periodsByTriple.get(key) ?? 0) + 1);
}

export const plannedPeriods: Array<{
    teacherId: string;

    classId: string;

    subjectId: string;

    periodsPerWeek: number;
}> = [...periodsByTriple.entries()].map(([key, periodsPerWeek]) => {
    const [teacherId, classId, subjectId] = key.split("|");

    return {
        teacherId,
        classId,
        subjectId,
        periodsPerWeek,
    };
});

export const plannedCampusByClass = campusByClass;

export const plannedClasses = schoolClasses;
