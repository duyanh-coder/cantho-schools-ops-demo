import {
    PlusOutlined,
} from "@ant-design/icons";

import {
    Button,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Table,
    Tag,
    message,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
    useState,
} from "react";

import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import type {
    PersonnelAssignment,
    SchoolRoom,
} from "@/mock/common/types";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import type {
    TimetableLookups,
} from "../../helpers";

export interface AssignmentBoardProps {
    assignments: PersonnelAssignment[];

    quotas: Array<{
        assigned: number;

        standard: number;

        teacherId: string;

        classId: string;

        subjectId: string;
    }>;

    lookups: TimetableLookups;

    rooms: Map<string, SchoolRoom>;

    onCreate: (assignment: PersonnelAssignment) => void;

    onSelectClass: (classId: string) => void;

    onSelectTeacher: (personnelId: string) => void;
}

const AssignmentBoard = ({
    assignments,
    quotas,
    lookups,
    onCreate,
    onSelectClass,
    onSelectTeacher,
}: AssignmentBoardProps) => {
    const [text, setText] = useState("");

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm<Record<string, unknown>>();

    const semesterOptions = useCatalogOptions("semester");

    const filtered = useMemo(
        () => assignments.filter((assignment) => {
            const query = text.trim().toLowerCase();

            if (!query) {
                return true;
            }

            return (
                lookups.teacherName(assignment.personnelId).toLowerCase().includes(query) ||
                lookups.className(assignment.classId).toLowerCase().includes(query) ||
                lookups.subjectName(assignment.subjectId).toLowerCase().includes(query)
            );
        }),
        [assignments, lookups, text],
    );

    const quotaByTriple = useMemo(() => {
        const map = new Map<string, { assigned: number; standard: number }>();

        for (const quota of quotas) {
            map.set(
                `${quota.teacherId}|${quota.classId}|${quota.subjectId}`,
                {
                    assigned: quota.assigned,
                    standard: quota.standard,
                },
            );
        }

        return map;
    }, [quotas]);

    const classOptions = useMemo(
        () => canThoMockData.classes.map((classItem) => ({
            value: classItem.id,
            label: classItem.name,
        })),
        [],
    );

    const personnelOptions = useMemo(
        () => canThoMockData.personnel.map((person) => ({
            value: person.id,
            label: person.fullName,
        })),
        [],
    );

    const subjectOptions = useMemo(
        () => subjects.map((subject) => ({
            value: subject.id,
            label: subject.name,
        })),
        [],
    );

    const columns: ColumnsType<PersonnelAssignment> = [
        {
            title: "Giáo viên",
            key: "personnelId",
            width: 210,
            render: (_, row) => (
                <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => onSelectTeacher(row.personnelId)}
                >
                    {lookups.teacherName(row.personnelId)}
                </Button>
            ),
        },
        {
            title: "Lớp",
            dataIndex: "classId",
            key: "classId",
            width: 140,
            render: (value: string) => (
                <Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => onSelectClass(value)}
                >
                    {lookups.className(value)}
                </Button>
            ),
        },
        {
            title: "Môn",
            dataIndex: "subjectId",
            key: "subjectId",
            width: 130,
            render: (value: string) => (
                <Tag color="blue">{lookups.subjectName(value)}</Tag>
            ),
        },
        {
            title: "Năm học",
            dataIndex: "academicYear",
            key: "academicYear",
            width: 110,
        },
        {
            title: "Học kỳ",
            dataIndex: "semester",
            key: "semester",
            width: 90,
            render: (value: PersonnelAssignment["semester"]) =>
                semesterOptions.find(
                    (option) => Number(option.value) === value,
                )?.label ?? `${value}`,
        },
        {
            title: "Tiết chuẩn",
            dataIndex: "periodsPerWeek",
            key: "periodsPerWeek",
            width: 100,
            align: "center",
        },
        {
            title: "Đã xếp trong lưới",
            key: "assigned",
            width: 130,
            align: "center",
            render: (_, row) => {
                const quota = quotaByTriple.get(
                    `${row.personnelId}|${row.classId}|${row.subjectId}`,
                );

                return quota?.assigned ?? 0;
            },
        },
        {
            title: "Trạng thái",
            key: "quotaDiff",
            width: 140,
            render: (_, row) => {
                const quota = quotaByTriple.get(
                    `${row.personnelId}|${row.classId}|${row.subjectId}`,
                );

                if (!quota) {
                    return <Tag>—</Tag>;
                }

                const diff = quota.assigned - quota.standard;

                return diff === 0
                    ? <Tag color="green">đủ</Tag>
                    : diff > 0
                        ? <Tag color="orange">vượt {diff}</Tag>
                        : <Tag color="blue">thiếu {-diff}</Tag>;
            },
        },
    ];

    const closeModal = () => {
        setOpen(false);
    };

    const handleFinish = (values: Record<string, unknown>) => {
        onCreate({
            id: `personnel-assignment-${Date.now().toString(36)}`,
            personnelId: String(values.personnelId),
            campusId: String(values.campusId),
            classId: String(values.classId),
            subjectId: String(values.subjectId),
            academicYear: String(values.academicYear),
            semester: Number(values.semester) as 1 | 2,
            periodsPerWeek: Number(values.periodsPerWeek),
            status: "active",
        });

        message.success("Đã thêm phân công giảng dạy");

        setOpen(false);
    };

    return (
        <div className="tt-assignment">
            <div className="tt-assignment__toolbar">
                <Input.Search
                    allowClear
                    placeholder="Tìm theo giáo viên, lớp hoặc môn…"
                    onChange={(event) => setText(event.target.value)}
                    style={{ maxWidth: 360 }}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();

                        form.setFieldsValue({
                            academicYear: "2026-2027",
                            semester: 1,
                            periodsPerWeek: 2,
                            status: "active",
                        });

                        setOpen(true);
                    }}
                >
                    Thêm phân công
                </Button>
            </div>

            {filtered.length > 0 ? (
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filtered}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                    }}
                    size="small"
                    scroll={{ x: true }}
                />
            ) : (
                <Empty description="Không có phân công phù hợp." />
            )}

            <Modal
                open={open}
                title="Thêm phân công giảng dạy"
                okText="Thêm mới"
                cancelText="Hủy"
                width={560}
                destroyOnHidden
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="personnelId"
                        label="Giáo viên"
                        rules={[{ required: true, message: "Chọn giáo viên" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={personnelOptions}
                            placeholder="Chọn giáo viên"
                        />
                    </Form.Item>

                    <Form.Item
                        name="classId"
                        label="Lớp học"
                        rules={[{ required: true, message: "Chọn lớp" }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            options={classOptions}
                            placeholder="Chọn lớp"
                        />
                    </Form.Item>

                    <Form.Item
                        name="subjectId"
                        label="Môn"
                        rules={[{ required: true, message: "Chọn môn" }]}
                    >
                        <Select options={subjectOptions} />
                    </Form.Item>

                    <Form.Item
                        name="campusId"
                        label="Cơ sở"
                        rules={[{ required: true, message: "Chọn cơ sở" }]}
                    >
                        <Select
                            options={canThoMockData.campuses.map((campus) => ({
                                value: campus.id,
                                label: `${
                                    lookups.campusName(campus.id)
                                } (${canThoMockData.campuses.find(
                                    (item) => item.id === campus.id,
                                )?.code ?? campus.id})`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        name="academicYear"
                        label="Năm học"
                        rules={[{ required: true, message: "Nhập năm học" }]}
                    >
                        <Input placeholder="VD: 2026-2027" />
                    </Form.Item>

                    <Form.Item
                        name="semester"
                        label="Học kỳ"
                        rules={[{ required: true, message: "Chọn học kỳ" }]}
                    >
                        <Select options={semesterOptions} />
                    </Form.Item>

                    <Form.Item
                        name="periodsPerWeek"
                        label="Số tiết / tuần"
                        rules={[{ required: true, message: "Nhập số tiết" }]}
                    >
                        <InputNumber min={1} max={30} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AssignmentBoard;