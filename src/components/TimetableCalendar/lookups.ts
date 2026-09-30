import type {
    Subject,
} from "@/mock/common/subjects";

import type {
    Campus,
    Personnel,
    SchoolClass,
    SchoolRoom,
} from "@/mock/common/types";

/**
 * Bảng tra cứu dùng chung cho mọi màn hình hiển thị thời khóa biểu.
 * Gom ở đây để lớp hiển thị và các trang nghiệp vụ dùng chung một
 * nguồn dữ liệu hiển thị, không tự dựng lại danh sách tên.
 */
export interface TimetableCalendarLookups {
    subjectName: (id: string) => string;

    className: (id: string) => string;

    teacherName: (id: string) => string;

    campusName: (id: string) => string;

    roomCode: (id: string) => string;

    classroomByCampus: Map<string, SchoolClass[]>;

    subjectById: Map<string, Subject>;

    classById: Map<string, SchoolClass>;

    personnelById: Map<string, Personnel>;

    campusById: Map<string, Campus>;

    roomById: Map<string, SchoolRoom>;
}

export const buildTimetableLookups = (
    subjects: Subject[],
    classes: SchoolClass[],
    personnel: Personnel[],
    campuses: Campus[],
    rooms: SchoolRoom[],
): TimetableCalendarLookups => {
    const subjectById = new Map(subjects.map((item) => [item.id, item]));
    const classById = new Map(classes.map((item) => [item.id, item]));
    const personnelById = new Map(personnel.map((item) => [item.id, item]));
    const campusById = new Map(campuses.map((item) => [item.id, item]));
    const roomById = new Map(rooms.map((item) => [item.id, item]));

    const classroomByCampus = new Map<string, SchoolClass[]>();

    for (const classItem of classes) {
        const bucket = classroomByCampus.get(classItem.campusId) ?? [];

        bucket.push(classItem);

        classroomByCampus.set(classItem.campusId, bucket);
    }

    return {
        subjectName: (id) => subjectById.get(id)?.name ?? id,
        className: (id) => classById.get(id)?.name ?? id,
        teacherName: (id) => personnelById.get(id)?.fullName ?? id,
        campusName: (id) => campusById.get(id)?.name ?? id,
        roomCode: (id) => roomById.get(id)?.code ?? id,
        classroomByCampus,
        subjectById,
        classById,
        personnelById,
        campusById,
        roomById,
    };
};

/**
 * Màu chủ đạo theo môn học, dùng chung cho lưới thời khóa biểu và
 * các bảng liên quan để một môn luôn mang một màu.
 */
export const SUBJECT_TONES: Record<string, string> = {
    math: "blue",
    literature: "pink",
    english: "purple",
    physics: "geekblue",
    chemistry: "orange",
    biology: "green",
    history: "gold",
    geography: "lime",
    civic_education: "cyan",
    informatics: "teal",
    technology: "volcano",
    physical_education: "magenta",
    music: "geekblue",
    art: "gold",
};

export const subjectTone = (
    subjectId: string,
): string => SUBJECT_TONES[subjectId] ?? "default";

export const shortTeacher = (
    fullName: string,
): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
