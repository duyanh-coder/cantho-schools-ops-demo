import {
    canThoMockData,
} from "@/mock";

import {
    canThoFacilities,
    canThoRooms,
    getSchoolOverviewStats,
} from "@/mock/canTho";


export interface CampusScale {
    classCount: number;
    studentCount: number;
    teacherCount: number;
}

export type CampusKpis = CampusScale & {
    totalPersonnel: number;
    teachers: number;
    managers: number;
    staff: number;
    roomCount: number;
};

const AVG_CLASS_SIZE = 45;

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

        const students = index >= 0 ? studentScale[index] : 0;

        return {
            classCount: Math.max(
                1,
                Math.round(students / AVG_CLASS_SIZE),
            ),
            studentCount: students,
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

const countRooms = (
    campusId: string,
): number => {
    const roomCount = canThoRooms.filter(
        (room) => room.campusId === campusId,
    ).length;

    if (roomCount > 0) {
        return roomCount;
    }

    return canThoFacilities.filter(
        (item) =>
            item.campusId === campusId &&
            item.category === "classroom",
    ).reduce(
        (total, item) => total + item.quantity,
        0,
    );
};

export const buildCampusKpis = (
    campusId: string,
): CampusKpis => {
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
            stats.personnel.teachers,
            shares,
        );

        const managerScale = allocateByShare(
            stats.personnel.managers,
            shares,
        );

        const staffScale = allocateByShare(
            stats.personnel.staff,
            shares,
        );

        const index = schoolCampuses.findIndex(
            (item) => item.id === campusId,
        );

        const students = index >= 0 ? studentScale[index] : 0;
        const teachers = index >= 0 ? teacherScale[index] : 0;
        const managers = index >= 0 ? managerScale[index] : 0;
        const staff = index >= 0 ? staffScale[index] : 0;

        return {
            classCount: Math.max(
                1,
                Math.round(students / AVG_CLASS_SIZE),
            ),
            studentCount: students,
            teacherCount: teachers + managers + staff,
            totalPersonnel: teachers + managers + staff,
            teachers,
            managers,
            staff,
            roomCount: countRooms(campusId),
        };
    }

    const students = canThoMockData.students.filter(
        (item) =>
            item.campusId === campusId &&
            item.status === "studying",
    ).length;

    const personnel = canThoMockData.personnel.filter(
        (item) => item.campusIds.includes(campusId),
    );

    const teachers = personnel.filter(
        (item) =>
            !item.roleTitle.toLowerCase().includes("hiệu trưởng") &&
            item.subjectIds.length > 0,
    ).length;

    const managers = personnel.filter(
        (item) => item.roleTitle.toLowerCase().includes("hiệu trưởng"),
    ).length;

    const staff = Math.max(
        0,
        personnel.length - teachers - managers,
    );

    return {
        classCount: countClasses(campusId),
        studentCount: students,
        teacherCount: personnel.length,
        totalPersonnel: personnel.length,
        teachers,
        managers,
        staff,
        roomCount: countRooms(campusId),
    };
};