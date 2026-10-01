import {
    AlertOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

import type {
    CSSProperties,
} from "react";

import type {
    TimetableConflictType,
} from "@/mock/common/types";

import {
    CONFLICT_TYPE_LABELS,
} from "@/mock/common/types";

import type {
    TimetableEvent,
} from "./types";

import {
    shortTeacher,
    subjectToneColor,
} from "./lookups";

export interface TimetableEventBlockProps {
    event: TimetableEvent;

    showClass?: boolean;

    showSubject?: boolean;

    showTeacher?: boolean;

    showRoom?: boolean;

    showCampus?: boolean;

    showConflicts?: boolean;

    onSelect?: (event: TimetableEvent) => void;
}

/**
 * Ô sự kiện trong lưới thời khóa biểu. Ưu tiên ba dòng BGH cần để ra
 * quyết định nhanh: lớp, môn, giáo viên. Phòng và cơ sở chỉ hiện khi
 * ngữ cảnh cần.
 */
const TimetableEventBlock = ({
    event,
    showClass = true,
    showSubject = true,
    showTeacher = true,
    showRoom = false,
    showCampus = false,
    showConflicts = false,
    onSelect,
}: TimetableEventBlockProps) => {
    const hasConflict = showConflicts && event.conflicts.length > 0;

    const meta = [
        showRoom ? event.roomCode : "",
        showCampus ? event.campusName : "",
    ].filter(Boolean).join(" · ");

    const describe = [
        showClass ? event.className : "",
        showSubject ? event.subjectName : "",
        showTeacher ? event.teacherName : "",
        meta,
        `${event.startTime} - ${event.endTime}`,
    ].filter(Boolean).join(", ");

    return (
        <button
            type="button"
            className={[
                "tt-cal-event",
                hasConflict ? "tt-cal-event--conflict" : "",
            ].filter(Boolean).join(" ")}
            // Màu viền trái lấy từ bảng màu chung nên khớp với dải chú giải.
            style={{
                "--tt-cal-tone": subjectToneColor(event.subjectId),
            } as CSSProperties}
            aria-label={describe}
            onClick={(domEvent) => {
                domEvent.stopPropagation();

                onSelect?.(event);
            }}
        >
            <span className="tt-cal-event__main">
                {showClass && (
                    <strong className="tt-cal-event__class">
                        {event.className}
                    </strong>
                )}

                {showSubject && (
                    <span className="tt-cal-event__subject">
                        {event.subjectName}
                    </span>
                )}

                {showTeacher && (
                    <em className="tt-cal-event__teacher">
                        {shortTeacher(event.teacherName)}
                        <span className="tt-cal-event__teacher-name">
                            {event.teacherName}
                        </span>
                    </em>
                )}
            </span>

            {meta && (
                <span className="tt-cal-event__meta">
                    <ClockCircleOutlined /> {meta}
                </span>
            )}

            {hasConflict && (
                <span className="tt-cal-event__conflicts">
                    {event.conflicts.map((type: TimetableConflictType) => (
                        <span
                            key={type}
                            className="tt-cal-event__conflict"
                        >
                            <AlertOutlined />
                            {CONFLICT_TYPE_LABELS[type]}
                        </span>
                    ))}
                </span>
            )}
        </button>
    );
};

export default TimetableEventBlock;
