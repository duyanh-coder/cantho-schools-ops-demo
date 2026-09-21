import type { WardStats } from "../common/types";

import { canThoCampuses } from "./campuses";
import { canThoTeachers } from "./teachers";
import { canThoStudents } from "./students";
import { canThoEnrollmentChanges } from "./enrollmentChanges";
import { canThoCareDemands } from "./careDemands";

const SCHOOL_ID = "can-tho-school-001";

export const canThoWardStats: WardStats[] = [
    {
        wardId: "can-tho-31135",
        academicYear: "2026-2027",
        schoolCount: 1,
        campusCount: canThoCampuses.filter((campus) => campus.schoolId === SCHOOL_ID).length,
        teacherCount: canThoTeachers.filter((teacher) => teacher.schoolId === SCHOOL_ID).length,
        studentCount: canThoStudents.filter((student) => student.schoolId === SCHOOL_ID && student.status === "studying").length,
        twoSessionCount: canThoCareDemands.reduce((sum, item) => sum + item.twoSessionCount, 0),
        boardingCount: canThoCareDemands.reduce((sum, item) => sum + item.boardingCount, 0),
        breakfastCount: canThoCareDemands.reduce((sum, item) => sum + item.breakfastCount, 0),
        lunchCount: canThoCareDemands.reduce((sum, item) => sum + item.lunchCount, 0),
        policyStudentCount: canThoStudents.filter((student) => student.schoolId === SCHOOL_ID && student.policyGroupIds.length > 0).length,
        enrollmentChangeCount: canThoEnrollmentChanges.filter((change) => change.schoolId === SCHOOL_ID).length,
    },
];