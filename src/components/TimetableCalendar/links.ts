import type {
    TimetableCalendarMode,
    TimetableEvent,
} from "./types";

export interface TimetableEventLink {
    label: string;

    to: string;
}

/**
 * Đường dẫn sẵn sàng để màn hình cha xử lý điều hướng sâu tới đơn vị
 * liên quan. Lớp hiển thị không tự điều hướng để không phụ thuộc router.
 */
export const linksOfEvent = (
    event: TimetableEvent,
    mode: TimetableCalendarMode,
): TimetableEventLink[] => {
    const links: TimetableEventLink[] = [];

    if (mode !== "class") {
        links.push({
            label: "Hồ sơ lớp",
            to: `/operations/classes/${event.classId}`,
        });
    }

    if (mode !== "teacher") {
        links.push({
            label: "Hồ sơ giáo viên",
            to: `/operations/personnel/${event.teacherId}`,
        });
    }

    if (mode !== "campus") {
        links.push({
            label: "Cơ sở",
            to: `/operations/campuses/${event.campusId}`,
        });
    }

    return links;
};
