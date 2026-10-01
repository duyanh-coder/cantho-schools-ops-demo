import type {
    AcademicYear,
    Semester,
    TimetableConflict,
    TimetableConflictType,
    TimetableEntry,
    TimetableEntryStatus,
    TimetablePeriod,
    TimetableSession,
    WeekDay,
} from "@/mock/common/types";

import type {
    TimetableCalendarLookups,
} from "./lookups";

/**
 * Ngữ cảnh hiển thị. Mỗi ngữ cảnh bỏ bớt bộ lọc và các trường không
 * liên quan để giữ giao diện lean, ví dụ hồ sơ giáo viên không cần
 * chọn lại giáo viên.
 */
export type TimetableCalendarMode =
    /**
     * Toàn trường: màn hình quản trị của ban giám hiệu, xem TKB chung của
     * mọi cơ sở. `school` giữ lại để các màn hình cũ không đổi call site.
     */
    | "overview"
    | "school"
    | "campus"
    | "grade"
    | "class"
    /**
     * Lịch của một học sinh, lấy theo lớp của học sinh nên hiển thị giống
     * ngữ cảnh lớp.
     */
    | "student"
    | "teacher"
    | "room";

/**
 * Sự kiện hiển thị, chuẩn hóa từ `TimetableEntry` cùng tên hiển thị
 * tra cứu sẵn để tầng lớp hiển thị không phải tra cứu lại.
 */
export interface TimetableEvent {
    id: string;

    entry: TimetableEntry;

    academicYearId: string;

    semesterId: string;

    campusId: string;

    campusName: string;

    classId: string;

    className: string;

    grade?: number;

    teacherId: string;

    teacherName: string;

    subjectId: string;

    subjectName: string;

    colorTone: string;

    roomId: string;

    roomCode: string;

    dayOfWeek: WeekDay;

    period: number;

    session: TimetableSession;

    startTime: string;

    endTime: string;

    week: number;

    status: TimetableEntryStatus;

    conflicts: TimetableConflictType[];
}

export interface TimetableCalendarFilters {
    academicYearId?: string;

    semesterId?: string;

    /**
     * `0` nghĩa là toàn học kỳ. Tuần cụ thể chỉ khớp với tiết có
     * `week` trùng tuần, còn tiết `week = 0` là lịch lặp hằng tuần.
     */
    week?: number;

    /**
     * Buổi đang xem. Bỏ trống nghĩa là cả ngày, lưới hiển thị mọi buổi
     * có tiết trong tuần đang chọn.
     */
    session?: TimetableSession;

    /**
     * Thứ trong tuần đang xem. Bỏ trống nghĩa là xem cả tuần, chọn một thứ
     * thì lưới chỉ còn cột của thứ đó.
     */
    dayOfWeek?: WeekDay;

    campusId?: string;

    grade?: number;

    classId?: string;

    teacherId?: string;

    subjectId?: string;

    roomId?: string;
}

export interface TimetableCalendarDay {
    day: WeekDay;

    label: string;

    /**
     * Ngày dương lịch theo `dd/MM/yyyy`, rỗng khi chưa có học kỳ để
     * suy ra tuần học.
     */
    date: string;

    dateLabel: string;

    isToday: boolean;
}

export interface TimetableSessionBlock {
    session: TimetableSession;

    label: string;

    /**
     * Chỉ gồm các tiết thực sự có dữ liệu trong tuần đang xem,
     * tránh hiện dòng trống không mang thông tin.
     */
    periods: TimetablePeriod[];
}

export interface TimetableSlot {
    day: WeekDay;

    period: number;
}

export interface TimetableCurrentSlot extends TimetableSlot {
    /**
     * Phần trăm thời gian đã trôi qua của tiết, dùng để đặt vạch
     * giờ hiện tại.
     */
    progress: number;

    /**
     * Giờ hiện tại dạng HH:mm, hiện cạnh vạch đỏ ở cột tiết.
     */
    label: string;
}

export interface TimetableCalendarModel {
    events: TimetableEvent[];

    days: TimetableCalendarDay[];

    sessions: TimetableSessionBlock[];

    bySlot: Map<string, TimetableEvent[]>;

    conflicts: TimetableConflict[];

    conflictsBySlot: Map<string, TimetableConflict[]>;

    /**
     * Danh sách loại xung đột có mặt trong tuần đang xem, dùng cho
     * thanh tổng hợp cảnh báo.
     */
    conflictTypes: TimetableConflictType[];

    currentSlot: TimetableCurrentSlot | null;

    isEmpty: boolean;

    weekLabel: string;

    totalLessons: number;

    /**
     * Số lớp và môn khác nhau xuất hiện trong tuần đang xem, giúp người
     * dùng thấy phạm vi lịch sau khi lọc.
     */
    totalClasses: number;

    totalSubjects: number;

    totalConflicts: number;

    /**
     * Chú giải màu theo môn của các môn đang có tiết trong tuần đang xem.
     */
    legend: {
        subjectId: string;

        subjectName: string;

        tone: string;

        color: string;
    }[];
}

export interface UseTimetableCalendarOptions {
    entries: TimetableEntry[];

    lookups: TimetableCalendarLookups;

    /**
     * Học kỳ dùng để suy ra ngày dương lịch của từng tuần học.
     */
    semester?: Semester;

    filters?: TimetableCalendarFilters;

    week?: number;

    /**
     * Ngày dùng để đánh dấu cột "hôm nay". Mặc định ngày hệ thống.
     */
    today?: Date;

    /**
     * Thời điểm dùng cho vạch giờ hiện tại. Mặc định ngày hệ thống.
     */
    now?: Date;

    /**
     * Xung đột do bên ngoài cung cấp. Bỏ trống thì tự suy ra từ các
     * bộ xung đột cùng ngữ cảnh.
     */
    conflicts?: TimetableConflict[];
}

export interface TimetableCalendarProps extends UseTimetableCalendarOptions {
    mode?: TimetableCalendarMode;

    /**
     * Định danh thực thể của ngữ cảnh, dùng cho deep-link chuẩn bị.
     */
    entityId?: string;

    /**
     * Học kỳ dùng làm ngữ cảnh để tính ngày dương lịch. Danh sách học kỳ
     * cho bộ lọc mặc định lấy từ ngữ cảnh này, màn hình có nhiều học
     * kỳ trong dữ liệu thì truyền thêm `semesterOptions`.
     */
    semesterOptions?: Semester[];

    onWeekChange?: (week: number) => void;

    /**
     * Điều hướng tới trang chi tiết của đối tượng được bấm trong hộp chi tiết
     * tiết học (giáo viên, lớp, phòng). Không truyền thì các liên kết chỉ
     * hiển thị dạng văn bản.
     */
    onNavigate?: (to: string) => void;

    onFiltersChange?: (filters: TimetableCalendarFilters) => void;

    showFilters?: boolean;

    /**
     * Bỏ tắt bộ chọn học kỳ khi màn hình cha đã có sẵn ở đầu trang.
     */
    showSemesterFilter?: boolean;

    /**
     * Bỏ tắt bộ chọn cơ sở khi ngữ cảnh đã cố định hoặc màn hình cha
     * đã có sẵn ở đầu trang.
     */
    showCampusFilter?: boolean;

    /**
     * Bật bộ chọn khối ở ngữ cảnh giáo viên để thu hẹp danh sách lớp.
     */
    showGradeFilter?: boolean;

    /**
     * Bật bộ chọn môn học.
     */
    showSubjectFilter?: boolean;

    /**
     * Bật bộ chọn thứ trong tuần. Mặc định bật vì đây là cách nhanh nhất để
     * ban giám hiệu xem một ngày cụ thể.
     */
    showDayFilter?: boolean;

    /**
     * Bật bộ chọn năm học. Cần truyền `academicYearOptions` thì mới có
     * danh sách chọn.
     */
    showAcademicYearFilter?: boolean;

    /**
     * Danh sách năm học cho bộ chọn năm học.
     */
    academicYearOptions?: AcademicYear[];

    /**
     * Hiện chú giải màu theo môn học ngay dưới bộ lọc, phục vụ khi màu
     * mang ý nghĩa nghiệp vụ.
     */
    showLegend?: boolean;

    /**
     * Giới hạn lựa chọn khối/lớp/phòng/môn theo đúng các tiết đang có
     * trong phạm vi cố định của ngữ cảnh, nhờ vậy mọi lựa chọn đều bảo
     * đảm có dữ liệu thay vì dẫn tới một lưới trống.
     */
    scopeOptionsToEntries?: boolean;

    showClass?: boolean;

    showSubject?: boolean;

    showTeacher?: boolean;

    showRoom?: boolean;

    showCampus?: boolean;

    /**
     * Bật các dấu hiệu cảnh báo xung đột trên lưới. Mặc định tắt vì lưới
     * dùng để tra cứu nhanh, việc đối chiếu xung đột thuộc nghiệp vụ
     * kiểm tra và chỉnh sửa.
     */
    showConflictIndicators?: boolean;

    onSelectSlot?: (
        slot: TimetableSlot,
        events: TimetableEvent[],
    ) => void;

    onSelectEvent?: (event: TimetableEvent) => void;

    emptyText?: string;

    className?: string;
}
