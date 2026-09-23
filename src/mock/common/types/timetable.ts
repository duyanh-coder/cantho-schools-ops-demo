export type WeekDay =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export type TimetableEntryStatus =
    | "DRAFT"
    | "CHECKING"
    | "CONFLICT"
    | "ADJUSTING"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "PUBLISHED";

export interface TimetableEntry {
    id: string;

    academicYearId: string;

    semesterId: string;

    campusId: string;

    classId: string;

    teacherId: string;

    subjectId: string;

    roomId: string;

    dayOfWeek: WeekDay;

    period: number;

    week: number;

    status: TimetableEntryStatus;

    assignmentId?: string;
}

export interface TimetablePeriod {
    period: number;

    startTime: string;

    endTime: string;
}

export const PERIOD_TIME: TimetablePeriod[] = [
    { period: 1, startTime: "07:00", endTime: "07:45" },
    { period: 2, startTime: "07:50", endTime: "08:35" },
    { period: 3, startTime: "08:40", endTime: "09:25" },
    { period: 4, startTime: "09:30", endTime: "10:15" },
    { period: 5, startTime: "10:20", endTime: "11:05" },
];

export const periodTimes = (
    period: number,
): TimetablePeriod => {
    return PERIOD_TIME.find((item) => item.period === period)
        ?? PERIOD_TIME[0];
};

export const DAY_LABELS: Record<WeekDay, string> = {
    monday: "Thứ Hai",
    tuesday: "Thứ Ba",
    wednesday: "Thứ Tư",
    thursday: "Thứ Năm",
    friday: "Thứ Sáu",
    saturday: "Thứ Bảy",
    sunday: "Chủ nhật",
};

export const WEEKDAY_ORDER: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

export const STATUS_LABELS: Record<TimetableEntryStatus, string> = {
    DRAFT: "Nháp",
    CHECKING: "Chờ duyệt",
    CONFLICT: "Xung đột",
    ADJUSTING: "Đang chỉnh sửa",
    PENDING_APPROVAL: "Chờ phê duyệt",
    APPROVED: "Đã duyệt",
    PUBLISHED: "Đã xuất bản",
};

export const STATUS_TONES: Record<TimetableEntryStatus, string> = {
    DRAFT: "default",
    CHECKING: "blue",
    CONFLICT: "red",
    ADJUSTING: "orange",
    PENDING_APPROVAL: "purple",
    APPROVED: "green",
    PUBLISHED: "gold",
};