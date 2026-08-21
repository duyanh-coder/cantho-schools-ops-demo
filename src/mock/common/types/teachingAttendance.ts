export interface TeachingAttendance {
    id: string;

    campusId: string;

    classId: string;

    teacherId: string;

    timetableId: string;

    date: string;

    status:
        | "present"
        | "late"
        | "absent";
}