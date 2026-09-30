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

    version: number;

    supersedesId?: string;

    updatedAt?: string;
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

export type TimetableHistoryAction =
    | "created"
    | "updated"
    | "moved"
    | "teacher_changed"
    | "room_changed"
    | "deleted"
    | "status_changed"
    | "conflict_detected"
    | "conflict_resolved"
    | "published";

export const HISTORY_ACTION_LABELS: Record<TimetableHistoryAction, string> = {
    created: "Tạo tiết",
    updated: "Cập nhật tiết",
    moved: "Đổi thời gian",
    teacher_changed: "Đổi giáo viên",
    room_changed: "Đổi phòng",
    deleted: "Xóa tiết",
    status_changed: "Đổi trạng thái",
    conflict_detected: "Phát hiện xung đột",
    conflict_resolved: "Xử lý xung đột",
    published: "Công bố",
};

export const HISTORY_ACTION_TONES: Record<TimetableHistoryAction, string> = {
    created: "green",
    updated: "blue",
    moved: "purple",
    teacher_changed: "cyan",
    room_changed: "geekblue",
    deleted: "red",
    status_changed: "orange",
    conflict_detected: "red",
    conflict_resolved: "green",
    published: "gold",
};

export interface TimetableHistoryEntry {
    id: string;

    entryId: string;

    academicYearId: string;

    semesterId: string;

    campusId: string;

    classId: string;

    action: TimetableHistoryAction;

    actor: string;

    reason?: string;

    before?: Partial<TimetableEntry>;

    after?: Partial<TimetableEntry>;

    createdAt: string;
}

export type TimetableConflictType =
    | "teacher_conflict"
    | "class_conflict"
    | "room_conflict"
    | "quota_exceeded"
    | "quota_missing"
    | "assignment_missing"
    | "campus_mismatch"
    | "capacity_exceeded";

export const CONFLICT_TYPE_LABELS: Record<TimetableConflictType, string> = {
    teacher_conflict: "Trùng giáo viên",
    class_conflict: "Trùng lớp",
    room_conflict: "Trùng phòng",
    quota_exceeded: "Vượt số tiết phân công",
    quota_missing: "Thiếu tiết so với phân công",
    assignment_missing: "Thiếu phân công giảng dạy",
    campus_mismatch: "Sai cơ sở",
    capacity_exceeded: "Vượt sức chứa phòng",
};

export const CONFLICT_TYPE_TONES: Record<TimetableConflictType, string> = {
    teacher_conflict: "red",
    class_conflict: "volcano",
    room_conflict: "magenta",
    quota_exceeded: "orange",
    quota_missing: "gold",
    assignment_missing: "purple",
    campus_mismatch: "cyan",
    capacity_exceeded: "lime",
};

export interface TimetableSuggestion {
    dayOfWeek: WeekDay;

    period: number;

    roomId: string;

    teacherId: string;

    score: number;

    note: string;
}

export interface TimetableConflict {
    type: TimetableConflictType;

    dayOfWeek: WeekDay;

    period: number;

    week: number;

    rows: TimetableEntry[];

    message: string;

    cause: string;

    resolution: string;
}

export interface TimetableQuota {
    teacherId: string;

    classId: string;

    subjectId: string;

    standard: number;

    assigned: number;
}

export interface TimetableChangeLog {
    entryId: string;

    conflicts: TimetableConflict[];

    suggestions: TimetableSuggestion[];
}