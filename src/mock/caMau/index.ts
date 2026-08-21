import type {
    RegionMockData,
} from "../common/types";

import {
    caMauRegions,
} from "./regions";

import {
    caMauWards,
} from "./wards";

import {
    caMauSchools,
} from "./schools";

import {
    caMauCampuses,
} from "./campuses";

import {
    caMauUsers,
} from "./users";

import {
    caMauTeachers,
} from "./teachers";

import {
    caMauClasses,
} from "./classes";

import {
    caMauTimetables,
} from "./timetables";

import {
    caMauTeachingAttendance,
} from "./teachingAttendance";

import {
    caMauDocuments,
} from "./documents";

import {
    caMauAlerts,
} from "./alerts";

import {
    caMauTasks,
} from "./tasks";

import {
    caMauReports,
} from "./reports";

import {
    caMauGis,
} from "./gis";


export const caMauMockData: RegionMockData = {
    regions: caMauRegions,

    wards: caMauWards,

    schools: caMauSchools,

    campuses: caMauCampuses,

    gis: caMauGis,

    users: caMauUsers,

    teachers: caMauTeachers,

    classes: caMauClasses,

    timetables: caMauTimetables,

    teachingAttendance: caMauTeachingAttendance,

    documents: caMauDocuments,

    alerts: caMauAlerts,

    tasks: caMauTasks,

    reports: caMauReports,
};


export {
    caMauRegions,
    caMauWards,
    caMauSchools,
    caMauCampuses,
    caMauGis,
    caMauUsers,
    caMauTeachers,
    caMauClasses,
    caMauTimetables,
    caMauTeachingAttendance,
    caMauDocuments,
    caMauAlerts,
    caMauTasks,
    caMauReports,
};