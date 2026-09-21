export interface BoardingRecord {
    id: string;

    schoolId: string;

    campusId: string;

    grade: number;

    academicYear: string;

    twoSessionCount: number;

    boardingCount: number;

    lunchCount: number;

    snackCount: number;

    note?: string;

    status: "active" | "inactive";
}