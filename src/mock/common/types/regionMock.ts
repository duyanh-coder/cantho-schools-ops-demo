import type { Region } from "./region";
import type { Ward } from "./ward";
import type { School } from "./school";
import type { Campus } from "./campus";
import type { SchoolClass } from "./class";
import type { Teacher } from "./teacher";
import type { TimetableItem } from "./timetable";
import type { DocumentItem } from "./document";
import type { AlertItem } from "./alert";
import type { TaskItem } from "./task";
import type { ReportItem } from "./report";
import type { TeachingAttendance } from "./teachingAttendance";
import type { User } from "./user";
import type { Sector } from "./sector";
import type { Personnel } from "./personnel";
import type { Student } from "./student";
import type { Transcript } from "./student";
import type { EnrolmentChange } from "./student";
import type { BoardingRecord } from "./boarding";
import type {
    GisMockData,
} from "./gis";


export interface RegionMockData {
    regions: Region[];

    wards: Ward[];

    schools: School[];

    campuses: Campus[];

    gis: GisMockData;

    classes: SchoolClass[];

    teachers: Teacher[];

    timetables: TimetableItem[];

    documents: DocumentItem[];

    alerts: AlertItem[];

    tasks: TaskItem[];

    reports: ReportItem[];

    teachingAttendance: TeachingAttendance[];

    users: User[];

    sectors: Sector[];

    personnel: Personnel[];

    students: Student[];

    transcripts: Transcript[];

    enrolmentChanges: EnrolmentChange[];

    boarding: BoardingRecord[];
}