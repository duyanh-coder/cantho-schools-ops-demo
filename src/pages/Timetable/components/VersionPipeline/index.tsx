import {
    Alert,
    Button,
    Empty,
    Space,
    Tag,
    Timeline,
} from "antd";

import {
    useMemo,
} from "react";

import type {
    TimetableEntry,
    TimetableEntryStatus,
    TimetableHistoryEntry,
} from "@/mock/common/types";

import {
    HISTORY_ACTION_LABELS,
    HISTORY_ACTION_TONES,
    STATUS_LABELS,
    STATUS_TONES,
} from "@/mock/common/types";

import {
    canTransit,
} from "@/utils/timetable";

import type {
    TimetableLookups,
} from "../../helpers";

import {
    slotLabel,
} from "../../helpers";

const NEXT_LABELS: Partial<Record<TimetableEntryStatus, string>> = {
    DRAFT: "Gửi duyệt",
    CHECKING: "Phê duyệt",
    CONFLICT: "Chỉnh sửa",
    ADJUSTING: "Gửi duyệt",
    PENDING_APPROVAL: "Phê duyệt",
    APPROVED: "Xuất bản",
    PUBLISHED: "Điều chỉnh",
};

export interface VersionPipelineProps {
    entries: TimetableEntry[];

    history: TimetableHistoryEntry[];

    lookups: TimetableLookups;

    onApplyTransition: (id: string, status: TimetableEntryStatus) => void;

    onAdjust: (entry: TimetableEntry) => void;
}

const VersionPipeline = ({
    entries,
    history,
    lookups,
    onApplyTransition,
    onAdjust,
}: VersionPipelineProps) => {
    const statusCounts = useMemo(() => {
        const counts = new Map<string, number>();

        for (const entry of entries) {
            counts.set(entry.status, (counts.get(entry.status) ?? 0) + 1);
        }

        return counts;
    }, [entries]);

    const rootFor = useMemo(() => {
        const roots = new Map<string, string>();

        for (const entry of entries) {
            const rootId = entry.supersedesId ?? entry.id;

            roots.set(entry.id, rootId);
        }

        return roots;
    }, [entries]);

    const lines = useMemo(() => {
        const grouped = new Map<string, TimetableEntry[]>();

        for (const entry of entries) {
            const rootId = rootFor.get(entry.id) ?? entry.id;

            const bucket = grouped.get(rootId) ?? [];

            bucket.push(entry);

            grouped.set(rootId, bucket);
        }

        return [...grouped.values()]
            .map((bucket) =>
                bucket.slice().sort((a, b) => a.version - b.version))
            .sort((a, b) =>
                slotLabel(a[0]?.dayOfWeek ?? "monday", a[0]?.period ?? 0).localeCompare(
                    slotLabel(b[0]?.dayOfWeek ?? "monday", b[0]?.period ?? 0),
                ));
    }, [entries, rootFor]);

    return (
        <div className="tt-pipeline">
            <div className="tt-pipeline__kpis">
                {[...statusCounts.entries()].map(([status, count]) => (
                    <div
                        key={status}
                        className="tt-pipeline__kpi"
                    >
                        <Tag color={STATUS_TONES[status as TimetableEntryStatus]}>
                            {STATUS_LABELS[status as TimetableEntryStatus]}
                        </Tag>

                        <b>{count}</b>
                    </div>
                ))}
            </div>

            <div className="tt-pipeline__versions">
                <div className="tt-pipeline__section-head">
                    <h4>Chuỗi phiên bản của từng tiết</h4>

                    <p>
                        Mỗi tiết có một chuỗi phiên bản; bản số cao hơn thay
                        thế bản thấp hơn. Không sửa trực tiếp tiết đã xuất bản.
                    </p>
                </div>

                {lines.map((line) => (
                    <div
                        key={line[0]?.id}
                        className="tt-pipeline__line"
                    >
                        <div className="tt-pipeline__line-head">
                            <span className="tt-pipeline__line-label">
                                {lookups.className(line[0]?.classId ?? "")} ·{" "}
                                {lookups.subjectName(line[0]?.subjectId ?? "")}
                            </span>

                            <span className="tt-pipeline__muted">
                                {slotLabel(
                                    line[0]?.dayOfWeek ?? "monday",
                                    line[0]?.period ?? 0,
                                )}
                            </span>
                        </div>

                        <div className="tt-pipeline__steps">
                            {line.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="tt-pipeline__step"
                                >
                                    <div className="tt-pipeline__step-dot">
                                        v{entry.version}
                                    </div>

                                    <div className="tt-pipeline__step-body">
                                        <Tag color={STATUS_TONES[entry.status]}>
                                            {STATUS_LABELS[entry.status]}
                                        </Tag>

                                        <span className="tt-pipeline__muted">
                                            {entry.id}
                                            {entry.updatedAt
                                                ? ` · ${new Date(entry.updatedAt).toLocaleString("vi-VN")}`
                                                : ""}
                                        </span>

                                        {entry.supersedesId && (
                                            <span className="tt-pipeline__muted">
                                                thay thế {entry.supersedesId}
                                            </span>
                                        )}

                                        <Space
                                            size={4}
                                            wrap
                                            className="tt-pipeline__step-actions"
                                        >
                                            {(
                                                Object.keys(NEXT_LABELS) as TimetableEntryStatus[]
                                            ).filter(
                                                (status) =>
                                                    status !== entry.status &&
                                                    canTransit(entry.status, status) &&
                                                    !(
                                                        entry.status === "PUBLISHED" &&
                                                        status === "ADJUSTING"
                                                    ),
                                            ).map((status) => (
                                                <Button
                                                    key={status}
                                                    size="small"
                                                    onClick={() =>
                                                        onApplyTransition(entry.id, status)}
                                                >
                                                    {NEXT_LABELS[status]}
                                                </Button>
                                            ))}

                                            {entry.status === "PUBLISHED" && (
                                                <Button
                                                    size="small"
                                                    onClick={() => onAdjust(entry)}
                                                >
                                                    Tạo bản điều chỉnh
                                                </Button>
                                            )}
                                        </Space>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {lines.length === 0 && (
                    <Empty description="Chưa có tiết nào." />
                )}
            </div>

            <div className="tt-pipeline__history">
                <div className="tt-pipeline__section-head">
                    <h4>Lịch sử điều chỉnh thời khóa biểu</h4>

                    <p>Toàn bộ thay đổi và chuyển trạng thái được ghi lại đầy đủ.</p>
                </div>

                {history.length > 0 ? (
                    <Timeline
                        className="tt-pipeline__timeline"
                        items={history.slice(0, 16).map((item) => ({
                            color: HISTORY_ACTION_TONES[item.action] === "red"
                                ? "red"
                                : "blue",
                            children: (
                                <div className="tt-pipeline__history-item">
                                    <Space size={6} wrap>
                                        <Tag color={HISTORY_ACTION_TONES[item.action]}>
                                            {HISTORY_ACTION_LABELS[item.action]}
                                        </Tag>

                                        <b>{lookups.className(item.classId)}</b>

                                        <span className="tt-pipeline__muted">
                                            {new Date(item.createdAt).toLocaleString("vi-VN")} ·{" "}
                                            {item.actor}
                                        </span>
                                    </Space>

                                    {item.reason && (
                                        <p className="tt-pipeline__muted">
                                            {item.reason}
                                        </p>
                                    )}
                                </div>
                            ),
                        }))}
                    />
                ) : (
                    <Alert
                        type="info"
                        showIcon
                        message="Chưa có lịch sử điều chỉnh."
                    />
                )}
            </div>
        </div>
    );
};

export default VersionPipeline;