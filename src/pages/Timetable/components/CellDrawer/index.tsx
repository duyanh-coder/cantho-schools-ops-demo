import {
    SwapOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Descriptions,
    Divider,
    Drawer,
    Space,
    Tag,
} from "antd";

import type {
    SchoolRoom,
    TimetableConflict,
    TimetableEntry,
    TimetableEntryStatus,
    TimetableSuggestion,
    WeekDay,
} from "@/mock/common/types";

import {
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

const TRANSITION_LABELS: Partial<Record<TimetableEntryStatus, string>> = {
    DRAFT: "Gửi duyệt",
    CHECKING: "Phê duyệt",
    CONFLICT: "Chỉnh sửa",
    ADJUSTING: "Gửi duyệt",
    PENDING_APPROVAL: "Phê duyệt",
    APPROVED: "Xuất bản",
    PUBLISHED: "Điều chỉnh",
};

export interface CellDrawerProps {
    open: boolean;

    onClose: () => void;

    day: WeekDay;

    period: number;

    rows: TimetableEntry[];

    conflicts: TimetableConflict[];

    lookups: TimetableLookups;

    rooms: Map<string, SchoolRoom>;

    suggestions: TimetableSuggestion[];

    onApplySuggestion: (
        entry: TimetableEntry,
        suggestion: TimetableSuggestion,
    ) => void;

    onApplyTransition: (
        entry: TimetableEntry,
        status: TimetableEntryStatus,
    ) => void;
}

const CellDrawer = ({
    open,
    onClose,
    day,
    period,
    rows,
    conflicts,
    lookups,
    rooms,
    suggestions,
    onApplySuggestion,
    onApplyTransition,
}: CellDrawerProps) => (
    <Drawer
        open={open}
        onClose={onClose}
        width={560}
        title={slotLabel(day, period)}
    >
        <Alert
            type="info"
            showIcon
            message={`Có ${rows.length} tiết được xếp tại ô thời gian này.`}
            style={{ marginBottom: 16 }}
        />

        <Divider titlePlacement="left" plain>
            Các tiết trong ô
        </Divider>

        {rows.length === 0 && (
            <Alert
                type="warning"
                showIcon
                message="Ô trống — không có tiết học nào trong thời gian này."
            />
        )}

        {rows.map((entry) => {
            const classItem = lookups.classById.get(entry.classId);

            const nextStates = (
                Object.keys(TRANSITION_LABELS) as TimetableEntryStatus[]
            ).filter(
                (status) => status !== entry.status && canTransit(entry.status, status),
            );

            return (
                <div
                    key={entry.id}
                    className="tt-drawer-entry"
                >
                    <div className="tt-drawer-entry__head">
                        <h4>
                            {lookups.subjectName(entry.subjectId)}
                        </h4>

                        <Space size={4} wrap>
                            <Tag color={STATUS_TONES[entry.status]}>
                                {STATUS_LABELS[entry.status]}
                            </Tag>

                            {entry.version > 1 && (
                                <Tag color="purple">v{entry.version}</Tag>
                            )}

                            {entry.supersedesId && (
                                <Tag color="gold">thay thế {entry.supersedesId}</Tag>
                            )}
                        </Space>
                    </div>

                    <Descriptions
                        column={2}
                        size="small"
                        className="tt-drawer-entry__desc"
                    >
                        <Descriptions.Item label="Lớp" span={2}>
                            {classItem?.name ?? entry.classId}
                            {" · "}
                            <span className="tt-drawer-entry__muted">
                                {lookups.campusName(entry.campusId)}
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Giáo viên" span={2}>
                            {lookups.teacherName(entry.teacherId)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phòng">
                            {rooms.get(entry.roomId)?.code ?? entry.roomId}
                        </Descriptions.Item>

                        <Descriptions.Item label="Buổi">
                            {slotLabel(entry.dayOfWeek, entry.period)}
                        </Descriptions.Item>
                    </Descriptions>

                    {conflicts.map((conflict, index) => (
                        <Alert
                            key={`${conflict.type}-${index}`}
                            type="error"
                            showIcon
                            message={conflict.message}
                            description={
                                <>
                                    <p>{conflict.cause}</p>

                                    <p className="tt-drawer-entry__muted">
                                        {conflict.resolution}
                                    </p>
                                </>
                            }
                            style={{
                                marginBottom: 8,
                            }}
                        />
                    ))}

                    <div className="tt-drawer-entry__actions">
                        {suggestions.length > 0 && (
                            <div className="tt-drawer-entry__suggest">
                                <span>Gợi ý ô thời gian trống:</span>

                                <Space size={6} wrap>
                                    {suggestions.slice(0, 4).map((suggestion) => (
                                        <Button
                                            key={
                                                `${suggestion.dayOfWeek}-${suggestion.period}-${suggestion.roomId}`
                                            }
                                            size="small"
                                            icon={<SwapOutlined />}
                                            onClick={() =>
                                                onApplySuggestion(entry, suggestion)}
                                        >
                                            {slotLabel(suggestion.dayOfWeek, suggestion.period)}
                                            {" · "}
                                            {rooms.get(suggestion.roomId)?.code
                                                ?? suggestion.roomId}
                                        </Button>
                                    ))}
                                </Space>
                            </div>
                        )}

                        {nextStates.length > 0 && (
                            <div className="tt-drawer-entry__transit">
                                <span>Tác vụ trạng thái:</span>

                                <Space size={6} wrap>
                                    {nextStates.map((status) => (
                                        <Button
                                            key={status}
                                            size="small"
                                            onClick={() =>
                                                onApplyTransition(entry, status)}
                                        >
                                            {TRANSITION_LABELS[status]}
                                        </Button>
                                    ))}
                                </Space>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
    </Drawer>
);

export default CellDrawer;