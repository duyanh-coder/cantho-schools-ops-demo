export interface TeacherAward {
    id: string;

    teacherId: string;

    schoolId: string;

    type: "good_teaching" | "creative_teaching" | "emulation_fighter" | "commendation" | "other";

    level: "school" | "district" | "city" | "province" | "national";

    title: string;

    academicYear: string;

    decisionNumber?: string;

    date: string;

    note?: string;
}