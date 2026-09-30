export {
    STATUS_FLOW,
    STATUS_ORDER,
    canTransit,
    describeTransition,
    isEditableStatus,
    nextStatus,
    nextStatusLabel,
} from "./status";

export type {
    TimetableChangeLog,
    TimetableConflict,
    TimetableConflictType,
    TimetableQuota,
    TimetableSuggestion,
} from "@/mock/common/types";

export type {
    DetectConflictContext,
    PlacementContext,
    TimetableQuotaSource,
} from "./conflicts";

export {
    buildChangeLog,
    computeQuotaUsage,
    detectAssignmentCoverage,
    detectConflicts,
    detectCrossCampusTeaching,
    detectMissingQuota,
    sortConflicts,
    suggestFreeSlots,
    validatePlacement,
    weeksOverlap,
} from "./conflicts";
