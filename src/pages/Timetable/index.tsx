import {
    BankOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    HomeOutlined,
    ReadOutlined,
    ReloadOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from "@ant-design/icons";

import {
    Button,
    Select,
    Space,
    Tabs,
    message,
} from "antd";

import type {
    TabsProps,
} from "antd";

import {
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import StatsCard from "@/components/dashboard/StatCard";

import {
    canThoSemesters,
} from "@/mock/canTho";

import {
    subjects,
} from "@/mock/common";

import type {
    TimetableConflict,
    TimetableEntry,
    TimetableEntryStatus,
    TimetableHistoryEntry,
    TimetableSuggestion,
    WeekDay,
} from "@/mock/common/types";

import {
    STATUS_LABELS,
} from "@/mock/common/types";

import {
    useAcademicYears,
} from "@/store/useAcademicYears";

import {
    useCampuses,
} from "@/store/useCampuses";

import {
    useClasses,
} from "@/store/useClasses";

import {
    usePersonnel,
} from "@/store/usePersonnel";

import {
    usePersonnelAssignments,
} from "@/store/usePersonnelAssignments";

import {
    useRooms,
} from "@/store/useRooms";

import {
    useSemesters,
} from "@/store/useSemesters";

import {
    useTimetableHistory,
} from "@/store/useTimetableHistory";

import {
    useTimetables,
} from "@/store/useTimetables";

import {
    computeQuotaUsage,
    suggestFreeSlots,
} from "@/utils/timetable";

import TimetableCalendar from "@/components/TimetableCalendar";

import type {
    TimetableCalendarFiltersState as TimetableCalendarFilterState,
} from "@/components/TimetableCalendar";

import {
    buildCalendarConflicts,
    resolveCalendarWeek,
    weekOfDate,
} from "@/components/TimetableCalendar/helpers";

import {
    summarizeTimetableWeek,
} from "@/components/TimetableCalendar/overview";

import AssignmentBoard from "./components/AssignmentBoard";
import CellDrawer from "./components/CellDrawer";
import ConflictPanel from "./components/ConflictPanel";
import RoomUsagePanel from "./components/RoomUsagePanel";
import VersionPipeline from "./components/VersionPipeline";

import {
    buildLookups,
} from "./helpers";

import "./style.scss";

const SCHOOL_ID = "can-tho-school-001";

const MAIN_CAMPUS_ID = "campus-main";

/**
 * Mặc định của màn hình quản trị: năm học đang hoạt động, học kỳ đầu tiên
 * của năm đó, tuần hiện tại và toàn bộ phân hiệu. Không mở sẵn một lớp hay
 * một giáo viên vì ban giám hiệu cần nhìn tổng thể trường.
 */
const ACTIVE_SEMESTER_FALLBACK = "2026-2027-HK1";

const tabsOf = (
    tabValue: string | null,
): string => {
    const valid = [
        "grid",
        "conflicts",
        "assignment",
        "versions",
        "rooms",
    ].includes(tabValue ?? "");

    return valid ? (tabValue as string) : "grid";
};

const TimetablePage = () => {
    const navigate = useNavigate();

    const [params, setParams] = useState(() => new URLSearchParams(
        window.location.search,
    ));

    const activeTab = tabsOf(params.get("tab"));

    const academicYearsApi = useAcademicYears(SCHOOL_ID);

    const activeYearId = academicYearsApi.activeYear?.id
        ?? ACTIVE_SEMESTER_FALLBACK.split("-H")[0];

    const [academicYearId, setAcademicYearId] = useState(activeYearId);

    const semestersApi = useSemesters(academicYearId);

    const [semesterId, setSemesterId] = useState(
        semestersApi.byAcademicYear[0]?.id ?? ACTIVE_SEMESTER_FALLBACK,
    );

    const [campusId, setCampusId] = useState<string>("");

    const [selectedSlot, setSelectedSlot] = useState<{
        day: WeekDay;

        period: number;
    } | null>(null);

    const campusesApi = useCampuses();

    const classesApi = useClasses();

    const personnelApi = usePersonnel();

    const roomsApi = useRooms();

    const timetables = useTimetables({
        academicYearId,
        semesterId,
        campusId: campusId || undefined,
    });

    const historyApi = useTimetableHistory({
        academicYearId,
        semesterId,
    });

    const currentSemester = useMemo(
        () => semestersApi.byAcademicYear.find(
            (semester) => semester.id === semesterId,
        ) ?? canThoSemesters.find(
            (semester) => semester.id === semesterId,
        ),
        [semesterId, semestersApi.byAcademicYear],
    );

    /**
     * Định mức giảng dạy phải theo đúng học kỳ đang xem, nếu không tab
     * Phân công và số liệu định mức sẽ lệch với lưới khi chọn HK2.
     */
    const semesterNumber = useMemo<1 | 2>(() => {
        const code = currentSemester?.code ?? currentSemester?.id ?? "";

        return code.replace(/\D/g, "").startsWith("2") ? 2 : 1;
    }, [currentSemester]);

    const assignmentApi = usePersonnelAssignments(
        undefined,
        {
            academicYear: academicYearId,
            semester: semesterNumber,
        },
    );

    const lookups = useMemo(
        () => buildLookups(
            subjects,
            classesApi.items,
            personnelApi.items,
            campusesApi.items,
            roomsApi.items,
        ),
        [classesApi.items, personnelApi.items, campusesApi.items, roomsApi.items],
    );

    const effective = timetables.effective;

    const roomCapacity = useMemo(
        () => {
            const map: Record<string, number> = {};

            for (const room of roomsApi.items) {
                map[room.id] = room.capacity;
            }

            return map;
        },
        [roomsApi.items],
    );

    const quotaSources = useMemo(
        () => assignmentApi.activeByTerm.map((item) => ({
            teacherId: item.personnelId,
            classId: item.classId,
            subjectId: item.subjectId,
            periodsPerWeek: item.periodsPerWeek,
        })),
        [assignmentApi.activeByTerm],
    );

    const conflicts: TimetableConflict[] = useMemo(
        () => buildCalendarConflicts(effective, {
            assignments: quotaSources,
            classes: classesApi.items,
            roomCapacity,
        }),
        [effective, quotaSources, classesApi.items, roomCapacity],
    );

    /**
     * Học kỳ, năm học và cơ sở đã có bộ chọn ở đầu trang nên lưới chỉ nhận
     * các bộ lọc còn lại để không có hai nút điều khiển cho cùng một dữ liệu.
     */
    const [calendarFilters, setCalendarFilters] =
        useState<TimetableCalendarFilterState>({});

    const scopedCalendarFilters = useMemo<TimetableCalendarFilterState>(
        () => ({
            ...calendarFilters,
            academicYearId,
            semesterId,
            campusId: campusId || undefined,
        }),
        [calendarFilters, academicYearId, semesterId, campusId],
    );

    /**
     * Tuần đang xem. Bỏ trống để lưới tự quy về tuần hiện tại của học kỳ,
     * đúng như mặc định "tuần hiện tại" của ban giám hiệu.
     */
    const [week, setWeek] = useState<number | undefined>(undefined);

    const activeWeek = useMemo(
        () => resolveCalendarWeek(
            scopedCalendarFilters.week,
            weekOfDate(currentSemester, new Date()) ?? 1,
        ),
        [scopedCalendarFilters.week, currentSemester],
    );

    /**
     * Tổng quan tuần suy ra từ đúng pipeline của lưới nên số liệu luôn
     * khớp với những tiết đang hiển thị, kể cả khi lọc cơ sở/khối/lớp/
     * giáo viên/môn/phòng.
     */
    const weekSummary = useMemo(
        () => summarizeTimetableWeek(
            effective,
            scopedCalendarFilters,
            lookups,
            activeWeek,
        ),
        [effective, scopedCalendarFilters, lookups, activeWeek],
    );

    const weekSummaryScope = useMemo(
        () => campusId
            ? campusesApi.byId.get(campusId)?.name ?? "cơ sở đang chọn"
            : "toàn trường",
        [campusId, campusesApi.byId],
    );

    const mainCampusName = campusesApi.byId.get(MAIN_CAMPUS_ID)?.name
        ?? "Trường";

    const weekLabelText = `Tuần ${activeWeek} · ${
        currentSemester?.name ?? ""
    } năm học ${academicYearId}`;

    const resetFilters = () => {
        setCampusId("");
        setCalendarFilters({});
        setWeek(undefined);
        setSemesterId(
            semestersApi.byAcademicYear[0]?.id ?? ACTIVE_SEMESTER_FALLBACK,
        );
    };

    const quotas = useMemo(
        () => computeQuotaUsage(effective, quotaSources),
        [effective, quotaSources],
    );

    const changeTab = (key: string) => {
        const next = new URLSearchParams(window.location.search);

        next.set("tab", key);

        window.history.replaceState({}, "", `?${next.toString()}`);

        setParams(next);
    };

    const openSlot = (day: WeekDay, period: number) => {
        setSelectedSlot({ day, period });
    };

    const drawerRows = useMemo(() => {
        if (!selectedSlot) {
            return [];
        }

        return (timetables.bySlot.get(
            `${selectedSlot.day}|${selectedSlot.period}`,
        ) ?? []).filter((entry) =>
            entry.academicYearId === academicYearId &&
            (
                !campusId ||
                entry.campusId === campusId
            ));
    }, [selectedSlot, timetables.bySlot, campusId, academicYearId]);

    const drawerConflicts = useMemo(() => {
        if (!selectedSlot) {
            return [];
        }

        return conflicts.filter((conflict) =>
            conflict.dayOfWeek === selectedSlot.day &&
            conflict.period === selectedSlot.period);
    }, [selectedSlot, conflicts]);

    const drawerSuggestions = useMemo<TimetableSuggestion[]>(() => {
        if (!selectedSlot) {
            return [];
        }

        const conflicted = drawerRows.find((entry) =>
            drawerConflicts.some((conflict) =>
                conflict.rows.some((row) => row.id === entry.id)));

        const primary = conflicted ?? drawerRows[0];

        if (!primary) {
            return [];
        }

        return suggestFreeSlots(
            effective,
            primary,
            {
                academicYearId: academicYearId,
                semesterId,
                classes: classesApi.items,
                assignments: quotaSources,
                week: primary.week || 0,
            },
            {
                roomIds: roomsApi.items
                    .filter((room) => room.campusId === primary.campusId)
                    .map((room) => room.id),
                limit: 5,
            },
        );
    }, [
        selectedSlot,
        drawerRows,
        drawerConflicts,
        effective,
        semesterId,
        academicYearId,
        classesApi.items,
        quotaSources,
        roomsApi.items,
    ]);

    const writeHistory = (
        entry: TimetableEntry,
        action: TimetableHistoryEntry["action"],
        reason: string,
        before?: Partial<TimetableEntry>,
        after?: Partial<TimetableEntry>,
    ) => {
        historyApi.create({
            id: `timetable-history-${Date.now().toString(36)}`,
            entryId: entry.id,
            academicYearId: entry.academicYearId,
            semesterId: entry.semesterId,
            campusId: entry.campusId,
            classId: entry.classId,
            action,
            actor: "Ban Giám hiệu",
            reason,
            before,
            after,
            createdAt: new Date().toISOString(),
        });
    };

    const applyTransition = (
        entry: TimetableEntry,
        status: TimetableEntryStatus,
    ) => {
        if (entry.status === "PUBLISHED" && status === "ADJUSTING") {
            adjustEntry(entry);

            return;
        }

        timetables.applyTransition(entry.id, status);

        if (entry.status !== status) {
            writeHistory(
                entry,
                "status_changed",
                `Chuyển trạng thái từ ${STATUS_LABELS[entry.status]} sang ${STATUS_LABELS[status]}.`,
                { status: entry.status },
                { status },
            );
        }

        message.success(
            `Chuyển trạng thái sang ${STATUS_LABELS[status]}`,
        );
    };

    const adjustEntry = (entry: TimetableEntry) => {
        const next = timetables.createAdjustment(entry.id, {
            dayOfWeek: entry.dayOfWeek,
            period: entry.period,
            roomId: entry.roomId,
        });

        if (!next) {
            message.warning(
                "Tiết này chưa ở trạng thái cho phép chỉnh sửa.",
            );

            return;
        }

        writeHistory(
            entry,
            "status_changed",
            `Tạo bản điều chỉnh v${next.version} thay cho tiết đã xuất bản.`,
            { status: entry.status, version: entry.version },
            { status: next.status, version: next.version, supersedesId: next.id },
        );

        message.success(`Đã tạo bản điều chỉnh v${next.version}`);
    };

    const applySuggestion = (
        entry: TimetableEntry,
        suggestion: TimetableSuggestion,
    ) => {
        const patch: Partial<TimetableEntry> = {
            dayOfWeek: suggestion.dayOfWeek,
            period: suggestion.period,
            roomId: suggestion.roomId,
        };

        if (entry.status === "PUBLISHED") {
            const next = timetables.createAdjustment(entry.id, patch);

            if (next) {
                writeHistory(
                    entry,
                    "moved",
                    "Dời tiết đã xuất bản sang ô thời gian trống (tạo bản điều chỉnh).",
                    {
                        dayOfWeek: entry.dayOfWeek,
                        period: entry.period,
                        roomId: entry.roomId,
                    },
                    patch,
                );

                message.success(
                    `Đã tạo bản điều chỉnh v${next.version} tại ô mới`,
                );

                setSelectedSlot(null);
            }

            return;
        }

        timetables.update({
            ...entry,
            ...patch,
            updatedAt: new Date().toISOString(),
        });

        writeHistory(
            entry,
            "moved",
            "Dời tiết sang ô thời gian trống.",
            {
                dayOfWeek: entry.dayOfWeek,
                period: entry.period,
                roomId: entry.roomId,
            },
            patch,
        );

        message.success("Đã dời tiết sang ô thời gian mới");

        setSelectedSlot(null);
    };

    const resolveConflict = (conflict: TimetableConflict) => {
        const primary = conflict.rows[0];

        if (!primary) {
            return;
        }

        if (drawerSuggestions.length > 0) {
            applySuggestion(primary, drawerSuggestions[0]);

            return;
        }

        message.warning("Chưa tìm được ô thời gian trống cho tiết này.");
    };

    const activeAssignments = assignmentApi.activeByTerm;

    const kpi = useMemo(() => {
        const quotaMissing = quotas.filter(
            (quota) => quota.assigned < quota.standard,
        ).length;

        const quotaOver = quotas.filter(
            (quota) => quota.assigned > quota.standard,
        ).length;

        return {
            lessons: effective.length,
            quotaMissing,
            quotaOver,
        };
    }, [effective, quotas]);

    const kpiCards = [
        {
            title: "Tiết trong lưới",
            value: kpi.lessons,
            icon: <ReadOutlined />,
            tone: "blue" as const,
            note: "bản có hiệu lực",
        },
        {
            title: "Thiếu tiết",
            value: kpi.quotaMissing,
            icon: <UnorderedListOutlined />,
            tone: "purple" as const,
            note: "so với phân công",
        },
        {
            title: "Vượt định mức",
            value: kpi.quotaOver,
            icon: <CheckCircleOutlined />,
            tone: "green" as const,
            note: "tiết thừa",
        },
    ];

    const weekSummaryCards = [
        {
            title: "Tổng tiết",
            value: weekSummary.totalLessons,
            icon: <ReadOutlined />,
            tone: "blue" as const,
            note: `tuần đang xem · ${weekSummaryScope}`,
        },
        {
            title: "Lớp có lịch",
            value: weekSummary.classCount,
            icon: <TeamOutlined />,
            tone: "green" as const,
            note: "lớp có ít nhất một tiết",
        },
        {
            title: "Giáo viên có lịch",
            value: weekSummary.teacherCount,
            icon: <UserOutlined />,
            tone: "purple" as const,
            note: "giáo viên được xếp tiết",
        },
        {
            title: "Phòng sử dụng",
            value: weekSummary.roomCount,
            icon: <BankOutlined />,
            tone: "orange" as const,
            note: "phòng học được dùng",
        },
        {
            title: "Phân hiệu hoạt động",
            value: weekSummary.campusCount,
            icon: <HomeOutlined />,
            tone: "blue" as const,
            note: "cơ sở có tiết trong tuần",
        },
    ];

    const items: TabsProps["items"] = [
        {
            key: "grid",
            label: "Lưới thời khóa biểu",
            children: (
                <div className="tt-overview">
                    <div className="tt-overview__summary">
                        <h4 className="tt-overview__summary-title">
                            Tổng quan tuần
                            {campusId
                                ? ` · ${weekSummaryScope}`
                                : " · toàn trường"}
                        </h4>

                        <div className="page-kpi">
                            {weekSummaryCards.map((card) => (
                                <StatsCard
                                    key={card.title}
                                    title={card.title}
                                    value={card.value}
                                    icon={card.icon}
                                    tone={card.tone}
                                    note={card.note}
                                />
                            ))}
                        </div>
                    </div>

                    <TimetableCalendar
                        entries={effective}
                        lookups={lookups}
                        semester={currentSemester}
                        semesterOptions={semestersApi.byAcademicYear}
                        academicYearOptions={academicYearsApi.items}
                        filters={scopedCalendarFilters}
                        week={week}
                        mode="overview"
                        showFilters
                        showSemesterFilter={false}
                        showCampusFilter={false}
                        showAcademicYearFilter={false}
                        showSubjectFilter
                        showDayFilter
                        showLegend
                        showRoom
                        scopeOptionsToEntries
                        onWeekChange={setWeek}
                        onFiltersChange={setCalendarFilters}
                        onNavigate={(to) => navigate(to)}
                    />
                </div>
            ),
        },
        {
            key: "conflicts",
            label: `Kiểm tra & chỉnh sửa (${conflicts.length})`,
            children: (
                <ConflictPanel
                    conflicts={conflicts}
                    quotas={quotas}
                    lookups={lookups}
                    rooms={roomsApi.byId}
                    onOpenSlot={(day, period) => {
                        changeTab("grid");

                        openSlot(day as WeekDay, period);
                    }}
                    onResolve={resolveConflict}
                />
            ),
        },
        {
            key: "assignment",
            label: "Phân công giảng dạy",
            children: (
                <AssignmentBoard
                    assignments={activeAssignments}
                    quotas={quotas}
                    lookups={lookups}
                    rooms={roomsApi.byId}
                    onCreate={(assignment) => {
                        assignmentApi.create(assignment);

                        message.success("Đã thêm phân công giảng dạy");
                    }}
                    onSelectClass={(classId) =>
                        navigate(`/operations/classes/${classId}`)}
                    onSelectTeacher={(personnelId) =>
                        navigate(`/operations/personnel/${personnelId}`)}
                />
            ),
        },
        {
            key: "versions",
            label: "Phiên bản & lịch sử",
            children: (
                <VersionPipeline
                    entries={timetables.items.filter(
                        (entry) =>
                            entry.academicYearId === academicYearId &&
                            (
                                !campusId ||
                                entry.campusId === campusId
                            ),
                    )}
                    history={historyApi.byTerm}
                    lookups={lookups}
                    onApplyTransition={(id, status) => {
                        const entry = timetables.byId.get(id);

                        if (entry) {
                            applyTransition(entry, status);
                        }
                    }}
                    onAdjust={adjustEntry}
                />
            ),
        },
        {
            key: "rooms",
            label: "Phòng & công suất",
            children: (
                <RoomUsagePanel
                    rooms={roomsApi.items}
                    classes={classesApi.items}
                    effective={effective}
                    lookups={lookups}
                    conflicts={conflicts}
                    onOpenCampus={(campusIdValue) =>
                        navigate(`/operations/campuses/${campusIdValue}`)}
                />
            ),
        },
    ];

    return (
        <div className="timetable-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            TOÀN TRƯỜNG
                        </span>

                        <h2>Thời khóa biểu</h2>

                        <p>
                            {mainCampusName} · {weekLabelText}
                        </p>
                    </div>

                    <div className="tt-scope">
                        <Space size={8} wrap>
                            <CalendarOutlined />

                            <Select
                                value={academicYearId}
                                onChange={(value) => {
                                    setAcademicYearId(value);

                                    setSemesterId(
                                        semestersApi.byAcademicYear[0]
                                            ?.id
                                            ?? ACTIVE_SEMESTER_FALLBACK,
                                    );
                                }}
                                options={academicYearsApi.items.map(
                                    (year) => ({
                                        value: year.id,
                                        label: year.name,
                                    }),
                                )}
                                style={{ minWidth: 190 }}
                            />

                            <Select
                                value={semesterId}
                                onChange={setSemesterId}
                                options={semestersApi.byAcademicYear.map(
                                    (semester) => ({
                                        value: semester.id,
                                        label: `${semester.name} · ${semester.academicYearId}`,
                                    }),
                                )}
                                style={{ minWidth: 220 }}
                            />

                            <Select
                                value={campusId}
                                onChange={setCampusId}
                                options={[
                                    {
                                        value: "",
                                        label: "Tất cả phân hiệu",
                                    },
                                    ...campusesApi.items
                                        .filter((campus) =>
                                            campus.schoolId === SCHOOL_ID)
                                        .map((campus) => ({
                                            value: campus.id,
                                            label: campus.name,
                                        })),
                                ]}
                                style={{ minWidth: 220 }}
                                placeholder="Phân hiệu"
                            />

                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Đặt lại bộ lọc
                            </Button>
                        </Space>
                    </div>
                </header>
            </div>

            <div className="page-kpi">
                {kpiCards.map((kpiCard) => (
                    <StatsCard
                        key={kpiCard.title}
                        title={kpiCard.title}
                        value={kpiCard.value}
                        icon={kpiCard.icon}
                        tone={kpiCard.tone}
                        note={kpiCard.note}
                    />
                ))}
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={changeTab}
                items={items}
                className="page-tabs"
                tabBarStyle={{ margin: "0 0 24px" }}
            />

            <CellDrawer
                open={selectedSlot !== null}
                onClose={() => setSelectedSlot(null)}
                day={selectedSlot?.day ?? "monday"}
                period={selectedSlot?.period ?? 1}
                rows={drawerRows}
                conflicts={drawerConflicts}
                lookups={lookups}
                rooms={roomsApi.byId}
                suggestions={drawerSuggestions}
                onApplySuggestion={applySuggestion}
                onApplyTransition={applyTransition}
            />
        </div>
    );
};

export default TimetablePage;