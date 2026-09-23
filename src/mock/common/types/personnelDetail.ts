export type PersonnelAssignmentStatus =
    | "active"
    | "inactive";

export interface PersonnelAssignment {
    id: string;

    personnelId: string;

    campusId: string;

    classId: string;

    subjectId: string;

    academicYear: string;

    semester: 1 | 2;

    periodsPerWeek: number;

    status: PersonnelAssignmentStatus;
}

export type PersonnelCompetitionLevel =
    | "truong"
    | "quan"
    | "thanh_pho"
    | "bo_gddt";

export interface PersonnelCompetition {
    id: string;

    personnelId: string;

    name: string;

    academicYear: string;

    level: PersonnelCompetitionLevel;

    subjectId: string;

    result: string;

    award: string;

    evidence?: string;
}

export type PersonnelRewardLevel =
    | "truong"
    | "quan"
    | "thanh_pho"
    | "bo_gddt";

export interface PersonnelReward {
    id: string;

    personnelId: string;

    title: string;

    awardType: string;

    academicYear: string;

    decisionNo: string;

    decisionDate: string;

    level: PersonnelRewardLevel;

    evidence?: string;
}

export interface PersonnelWorkHistory {
    id: string;

    personnelId: string;

    startDate: string;

    endDate?: string;

    campusId: string;

    positionTitle: string;

    subjectIds?: string[];

    decisionNo?: string;

    note?: string;
}

export type PersonnelHistoryEventType =
    | "created"
    | "updated"
    | "status_changed"
    | "assignment_added";

export interface PersonnelHistoryEntry {
    id: string;

    personnelId: string;

    type: PersonnelHistoryEventType;

    actor: string;

    content: string;

    createdAt: string;
}