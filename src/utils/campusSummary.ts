import {
    canThoMockData,
} from "@/mock";

import {
    canThoRooms,
} from "@/mock/canTho";

import type {
    Personnel,
} from "@/mock/common/types";


export interface CampusSummary {
    totalPersonnel: number;

    teachers: number;

    managers: number;

    staff: number;

    classCount: number;

    studentCount: number;

    roomCount: number;
}

const isManagerByRole = (roleTitle: string): boolean => {
    return roleTitle.toLowerCase().includes("hiệu trưởng");
};

export const summarizeCampus = (
    campusId: string,
    allPersonnel: Personnel[] = canThoMockData.personnel,
): CampusSummary => {
    const personnel = allPersonnel.filter(
        (item) => item.campusIds.includes(campusId),
    );

    const managers = personnel.filter(
        (item) => isManagerByRole(item.roleTitle),
    ).length;

    const teachers = personnel.filter(
        (item) =>
            !isManagerByRole(item.roleTitle) &&
            item.subjectIds.length > 0,
    ).length;

    const classCount = canThoMockData.classes.filter(
        (classItem) => classItem.campusId === campusId,
    ).length;

    const studentCount = canThoMockData.students.filter(
        (item) =>
            item.campusId === campusId &&
            item.status === "studying",
    ).length;

    const roomCount = canThoRooms.filter(
        (room) => room.campusId === campusId,
    ).length;

    return {
        totalPersonnel: personnel.length,
        teachers,
        managers,
        staff: Math.max(0, personnel.length - teachers - managers),
        classCount,
        studentCount,
        roomCount,
    };
};