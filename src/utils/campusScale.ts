import {
    canThoRooms,
} from "@/mock/canTho";

import {
    summarizeCampus,
} from "@/utils/campusSummary";

import type {
    Personnel,
} from "@/mock/common/types";


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

const countRooms = (
    campusId: string,
): number => {
    return canThoRooms.filter(
        (room) => room.campusId === campusId,
    ).length;
};

export const buildCampusScale = (
    campusId: string,
    personnel?: Personnel[],
): CampusScale => {
    const summary = summarizeCampus(campusId, personnel);

    return {
        classCount: summary.classCount,
        studentCount: summary.studentCount,
        teacherCount: summary.totalPersonnel,
    };
};

export const buildCampusKpis = (
    campusId: string,
    personnel?: Personnel[],
): CampusKpis => {
    const summary = summarizeCampus(campusId, personnel);

    return {
        classCount: summary.classCount,
        studentCount: summary.studentCount,
        teacherCount: summary.totalPersonnel,
        totalPersonnel: summary.totalPersonnel,
        teachers: summary.teachers,
        managers: summary.managers,
        staff: summary.staff,
        roomCount: countRooms(campusId) || summary.roomCount,
    };
};
