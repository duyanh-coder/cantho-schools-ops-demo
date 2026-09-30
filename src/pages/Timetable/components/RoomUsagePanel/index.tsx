import {
    ApartmentOutlined,
} from "@ant-design/icons";

import {
    Alert,
    Button,
    Descriptions,
    Drawer,
    Empty,
    Progress,
    Space,
    Table,
    Tag,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
    useState,
} from "react";

import type {
    SchoolClass,
    SchoolRoom,
    TimetableEntry,
    WeekDay,
} from "@/mock/common/types";

import {
    DAY_LABELS,
    PERIOD_TIME,
} from "@/mock/common/types";

import {
    CALENDAR_DAYS,
} from "@/components/TimetableCalendar/helpers";

import type {
    TimetableLookups,
} from "../../helpers";

import {
    slotLabel,
} from "../../helpers";

/**
 * Ngày học và khung tiết lấy từ nguồn chuẩn để bảng công suất phòng
 * khớp với lưới thời khóa biểu: sáu ngày Thứ Hai - Thứ Bảy và cả hai
 * buổi (tiết 1-10).
 */
const DAYS: WeekDay[] = CALENDAR_DAYS;

const PERIODS: number[] = PERIOD_TIME.map((item) => item.period);

const ROOM_CATEGORY_LABELS: Record<string, string> = {
    classroom: "Phòng học",
    function_room: "Phòng chức năng",
};

export interface RoomUsagePanelProps {
    rooms: SchoolRoom[];

    classes: SchoolClass[];

    effective: TimetableEntry[];

    lookups: TimetableLookups;

    conflicts: Array<{
        type: string;

        rows: TimetableEntry[];
    }>;

    onOpenCampus: (campusId: string) => void;
}

interface RoomUsageRow {
    room: SchoolRoom;

    used: number;

    capacity: number;

    maxClassSize: number;

    warning: boolean;

    slots: TimetableEntry[];
}

const RoomUsagePanel = ({
    rooms,
    classes,
    effective,
    lookups,
    conflicts,
    onOpenCampus,
}: RoomUsagePanelProps) => {
    const [selected, setSelected] = useState<RoomUsageRow | null>(null);

    const rows = useMemo<RoomUsageRow[]>(() => {
        const classSize = new Map<string, number>();

        for (const classItem of classes) {
            classSize.set(classItem.id, classItem.capacity ?? 0);
        }

        return rooms.map((room) => {
            const slots = effective.filter(
                (entry) => entry.roomId === room.id,
            );

            const roomConflicts = conflicts.filter((conflict) =>
                conflict.rows.some((row) => row.roomId === room.id));

            const maxClassSize = Math.max(
                ...slots.map(
                    (entry) => classSize.get(entry.classId) ?? 0,
                ),
                0,
            );

            return {
                room,
                used: slots.length,
                capacity: room.capacity,
                maxClassSize,
                warning: roomConflicts.length > 0
                    || maxClassSize > room.capacity,
                slots,
            };
        });
    }, [rooms, classes, effective, conflicts]);

    const columns: ColumnsType<RoomUsageRow> = [
        {
            title: "Phòng",
            key: "room",
            width: 130,
            render: (_, row) => (
                <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => setSelected(row)}
                >
                    {row.room.code}
                </Button>
            ),
        },
        {
            title: "Loại",
            key: "category",
            width: 150,
            render: (_, row) =>
                ROOM_CATEGORY_LABELS[row.room.category] ?? row.room.category,
        },
        {
            title: "Cơ sở",
            key: "campusId",
            width: 200,
            render: (_, row) => (
                <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => onOpenCampus(row.room.campusId)}
                >
                    {lookups.campusName(row.room.campusId)}
                </Button>
            ),
        },
        {
            title: "Sức chứa",
            dataIndex: "capacity",
            key: "capacity",
            width: 90,
            align: "center",
        },
        {
            title: "Lớp lớn nhất",
            dataIndex: "maxClassSize",
            key: "maxClassSize",
            width: 110,
            align: "center",
            render: (value: number, row) => (
                <span className={row.maxClassSize > row.capacity
                    ? "tt-room__over"
                    : undefined}
                >
                    {value || "—"}
                </span>
            ),
        },
        {
            title: "Số tiết",
            dataIndex: "used",
            key: "used",
            width: 80,
            align: "center",
        },
        {
            title: "Công suất",
            key: "usage",
            render: (_, row) => {
                const total = DAYS.length * PERIODS.length;

                const percent = total === 0
                    ? 0
                    : Math.round((row.used / total) * 100);

                return (
                    <div className="tt-room__usage">
                        <Progress
                            percent={percent}
                            size="small"
                            strokeColor={row.warning ? "#ef4444" : "#2563eb"}
                        />
                    </div>
                );
            },
        },
        {
            title: "",
            key: "warning",
            width: 120,
            render: (_, row) => row.warning
                ? (
                    <Tag color="red">
                        cần lưu ý
                    </Tag>
                )
                : <Tag color="green">ổn</Tag>,
        },
    ];

    return (
        <div className="tt-room">
            {rows.length > 0 ? (
                <Table
                    rowKey={(row) => row.room.id}
                    columns={columns}
                    dataSource={rows}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Empty description="Không có phòng học nào." />
            )}

            <Drawer
                open={selected !== null}
                onClose={() => setSelected(null)}
                width={620}
                title={selected
                    ? `${selected.room.code} · ${ROOM_CATEGORY_LABELS[selected.room.category] ?? ""}`
                    : "Phòng học"}
            >
                {selected && (
                    <>
                        <Space
                            size={8}
                            wrap
                            style={{ display: "flex", marginBottom: 8 }}
                        >
                            <Button
                                size="small"
                                icon={<ApartmentOutlined />}
                                onClick={() =>
                                    onOpenCampus(selected.room.campusId)}
                            >
                                {lookups.campusName(selected.room.campusId)}
                            </Button>
                        </Space>

                        <Descriptions
                            column={2}
                            size="small"
                            bordered
                            className="tt-room__desc"
                        >
                            <Descriptions.Item label="Sức chứa" span={1}>
                                {selected.capacity} chỗ
                            </Descriptions.Item>

                            <Descriptions.Item label="Số tiết" span={1}>
                                {selected.used}
                            </Descriptions.Item>

                            <Descriptions.Item label="Lớp lớn nhất" span={2}>
                                {selected.maxClassSize || "—"}
                            </Descriptions.Item>
                        </Descriptions>

                        {selected.warning && (
                            <Alert
                                type="warning"
                                showIcon
                                message="Phòng có tiết xếp quá sức chứa hoặc bị xung đột."
                                style={{ marginTop: 12 }}
                            />
                        )}

                        <div className="tt-room__board">
                            <h4>Lịch sử dụng phòng</h4>

                            <table className="tt-room__board-table">
                                <thead>
                                    <tr>
                                        <th>Tiết</th>

                                        {DAYS.map((day) => (
                                            <th key={day}>
                                                {DAY_LABELS[day].replace("Thứ ", "T")}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {PERIODS.map((period) => (
                                        <tr key={period}>
                                            <th>Tiết {period}</th>

                                            {DAYS.map((day) => {
                                                const entry = selected.slots.find(
                                                    (item) =>
                                                        item.dayOfWeek === day &&
                                                        item.period === period,
                                                );

                                                return entry ? (
                                                    <td
                                                        key={day}
                                                        className="tt-room__board-cell"
                                                    >
                                                        <b>{lookups.className(entry.classId)}</b>

                                                        <span>
                                                            {lookups.teacherName(entry.teacherId)}
                                                        </span>

                                                        <em>
                                                            {lookups.subjectName(entry.subjectId)}
                                                        </em>

                                                        <Tag
                                                            color={
                                                                entry.status === "PUBLISHED"
                                                                    ? "green"
                                                                    : "orange"
                                                            }
                                                        >
                                                            {entry.status === "PUBLISHED"
                                                                ? "đã xuất bản"
                                                                : slotLabel(
                                                                    entry.dayOfWeek,
                                                                    entry.period,
                                                                )}
                                                        </Tag>
                                                    </td>
                                                ) : (
                                                    <td
                                                        key={day}
                                                        className="tt-room__board-empty"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default RoomUsagePanel;