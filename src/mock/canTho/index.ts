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
import { canThoSectors } from "./sectors";
import { canThoPersonnel } from "./personnel";
import { canThoStudents } from "./students";
import { canThoTranscripts } from "./transcripts";
import { canThoEnrolmentChanges } from "./enrolmentChanges";
import { canThoBoarding } from "./boarding";
import { canThoFacilities } from "./facilities";

export const canThoMockData: RegionMockData = {
    regions: canThoRegions, wards: canThoWards, schools: canThoSchools, campuses: canThoCampuses, gis: canThoGis, users: canThoUsers, teachers: canThoTeachers, classes: canThoClasses, timetables: canThoTimetables, teachingAttendance: canThoTeachingAttendance, documents: canThoDocuments, alerts: canThoAlerts, tasks: canThoTasks, reports: canThoReports, sectors: canThoSectors, personnel: canThoPersonnel, students: canThoStudents, transcripts: canThoTranscripts, enrolmentChanges: canThoEnrolmentChanges, facilities: canThoFacilities, boarding: canThoBoarding,
};

export { canThoRegions, canThoWards, canThoSchools, canThoCampuses, canThoGis, canThoUsers, canThoTeachers, canThoClasses, canThoTimetables, canThoTeachingAttendance, canThoDocuments, canThoAlerts, canThoTasks, canThoReports, canThoSectors, canThoPersonnel, canThoStudents, canThoTranscripts, canThoEnrolmentChanges, canThoBoarding, canThoFacilities };
