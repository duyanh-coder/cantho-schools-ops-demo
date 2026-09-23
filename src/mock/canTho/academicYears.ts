import type {
    AcademicYear,
    Semester,
} from "../common/types";

export const canThoAcademicYears: AcademicYear[] = [
    {
        id: "2025-2026",
        schoolId: "can-tho-school-001",
        code: "NH-2025-2026",
        name: "Năm học 2025 - 2026",
        startDate: "2025-09-05",
        endDate: "2026-05-30",
        status: "CLOSED",
    },
    {
        id: "2026-2027",
        schoolId: "can-tho-school-001",
        code: "NH-2026-2027",
        name: "Năm học 2026 - 2027",
        startDate: "2026-09-05",
        endDate: "2027-05-30",
        status: "ACTIVE",
    },
    {
        id: "2027-2028",
        schoolId: "can-tho-school-001",
        code: "NH-2027-2028",
        name: "Năm học 2027 - 2028",
        startDate: "2027-09-05",
        endDate: "2028-05-30",
        status: "DRAFT",
    },
];

export const canThoSemesters: Semester[] = [
    {
        id: "2025-2026-HK1",
        academicYearId: "2025-2026",
        code: "HK1",
        name: "Học kỳ 1",
        startDate: "2025-09-05",
        endDate: "2025-12-31",
        status: "CLOSED",
    },
    {
        id: "2025-2026-HK2",
        academicYearId: "2025-2026",
        code: "HK2",
        name: "Học kỳ 2",
        startDate: "2026-01-05",
        endDate: "2026-05-30",
        status: "CLOSED",
    },
    {
        id: "2026-2027-HK1",
        academicYearId: "2026-2027",
        code: "HK1",
        name: "Học kỳ 1",
        startDate: "2026-09-05",
        endDate: "2026-12-31",
        status: "ACTIVE",
    },
    {
        id: "2026-2027-HK2",
        academicYearId: "2026-2027",
        code: "HK2",
        name: "Học kỳ 2",
        startDate: "2027-01-05",
        endDate: "2027-05-30",
        status: "ACTIVE",
    },
];