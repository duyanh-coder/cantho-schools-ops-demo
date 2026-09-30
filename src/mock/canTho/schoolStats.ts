import {
    canThoCampuses,
} from "./campuses";

import {
    canThoClasses,
} from "./classes";

import {
    canThoPersonnel,
} from "./personnel";

import {
    canThoSchools,
} from "./schools";

import {
    canThoStudents,
} from "./students";

import {
    summarizePersonnel,
} from "../common/personnelRole";


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

const personnelStatsOfSchool = (
    schoolId: string,
): SchoolPersonnelStats => {
    /**
     * Dùng chung bộ phân nhóm với tab Nhân sự để số cán bộ, giáo viên và
     * nhân viên ở tab Tổng quan luôn khớp với danh sách chi tiết.
     */
    const summary = summarizePersonnel(canThoPersonnel.filter(
        (item) => item.schoolId === schoolId,
    ));

    return {
        total: summary.total,
        teachers: summary.teachers,
        managers: summary.managers,
        staff: summary.staff,
        male: summary.male,
        female: summary.female,
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

const studentStatsOfSchool = (
    schoolId: string,
): SchoolStudentsStats => {
    const enrolled = canThoStudents.filter(
        (item) => item.schoolId === schoolId && item.status === "studying",
    );

    const gradeMap = new Map<number, number>();

    for (const student of enrolled) {
        if (student.grade === undefined) {
            continue;
        }

        gradeMap.set(
            student.grade,
            (gradeMap.get(student.grade) ?? 0) + 1,
        );
    }

    const male = enrolled.filter(
        (item) => item.gender === "male",
    ).length;

    return {
        total: enrolled.length,
        grades: Array.from(gradeMap.entries())
            .map(([grade, count]) => ({ grade, count }))
            .sort((a, b) => a.grade - b.grade),
        male,
        female: enrolled.length - male,
    };
};

export const canThoSchoolOverviewStats: SchoolOverviewStats[] =
    canThoSchools.map((school) => ({
        schoolId: school.id,
        academicYear: ACADEMIC_YEAR,
        personnel: personnelStatsOfSchool(school.id),
        students: studentStatsOfSchool(school.id),
        campuses: campusCountsOfSchool(school.id),
        classes: classCountsOfSchool(school.id),
    }));

export const getSchoolOverviewStats = (
    schoolId: string,
): SchoolOverviewStats | undefined => {
    return canThoSchoolOverviewStats.find(
        (stats) => stats.schoolId === schoolId,
    );
};