export interface DayOption {
    key: string;

    label: string;

    date: string;
}

export interface OverviewSeriesItem {
    label: string;

    value: number;
}

export interface CampusStatusItem {
    id: string;

    code: string;

    name: string;

    todayLessons: number;

    isActive: boolean;
}

export interface StaffStatsItem {
    present: number;

    late: number;

    absent: number;
}