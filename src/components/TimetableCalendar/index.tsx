import {
    AlertOutlined,
    CalendarOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";

import {
    Button,
    Segmented,
    Space,
    Tag,
    Tooltip,
} from "antd";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type {
    Semester,
    TimetableSession,
} from "@/mock/common/types";

import {
    CONFLICT_TYPE_LABELS,
    SESSION_LABELS,
    SESSION_ORDER,
} from "@/mock/common/types";

import type {
    TimetableCalendarFilters as CalendarFilters,
    TimetableCalendarProps,
    TimetableEvent,
} from "./types";

import type {
    TimetableFilterOption,
} from "./TimetableCalendarFilters";

import {
    filterScopeOf,
    normalizeCalendarFilters,
    optionScopeOf,
    resolveCalendarWeek,
    slotKey,
    weekCountOfSemester,
    weekOfDate,
} from "./helpers";

import {
    timetablesConflictOf,
    useTimetableCalendar,
} from "./useTimetableCalendar";

import TimetableCalendarFiltersView from "./TimetableCalendarFilters";
import TimetableEventBlock from "./TimetableEventBlock";
import TimetableEventDetail from "./TimetableEventDetail";

import "./style.scss";

/**
 * Lớp hiển thị thời khóa biểu dùng chung cho mọi ngữ cảnh: trường,
 * cơ sở, khối, lớp, giáo viên, phòng.
 *
 * Component nhận sẵn dữ liệu, bộ lọc và bộ xung đột từ bên ngoài nên
 * mỗi màn hình chỉ quyết định phạm vi hiển thị, không phải viết lại
 * lưới. Mặc định xem theo tuần học và chỉ render những buổi, tiết có
 * dữ liệu thật.
 */
const TimetableCalendar = ({
    entries,
    lookups,
    semester,
    semesterOptions,
    filters: controlledFilters,
    week: controlledWeek = 0,
    mode = "school",
    entityId,
    onWeekChange,
    onFiltersChange,
    onNavigate,
    showFilters = false,
    showSemesterFilter = true,
    showCampusFilter = true,
    showGradeFilter,
    showSubjectFilter = false,
    showDayFilter = true,
    showAcademicYearFilter = false,
    academicYearOptions = [],
    showLegend = false,
    scopeOptionsToEntries = false,
    showClass = true,
    showSubject = true,
    showTeacher = true,
    showRoom = false,
    showCampus = false,
    showConflictIndicators = false,
    onSelectSlot,
    onSelectEvent,
    emptyText = "Chưa có tiết học nào trong tuần này.",
    className,
    today,
    now,
    conflicts,
}: TimetableCalendarProps) => {
    /**
     * Bộ lọc khởi tạo theo ngữ cảnh cố định: học kỳ đang xem và thực thể
     * của màn hình. Giữ nguyên tập giá trị này để nút "Xoá bộ lọc" chỉ
     * gỡ phần người dùng chọn thêm, không mất ngữ cảnh.
     */
    const defaultFilters = useCallback((): CalendarFilters => ({
        semesterId: semester?.id,
        week: controlledWeek,
        campusId: entityId && mode === "campus" ? entityId : undefined,
        classId: entityId && (mode === "class" || mode === "student")
            ? entityId
            : undefined,
        grade: entityId && mode === "grade"
            ? Number.parseInt(entityId, 10)
            : undefined,
        teacherId: entityId && mode === "teacher" ? entityId : undefined,
        roomId: entityId && mode === "room" ? entityId : undefined,
    }), [semester, controlledWeek, entityId, mode]);

    const [localFilters, setLocalFilters] = useState<CalendarFilters>(
        defaultFilters,
    );

    const filters = controlledFilters ?? localFilters;

    const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(
        null,
    );

    const currentWeek = useMemo(() => {
        const current = weekOfDate(semester, today ?? new Date());

        return current && current > 0 ? current : 1;
    }, [semester, today]);

    /**
     * `0` là lịch lặp hằng tuần nên mặc định nhảy về tuần đang xem học
     * thay vì hiện nhãn "Tuần 0".
     */
    const week = resolveCalendarWeek(filters.week, currentWeek);

    const model = useTimetableCalendar({
        entries,
        lookups,
        semester,
        filters,
        week,
        today,
        now,
        conflicts,
    });

    const semesters: Semester[] = useMemo(
        () => (semesterOptions
            ? semesterOptions
            : semester
                ? [semester]
                : []),
        [semesterOptions, semester],
    );

    const weekCount = useMemo(
        () => (semester ? weekCountOfSemester(semester) : 1),
        [semester],
    );

    const weekOptions: TimetableFilterOption[] = useMemo(
        () => Array.from({ length: Math.max(1, weekCount) }, (_item, index) => ({
            value: index + 1,
            label: `Tuần ${index + 1}`,
        })),
        [weekCount],
    );

    /**
     * Phạm vi lựa chọn của bộ lọc. Khi bật `scopeOptionsToEntries`, danh
     * sách khối/lớp/môn/phòng chỉ gồm những gì thực sự có tiết trong
     * phạm vi đang xem nên không lựa chọn nào dẫn tới lưới trống.
     */
    const scopeFor = useCallback((next: CalendarFilters, nextWeek: number) =>
        (scopeOptionsToEntries
            ? filterScopeOf(
                optionScopeOf(entries, next, lookups, nextWeek),
                lookups,
            )
            : null),
    [scopeOptionsToEntries, entries, lookups]);

    const optionScope = useMemo(
        () => scopeFor(filters, week),
        [scopeFor, filters, week],
    );

    /**
     * Mọi thay đổi đều đi qua đây nên lựa chọn cũ luôn được kiểm tra
     * lại theo phạm vi mới: đổi tuần hay đổi buổi sẽ bỏ lớp, môn,
     * phòng không còn tiết trong tuần vừa chọn.
     */
    const setFilters = (
        next: CalendarFilters,
        nextWeek: number = week,
    ): void => {
        const scope = scopeFor(next, nextWeek);

        const settled = scope
            ? normalizeCalendarFilters(next, scope)
            : next;

        setLocalFilters(settled);

        onFiltersChange?.(settled);
    };

    const changeWeek = (next: number): void => {
        const clamped = Math.min(Math.max(1, next), Math.max(1, weekCount));

        setFilters({ ...filters, week: clamped }, clamped);

        onWeekChange?.(clamped);
    };

    /**
     * Lịch lặp hằng tuần nên `0` là tuần đang xem học: nhảy về đây thì
     * vạch giờ hiện tại tự đi theo tuần học đang chạy.
     */
    const goCurrentWeek = (): void => {
        setFilters({ ...filters, week: 0 }, currentWeek);

        onWeekChange?.(currentWeek);
    };

    /**
     * Mặc định bộ lọc là "Cả ngày" nên lưới có cả hai buổi, lúc đó dải tên
     * buổi chỉ là dòng thừa vì tiết sáng hiện ngay trên tiết chiều. Dải này
     * chỉ có ý nghĩa khi người dùng lọc theo buổi, lúc đó `model.sessions`
     * chỉ còn đúng một buổi.
     */
    const showSessionLabel = model.sessions.length === 1;

    const sessionOptions = useMemo(
        () => [
            { value: "", label: "Cả ngày" },
            ...SESSION_ORDER.map((session) => ({
                value: session,
                label: SESSION_LABELS[session],
            })),
        ],
        [],
    );

    /**
     * Mở lưới ở tuần hiện hành thì đưa tiết đang diễn ra vào giữa khung
     * nhìn giống Google Calendar. Chỉ chạy một lần mỗi lần mount để không
     * giành quyền cuộn khỏi người dùng.
     */
    const currentRowRef = useRef<HTMLDivElement | null>(null);

    const scrolledToCurrentSlot = useRef(false);

    useEffect(() => {
        if (!model.currentSlot || scrolledToCurrentSlot.current) {
            return;
        }

        scrolledToCurrentSlot.current = true;

        currentRowRef.current?.scrollIntoView({
            block: "center",
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches
                ? "auto"
                : "smooth",
        });
    }, [model.currentSlot]);

    /**
     * Có lựa chọn nào nằm ngoài phần ngữ cảnh cố định thì mới gợi ý
     * xoá bộ lọc, tránh một lưới trống vì lý do thật sự.
     */
    const hasUserFilters = useMemo(() => {
        const base = defaultFilters();

        return Object.entries(filters).some(([key, value]) =>
            value !== undefined &&
            value !== "" &&
            value !== 0 &&
            base[key as keyof CalendarFilters] !== value);
    }, [filters, defaultFilters]);

    const selectEvent = (event: TimetableEvent): void => {
        setSelectedEvent(event);

        onSelectEvent?.(event);
    };

    return (
        <section
            className={["tt-cal", className ?? ""].filter(Boolean).join(" ")}
        >
            <header className="tt-cal__head">
                <div className="tt-cal__head-main">
                    <div className="tt-cal__week-nav">
                        <Button
                            size="small"
                            icon={<LeftOutlined />}
                            aria-label="Tuần trước"
                            onClick={() => changeWeek(week - 1)}
                        />

                        <strong className="tt-cal__week-label">
                            {model.weekLabel}
                        </strong>

                        <Button
                            size="small"
                            icon={<RightOutlined />}
                            aria-label="Tuần sau"
                            onClick={() => changeWeek(week + 1)}
                        />

                        {week !== currentWeek && (
                            <Tooltip title="Về tuần hiện hành">
                                <Button
                                    size="small"
                                    className="tt-cal__week-today"
                                    icon={<CalendarOutlined />}
                                    aria-label="Về tuần hiện hành"
                                    onClick={goCurrentWeek}
                                />
                            </Tooltip>
                        )}

                        <Segmented
                            size="small"
                            className="tt-cal__session-switch"
                            aria-label="Buổi học"
                            value={filters.session ?? ""}
                            options={sessionOptions}
                            onChange={(value) =>
                                setFilters({
                                    ...filters,
                                    session: value === "" || !value
                                        ? undefined
                                        : (value as TimetableSession),
                                })}
                        />
                    </div>

                    <Space size={8} wrap>
                        <Tag className="tt-cal__metric">
                            {model.totalLessons} tiết
                        </Tag>

                        {model.totalClasses > 0 && (
                            <Tag className="tt-cal__metric">
                                {model.totalClasses} lớp
                            </Tag>
                        )}

                        {model.totalSubjects > 0 && (
                            <Tag className="tt-cal__metric">
                                {model.totalSubjects} môn
                            </Tag>
                        )}

                        {showConflictIndicators && (
                            model.totalConflicts > 0 ? (
                                <Tooltip title="Số xung đột trong tuần đang xem">
                                    <Tag
                                        color="red"
                                        icon={<AlertOutlined />}
                                        className="tt-cal__metric"
                                    >
                                        {model.totalConflicts} xung đột
                                    </Tag>
                                </Tooltip>
                            ) : (
                                <Tag
                                    color="green"
                                    className="tt-cal__metric"
                                >
                                    Không có xung đột
                                </Tag>
                            )
                        )}

                        {showConflictIndicators && model.conflictTypes.map(
                            (type) => (
                                <Tag
                                    key={type}
                                    color="volcano"
                                    className="tt-cal__metric"
                                >
                                    {CONFLICT_TYPE_LABELS[type]}
                                </Tag>
                            ),
                        )}
                    </Space>
                </div>

                {showFilters && (
                    <div className="tt-cal__head-filters">
                        <TimetableCalendarFiltersView
                            mode={mode}
                            filters={filters}
                            semesters={semesters}
                            lookups={lookups}
                            week={week}
                            weekOptions={weekOptions}
                            scope={optionScope}
                            onChange={setFilters}
                            showSemester={showSemesterFilter}
                            showCampus={showCampusFilter}
                            showGrade={showGradeFilter}
                            showSubject={showSubjectFilter}
                            showDay={showDayFilter}
                            showAcademicYear={showAcademicYearFilter}
                            academicYears={academicYearOptions}
                        />
                    </div>
                )}

                {showLegend && model.legend.length > 0 && (
                    <div className="tt-cal__legend">
                        <span className="tt-cal__legend-title">
                            Môn học
                        </span>

                        {model.legend.map((item) => (
                            <Tag
                                key={item.subjectId}
                                color={item.tone}
                                className="tt-cal__legend-item"
                            >
                                {item.subjectName}
                            </Tag>
                        ))}
                    </div>
                )}
            </header>

            {model.isEmpty ? (
                <div className="tt-cal__empty">
                    <p>{emptyText}</p>

                    {hasUserFilters && (
                        <Button
                            size="small"
                            onClick={() => setFilters(defaultFilters())}
                        >
                            Xoá bộ lọc
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="tt-cal__scroll">
                        <div
                            className="tt-cal__grid"
                            style={{
                                gridTemplateColumns:
                                    `var(--tt-cal-time-col) repeat(${model.days.length}, minmax(var(--tt-cal-day-min), 1fr))`,
                            }}
                        >
                            <div
                                className="tt-cal__corner"
                                role="columnheader"
                            >
                                Tiết / Thứ
                            </div>

                            {model.days.map((day) => (
                                <div
                                    key={day.day}
                                    className={[
                                        "tt-cal__day-head",
                                        day.isToday ? "is-today" : "",
                                    ].filter(Boolean).join(" ")}
                                    role="columnheader"
                                >
                                    <strong>{day.label}</strong>

                                    {day.dateLabel && (
                                        <span className="tt-cal__day-date">
                                            {day.dateLabel}
                                        </span>
                                    )}

                                    {day.isToday && (
                                        <Tag className="tt-cal__day-today">
                                            Hôm nay
                                        </Tag>
                                    )}
                                </div>
                            ))}

                            {showSessionLabel && model.sessions.map(
                                (block) => (
                                    <div
                                        key={block.session}
                                        className="tt-cal__session"
                                    >
                                        <span>{block.label}</span>
                                    </div>
                                ),
                            )}

                            {model.sessions.flatMap((block) =>
                                block.periods.map((period) => {
                                    const currentSlot =
                                        model.currentSlot;

                                    const isCurrentPeriod =
                                        currentSlot?.period ===
                                        period.period;

                                    const progress =
                                        currentSlot?.progress ?? 0;

                                    return (
                                        <div
                                            key={`${block.session}-${period.period}`}
                                            className="tt-cal__row"
                                            ref={isCurrentPeriod
                                                ? currentRowRef
                                                : undefined}
                                        >
                                            <div
                                                className="tt-cal__time"
                                                role="rowheader"
                                            >
                                                <strong>
                                                    Tiết {period.period}
                                                </strong>

                                                <span>
                                                    {period.startTime}
                                                    <br />
                                                    {period.endTime}
                                                </span>

                                                {isCurrentPeriod && (
                                                    <span
                                                        className="tt-cal__now-label"
                                                        style={{
                                                            top: `${
                                                                progress *
                                                                100
                                                            }%`,
                                                        }}
                                                    >
                                                        {
                                                            currentSlot?.label
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {model.days.map((day) => {
                                                const key = slotKey(
                                                    day.day,
                                                    period.period,
                                                );

                                                const events =
                                                    model.bySlot.get(key) ??
                                                    [];

                                                const slotConflicts =
                                                    showConflictIndicators
                                                        ? model.conflictsBySlot.get(
                                                            key,
                                                        ) ?? []
                                                        : [];

                                                const isCurrentSlot =
                                                    isCurrentPeriod &&
                                                    currentSlot
                                                        ?.day === day.day;

                                                return (
                                                    <div
                                                        key={key}
                                                        role="gridcell"
                                                        className={[
                                                            "tt-cal__cell",
                                                            events.length === 0
                                                                ? "is-empty"
                                                                : "",
                                                            day.isToday
                                                                ? "is-today"
                                                                : "",
                                                            slotConflicts.length >
                                                            0
                                                                ? "has-conflict"
                                                                : "",
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" ")}
                                                        onClick={() =>
                                                            onSelectSlot?.(
                                                                {
                                                                    day: day.day,
                                                                    period: period
                                                                        .period,
                                                                },
                                                                events,
                                                            )}
                                                    >
                                                        {slotConflicts.length > 0 && (
                                                            <span
                                                                className="tt-cal__cell-conflict"
                                                                aria-label={`${slotConflicts.length} xung đột tại ô này`}
                                                            >
                                                                <AlertOutlined />
                                                                {" "}
                                                                {
                                                                    slotConflicts
                                                                        .length
                                                                }
                                                            </span>
                                                        )}


                                                        {events.length === 0 ? (
                                                            <span className="tt-cal__cell-empty">
                                                                Không có lịch
                                                            </span>
                                                        ) : (
                                                            events.map((event) => (
                                                                <TimetableEventBlock
                                                                    key={event.id}
                                                                    event={event}
                                                                    showClass={showClass}
                                                                    showSubject={showSubject}
                                                                    showTeacher={showTeacher}
                                                                    showRoom={showRoom}
                                                                    showCampus={showCampus}
                                                                    showConflicts={
                                                                        showConflictIndicators
                                                                    }
                                                                    onSelect={selectEvent}
                                                                />
                                                            ))
                                                        )}

                                                        {isCurrentSlot && (
                                                            <span
                                                                className="tt-cal__now-line"
                                                                style={{
                                                                    top: `${
                                                                        progress *
                                                                        100
                                                                    }%`,
                                                                }}
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }))}
                        </div>
                    </div>

                    <p className="tt-cal__hint">
                        Chọn một tiết để xem chi tiết. Ô trống nghĩa là
                        không có lịch tại khung giờ đó.
                    </p>
                </>
            )}

            <TimetableEventDetail
                open={selectedEvent !== null}
                event={selectedEvent}
                conflicts={showConflictIndicators && selectedEvent
                    ? timetablesConflictOf(model.conflicts, selectedEvent.id)
                    : []}
                mode={mode}
                onNavigate={onNavigate}
                onClose={() => setSelectedEvent(null)}
            />
        </section>
    );
};

export default TimetableCalendar;

export type {
    TimetableCalendarFilters as TimetableCalendarFiltersState,
} from "./types";

export type {
    TimetableEvent,
    TimetableSlot,
} from "./types";
