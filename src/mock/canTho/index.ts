import type { RegionMockData } from "../common/types";

import { canThoRegions } from "./regions";
import { canThoWards } from "./wards";
import { canThoSchools } from "./schools";
import { canThoCampuses } from "./campuses";
import { canThoUsers } from "./users";
import { canThoTeachers } from "./teachers";
import { canThoClasses } from "./classes";
import { canThoTimetables } from "./timetables";
import { canThoTeachingAttendance } from "./teachingAttendance";
import { canThoDocuments } from "./documents";
import { canThoAlerts } from "./alerts";
import { canThoTasks } from "./tasks";
import { canThoReports } from "./reports";
import { canThoGis } from "./gis";
import { canThoDepartments } from "./departments";
import { canThoTeacherAwards } from "./teacherAwards";

export const canThoMockData: RegionMockData = {
    regions: canThoRegions, wards: canThoWards, schools: canThoSchools, campuses: canThoCampuses, gis: canThoGis, users: canThoUsers, teachers: canThoTeachers, classes: canThoClasses, timetables: canThoTimetables, teachingAttendance: canThoTeachingAttendance, documents: canThoDocuments, alerts: canThoAlerts, tasks: canThoTasks, reports: canThoReports,
    departments: canThoDepartments, students: [], guardians: [], academicRecords: [], enrollmentChanges: [], careDemands: [], teacherAwards: canThoTeacherAwards, facilities: [], finances: [], schoolHealth: [], studentDisciplines: [], policyGroups: [],
};

export { canThoRegions, canThoWards, canThoSchools, canThoCampuses, canThoGis, canThoUsers, canThoTeachers, canThoClasses, canThoTimetables, canThoTeachingAttendance, canThoDocuments, canThoAlerts, canThoTasks, canThoReports, canThoDepartments, canThoTeacherAwards };
