import type {
    ClassStatus,
    ClassType,
} from "./classModel";


export interface SchoolClass {
    id: string;

    schoolId: string;
    campusId: string;

    code: string;
    name: string;

    grade: number;

    academicYear: string;

    homeroomTeacherId?: string;

    roomId?: string;

    classType?: ClassType;

    capacity?: number;

    note?: string;

    status: ClassStatus;
}