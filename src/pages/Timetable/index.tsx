import {
    CalendarOutlined,
    CheckCircleOutlined,
    ReadOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

import {
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
} from "@/components/TimetableCalendar/helpers";

import AssignmentBoard from "./components/AssignmentBoard";
import CellDrawer from "./components/CellDrawer";
import ConflictPanel from "./components/ConflictPanel";
import RoomUsagePanel from "./components/RoomUsagePanel";
import VersionPipeline from "./components/VersionPipeline";

import {
    buildLookups,
} from "./helpers";

import "./style.scss";

const ACADEMIC_YEAR_ID = "2026-2027";

const DEFAULT_SEMESTER = "2026-2027-HK1";

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

    const [semesterId, setSemesterId] = useState(DEFAULT_SEMESTER);

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
        academicYearId: ACADEMIC_YEAR_ID,
        semesterId,
        campusId: campusId || undefined,
    });

    const historyApi = useTimetableHistory({
        academicYearId: ACADEMIC_YEAR_ID,
        semesterId,
    });

    const assignmentApi = usePersonnelAssignments(
        undefined,
        {
            academicYear: ACADEMIC_YEAR_ID,
            semester: 1,
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

    const currentSemester = useMemo(
        () => canThoSemesters.find(
            (semester) => semester.id === semesterId,
        ),
        [semesterId],
    );

    /**
     * Học kỳ và cơ sở đã có bộ chọn ở đầu trang nên lưới chỉ nhận các
     * bộ lọc còn lại để không có hai nút điều khiển cho cùng một dữ liệu.
     */
    const [calendarFilters, setCalendarFilters] =
        useState<TimetableCalendarFilterState>({});

    const scopedCalendarFilters = useMemo<TimetableCalendarFilterState>(
        () => ({
            ...calendarFilters,
            semesterId,
            campusId: campusId || undefined,
        }),
        [calendarFilters, semesterId, campusId],
    );

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
            entry.academicYearId === ACADEMIC_YEAR_ID &&
            (
                !campusId ||
                entry.campusId === campusId
            ));
    }, [selectedSlot, timetables.bySlot, campusId]);

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
                academicYearId: ACADEMIC_YEAR_ID,
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

    const items: TabsProps["items"] = [
        {
            key: "grid",
            label: "Lưới thời khóa biểu",
            children: (
                <TimetableCalendar
                    entries={effective}
                    lookups={lookups}
                    semester={currentSemester}
                    filters={scopedCalendarFilters}
                    mode="school"
                    showFilters
                    showSemesterFilter={false}
                    showCampusFilter={false}
                    showRoom
                    onFiltersChange={setCalendarFilters}
                    onSelectSlot={(slot) => openSlot(slot.day, slot.period)}
                />
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
                            entry.academicYearId === ACADEMIC_YEAR_ID &&
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
                            LỊCH GIẢNG DẠY
                        </span>

                        <h2>Thời khóa biểu</h2>

                        <p>
                            Xếp lịch, kiểm tra xung đột, quản lý phiên bản và
                            công suất phòng học cho năm học {ACADEMIC_YEAR_ID}.
                        </p>
                    </div>

                    <div className="tt-scope">
                        <Space size={8} wrap>
                            <CalendarOutlined />

                            <Select
                                value={semesterId}
                                onChange={setSemesterId}
                                options={canThoSemesters.map(
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
                                        label: "Toàn địa bàn",
                                    },
                                    ...campusesApi.items.map((campus) => ({
                                        value: campus.id,
                                        label: campus.name,
                                    })),
                                ]}
                                style={{ minWidth: 200 }}
                                placeholder="Cơ sở"
                            />
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