import {
    canThoCampuses,
} from "./campuses";

import {
    canThoClasses,
} from "./classes";


export interface SchoolGradeCount {
    grade: number;

    count: number;
}

export interface SchoolPersonnelStats {
    total: number;

    teachers: number;

    managers: number;

    staff: number;

    male: number;

    female: number;
}

export interface SchoolStudentsStats {
    total: number;

    grades: SchoolGradeCount[];

    male: number;

    female: number;
}

export interface SchoolOverviewStats {
    schoolId: string;

    academicYear: string;

    personnel: SchoolPersonnelStats;

    students: SchoolStudentsStats;

    campuses: {
        total: number;

        headquarters: number;

        branches: number;
    };

    classes: {
        total: number;

        grades: SchoolGradeCount[];
    };
}

const SCHOOL_001 = "can-tho-school-001";

const ACADEMIC_YEAR = "2026-2027";

const campusCountsOfSchool = (
    schoolId: string,
): { total: number; headquarters: number; branches: number } => {
    const campuses = canThoCampuses.filter(
        (campus) => campus.schoolId === schoolId,
    );

    return {
        total: campuses.length,
        headquarters: campuses.filter((campus) => campus.isMainCampus).length,
        branches: campuses.filter((campus) => !campus.isMainCampus).length,
    };
};

const classCountsOfSchool = (
    schoolId: string,
): { total: number; grades: SchoolGradeCount[] } => {
    const gradeMap = new Map<number, number>();

    for (const classItem of canThoClasses) {
        if (classItem.schoolId !== schoolId) {
            continue;
        }

        gradeMap.set(
            classItem.grade,
            (gradeMap.get(classItem.grade) ?? 0) + 1,
        );
    }

    const grades = Array.from(gradeMap.entries())
        .map(([grade, count]) => ({ grade, count }))
        .sort((a, b) => a.grade - b.grade);

    return {
        total: grades.reduce((sum, item) => sum + item.count, 0),
        grades,
    };
};

export const canThoSchoolOverviewStats: SchoolOverviewStats[] = [
    {
        schoolId: SCHOOL_001,
        academicYear: ACADEMIC_YEAR,
        personnel: {
            total: 240,
            teachers: 210,
            managers: 8,
            staff: 22,
            male: 92,
            female: 148,
        },
        students: {
            total: 4280,
            grades: [
                { grade: 6, count: 1080 },
                { grade: 7, count: 1060 },
                { grade: 8, count: 1070 },
                { grade: 9, count: 1070 },
            ],
            male: 2210,
            female: 2070,
        },
        campuses: campusCountsOfSchool(SCHOOL_001),
        classes: classCountsOfSchool(SCHOOL_001),
    },
];

export const getSchoolOverviewStats = (
    schoolId: string,
): SchoolOverviewStats | undefined => {
    return canThoSchoolOverviewStats.find(
        (stats) => stats.schoolId === schoolId,
    );
};