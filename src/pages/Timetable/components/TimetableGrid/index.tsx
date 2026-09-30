import {
    AlertOutlined,
} from "@ant-design/icons";

import {
    useMemo,
} from "react";

import type {
    TimetableConflict,
    TimetableEntry,
    WeekDay,
} from "@/mock/common/types";

import {
    DAY_LABELS,
    PERIOD_TIME,
} from "@/mock/common/types";

import type {
    TimetableLookups,
} from "../../helpers";

import {
    shortTeacher,
} from "../../helpers";

const SCHOOL_DAYS: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
];

const PERIODS = [1, 2, 3, 4, 5];

interface SlotCellProps {
    day: WeekDay;

    period: number;

    rows: TimetableEntry[];

    conflicts: TimetableConflict[];

    lookups: TimetableLookups;

    onOpen: (day: WeekDay, period: number) => void;
}

const SlotCell = ({
    day,
    period,
    rows,
    conflicts,
    lookups,
    onOpen,
}: SlotCellProps) => {
    const cellConflicts = useMemo(
        () => conflicts.filter((conflict) =>
            conflict.dayOfWeek === day &&
            conflict.period === period),
        [conflicts, day, period],
    );

    return (
        <td
            className={[
                "tt-grid__cell",
                cellConflicts.length > 0 ? "tt-grid__cell--conflict" : "",
                rows.length === 0 ? "tt-grid__cell--empty" : "",
            ].filter(Boolean).join(" ")}
        >
            {rows.length > 0 && (
                <button
                    type="button"
                    className="tt-grid__cell-inner"
                    onClick={() => onOpen(day, period)}
                >
                    {cellConflicts.length > 0 && (
                        <span className="tt-grid__conflict-badge">
                            <AlertOutlined />
                            {cellConflicts.length}
                        </span>
                    )}

                    <div className="tt-grid__chips">
                        {rows.map((entry) => {
                            const classItem = lookups.classById.get(entry.classId);

                            return (
                                <span
                                    key={entry.id}
                                    className={[
                                        "tt-grid__chip",
                                        entry.status === "ADJUSTING"
                                            ? "tt-grid__chip--adjusting"
                                            : entry.status === "DRAFT"
                                                ? "tt-grid__chip--draft"
                                                : entry.status === "CONFLICT"
                                                    ? "tt-grid__chip--conflict"
                                                    : "tt-grid__chip--published",
                                    ].join(" ")}
                                >
                                    <span className="tt-grid__chip-subject">
                                        {lookups.subjectName(entry.subjectId).slice(0, 2)}
                                    </span>

                                    <span className="tt-grid__chip-body">
                                        <strong>
                                            {classItem?.name ?? entry.classId}
                                        </strong>

                                        <em>
                                            {shortTeacher(lookups.teacherName(entry.teacherId))} ·{" "}
                                            {lookups.roomCode(entry.roomId)}
                                        </em>
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                </button>
            )}
        </td>
    );
};

export interface TimetableGridProps {
    effective: TimetableEntry[];

    conflicts: TimetableConflict[];

    lookups: TimetableLookups;

    onOpenSlot: (day: WeekDay, period: number) => void;
}

const TimetableGrid = ({
    effective,
    conflicts,
    lookups,
    onOpenSlot,
}: TimetableGridProps) => {
    const bySlot = useMemo(() => {
        const map = new Map<string, TimetableEntry[]>();

        for (const entry of effective) {
            const key = `${entry.dayOfWeek}|${entry.period}`;

            const bucket = map.get(key) ?? [];

            bucket.push(entry);

            map.set(key, bucket);
        }

        return map;
    }, [effective]);

    return (
        <div className="tt-grid">
            <p className="tt-grid__hint">
                Chọn một ô để xem chi tiết tiết học, các phiên bản và đề xuất chỉnh sửa.
            </p>

            <div className="tt-grid__scroll">
                <table className="tt-grid__table">
                    <thead>
                        <tr>
                            <th className="tt-grid__corner">Tiết / Thứ</th>

                            {SCHOOL_DAYS.map((day) => (
                                <th key={day}>
                                    {DAY_LABELS[day]}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {PERIODS.map((period) => {
                            const time = PERIOD_TIME.find((item) => item.period === period);

                            return (
                                <tr key={period}>
                                    <th className="tt-grid__period">
                                        <b>Tiết {period}</b>

                                        <span>
                                            {time
                                                ? `${time.startTime}-${time.endTime}`
                                                : ""}
                                        </span>
                                    </th>

                                    {SCHOOL_DAYS.map((day) => {
                                        const rows = bySlot.get(`${day}|${period}`) ?? [];

                                        return (
                                            <SlotCell
                                                key={day}
                                                day={day}
                                                period={period}
                                                rows={rows}
                                                conflicts={conflicts}
                                                lookups={lookups}
                                                onOpen={onOpenSlot}
                                            />
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimetableGrid;