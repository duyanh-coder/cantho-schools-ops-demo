import {
    AlertOutlined,
    CheckOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Empty,
    Space,
    Table,
    Tag,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
} from "react";

import type {
    SchoolRoom,
    TimetableConflict,
} from "@/mock/common/types";

import {
    CONFLICT_TYPE_LABELS,
    CONFLICT_TYPE_TONES,
} from "@/mock/common/types";

import type {
    TimetableLookups,
} from "../../helpers";

import {
    slotLabel,
} from "../../helpers";

export interface ConflictPanelProps {
    conflicts: TimetableConflict[];

    quotas: Array<{
        assigned: number;

        standard: number;

        teacherId: string;

        classId: string;

        subjectId: string;
    }>;

    lookups: TimetableLookups;

    rooms: Map<string, SchoolRoom>;

    onOpenSlot: (day: string, period: number) => void;

    onResolve: (conflict: TimetableConflict) => void;
}

const ConflictRow = ({
    conflict,
    lookups,
    rooms,
    onOpenSlot,
    onResolve,
}: {
    conflict: TimetableConflict;

    lookups: TimetableLookups;

    rooms: Map<string, SchoolRoom>;

    onOpenSlot: (day: string, period: number) => void;

    onResolve: ConflictPanelProps["onResolve"];
}) => {
    const primary = conflict.rows[0];

    return (
        <div className="tt-conflict">
            <div className="tt-conflict__head">
                <Space size={6} wrap>
                    <Tag color={CONFLICT_TYPE_TONES[conflict.type]}>
                        {CONFLICT_TYPE_LABELS[conflict.type]}
                    </Tag>

                    <span className="tt-conflict__slot">
                        {slotLabel(conflict.dayOfWeek, conflict.period)}
                        {conflict.week > 0 ? ` · tuần ${conflict.week}` : ""}
                    </span>
                </Space>

                <Space size={4} wrap>
                    <Button
                        size="small"
                        onClick={() =>
                            onOpenSlot(
                                conflict.dayOfWeek as string,
                                conflict.period,
                            )}
                    >
                        <AlertOutlined /> Vị trí
                    </Button>

                    {primary && (
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            onClick={() => onResolve(conflict)}
                        >
                            <CheckOutlined /> Xử lý
                        </Button>
                    )}
                </Space>
            </div>

            <p className="tt-conflict__message">{conflict.message}</p>

            <div className="tt-conflict__meta">
                {conflict.rows.map((row) => (
                    <span
                        key={row.id}
                        className="tt-conflict__row"
                    >
                        <b>{lookups.className(row.classId)}</b> ·{" "}
                        {lookups.teacherName(row.teacherId)} ·{" "}
                        {rooms.get(row.roomId)?.code ?? row.roomId}
                    </span>
                ))}
            </div>

            <div className="tt-conflict__resolution">
                <p><em>Nguyên nhân:</em> {conflict.cause}</p>

                <p><em>Hướng xử lý:</em> {conflict.resolution}</p>
            </div>
        </div>
    );
};

const ConflictPanel = ({
    conflicts,
    quotas,
    lookups,
    rooms,
    onOpenSlot,
    onResolve,
}: ConflictPanelProps) => {
    const summary = useMemo(
        () => {
            const byType = new Map<string, number>();

            for (const conflict of conflicts) {
                byType.set(
                    conflict.type,
                    (byType.get(conflict.type) ?? 0) + 1,
                );
            }

            return byType;
        },
        [conflicts],
    );

    const quotaRows = useMemo(
        () => quotas
            .filter((quota) => quota.assigned !== quota.standard)
            .slice(0, 12),
        [quotas],
    );

    type QuotaRow = ConflictPanelProps["quotas"][number];

    const quotaColumns: ColumnsType<QuotaRow> = [
        {
            title: "Giáo viên",
            key: "teacher",
            render: (_, row) => lookups.teacherName(row.teacherId),
        },
        {
            title: "Lớp",
            dataIndex: "classId",
            key: "classId",
            render: (value: string) => lookups.className(value),
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            key: "subjectId",
            render: (value: string) => lookups.subjectName(value),
        },
        {
            title: "Đã xếp",
            dataIndex: "assigned",
            key: "assigned",
            width: 90,
            align: "center",
        },
        {
            title: "Định mức",
            dataIndex: "standard",
            key: "standard",
            width: 90,
            align: "center",
        },
        {
            title: "Lệch",
            key: "diff",
            width: 100,
            align: "center",
            render: (_, row) => {
                const diff = row.assigned - row.standard;

                return diff === 0
                    ? <Tag color="green">đủ</Tag>
                    : diff > 0
                        ? <Tag color="orange">+{diff} (vượt)</Tag>
                        : <Tag color="blue">{diff} (thiếu)</Tag>;
            },
        },
    ];

    return (
        <div className="tt-conflict-panel">
            <div className="tt-conflict-panel__kpis">
                {[...summary.entries()].map(([type, count]) => (
                    <div
                        key={type}
                        className="tt-conflict-panel__kpi"
                    >
                        <Tag color={CONFLICT_TYPE_TONES[type as never]}>
                            {CONFLICT_TYPE_LABELS[type as never]}
                        </Tag>

                        <b>{count}</b>
                    </div>
                ))}

                {summary.size === 0 && (
                    <Alert
                        type="success"
                        showIcon
                        message="Không phát hiện xung đột nào trong lưới hiện hành."
                    />
                )}
            </div>

            <div className="tt-conflict-panel__list">
                {conflicts.slice(0, 20).map((conflict) => (
                    <ConflictRow
                        key={`${conflict.type}-${conflict.dayOfWeek}-${conflict.period}-${conflict.rows.map((row) => row.id).join("-")}`}
                        conflict={conflict}
                        lookups={lookups}
                        rooms={rooms}
                        onOpenSlot={onOpenSlot}
                        onResolve={onResolve}
                    />
                ))}

                {conflicts.length === 0 && (
                    <Empty description="Chưa có xung đột" />
                )}
            </div>

            <div className="tt-conflict-panel__quota">
                <div className="tt-conflict-panel__quota-head">
                    <h4>Chênh lệch so với định mức phân công</h4>

                    <p>
                        Số tiết đã xếp trong lưới so với số tiết chuẩn trong
                        phân công giảng dạy.
                    </p>
                </div>

                {quotaRows.length > 0 ? (
                    <Table
                        rowKey={(row) =>
                            `${row.teacherId}-${row.classId}-${row.subjectId}`}
                        columns={quotaColumns}
                        dataSource={quotaRows}
                        pagination={false}
                        size="small"
                    />
                ) : (
                    <Alert
                        type="success"
                        showIcon
                        message="Tất cả phân công đều đủ số tiết trong lưới."
                    />
                )}
            </div>
        </div>
    );
};

export default ConflictPanel;