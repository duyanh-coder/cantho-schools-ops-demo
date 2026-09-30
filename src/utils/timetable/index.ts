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
    WorkloadStrainOptions,
} from "./conflicts";

export {
    DEFAULT_MAX_CONSECUTIVE_PER_SESSION,
    DEFAULT_MAX_PERIODS_PER_DAY,
    buildChangeLog,
    computeQuotaUsage,
    detectAssignmentCoverage,
    detectCalendarConflicts,
    detectConflicts,
    detectCrossCampusTeaching,
    detectMissingQuota,
    detectWorkloadStrain,
    sortConflicts,
    suggestFreeSlots,
    validatePlacement,
    weeksOverlap,
} from "./conflicts";
