import {
    canThoPersonnelAssignments,
} from "./personnelAssignments";

import {
    plannedTimetables,
} from "./timetablePlan";

import type {
    TimetableEntry,
} from "../common/types";


const ACADEMIC_YEAR_ID = "2026-2027";

const assignmentByTriple = new Map<string, string>();

for (const assignment of canThoPersonnelAssignments) {
    if (
        assignment.academicYear !== ACADEMIC_YEAR_ID ||
        assignment.semester !== 1 ||
        assignment.status !== "active"
    ) {
        continue;
    }

    const key = [
        assignment.personnelId,
        assignment.classId,
        assignment.subjectId,
    ].join("|");

    assignmentByTriple.set(key, assignment.id);
}

export const canThoTimetables: TimetableEntry[] = plannedTimetables.map(
    (entry) => ({
        ...entry,
        version: entry.version ?? 1,
        assignmentId: entry.assignmentId ?? assignmentByTriple.get(
            [entry.teacherId, entry.classId, entry.subjectId].join("|"),
        ),
    }),
);
