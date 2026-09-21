import type { AcademicRecord, SubjectScore } from "../common/types";

import { canThoStudents } from "./students";

const SUBJECT_IDS = ["math", "literature", "english", "physics", "chemistry", "biology"];

const round1 = (value: number): number => {
    return Math.round(value * 10) / 10;
};

const buildScores = (index: number, semesterOffset: number): SubjectScore[] => {
    return SUBJECT_IDS.map((subjectId, subjectIdx) => {
        const base = 6.2 + ((index * 0.21 + subjectIdx * 0.47 + semesterOffset) % 3.3);

        const score15 = round1(base + ((index % 3) - 1) * 0.5);

        const score45 = round1(base + 0.4);

        const final = round1(base + 0.8);

        const semester = round1((score15 + score45 * 2 + final * 3) / 6);

        return { subjectId, score15, score45, final, semester };
    });
};

const semesterAverage = (scores: SubjectScore[]): number => {
    const total = scores.reduce(
        (sum, score) => sum + score.semester,
        0,
    );

    return total / scores.length;
};

const conductByIndex = (index: number): AcademicRecord["conduct"] => {
    if (index % 7 === 0) {
        return "fair";
    }

    if (index % 13 === 0) {
        return "pass";
    }

    return "good";
};

export const canThoAcademicRecords: AcademicRecord[] = [];

canThoStudents.forEach((student, index) => {
    const recordBase: Omit<AcademicRecord, "semester"> = {
        id: "",
        studentId: student.id,
        academicYear: "2026-2027",
        subjectScores: [],
        conduct: conductByIndex(index + 1),
        learningGrade: "pass",
        honor: undefined,
        unexcusedAbsences: (index * 7) % 6,
        excusedAbsences: (index * 3) % 8,
    };

    ["1", "2"].forEach((semester, semesterIdx) => {
        const scores = buildScores(index + 1, semesterIdx);

        const average = semesterAverage(scores);

        const learningGrade: AcademicRecord["learningGrade"] =
            average >= 8
                ? "excellent"
                : average >= 6.5
                    ? "good"
                    : average >= 5
                        ? "fair"
                        : "pass";

        const honor: AcademicRecord["honor"] =
            learningGrade === "excellent"
                ? "excellent_student"
                : learningGrade === "good"
                    ? "advanced_student"
                    : "none";

        canThoAcademicRecords.push({
            ...recordBase,
            id: `can-tho-record-${String(index + 1).padStart(4, "0")}-s${semester}`,
            semester: semester as AcademicRecord["semester"],
            subjectScores: scores,
            learningGrade,
            honor,
        });
    });
});