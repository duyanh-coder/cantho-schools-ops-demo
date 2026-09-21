import {
    SCHOOL_FOCUS,
    WARD_FOCUS,
} from "@/config";

import type {
    AcademicRecord,
    Campus,
    CareDemand,
    Department,
    EnrollmentChange,
    Facility,
    FinanceItem,
    Guardian,
    PolicyGroup,
    School,
    SchoolHealthItem,
    Student,
    StudentDiscipline,
    Teacher,
    TeacherAward,
    Ward,
    WardStats,
} from "./common/types";

import {
    getCurrentRegionMockData,
} from "./getCurrentRegionMockData";


const getFocusSchoolId = (): string => {
    return SCHOOL_FOCUS.id;
};


const getFocusWardId = (): string => {
    return WARD_FOCUS.id;
};


export const getCurrentSchools = (): School[] => {
    return getCurrentRegionMockData().schools;
};


export const getCurrentCampuses = (): Campus[] => {
    return getCurrentRegionMockData().campuses;
};


export const getCurrentWards = (): Ward[] => {
    return getCurrentRegionMockData().wards;
};


export const getCampusById = (
    campusId: string,
): Campus | undefined => {
    return getCurrentCampuses().find(
        (campus) => campus.id === campusId,
    );
};


export const getSchoolById = (
    schoolId: string,
): School | undefined => {
    return getCurrentSchools().find(
        (school) => school.id === schoolId,
    );
};


export const getWardById = (
    wardId: string,
): Ward | undefined => {
    return getCurrentWards().find(
        (ward) => ward.id === wardId,
    );
};


export const getCampusesBySchoolId = (
    schoolId: string,
): Campus[] => {
    return getCurrentCampuses().filter(
        (campus) => campus.schoolId === schoolId,
    );
};


export const getCampusesByWardId = (
    wardId: string,
): Campus[] => {
    return getCurrentCampuses().filter(
        (campus) => campus.wardId === wardId,
    );
};


export const getSchoolByCampusId = (
    campusId: string,
): School | undefined => {
    const campus = getCampusById(campusId);

    if (!campus) {
        return undefined;
    }

    return getSchoolById(
        campus.schoolId,
    );
};


export const getFocusSchool = (): School | undefined => {
    return getSchoolById(
        getFocusSchoolId(),
    );
};


export const getFocusCampuses = (): Campus[] => {
    return getCampusesBySchoolId(
        getFocusSchoolId(),
    );
};


export const getFocusWard = (): Ward | undefined => {
    return getWardById(
        getFocusWardId(),
    );
};


const focusCampusIds = (): string[] => {
    return getFocusCampuses().map(
        (campus) => campus.id,
    );
};


const focusStudentIds = (): string[] => {
    return getFocusStudents().map(
        (student) => student.id,
    );
};


export const getFocusDepartments = (): Department[] => {
    return getCurrentRegionMockData().departments;
};


export const getFocusStudents = (): Student[] => {
    return getCurrentRegionMockData().students.filter(
        (student) => student.schoolId === getFocusSchoolId(),
    );
};


export const getFocusGuardians = (): Guardian[] => {
    return getCurrentRegionMockData().guardians;
};


export const getFocusAcademicRecords = (): AcademicRecord[] => {
    const studentIds = new Set(focusStudentIds());

    return getCurrentRegionMockData().academicRecords.filter(
        (record) => studentIds.has(record.studentId),
    );
};


export const getFocusEnrollmentChanges = (): EnrollmentChange[] => {
    return getCurrentRegionMockData().enrollmentChanges.filter(
        (change) => change.schoolId === getFocusSchoolId(),
    );
};


export const getFocusCareDemands = (): CareDemand[] => {
    return getCurrentRegionMockData().careDemands.filter(
        (demand) => demand.schoolId === getFocusSchoolId(),
    );
};


export const getFocusTeacherAwards = (): TeacherAward[] => {
    return getCurrentRegionMockData().teacherAwards;
};


export const getFocusFacilities = (): Facility[] => {
    const campusIds = new Set(focusCampusIds());

    return getCurrentRegionMockData().facilities.filter(
        (facility) => campusIds.has(facility.campusId),
    );
};


export const getFocusFinances = (): FinanceItem[] => {
    return getCurrentRegionMockData().finances.filter(
        (finance) => finance.schoolId === getFocusSchoolId(),
    );
};


export const getFocusSchoolHealth = (): SchoolHealthItem[] => {
    const campusIds = new Set(focusCampusIds());

    return getCurrentRegionMockData().schoolHealth.filter(
        (item) => campusIds.has(item.campusId),
    );
};


export const getFocusStudentDisciplines = (): StudentDiscipline[] => {
    const studentIds = new Set(focusStudentIds());

    return getCurrentRegionMockData().studentDisciplines.filter(
        (item) => studentIds.has(item.studentId),
    );
};


export const getFocusPolicyGroups = (): PolicyGroup[] => {
    return getCurrentRegionMockData().policyGroups;
};


export const getFocusWardStats = (): WardStats[] => {
    return getCurrentRegionMockData().gis.wardStats.filter(
        (stats) => stats.wardId === WARD_FOCUS.gisWardId,
    );
};


export const getFocusTeachers = (): Teacher[] => {
    return getCurrentRegionMockData().teachers.filter(
        (teacher) => teacher.schoolId === getFocusSchoolId(),
    );
};