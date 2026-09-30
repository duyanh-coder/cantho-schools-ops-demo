import type {
    Semester,
    TimetableConflict,
    TimetableEntry,
    TimetablePeriod,
    TimetableSession,
    WeekDay,
} from "@/mock/common/types";

import {
    DAY_LABELS,
    PERIOD_TIME,
    SESSION_LABELS,
    SESSION_ORDER,
    WEEKDAY_ORDER,
    periodsBySession,
    periodSession,
    periodTimes,
} from "@/mock/common/types";

import type {
    TimetableCalendarDay,
    TimetableCalendarFilters,
    TimetableEvent,
    TimetableSessionBlock,
    TimetableSlot,
} from "./types";

import type {
    TimetableCalendarLookups,
} from "./lookups";

import {
    subjectTone,
} from "./lookups";

import {
    detectCalendarConflicts,
    sortConflicts,
} from "@/utils/timetable";

import type {
    DetectConflictContext,
} from "@/utils/timetable";

/**
 * Dựng danh sách xung đột đã sắp xếp từ phạm vi tiết mà màn hình đang
 * hiển thị. Gom lại để mọi màn dùng cùng một quy tắc, không màn nào
 * quên sắp xếp hoặc bỏ sót ngữ cảnh phụ trợ.
 */
export const buildCalendarConflicts = (
    entries: TimetableEntry[],
    context: DetectConflictContext = {},
): TimetableConflict[] => sortConflicts(
    detectCalendarConflicts(entries, context),
);

/**
 * Ngày học trong tuần. Từ THCS đến THPT, thứ Bảy là ngày học như các
 * ngày khác; chỉ Chủ nhật không nằm trong lưới thời khóa biểu tuần học.
 */
export const CALENDAR_DAYS: WeekDay[] = WEEKDAY_ORDER.filter((day) =>
    day !== "sunday");

export const slotKey = (
    day: WeekDay,
    period: number,
): string => `${day}|${period}`;

export const dayLabel = (
    day: WeekDay,
): string => DAY_LABELS[day] ?? day;

const toIsoDate = (
    date: Date,
): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Ngày dương lịch của ngày dương lịch, giữ đúng múi giờ cục bộ.
 */
export const startOfLocalDay = (
    value: Date,
): Date => new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
);

const addDays = (
    value: Date,
    days: number,
): Date => {
    const next = new Date(value.getFullYear(), value.getMonth(), value.getDate());

    next.setDate(next.getDate() + days);

    return next;
};

const startOfFirstWeek = (
    semester: Semester,
): Date => {
    const [year, month, day] = semester.startDate
        .split("-")
        .map((part) => Number.parseInt(part, 10));

    const start = new Date(year, (month ?? 1) - 1, day ?? 1);

    /**
     * Tuần học thứ nhất bắt đầu từ thứ Hai đầu tiên kể từ ngày bắt
     * đầu học kỳ: `8 - dow` cho ra số ngày cần cộng thêm.
     */
    const daysUntilMonday = (8 - start.getDay()) % 7;

    return addDays(start, daysUntilMonday);
};

/**
 * Tuần đang áp dụng. `0` hoặc `undefined` nghĩa là lịch lặp hằng tuần
 * nên lấy tuần hiện hành, tuyệt đối không để lọc tuần rơi về tuần 1
 * của danh sách chọn.
 */
export const resolveCalendarWeek = (
    week: number | undefined,
    currentWeek: number,
): number => (week && week > 0 ? week : currentWeek);

/**
 * Ngày dương lịch của các ngày trong một tuần học. Tuần 1 là tuần
 * chứa ngày khai giảng, nên học kỳ bắt đầu giữa tuần vẫn xếp đúng.
 */
export const datesOfWeek = (
    semester: Semester | undefined,
    week: number,
): Date[] => {
    if (!semester || week <= 0) {
        return [];
    }

    const first = addDays(startOfFirstWeek(semester), (week - 1) * 7);

    return CALENDAR_DAYS.map((_day, index) => addDays(first, index));
};

/**
 * Số tuần học chứa ngày đang xét, hoặc `null` khi ngoài học kỳ.
 */
export const weekOfDate = (
    semester: Semester | undefined,
    value: Date,
): number | null => {
    if (!semester) {
        return null;
    }

    const first = startOfFirstWeek(semester);

    const diff = startOfLocalDay(value).getTime() - first.getTime();

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    const week = Math.floor(days / 7) + 1;

    const total = weekCountOfSemester(semester);

    return week >= 1 && week <= total ? week : null;
};

/**
 * Số tuần học của một học kỳ, tối thiểu 1 để lịch luôn hiển thị được.
 */
export const weekCountOfSemester = (
    semester: Semester,
): number => {
    const [endYear, endMonth, endDay] = semester.endDate
        .split("-")
        .map((part) => Number.parseInt(part, 10));

    const end = new Date(endYear, (endMonth ?? 1) - 1, endDay ?? 1);

    const first = startOfFirstWeek(semester);

    const days = Math.floor(
        (end.getTime() - first.getTime()) / (24 * 60 * 60 * 1000),
    );

    return Math.max(1, Math.floor(days / 7) + 1);
};

export const weekRangeLabel = (
    semester: Semester | undefined,
    week: number,
): string => {
    const dates = datesOfWeek(semester, week);

    const first = dates[0];
    const last = dates[dates.length - 1];

    if (!first || !last) {
        return `Tuần ${week}`;
    }

    const format = (date: Date): string =>
        `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1,
        ).padStart(2, "0")}`;

    return `Tuần ${week} · ${format(first)} - ${format(last)}`;
};

export const buildCalendarDays = (
    semester: Semester | undefined,
    week: number,
    today: Date,
): TimetableCalendarDay[] => {
    const dates = datesOfWeek(semester, week);

    const todayIso = toIsoDate(today);

    return CALENDAR_DAYS.map((day, index) => {
        const date = dates[index];

        return {
            day,
            label: dayLabel(day),
            date: date ? toIsoDate(date) : "",
            dateLabel: date
                ? `${String(date.getDate()).padStart(2, "0")}/${String(
                    date.getMonth() + 1,
                ).padStart(2, "0")}`
                : "",
            isToday: date ? toIsoDate(date) === todayIso : false,
        };
    });
};

/**
 * Tiết có `week = 0` là lịch lặp hằng tuần nên khớp mọi tuần.
 */
export const weekMatches = (
    entry: TimetableEntry,
    week: number,
): boolean => week <= 0 || entry.week === 0 || entry.week === week;

/**
 * Bộ lọc rỗng nghĩa là không giới hạn: chỉ so khi lọc có giá trị.
 */
const matchesValue = (
    value: string | number | undefined,
    filter: string | number | undefined,
): boolean => filter === undefined || filter === "" || value === filter;

export const applyCalendarFilters = (
    entries: TimetableEntry[],
    filters: TimetableCalendarFilters = {},
    lookups?: TimetableCalendarLookups,
    week = 0,
): TimetableEntry[] =>
    entries.filter((entry) => {
        if (filters.academicYearId && entry.academicYearId !== filters.academicYearId) {
            return false;
        }

        if (filters.semesterId && entry.semesterId !== filters.semesterId) {
            return false;
        }

        if (!matchesValue(entry.campusId, filters.campusId)) {
            return false;
        }

        if (!matchesValue(entry.classId, filters.classId)) {
            return false;
        }

        if (!matchesValue(entry.teacherId, filters.teacherId)) {
            return false;
        }

        if (!matchesValue(entry.subjectId, filters.subjectId)) {
            return false;
        }

        if (!matchesValue(entry.roomId, filters.roomId)) {
            return false;
        }

        if (
            filters.session !== undefined &&
            periodSession(entry.period) !== filters.session
        ) {
            return false;
        }

        if (
            filters.dayOfWeek !== undefined &&
            entry.dayOfWeek !== filters.dayOfWeek
        ) {
            return false;
        }

        if (
            filters.grade !== undefined &&
            lookups?.classById.get(entry.classId)?.grade !== filters.grade
        ) {
            return false;
        }

        return weekMatches(entry, week);
    });

export const toTimetableEvent = (
    entry: TimetableEntry,
    lookups: TimetableCalendarLookups,
    conflicts: TimetableConflict[] = [],
): TimetableEvent => {
    const time = periodTimes(entry.period);

    const kinds = [
        ...new Set(
            conflicts
                .filter((conflict) =>
                    conflict.rows.some((row) => row.id === entry.id))
                .map((conflict) => conflict.type),
        ),
    ];

    return {
        id: entry.id,
        entry,
        academicYearId: entry.academicYearId,
        semesterId: entry.semesterId,
        campusId: entry.campusId,
        campusName: lookups.campusName(entry.campusId),
        classId: entry.classId,
        className: lookups.className(entry.classId),
        grade: lookups.classById.get(entry.classId)?.grade,
        teacherId: entry.teacherId,
        teacherName: lookups.teacherName(entry.teacherId),
        subjectId: entry.subjectId,
        subjectName: lookups.subjectName(entry.subjectId),
        colorTone: subjectTone(entry.subjectId),
        roomId: entry.roomId,
        roomCode: lookups.roomCode(entry.roomId),
        dayOfWeek: entry.dayOfWeek,
        period: entry.period,
        session: time.session,
        startTime: time.startTime,
        endTime: time.endTime,
        week: entry.week,
        status: entry.status,
        conflicts: kinds,
    };
};

export const toTimetableEvents = (
    entries: TimetableEntry[],
    lookups: TimetableCalendarLookups,
    conflicts: TimetableConflict[] = [],
): TimetableEvent[] =>
    entries.map((entry) => toTimetableEvent(entry, lookups, conflicts));

export const groupEventsBySlot = (
    events: TimetableEvent[],
): Map<string, TimetableEvent[]> => {
    const bySlot = new Map<string, TimetableEvent[]>();

    for (const event of events) {
        const key = slotKey(event.dayOfWeek, event.period);

        const bucket = bySlot.get(key) ?? [];

        bucket.push(event);

        bySlot.set(key, bucket);
    }

    return bySlot;
};

export const groupConflictsBySlot = (
    conflicts: TimetableConflict[],
): Map<string, TimetableConflict[]> => {
    const bySlot = new Map<string, TimetableConflict[]>();

    for (const conflict of conflicts) {
        const key = slotKey(conflict.dayOfWeek, conflict.period);

        const bucket = bySlot.get(key) ?? [];

        bucket.push(conflict);

        bySlot.set(key, bucket);
    }

    return bySlot;
};

/**
 * Bố cục lưới là cố định theo khung tiết chuẩn, không co lại theo dữ
 * liệu: dải "Buổi sáng" luôn nằm trên tiết 1-5 và dải "Buổi chiều"
 * luôn nằm trên tiết 6-10. Nhờ vậy mọi lớp - kể cả lớp chỉ học sáng -
 * dùng chung một lưới, và tiết số không bị đánh lại theo dữ liệu.
 *
 * Khi người dùng lọc theo buổi thì chỉ dựng buổi đang chọn với đủ tiết
 * của buổi đó. Không có tiết nào thì trả về mảng rỗng để tầng hiển
 * thị dùng trạng thái rỗng kèm nút xoá bộ lọc thay vì một bảng toàn
 * ô trống.
 */
export const deriveSessionBlocks = (
    events: TimetableEvent[],
    sessionFilter?: TimetableSession,
): TimetableSessionBlock[] => {
    if (events.length === 0) {
        return [];
    }

    const sessions = sessionFilter === undefined
        ? SESSION_ORDER
        : SESSION_ORDER.filter((session) => session === sessionFilter);

    return sessions.map((session) => ({
        session,
        label: SESSION_LABELS[session],
        periods: periodsBySession(session),
    }));
};

export const hasSchedule = (
    events: TimetableEvent[],
): boolean => events.length > 0;

export const periodLabel = (
    period: number,
): string => {
    const item = PERIOD_TIME.find((value) => value.period === period);

    return item
        ? `Tiết ${period} · ${item.startTime}-${item.endTime}`
        : `Tiết ${period}`;
};

export const slotLabel = (
    slot: TimetableSlot,
): string => `${dayLabel(slot.day)} · ${periodLabel(slot.period)}`;

export const sessionOfPeriod = (
    period: number,
): TimetableSession => periodTimes(period).session;

export const periodsOfSession = (
    session: TimetableSession,
): TimetablePeriod[] => periodsBySession(session);

/**
 * Tiết đang diễn ra vào thời điểm `now`, chỉ khi thời điểm đó rơi vào
 * tuần đang xem.
 */
export const currentSlotAt = (
    now: Date,
    days: TimetableCalendarDay[],
): {
    day: WeekDay;
    period: number;
    progress: number;
    label: string;
} | null => {
    const minutes = now.getHours() * 60 + now.getMinutes();

    const label = `${String(now.getHours()).padStart(2, "0")}:${
        String(now.getMinutes()).padStart(2, "0")
    }`;

    for (const item of days) {
        if (!item.isToday) {
            continue;
        }

        for (const period of PERIOD_TIME) {
            const [startHour, startMinute] = period.startTime
                .split(":")
                .map((part) => Number.parseInt(part, 10));

            const [endHour, endMinute] = period.endTime
                .split(":")
                .map((part) => Number.parseInt(part, 10));

            const start = (startHour ?? 0) * 60 + (startMinute ?? 0);
            const end = (endHour ?? 0) * 60 + (endMinute ?? 0);

            if (minutes < start || minutes > end) {
                continue;
            }

            return {
                day: item.day,
                period: period.period,
                label,
                progress: end === start
                    ? 0
                    : Math.min(1, Math.max(0, (minutes - start) / (end - start))),
            };
        }

        return null;
    }

    return null;
};

/**
 * Phạm vi dùng để dựng danh sách lựa chọn của bộ lọc: các tiết sau khi
 * áp phạm vi cố định của ngữ cảnh (học kỳ, tuần, buổi, cơ sở, khối,
 * giáo viên) nhưng bỏ chính lớp/môn/phòng đang chọn, nếu không thì danh
 * sách sẽ tự thu hẹp theo lựa chọn hiện tại và không còn cách bỏ chọn.
 */
export const optionScopeOf = (
    entries: TimetableEntry[],
    filters: TimetableCalendarFilters,
    lookups: TimetableCalendarLookups,
    week = 0,
): TimetableEntry[] => applyCalendarFilters(
    entries,
    {
        academicYearId: filters.academicYearId,
        semesterId: filters.semesterId,
        session: filters.session,
        dayOfWeek: filters.dayOfWeek,
        campusId: filters.campusId,
        grade: filters.grade,
        teacherId: filters.teacherId,
    },
    lookups,
    week,
);

export interface CalendarFilterScope {
    grades: Set<number>;

    classIds: Set<string>;

    subjectIds: Set<string>;

    roomIds: Set<string>;
}

export const filterScopeOf = (
    scope: TimetableEntry[],
    lookups: TimetableCalendarLookups,
): CalendarFilterScope => {
    const scopeIds: CalendarFilterScope = {
        grades: new Set<number>(),
        classIds: new Set<string>(),
        subjectIds: new Set<string>(),
        roomIds: new Set<string>(),
    };

    for (const entry of scope) {
        const grade = lookups.classById.get(entry.classId)?.grade;

        if (grade !== undefined) {
            scopeIds.grades.add(grade);
        }

        scopeIds.classIds.add(entry.classId);
        scopeIds.subjectIds.add(entry.subjectId);
        scopeIds.roomIds.add(entry.roomId);
    }

    return scopeIds;
};

/**
 * Bỏ lựa chọn khối/lớp/môn/phòng không còn tồn tại trong phạm vi hiện
 * tại, ví dụ khi đổi cơ sở, đổi tuần hoặc đổi buổi. Trả về chính đối
 * tượng cũ khi không có gì thay đổi để tránh vòng lặp render.
 */
export const normalizeCalendarFilters = (
    filters: TimetableCalendarFilters,
    scope: CalendarFilterScope,
): TimetableCalendarFilters => {
    const next = { ...filters };

    let changed = false;

    if (next.grade !== undefined && !scope.grades.has(next.grade)) {
        next.grade = undefined;

        changed = true;
    }

    for (const key of [
        "classId",
        "subjectId",
        "roomId",
    ] as const) {
        const value = next[key];

        if (!value) {
            continue;
        }

        const set = key === "classId"
            ? scope.classIds
            : key === "subjectId"
                ? scope.subjectIds
                : scope.roomIds;

        if (!set.has(value)) {
            next[key] = undefined;

            changed = true;
        }
    }

    return changed ? next : filters;
};
