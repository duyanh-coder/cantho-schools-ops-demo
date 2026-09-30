import {
    canThoMockData,
} from "@/mock";

import {
    getSchoolOverviewStats,
} from "@/mock/canTho";


export interface CampusScale {
    classCount: number;
    studentCount: number;
    teacherCount: number;
}

const allocateByShare = (
    total: number,
    shares: number[],
): number[] => {
    if (shares.length === 0 || total <= 0) {
        return shares.map(() => 0);
    }

    const raw = shares.map(
        (share) => total * share,
    );

    const allocated = raw.map(
        (value) => Math.floor(value),
    );

    const remainder = total - allocated.reduce(
        (sum, value) => sum + value,
        0,
    );

    const order = raw
        .map((value, index) => ({
            index,
            fraction: value - Math.floor(value),
        }))
        .sort((a, b) => b.fraction - a.fraction);

    for (let step = 0; step < remainder; step += 1) {
        allocated[order[step % order.length].index] += 1;
    }

    return allocated;
};

const countClasses = (
    campusId: string,
): number => {
    return canThoMockData.classes.filter(
        (item) => item.campusId === campusId,
    ).length;
};

export const buildCampusScale = (
    campusId: string,
): CampusScale => {
    const campus = canThoMockData.campuses.find(
        (item) => item.id === campusId,
    );

    const stats = campus
        ? getSchoolOverviewStats(campus.schoolId)
        : undefined;

    if (stats && stats.classes.total > 0) {
        const schoolCampuses = canThoMockData.campuses.filter(
            (item) => item.schoolId === campus?.schoolId,
        );

        const shares = schoolCampuses.map(
            (item) => countClasses(item.id) / stats.classes.total,
        );

        const studentScale = allocateByShare(
            stats.students.total,
            shares,
        );

        const teacherScale = allocateByShare(
            stats.personnel.total,
            shares,
        );

        const index = schoolCampuses.findIndex(
            (item) => item.id === campusId,
        );

        return {
            classCount: countClasses(campusId),
            studentCount: index >= 0 ? studentScale[index] : 0,
            teacherCount: index >= 0 ? teacherScale[index] : 0,
        };
    }

    return {
        classCount: countClasses(campusId),
        studentCount: canThoMockData.students.filter(
            (item) =>
                item.campusId === campusId &&
                item.status === "studying",
        ).length,
        teacherCount: canThoMockData.personnel.filter(
            (item) => item.campusIds.includes(campusId),
        ).length,
    };
};