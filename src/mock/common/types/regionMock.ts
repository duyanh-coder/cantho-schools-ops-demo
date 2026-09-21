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
import type {
    GisMockData,
} from "./gis";
import type {
    Department,
} from "./department";
import type {
    Guardian,
    Student,
} from "./student";
import type {
    AcademicRecord,
} from "./academicRecord";
import type {
    EnrollmentChange,
} from "./enrollmentChange";
import type {
    CareDemand,
} from "./careDemand";
import type {
    TeacherAward,
} from "./teacherAward";
import type {
    Facility,
} from "./facility";
import type {
    FinanceItem,
} from "./finance";
import type {
    SchoolHealthItem,
} from "./schoolHealth";
import type {
    StudentDiscipline,
} from "./studentDiscipline";
import type {
    PolicyGroup,
} from "./policyGroup";


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

    departments: Department[];

    students: Student[];

    guardians: Guardian[];

    academicRecords: AcademicRecord[];

    enrollmentChanges: EnrollmentChange[];

    careDemands: CareDemand[];

    teacherAwards: TeacherAward[];

    facilities: Facility[];

    finances: FinanceItem[];

    schoolHealth: SchoolHealthItem[];

    studentDisciplines: StudentDiscipline[];

    policyGroups: PolicyGroup[];
}