import type {
    TimetableEntry,
    TimetableEntryStatus,
} from "@/mock/common/types";

import {
    STATUS_LABELS,
} from "@/mock/common/types";


export const STATUS_FLOW: Record<TimetableEntryStatus, TimetableEntryStatus[]> = {
    DRAFT: ["CHECKING"],
    CHECKING: ["APPROVED", "CONFLICT", "ADJUSTING"],
    CONFLICT: ["ADJUSTING"],
    ADJUSTING: ["CHECKING"],
    PENDING_APPROVAL: ["APPROVED", "ADJUSTING"],
    APPROVED: ["PUBLISHED", "ADJUSTING"],
    PUBLISHED: ["ADJUSTING"],
};

export const STATUS_ORDER: TimetableEntryStatus[] = [
    "DRAFT",
    "CHECKING",
    "PENDING_APPROVAL",
    "APPROVED",
    "PUBLISHED",
    "ADJUSTING",
    "CONFLICT",
];

export const canTransit = (
    from: TimetableEntryStatus,
    to: TimetableEntryStatus,
): boolean => {
    if (from === to) {
        return true;
    }

    return (STATUS_FLOW[from] ?? []).includes(to);
};

export const nextStatus = (
    entry: TimetableEntry,
): TimetableEntryStatus | undefined => {
    return (STATUS_FLOW[entry.status] ?? [])[0];
};

export const isEditableStatus = (
    status: TimetableEntryStatus,
): boolean =>
    status === "DRAFT" ||
    status === "ADJUSTING" ||
    status === "CONFLICT";

export const describeTransition = (
    from: TimetableEntryStatus,
    to: TimetableEntryStatus,
): string => {
    if (from === to) {
        return `Giữ nguyên trạng thái ${STATUS_LABELS[to]}.`;
    }

    if (from === "PUBLISHED") {
        return `Tạo phiên bản điều chỉnh mới thay vì sửa trực tiếp bản đã xuất bản (${STATUS_LABELS[to]}).`;
    }

    if (to === "PUBLISHED") {
        return `Công bố ${STATUS_LABELS[from]} để giáo viên và học sinh nhìn thấy.`;
    }

    if (to === "CONFLICT") {
        return `Đánh dấu xung đột khi phát hiện lỗi trong ${STATUS_LABELS[from]}.`;
    }

    if (to === "APPROVED") {
        return `Phê duyệt ${STATUS_LABELS[from]} khi không còn xung đột.`;
    }

    if (to === "ADJUSTING") {
        return `Chuyển ${STATUS_LABELS[from]} sang chỉnh sửa để xử lý vấn đề.`;
    }

    return `Chuyển từ ${STATUS_LABELS[from]} sang ${STATUS_LABELS[to]}.`;
};

export const nextStatusLabel = (
    status: TimetableEntryStatus,
): string => {
    const next = (STATUS_FLOW[status] ?? [])[0];

    return next ? STATUS_LABELS[next] : "Không có";
};
