export const SCHOOL_FOCUS = {
    id: "can-tho-school-001",

    name: "Trường THCS Ninh Kiều",

    gisWardId: "can-tho-31135",

    academicYear: "2026-2027",

    grades: [6, 7, 8, 9],
} as const;

export const WARD_FOCUS = {
    id: "can-tho-ward-001",

    name: "Phường Ninh Kiều",

    gisWardId: SCHOOL_FOCUS.gisWardId,
} as const;