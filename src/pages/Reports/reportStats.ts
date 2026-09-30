import type {
    BoardingProfile,
    Campus,
    EducationLevel,
    EnrolmentChange,
    Grade,
    Personnel,
    SchoolClass,
    SchoolRoom,
    Student,
} from "@/mock/common/types";

import {
    groupPersonnel,
    summarizePersonnel,
} from "@/mock/common/personnelRole";


/**
 * Trường mẫu của báo cáo quản trị BGH.
 *
 * Báo cáo chỉ phục vụ ban giám hiệu trường, nên phạm vi cố định là một
 * trường và các cơ sở thuộc trường đó.
 */
export const REPORT_SCHOOL_ID = "can-tho-school-001";

/** Bậc học của trường mẫu, quyết định khoảng khối được tính. */
const REPORT_SCHOOL_LEVEL: EducationLevel = "THCS";

/**
 * Ghi chú hiển thị ở biểu đồ xu hướng.
 *
 * Toàn bộ dữ liệu học sinh trong hệ thống chỉ có một năm học nên không thể
 * dựng đường xu hướng nhiều năm. Thay vì bịa số liệu, biểu đồ chuyển sang
 * so sánh giữa các cơ sở và ghi chú lý do.
 */
export const TREND_UNAVAILABLE_NOTE =
    "Chưa có dữ liệu nhiều năm học để so sánh xu hướng.";

const GRADE_LABELS: Record<number, string> = {
    6: "Lớp 6",
    7: "Lớp 7",
    8: "Lớp 8",
    9: "Lớp 9",
    10: "Lớp 10",
    11: "Lớp 11",
    12: "Lớp 12",
};

const CLASS_STATUS_LABELS: Record<SchoolClass["status"], string> = {
    active: "Đang hoạt động",
    inactive: "Ngừng hoạt động",
    suspended: "Tạm ngừng",
    closed: "Đã đóng",
};

const ROOM_CONDITION_LABELS: Record<SchoolRoom["condition"], string> = {
    good: "Tốt",
    normal: "Bình thường",
    repair: "Cần sửa chữa",
};


export const gradeLabel = (grade: number): string =>
    GRADE_LABELS[grade] ?? `Lớp ${grade}`;


/**
 * Khoảng khối theo bậc học.
 *
 * Báo cáo quản trị chỉ tính khối thuộc bậc của trường: trường THCS có lớp
 * 6-9, khối 10-12 thuộc THPT nên không lẫn vào báo cáo của ban giám hiệu
 * khối THCS.
 */
export const gradeRangeOf = (
    level: EducationLevel,
): { min: number; max: number } => (level === "THPT"
    ? { min: 10, max: 12 }
    : level === "THCS_THPT"
        ? { min: 6, max: 12 }
        : { min: 6, max: 9 });

const allowedGradeNumbers = (
    grades: number[],
): number[] => {
    const range = gradeRangeOf(REPORT_SCHOOL_LEVEL);

    return [
        ...new Set(
            grades.filter((grade) =>
                grade >= range.min && grade <= range.max),
        ),
    ].sort((a, b) => a - b);
};


export interface ReportSources {
    campuses: Campus[];

    classes: SchoolClass[];

    students: Student[];

    personnel: Personnel[];

    rooms: SchoolRoom[];

    boardingProfiles: BoardingProfile[];

    enrolmentChanges: EnrolmentChange[];

    grades: Grade[];
}


export interface CampusReportRow {
    campusId: string;

    code: string;

    name: string;

    isMainCampus: boolean;

    campusType: string;

    classCount: number;

    studentCount: number;

    classroomCount: number;

    functionRoomCount: number;

    roomCount: number;

    managerCount: number;

    teacherCount: number;

    staffCount: number;

    personnelCount: number;

    twoSessionCount: number;

    boardingCount: number;

    mealCount: number;

    avgStudentsPerClass: number;

    boardingRate: number;
}


export interface GradeReportRow {
    grade: number;

    label: string;

    classCount: number;

    studentCount: number;

    avgStudentsPerClass: number;
}


export interface CountRow {
    key: string;

    label: string;

    count: number;
}


export interface EnrolmentReportRow {
    date: string;

    label: string;

    increase: number;

    decrease: number;

    net: number;
}


export interface ReportTotals {
    campusCount: number;

    classCount: number;

    studentCount: number;

    maleCount: number;

    femaleCount: number;

    staffCount: number;

    classroomCount: number;

    functionRoomCount: number;

    roomCount: number;

    twoSessionCount: number;

    boardingCount: number;

    mealCount: number;

    boardingRate: number;

    avgStudentsPerClass: number;
}


export interface ReportOverview {
    schoolId: string;

    academicYearId: string;

    academicYearIds: string[];

    totals: ReportTotals;

    campusRows: CampusReportRow[];

    gradeRows: GradeReportRow[];

    personnelGroups: CountRow[];

    classStatusRows: CountRow[];

    roomConditionRows: CountRow[];

    enrolmentRows: EnrolmentReportRow[];

    trendNote: string;

    hasTrendData: boolean;
}


const round1 = (
    value: number,
): number => Math.round(value * 10) / 10;

const rate = (
    part: number,
    total: number,
): number => (total > 0 ? round1((part / total) * 100) : 0);

const countBy = (
    rows: Array<{ id: string }>,
): number => rows.length;

/** Ngày theo định dạng Việt Nam để hiển thị trên trục ngang. */
const formatDateLabel = (
    isoDate: string,
): string => {
    const [year, month, day] = isoDate.split("-");

    if (!year || !month || !day) {
        return isoDate;
    }

    return `${day}/${month}/${year}`;
};


/**
 * Thống kê tổng quan cho ban giám hiệu một trường.
 *
 * `academicYearId` rỗng nghĩa là lấy tất cả năm học. Mọi con số đều suy ra
 * từ dữ liệu đầu vào, không có giá trị mặc định viết tay.
 */
export const buildReportOverview = (
    sources: ReportSources,
    academicYearId = "",
): ReportOverview => {
    const schoolCampuses = sources.campuses.filter((campus) =>
        campus.schoolId === REPORT_SCHOOL_ID);

    const campusIds = new Set(schoolCampuses.map((campus) => campus.id));

    const scopedClasses = sources.classes.filter((item) =>
        campusIds.has(item.campusId));

    const classIds = new Set(scopedClasses.map((item) => item.id));

    const scopedStudents = sources.students.filter((student) =>
        student.classId !== undefined && classIds.has(student.classId));

    const scopedRooms = sources.rooms.filter((room) =>
        campusIds.has(room.campusId));

    const scopedPersonnel = sources.personnel.filter((person) =>
        person.schoolId === REPORT_SCHOOL_ID
        && person.campusIds.some((id) => campusIds.has(id)));

    /* ========================================
       ACADEMIC YEAR SCOPING
     ======================================== */

    const academicYearIds = [
        ...new Set(
            sources.boardingProfiles
                .map((profile) => profile.academicYearId)
                .filter(Boolean),
        ),
    ].sort();

    const studentIds = new Set(scopedStudents.map((student) => student.id));

    const scopedProfiles = academicYearId
        ? sources.boardingProfiles.filter((profile) =>
            profile.academicYearId === academicYearId
            && studentIds.has(profile.studentId))
        : sources.boardingProfiles.filter((profile) =>
            studentIds.has(profile.studentId));

    /* ========================================
       PER CAMPUS ROWS
     ======================================== */

    const campusRows: CampusReportRow[] = schoolCampuses
        .map((campus) => {
            const campusClasses = scopedClasses.filter((item) =>
                item.campusId === campus.id);

            const campusClassIds = new Set(
                campusClasses.map((item) => item.id),
            );

            const campusStudents = scopedStudents.filter((student) =>
                student.classId !== undefined
                && campusClassIds.has(student.classId));

            const campusRooms = scopedRooms.filter((room) =>
                room.campusId === campus.id);

            const campusPersonnel = scopedPersonnel.filter((person) =>
                person.campusIds.includes(campus.id));

            const summary = summarizePersonnel(campusPersonnel);

            const campusStudentIds = new Set(
                campusStudents.map((student) => student.id),
            );

            const campusProfiles = scopedProfiles.filter((profile) =>
                campusStudentIds.has(profile.studentId));

            return {
                campusId: campus.id,

                code: campus.code,

                name: campus.name,

                isMainCampus: campus.isMainCampus,

                campusType: campus.type === "HEADQUARTERS"
                    ? "Trụ sở chính"
                    : "Phân hiệu",

                classCount: campusClasses.length,

                studentCount: campusStudents.length,

                classroomCount: countBy(campusRooms.filter((room) =>
                    room.category === "classroom")),

                functionRoomCount: countBy(campusRooms.filter((room) =>
                    room.category === "function_room")),

                roomCount: campusRooms.length,

                managerCount: summary.managers,

                teacherCount: summary.teachers,

                staffCount: summary.staff,

                personnelCount: summary.total,

                twoSessionCount: countBy(campusProfiles.filter((profile) =>
                    profile.twoSession)),

                boardingCount: countBy(campusProfiles.filter((profile) =>
                    profile.boarding)),

                mealCount: countBy(campusProfiles.filter((profile) =>
                    profile.mealRequired)),

                avgStudentsPerClass: campusClasses.length > 0
                    ? round1(campusStudents.length / campusClasses.length)
                    : 0,

                boardingRate: rate(
                    campusProfiles.filter((profile) => profile.boarding).length,
                    campusProfiles.length,
                ),
            };
        })
        .sort((a, b) => {
            if (a.isMainCampus !== b.isMainCampus) {
                return a.isMainCampus ? -1 : 1;
            }

            return b.studentCount - a.studentCount
                || a.name.localeCompare(b.name, "vi-VN");
        });

    /* ========================================
       TOTALS
     ======================================== */

    const totals: ReportTotals = {
        campusCount: schoolCampuses.length,

        classCount: scopedClasses.length,

        studentCount: scopedStudents.length,

        maleCount: countBy(scopedStudents.filter((student) =>
            student.gender === "male")),

        femaleCount: countBy(scopedStudents.filter((student) =>
            student.gender === "female")),

        staffCount: summarizePersonnel(scopedPersonnel).total,

        classroomCount: countBy(scopedRooms.filter((room) =>
            room.category === "classroom")),

        functionRoomCount: countBy(scopedRooms.filter((room) =>
            room.category === "function_room")),

        roomCount: scopedRooms.length,

        twoSessionCount: countBy(scopedProfiles.filter((profile) =>
            profile.twoSession)),

        boardingCount: countBy(scopedProfiles.filter((profile) =>
            profile.boarding)),

        mealCount: countBy(scopedProfiles.filter((profile) =>
            profile.mealRequired)),

        boardingRate: rate(
            scopedProfiles.filter((profile) => profile.boarding).length,
            scopedProfiles.length,
        ),

        avgStudentsPerClass: scopedClasses.length > 0
            ? round1(scopedStudents.length / scopedClasses.length)
            : 0,
    };

    /* ========================================
       GRADE DISTRIBUTION
     ======================================== */

    const gradeNumbers = allowedGradeNumbers(
        scopedClasses.map((item) => item.grade),
    );

    const gradeRows: GradeReportRow[] = gradeNumbers.map((grade) => {
        const gradeClasses = scopedClasses.filter((item) =>
            item.grade === grade);

        const gradeClassIds = new Set(
            gradeClasses.map((item) => item.id),
        );

        const gradeStudents = countBy(scopedStudents.filter((student) =>
            student.classId !== undefined
            && gradeClassIds.has(student.classId)));

        return {
            grade,

            label: gradeLabel(grade),

            classCount: gradeClasses.length,

            studentCount: gradeStudents,

            avgStudentsPerClass: gradeClasses.length > 0
                ? round1(gradeStudents / gradeClasses.length)
                : 0,
        };
    });

    /* ========================================
       PERSONNEL / CLASS / ROOM BREAKDOWN
     ======================================== */

    const personnelGroups: CountRow[] = groupPersonnel(scopedPersonnel)
        .map((group) => ({
            key: group.group,

            label: group.label,

            count: group.count,
        }));

    const classStatusRows: CountRow[] = (
        ["active", "inactive", "suspended", "closed"] as SchoolClass["status"][]
    ).map((status) => ({
        key: status,

        label: CLASS_STATUS_LABELS[status],

        count: countBy(scopedClasses.filter((item) =>
            item.status === status)),
    })).filter((row) => row.count > 0);

    const roomConditionRows: CountRow[] = (
        ["good", "normal", "repair"] as SchoolRoom["condition"][]
    ).map((condition) => ({
        key: condition,

        label: ROOM_CONDITION_LABELS[condition],

        count: countBy(scopedRooms.filter((room) =>
            room.condition === condition)),
    })).filter((row) => row.count > 0);

    /* ========================================
       ENROLMENT MOVEMENT BY DATE
     ======================================== */

    const scopedEnrolment = sources.enrolmentChanges.filter((change) =>
        change.schoolId === REPORT_SCHOOL_ID
        && (change.campusId === undefined
            || campusIds.has(change.campusId)));

    const dates = [
        ...new Set(scopedEnrolment.map((change) => change.effectiveDate)),
    ].sort();

    const enrolmentRows: EnrolmentReportRow[] = dates.map((date) => {
        const sameDay = scopedEnrolment.filter((change) =>
            change.effectiveDate === date);

        const increase = countBy(sameDay.filter((change) =>
            change.changeType === "increase"));

        const decrease = countBy(sameDay.filter((change) =>
            change.changeType === "decrease"));

        return {
            date,

            label: formatDateLabel(date),

            increase,

            decrease,

            net: increase - decrease,
        };
    });

    return {
        schoolId: REPORT_SCHOOL_ID,

        academicYearId,

        academicYearIds,

        totals,

        campusRows,

        gradeRows,

        personnelGroups,

        classStatusRows,

        roomConditionRows,

        enrolmentRows,

        trendNote: academicYearIds.length > 1 ? "" : TREND_UNAVAILABLE_NOTE,

        hasTrendData: academicYearIds.length > 1,
    };
};