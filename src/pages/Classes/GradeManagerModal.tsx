import {
    BookOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";

import {
    Button,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";

import type {
    ColumnsType,
} from "antd/es/table";

import {
    useMemo,
    useState,
} from "react";

import type {
    Grade,
} from "@/mock/common/types";

import {
    useClasses,
} from "@/store/useClasses";

import {
    gradeBlockers,
    useGrades,
} from "@/store/useGrades";

const MAX_GRADE = 12;

interface GradeManagerModalProps {
    open: boolean;

    schoolId: string;

    onClose: () => void;
}

const GradeManagerModal = ({
    open,
    schoolId,
    onClose,
}: GradeManagerModalProps) => {
    const gradesApi = useGrades(schoolId);

    const classesApi = useClasses(schoolId);

    const [pendingGrade, setPendingGrade] = useState<number | undefined>(
        undefined,
    );

    const grades = gradesApi.bySchool;

    const classCountByGrade = useMemo(() => {
        const map = new Map<string, number>();

        for (const classItem of classesApi.bySchool) {
            const key = classItem.gradeId ?? String(classItem.grade);

            map.set(key, (map.get(key) ?? 0) + 1);
        }

        return map;
    }, [classesApi.bySchool]);

    const missingGrades = useMemo(
        () => Array.from({ length: MAX_GRADE }, (_, index) => index + 1)
            .filter((grade) => !grades.some((item) => item.sortOrder === grade))
            .map((grade) => ({
                value: grade,
                label: `Khối ${grade}`,
            })),
        [grades],
    );

    const handleCreate = () => {
        if (pendingGrade === undefined) {
            message.warning("Vui lòng chọn khối cần thêm.");

            return;
        }

        const created = gradesApi.createGrade(schoolId, pendingGrade);

        if (!created) {
            message.error("Khối đã tồn tại trong trường này.");

            return;
        }

        setPendingGrade(undefined);

        message.success(`Đã thêm khối ${created.name} (${created.code})`);
    };

    const handleRemove = (grade: Grade) => {
        const blockers = gradeBlockers(grade, classesApi.bySchool);

        if (blockers.length > 0) {
            message.warning(blockers[0]);

            return;
        }

        const error = gradesApi.removeGrade(grade.id, classesApi.bySchool);

        if (error) {
            message.warning(error);

            return;
        }

        message.success(`Đã xóa khối ${grade.name} (${grade.code})`);
    };

    const columns: ColumnsType<Grade> = [
        {
            title: "Mã khối",
            dataIndex: "code",
            width: 110,
        },
        {
            title: "Tên khối",
            dataIndex: "name",
        },
        {
            title: "Số lớp",
            width: 90,
            align: "right",
            render: (_: unknown, grade: Grade) => {
                const count = classCountByGrade.get(grade.id) ?? 0;

                return count > 0
                    ? <Tag color="blue">{count} lớp</Tag>
                    : <Tag>Chưa có lớp</Tag>;
            },
        },
        {
            title: "",
            width: 56,
            align: "right",
            render: (_: unknown, grade: Grade) => {
                const count = classCountByGrade.get(grade.id) ?? 0;

                return (
                    <Tooltip
                        title={
                            count > 0
                                ? "Khối còn lớp học nên không xóa được"
                                : "Xóa khối"
                        }
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                            disabled={count > 0}
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemove(grade)}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <Modal
            open={open}
            title="Quản lý khối học"
            okText="Đóng"
            cancelButtonProps={{ style: { display: "none" } }}
            width={640}
            onOk={onClose}
            onCancel={onClose}
        >
            <Space
                wrap
                style={{ marginBottom: 12 }}
            >
                <Select
                    style={{ width: 160 }}
                    placeholder="Chọn khối cần thêm"
                    value={pendingGrade}
                    options={missingGrades}
                    onChange={setPendingGrade}
                />

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={pendingGrade === undefined}
                    onClick={handleCreate}
                >
                    Thêm khối
                </Button>
            </Space>

            {missingGrades.length === 0 && (
                <Typography.Paragraph type="secondary">
                    <BookOutlined /> Trường đã có đủ khối 1 đến {MAX_GRADE}.
                </Typography.Paragraph>
            )}

            <Table<Grade>
                rowKey="id"
                size="small"
                pagination={false}
                columns={columns}
                dataSource={grades}
            />
        </Modal>
    );
};

export { GradeManagerModal };

export default GradeManagerModal;
