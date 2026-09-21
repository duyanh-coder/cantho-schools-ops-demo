import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons";

import {
    Button,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
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

import type {
    ReactNode,
} from "react";

import StatsCard from "@/components/dashboard/StatCard";

import {
    useCrud,
} from "@/store/useCrud";

import "./style.scss";


export interface CrudFieldOption {
    value: string | number;

    label: string;
}

export type CrudFieldType =
    | "text"
    | "textarea"
    | "number"
    | "select"
    | "multiselect"
    | "date";

export interface CrudField<T extends { id: string }> {
    name: keyof T & string;

    label: string;

    type?: CrudFieldType;

    required?: boolean;

    options?: CrudFieldOption[];

    placeholder?: string;

    initialValue?: unknown;

    min?: number;

    max?: number;

    span?: number;

    tableWidth?: number;

    table?: boolean;

    hideInForm?: boolean;

    render?: (row: T) => ReactNode;

    sorter?: boolean;
}

export interface CrudKpi {
    title: string;

    value: ReactNode;

    icon?: ReactNode;

    tone: "blue" | "green" | "orange" | "purple";

    note?: string;
}

export interface CrudManagerProps<T extends { id: string }> {
    eyebrow: string;

    title: string;

    description: string;

    storageKey: string;

    seed: T[];

    fields: CrudField<T>[];

    kpis?: CrudKpi[];

    entityName?: string;

    newLabel?: string;
}


const toLabelMap = (
    options?: CrudFieldOption[],
): Map<string, string> => {
    return new Map<string, string>(
        (options ?? []).map(
            (option): [string, string] => [
                String(option.value),
                option.label,
            ],
        ),
    );
};


function CrudManager<T extends { id: string }>({
    eyebrow,
    title,
    description,
    storageKey,
    seed,
    fields,
    kpis,
    entityName,
    newLabel,
}: CrudManagerProps<T>) {
    const {
        items,
        create,
        update,
        remove,
        reset,
    } = useCrud<T>(storageKey, seed);

    const [keyword, setKeyword] = useState("");

    const [open, setOpen] = useState(false);

    const [editing, setEditing] = useState<T | null>(null);

    const [form] = Form.useForm<Record<string, unknown>>();

    const modalTitle = editing
        ? `Cập nhật ${entityName ?? title}`
        : `Thêm mới ${entityName ?? title}`;

    const labelMaps = useMemo(
        () => {
            const map = new Map<string, Map<string, string>>();

            fields.forEach((field) => {
                if (field.options) {
                    map.set(field.name, toLabelMap(field.options));
                }
            });

            return map;
        },
        [fields],
    );

    const filtered = useMemo(
        () => {
            const kw = keyword.trim().toLowerCase();

            if (!kw) {
                return items;
            }

            return items.filter((row) =>
                fields.some((field) => {
                    if (field.table === false || field.name === "id") {
                        return false;
                    }

                    const value = row[field.name];

                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        return false;
                    }

                    const labelMap = labelMaps.get(field.name);

                    const flatten = (input: unknown): string[] => {
                        if (Array.isArray(input)) {
                            return input.flatMap(flatten);
                        }

                        if (
                            labelMap &&
                            input !== null &&
                            input !== undefined
                        ) {
                            const mapped = labelMap.get(
                                String(input),
                            );

                            if (mapped) {
                                return [
                                    mapped.toLowerCase(),
                                    String(input).toLowerCase(),
                                ];
                            }
                        }

                        return [String(input).toLowerCase()];
                    };

                    return flatten(value).some((part) =>
                        part.includes(kw),
                    );
                }),
            );
        },
        [items, keyword, fields, labelMaps],
    );

    const columns = useMemo<ColumnsType<T>>(
        () => {
            const columnsBuilder: ColumnsType<T> = fields
                .filter((field) => field.table !== false)
                .map((field) => ({
                    key: field.name,
                    title: field.label,
                    dataIndex: field.name,
                    width: field.tableWidth,
                    sorter: field.sorter
                        ? (a: T, b: T) => {
                            const av = a[field.name];
                            const bv = b[field.name];

                            if (
                                typeof av === "number" &&
                                typeof bv === "number"
                            ) {
                                return av - bv;
                            }

                            return String(av).localeCompare(
                                String(bv),
                            );
                        }
                        : undefined,
                    render: (_: unknown, row: T) => {
                        if (field.render) {
                            return field.render(row);
                        }

                        const value = row[field.name];

                        if (
                            value === null ||
                            value === undefined ||
                            value === ""
                        ) {
                            return (
                                <span className="crud-panel__muted">
                                    —
                                </span>
                            );
                        }

                        const labelMap = labelMaps.get(field.name);

                        if (Array.isArray(value)) {
                            return (
                                <Space
                                    size={4}
                                    wrap
                                >
                                    {value.map((entry) => (
                                        <Tag
                                            color="blue"
                                            key={String(entry)}
                                        >
                                            {labelMap?.get(String(entry)) ??
                                                String(entry)}
                                        </Tag>
                                    ))}
                                </Space>
                            );
                        }

                        return (
                            labelMap?.get(String(value)) ??
                            String(value)
                        );
                    },
                }));

            columnsBuilder.push({
                key: "__actions",
                title: "",
                width: 92,
                align: "right",
                render: (_: unknown, row: T) => (
                    <Space size={4}>
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(row)}
                        />

                        <Button
                            danger
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => confirmRemove(row)}
                        />
                    </Space>
                ),
            });

            return columnsBuilder;
        },
        [fields, labelMaps],
    );

    const openCreate = () => {
        setEditing(null);

        form.resetFields();

        const initialValues: Record<string, unknown> = {};

        fields.forEach((field) => {
            if (field.initialValue !== undefined) {
                initialValues[field.name] = field.initialValue;
            }
        });

        form.setFieldsValue(initialValues);

        setOpen(true);
    };

    const openEdit = (row: T) => {
        setEditing(row);

        form.setFieldsValue(row as unknown as Record<string, unknown>);

        setOpen(true);
    };

    const handleFinish = (
        values: Record<string, unknown>,
    ) => {
        if (editing) {
            update({ ...editing, ...values } as T);

            message.success("Đã cập nhật bản ghi");
        } else {
            create({
                ...values,
                id: `${storageKey}-${Date.now().toString(36)}`,
            } as T);

            message.success("Đã thêm bản ghi mới");
        }

        setOpen(false);

        setEditing(null);

        form.resetFields();
    };

    const confirmRemove = (row: T) => {
        const label = (row as Record<string, unknown>).fullName
            ? String((row as Record<string, unknown>).fullName)
            : String((row as Record<string, unknown>).name ?? row.id);

        Modal.confirm({
            title: "Xóa bản ghi?",
            content: `Bạn có chắc muốn xóa “${label}” khỏi danh sách?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                remove(row.id);

                message.success("Đã xóa bản ghi");
            },
        });
    };

    const confirmReset = () => {
        Modal.confirm({
            title: "Khôi phục dữ liệu mẫu?",
            content:
                "Toàn bộ thay đổi CRUD của danh mục này sẽ bị xóa và trả về dữ liệu mẫu ban đầu.",
            okText: "Khôi phục",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                reset();

                message.success("Đã khôi phục dữ liệu mẫu");
            },
        });
    };


    const toCsvValue = (
        row: T,
        field: CrudField<T>,
    ): string => {
        const value =
            row[field.name];

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        if (
            field.type === "select" ||
            field.type === "multiselect"
        ) {
            const values =
                (
                    Array.isArray(value)
                        ? value
                        : [value]
                ).map(
                    (entry) =>
                        labelMaps.get(
                            field.name,
                        )?.get(
                            String(entry),
                        ) ?? String(entry),
                );

            return values.join(", ");
        }

        return String(value);
    };


    const handleExport = () => {
        const exportableFields =
            fields.filter(
                (field) =>
                    field.hideInForm ||
                    field.table !== false,
            );

        const rows =
            [exportableFields.map((f) => f.label)]
                .concat(
                    filtered.map(
                        (row) =>
                            exportableFields.map(
                                (field) =>
                                    `"${toCsvValue(row, field).replaceAll('"', '""')}"`,
                            ),
                    ),
                );

        const csv =
            "\ufeff" +
            rows
                .map((cells) => cells.join(","))
                .join("\r\n");

        const blob =
            new Blob(
                [csv],
                {
                    type: "text/csv;charset=utf-8",
                },
            );

        const url =
            URL.createObjectURL(
                blob,
            );

        const anchor =
            document.createElement(
                "a",
            );

        anchor.href = url;

        anchor.download =
            `${storageKey}.csv`;

        document.body.appendChild(
            anchor,
        );

        anchor.click();

        document.body.removeChild(
            anchor,
        );

        URL.revokeObjectURL(
            url,
        );

        message.success(
            "Đã xuất file Excel",
        );
    };


    const renderFormItem = (field: CrudField<T>) => {
        const type = field.type ?? "text";

        if (type === "textarea") {
            return (
                <Input.TextArea
                    rows={3}
                    placeholder={field.placeholder}
                />
            );
        }

        if (type === "number") {
            return (
                <InputNumber
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    style={{ width: "100%" }}
                />
            );
        }

        if (type === "select") {
            return (
                <Select
                    placeholder={field.placeholder ?? `Chọn ${field.label.toLowerCase()}`}
                    options={field.options}
                    showSearch
                    optionFilterProp="label"
                />
            );
        }

        if (type === "multiselect") {
            return (
                <Select
                    mode="multiple"
                    placeholder={field.placeholder ?? `Chọn ${field.label.toLowerCase()}`}
                    options={field.options}
                    showSearch
                    optionFilterProp="label"
                    maxTagCount="responsive"
                />
            );
        }

        if (type === "date") {
            return (
                <Input
                    type="date"
                    placeholder={field.placeholder}
                />
            );
        }

        return (
            <Input
                placeholder={field.placeholder ?? `Nhập ${field.label.toLowerCase()}`}
            />
        );
    };

    return (
        <div className="crud-panel">
            <header className="page-head">
                <div className="page-head__inner">
                    <span className="page-head__eyebrow">
                        {eyebrow}
                    </span>

                    <h2>{title}</h2>

                    <p>{description}</p>
                </div>
            </header>

            {kpis && kpis.length > 0 && (
                <div className="page-kpi">
                    {kpis.map((kpi) => (
                        <StatsCard
                            key={kpi.title}
                            tone={kpi.tone}
                            title={kpi.title}
                            value={kpi.value}
                            icon={kpi.icon}
                            note={kpi.note}
                        />
                    ))}
                </div>
            )}

            <section className="crud-panel__card">
                <div className="crud-panel__header">
                    <div className="crud-panel__title">
                        <span className="crud-panel__eyebrow">
                            DANH MỤC
                        </span>

                        <h3>Quản lý {entityName ?? title.toLowerCase()}</h3>

                        <p>
                            {filtered.length} bản ghi ·
                            Lưu tự động trên trình duyệt (localStorage)
                        </p>
                    </div>

                    <div className="crud-panel__actions">
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm..."
                            value={keyword}
                            onChange={(event) =>
                                setKeyword(event.target.value)
                            }
                            className="crud-panel__search"
                        />

                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            className="crud-panel__export"
                            title="Xuất danh sách hiện tại ra file CSV (Excel)"
                        >
                            Xuất Excel
                        </Button>

                        <Button
                            icon={<ReloadOutlined />}
                            onClick={confirmReset}
                            className="crud-panel__reset"
                        >
                            Khôi phục mẫu
                        </Button>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreate}
                        >
                            {newLabel ?? "Thêm mới"}
                        </Button>
                    </div>
                </div>

                <div className="crud-panel__body">
                    <Table<T>
                        rowKey="id"
                        columns={columns}
                        dataSource={filtered}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: true,
                            showTotal: (total) =>
                                `Tổng ${total} bản ghi`,
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description={
                                        keyword
                                            ? "Không tìm thấy bản ghi nào"
                                            : "Chưa có dữ liệu"
                                    }
                                />
                            ),
                        }}
                    />
                </div>
            </section>

            <Modal
                open={open}
                title={modalTitle}
                okText="Lưu"
                cancelText="Hủy"
                width={720}
                destroyOnHidden
                onCancel={() => {
                    setOpen(false);

                    setEditing(null);
                }}
                onOk={() => form.submit()}
            >
                <Form<Record<string, unknown>>
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    {fields
                        .filter((field) => !field.hideInForm)
                        .map((field) => (
                            <Form.Item
                                name={field.name as string}
                                key={field.name}
                                label={field.label}
                                required={field.required}
                                style={{
                                    display: field.type === "textarea"
                                        ? "block"
                                        : "inline-block",
                                    width:
                                        field.type === "textarea"
                                            ? "100%"
                                            : `${field.span ?? 50}%`,
                                }}
                                rules={
                                    field.required
                                        ? [
                                            {
                                                required: true,
                                                message: `Vui lòng nhập ${field.label.toLowerCase()}`,
                                            },
                                        ]
                                        : undefined
                                }
                            >
                                {renderFormItem(field)}
                            </Form.Item>
                        ))}
                </Form>
            </Modal>
        </div>
    );
}


export default CrudManager;