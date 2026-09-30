import {
    AlertOutlined,
    CalendarOutlined,
} from "@ant-design/icons";

import {
    Button,
    Descriptions,
    Drawer,
    Space,
    Tag,
} from "antd";

import type {
    TimetableConflict,
    TimetableEntryStatus,
} from "@/mock/common/types";

import {
    CONFLICT_TYPE_LABELS,
    SESSION_LABELS,
    STATUS_LABELS,
    STATUS_TONES,
} from "@/mock/common/types";

import type {
    TimetableCalendarMode,
    TimetableEvent,
} from "./types";

import {
    dayLabel,
    periodLabel,
} from "./helpers";

import {
    linksOfEvent,
} from "./links";

export type {
    TimetableEventLink,
} from "./links";

export interface TimetableEventDetailProps {
    open: boolean;

    event: TimetableEvent | null;

    conflicts: TimetableConflict[];

    mode?: TimetableCalendarMode;

    onClose: () => void;

    onNavigate?: (to: string) => void;
}

const statusToneOf = (
    status: TimetableEntryStatus,
): string => STATUS_TONES[status] ?? "default";

const TimetableEventDetail = ({
    open,
    event,
    conflicts,
    mode = "school",
    onClose,
    onNavigate,
}: TimetableEventDetailProps) => {
    return (
        <Drawer
            open={open}
            width={420}
            onClose={onClose}
            title={event
                ? `${event.className} · ${event.subjectName}`
                : "Chi tiết tiết học"}
            extra={event && (
                <Tag color={statusToneOf(event.status)}>
                    {STATUS_LABELS[event.status]}
                </Tag>
            )}
        >
            {event && (
                <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                >
                    <Descriptions
                        size="small"
                        column={1}
                        bordered
                    >
                        <Descriptions.Item label="Ngày">
                            {dayLabel(event.dayOfWeek)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tiết">
                            Tiết {event.period}
                        </Descriptions.Item>

                        <Descriptions.Item label="Buổi">
                            {SESSION_LABELS[event.session]}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giờ học">
                            {event.startTime} - {event.endTime}
                        </Descriptions.Item>

                        <Descriptions.Item label="Lớp">
                            {event.className}
                            {event.grade ? ` · Khối ${event.grade}` : ""}
                        </Descriptions.Item>

                        <Descriptions.Item label="Môn học">
                            {event.subjectName}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giáo viên">
                            {event.teacherName}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phòng">
                            {event.roomCode}
                        </Descriptions.Item>

                        <Descriptions.Item label="Cơ sở">
                            {event.campusName}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tuần học">
                            {event.week === 0
                                ? "Lặp hằng tuần"
                                : `Tuần ${event.week}`}
                        </Descriptions.Item>

                        <Descriptions.Item label="Mã tiết">
                            {event.entry.id}
                        </Descriptions.Item>
                    </Descriptions>

                    <div>
                        <h4 className="tt-cal-detail__heading">
                            <CalendarOutlined /> Điều hướng nhanh
                        </h4>

                        <Space size={8} wrap>
                            {linksOfEvent(event, mode).map((link) => (
                                <Button
                                    key={link.to}
                                    size="small"
                                    onClick={() =>
                                        onNavigate?.(link.to)}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Space>
                    </div>

                    {conflicts.length > 0 && (
                        <div>
                            <h4 className="tt-cal-detail__heading">
                                <AlertOutlined /> Xung đột tại ô này
                            </h4>

                            <Space
                                direction="vertical"
                                size={12}
                                style={{ width: "100%" }}
                            >
                                {conflicts.map((conflict) => (
                                    <div
                                        key={`${conflict.type}-${conflict.period}`}
                                        className="tt-cal-detail__conflict"
                                    >
                                        <Tag color="red">
                                            {CONFLICT_TYPE_LABELS[
                                                conflict.type
                                            ]}
                                        </Tag>

                                        <p>{conflict.message}</p>

                                        <p>
                                            <em>Nguyên nhân:</em>{" "}
                                            {conflict.cause}
                                        </p>

                                        <p>
                                            <em>Hướng xử lý:</em>{" "}
                                            {conflict.resolution}
                                        </p>
                                    </div>
                                ))}
                            </Space>
                        </div>
                    )}

                    <p className="tt-cal-detail__hint">
                        Giờ học chi tiết: {periodLabel(event.period)}
                    </p>
                </Space>
            )}
        </Drawer>
    );
};

export default TimetableEventDetail;
