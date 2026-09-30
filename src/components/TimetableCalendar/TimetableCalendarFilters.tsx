import {
    Select,
    Space,
} from "antd";

import type {
    AcademicYear,
    SchoolClass,
    Semester,
} from "@/mock/common/types";

import type {
    CalendarFilterScope,
} from "./helpers";

import {
    CALENDAR_DAYS,
    dayLabel,
} from "./helpers";

import type {
    TimetableCalendarFilters as CalendarFilters,
    TimetableCalendarMode,
} from "./types";

import type {
    TimetableCalendarLookups,
} from "./lookups";

export interface TimetableFilterOption {
    value: string | number;

    label: string;
}

export interface TimetableCalendarFiltersProps {
    mode?: TimetableCalendarMode;

    filters: CalendarFilters;

    semesters: Semester[];

    lookups: TimetableCalendarLookups;

    /**
     * Tuần đang được áp dụng sau khi đã quy đổi `week = 0` thành tuần
     * hiện tại, để bộ chọn không hiển thị sai nhãn "Tất cả tuần".
     */
    week: number;

    weekOptions: TimetableFilterOption[];

    /**
     * Phạm vi lựa chọn thu hẹp theo tiết đang có. Bỏ trống thì danh
     * sách lấy từ toàn bộ dữ liệu tra cứu như trước.
     */
    scope?: CalendarFilterScope | null;

    onChange: (filters: CalendarFilters) => void;

    /**
     * Cho phép ẩn nhóm lọc phạm vi khi ngữ cảnh đã cố định
     * (ví dụ tab thời khóa biểu của một lớp).
     */
    showScope?: boolean;

    /**
     * Đặt false khi màn hình cha đã có bộ chọn học kỳ ở đầu trang để
     * tránh hai nút điều khiển cho cùng một dữ liệu.
     */
    showSemester?: boolean;

    /**
     * Đặt false khi màn hình cha đã có bộ chọn cơ sở ở đầu trang.
     */
    showCampus?: boolean;

    /**
     * Bật bộ chọn khối ở ngữ cảnh giáo viên để thu hẹp danh sách lớp.
     */
    showGrade?: boolean;

    showSubject?: boolean;

    /**
     * Bật bộ chọn năm học. Cần `academicYears` thì mới có danh sách chọn.
     */
    showAcademicYear?: boolean;

    academicYears?: AcademicYear[];

    /**
     * Bật bộ chọn thứ trong tuần.
     */
    showDay?: boolean;
}

const gradeLabel = (grade: number): string => `Khối ${grade}`;

const gradeOptionsOf = (
    lookups: TimetableCalendarLookups,
    campusId: string,
): TimetableFilterOption[] => {
    const grades = new Map<number, string>();

    for (const classItem of lookups.classById.values()) {
        if (campusId && classItem.campusId !== campusId) {
            continue;
        }

        grades.set(classItem.grade, gradeLabel(classItem.grade));
    }

    return [...grades.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([value, label]) => ({ value, label }));
};

const classOptionsOf = (
    classes: SchoolClass[],
    campusId: string,
    grade: number | undefined,
): TimetableFilterOption[] =>
    classes
        .filter((classItem) => !campusId || classItem.campusId === campusId)
        .filter((classItem) =>
            grade === undefined || classItem.grade === grade)
        .sort((a, b) => a.grade - b.grade || a.code.localeCompare(b.code))
        .map((classItem) => ({
            value: classItem.id,
            label: classItem.name,
        }));

const toClassOptions = (
    classes: SchoolClass[],
    scope: CalendarFilterScope,
): TimetableFilterOption[] => classOptionsOf(classes, "", undefined)
    .filter((option) => scope.classIds.has(option.value as string))
    .map((option) => {
        const classItem = classes.find((item) => item.id === option.value);

        return {
            value: option.value,
            label: classItem
                ? `${classItem.name} · Khối ${classItem.grade}`
                : option.label,
        };
    });

/**
 * Bộ lọc theo ngữ cảnh: luôn có học kỳ và tuần, thêm phạm vi cơ sở /
 * khối / lớp / giáo viên / môn / phòng nhưng chỉ khi ngữ cảnh cần.
 *
 * Lọc luôn cascade theo thứ tự cơ sở → khối → lớp: đổi cơ sở hoặc
 * khối sẽ bỏ lớp đang chọn nếu lớp đó không còn thuộc phạm vi mới.
 *
 * Khi có `scope`, danh sách khối/lớp/môn/phòng chỉ gồm những gì đang
 * có tiết trong phạm vi cố định nên mọi lựa chọn đều dẫn tới lưới có
 * dữ liệu thay vì một màn trống không rõ nguyên nhân.
 */
const TimetableCalendarFilters = ({
    mode = "school",
    filters,
    semesters,
    lookups,
    week,
    weekOptions,
    scope,
    onChange,
    showScope = true,
    showSemester = true,
    showCampus: showCampusProp,
    showGrade: showGradeProp,
    showSubject = false,
    showAcademicYear = false,
    academicYears = [],
    showDay = true,
}: TimetableCalendarFiltersProps) => {
    const campusId = filters.campusId ?? "";

    const grade = filters.grade;

    const showCampus = showCampusProp ??
        (showScope && mode !== "campus");

    const showGrade = showGradeProp ??
        (showScope &&
            mode !== "grade" &&
            mode !== "teacher" &&
            mode !== "room");
    const showClass = showScope &&
        mode !== "class" &&
        mode !== "student";
    const showTeacher = showScope && mode !== "teacher";
    const showRoom = showScope && mode !== "room";

    const update = (patch: Partial<CalendarFilters>): void => {
        onChange({ ...filters, ...patch });
    };

    const classes = [...lookups.classById.values()];

    const inScope = <T,>(value: T | undefined, set: Set<T>): boolean =>
        !scope || value === undefined || set.has(value);

    const classStillInScope = (
        classId: string | undefined,
        nextCampusId: string,
        nextGrade: number | undefined,
    ): string | undefined => {
        if (!classId) {
            return undefined;
        }

        const target = lookups.classById.get(classId);

        if (!target) {
            return undefined;
        }

        const matchesCampus = !nextCampusId ||
            target.campusId === nextCampusId;

        const matchesGrade = nextGrade === undefined ||
            target.grade === nextGrade;

        if (!scope) {
            return matchesCampus && matchesGrade ? classId : undefined;
        }

        const matchesScope = scope.classIds.has(classId) &&
            scope.grades.has(target.grade);

        return matchesCampus && matchesGrade && matchesScope
            ? classId
            : undefined;
    };

    return (
        <Space
            size={8}
            wrap
            className="tt-cal-filters"
        >
            {showAcademicYear && academicYears.length > 0 && (
                <Select
                    allowClear
                    placeholder="Tất cả năm học"
                    value={filters.academicYearId || undefined}
                    style={{ minWidth: 170 }}
                    options={academicYears.map((year) => ({
                        value: year.id,
                        label: year.name,
                    }))}
                    onChange={(value) => update({
                        academicYearId: value ?? undefined,
                    })}
                />
            )}

            {showSemester && (
                <Select
                    allowClear
                    placeholder="Tất cả học kỳ"
                    value={filters.semesterId || undefined}
                    style={{ minWidth: 170 }}
                    options={semesters.map((semester) => ({
                        value: semester.id,
                        label: `${semester.name} · ${semester.academicYearId}`,
                    }))}
                    onChange={(value) =>
                        update({ semesterId: value ?? undefined })}
                />
            )}

            <Select
                value={week}
                style={{ minWidth: 120 }}
                options={weekOptions}
                onChange={(value) => update({ week: value })}
            />

            {showDay && (
                <Select
                    allowClear
                    placeholder="Cả tuần"
                    value={filters.dayOfWeek ?? undefined}
                    style={{ minWidth: 140 }}
                    options={CALENDAR_DAYS.map((day) => ({
                        value: day,
                        label: dayLabel(day),
                    }))}
                    onChange={(value) => update({
                        dayOfWeek: (value ?? undefined) as
                            | CalendarFilters["dayOfWeek"],
                    })}
                />
            )}

            {showCampus && (
                <Select
                    allowClear
                    placeholder="Tất cả cơ sở"
                    value={campusId || undefined}
                    style={{ minWidth: 170 }}
                    options={[...lookups.campusById.values()]
                        .sort((a, b) => a.code.localeCompare(b.code))
                        .map((campus) => ({
                            value: campus.id,
                            label: campus.name,
                        }))}
                    onChange={(value) => {
                        const nextCampusId = value ?? "";

                        update({
                            campusId: value ?? undefined,
                            grade: gradeOptionsOf(
                                lookups,
                                nextCampusId,
                            ).some((option) => option.value === grade)
                                ? grade
                                : undefined,
                            classId: classStillInScope(
                                filters.classId,
                                nextCampusId,
                                grade,
                            ),
                            roomId: undefined,
                        });
                    }}
                />
            )}

            {showGrade && (
                <Select
                    allowClear
                    placeholder="Tất cả khối"
                    value={grade}
                    style={{ minWidth: 120 }}
                    options={scope
                        ? [...scope.grades]
                            .sort((a, b) => a - b)
                            .map((value) => ({
                                value,
                                label: gradeLabel(value),
                            }))
                        : gradeOptionsOf(lookups, campusId)}
                    onChange={(value) => {
                        const nextGrade = value ?? undefined;

                        update({
                            grade: nextGrade,
                            classId: classStillInScope(
                                filters.classId,
                                campusId,
                                nextGrade,
                            ),
                            roomId: undefined,
                        });
                    }}
                />
            )}

            {showClass && (
                <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Tất cả lớp"
                    value={filters.classId || undefined}
                    style={{ minWidth: 170 }}
                    options={scope
                        ? toClassOptions(classes, scope)
                        : classOptionsOf(classes, campusId, grade)}
                    onChange={(value) =>
                        update({ classId: value ?? undefined })}
                />
            )}

            {showTeacher && (
                <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Tất cả giáo viên"
                    value={filters.teacherId || undefined}
                    style={{ minWidth: 160 }}
                    options={[...lookups.personnelById.values()]
                        .sort((a, b) => a.fullName.localeCompare(b.fullName))
                        .map((person) => ({
                            value: person.id,
                            label: person.fullName,
                        }))}
                    onChange={(value) =>
                        update({ teacherId: value ?? undefined })}
                />
            )}

            {showSubject && (
                <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Tất cả môn"
                    value={filters.subjectId || undefined}
                    style={{ minWidth: 150 }}
                    options={[...lookups.subjectById.values()]
                        .filter((subject) =>
                            inScope(subject.id, scope?.subjectIds ??
                                new Set(lookups.subjectById.keys())))
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((subject) => ({
                            value: subject.id,
                            label: subject.name,
                        }))}
                    onChange={(value) =>
                        update({ subjectId: value ?? undefined })}
                />
            )}

            {showRoom && (
                <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Tất cả phòng"
                    value={filters.roomId || undefined}
                    style={{ minWidth: 150 }}
                    options={[...lookups.roomById.values()]
                        .filter((room) => inScope(room.id, scope?.roomIds ??
                            new Set(lookups.roomById.keys())))
                        .sort((a, b) => a.code.localeCompare(b.code))
                        .map((room) => ({
                            value: room.id,
                            label: `${room.code} · ${
                                lookups.campusName(room.campusId)
                            }`,
                        }))}
                    onChange={(value) =>
                        update({ roomId: value ?? undefined })}
                />
            )}
        </Space>
    );
};

export default TimetableCalendarFilters;
