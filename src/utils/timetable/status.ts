import type {
    TimetableEntry,
    TimetableEntryStatus,
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