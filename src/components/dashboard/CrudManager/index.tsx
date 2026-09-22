import {
    BulbOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
    UploadOutlined,
} from "@ant-design/icons";

import {
    Button,
    Descriptions,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Upload,
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

import {
    parseCsv,
} from "@/utils/csv";

import workflowDiagram from "@/assets/images/workflow/cach-thuc-hien.png";

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

    compact?: boolean;

    detail?: boolean;

    detailWidth?: number;
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


const remainingBySelector = <T extends { id: string }>(
    items: T[],
    fields: CrudField<T>[],
): string => {
    const selector = fields.find(
        (field) =>
            field.type === "select" &&
            field.options &&
            field.options.length > 0,
    );

    if (!selector) {
        return "Dữ liệu quản lý tập trung tại một danh sách";
    }

    const map = toLabelMap(selector.options);

    const counts = new Map<string, number>();

    items.forEach((item) => {
        const value = String(item[selector.name]);

        const label = map.get(value) ?? value;

        counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    const entries = [...counts.entries()].sort(
        (a, b) => b[1] - a[1],
    );

    const summary = entries
        .map(([label, count]) => `${label} (${count})`)
        .join(" · ");

    return `${selector.label}: ${summary}`;
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
    compact,
    detail,
    detailWidth,
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

    const [detailRow, setDetailRow] = useState<T | null>(null);

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
                width: detail ? 116 : 92,
                align: "right",
                render: (_: unknown, row: T) => (
                    <Space size={4}>
                        {detail && (
                            <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                title="Xem chi tiết"
                                onClick={() =>
                                    setDetailRow(row)
                                }
                            />
                        )}

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
        [fields, labelMaps, detail],
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
            const defaults: Record<string, unknown> = {};

            fields.forEach((field) => {
                if (
                    field.hideInForm &&
                    field.initialValue !== undefined
                ) {
                    defaults[field.name] =
                        field.initialValue;
                }
            });

            create({
                ...defaults,
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


    const renderDetailValue = (
        row: T,
        field: CrudField<T>,
    ): ReactNode => {
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

        if (typeof value === "boolean") {
            return (
                labelMap?.get(String(value)) ??
                (value ? "Có" : "Không")
            );
        }

        return (
            labelMap?.get(String(value)) ??
            String(value)
        );
    };


    const handleExport = () => {
        const exportableFields =
            fields.filter(
                (field) => !field.hideInForm,
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


    const handleImport = (
        file: File,
    ) => {
        const reader =
            new FileReader();

        reader.onload = () => {
            const content =
                String(
                    reader.result,
                );

            const parsed =
                parseCsv(
                    content,
                );

            if (
                parsed.headers.length === 0 ||
                parsed.rows.length === 0
            ) {
                message.warning(
                    "File CSV không có dữ liệu hợp lệ",
                );

                return;
            }

            const headerToField =
                new Map<string, string>();

            fields.forEach(
                (field) => {
                    if (
                        field.name === "id"
                    ) {
                        return;
                    }

                    headerToField.set(
                        field.label.toLowerCase(),
                        field.name,
                    );
                },
            );

            let imported = 0;

            parsed.rows.forEach(
                (cells) => {
                    const record:
                        Record<string, unknown> = {
                            id:
                                `${storageKey}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
                        };

                    let valid = false;

                    parsed.headers.forEach(
                        (header, index) => {
                            const name =
                                headerToField.get(
                                    header.trim().toLowerCase(),
                                );

                            const value =
                                cells[index];

                            if (
                                name &&
                                value !== undefined &&
                                value.trim().length > 0
                            ) {
                                const field =
                                    fields.find(
                                        (candidate) =>
                                            candidate.name === name,
                                    );

                                if (
                                    field?.type ===
                                        "multiselect"
                                ) {
                                    const values =
                                        value
                                            .split(",")
                                            .map((part) => part.trim())
                                            .filter((part) => part.length > 0);

                                    const selected =
                                        (field.options ?? [])
                                            .filter(
                                                (option) =>
                                                    values.includes(
                                                        String(option.label),
                                                    ),
                                            )
                                            .map(
                                                (option) =>
                                                    option.value,
                                            );

                                    record[name] =
                                        selected;
                                } else if (
                                    field?.type ===
                                        "select"
                                ) {
                                    const option =
                                        (field.options ?? []).find(
                                            (candidate) =>
                                                String(candidate.label) ===
                                                value.trim(),
                                        );

                                    record[name] =
                                        option?.value ??
                                        value.trim();
                                } else {
                                    record[name] =
                                        value.trim();
                                }

                                valid = true;
                            }
                        },
                    );

                    if (valid) {
                        create(
                            record as T,
                        );

                        imported += 1;
                    }
                },
            );

            if (imported > 0) {
                message.success(
                    `Đã nhập thêm ${imported} bản ghi`,
                );
            } else {
                message.warning(
                    "Không nhập được bản ghi nào",
                );
            }
        };

        reader.readAsText(
            file,
            "utf-8",
        );

        return false;
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
        <div className={compact ? "crud-panel crud-panel--compact" : "crud-panel"}>
            {!compact && (
                <header className="page-head">
                    <div className="page-head__inner">
                        <span className="page-head__eyebrow">
                            {eyebrow}
                        </span>

                        <h2>{title}</h2>

                        <p>{description}</p>
                    </div>
                </header>
            )}

            <div className="crud-panel__workflow">
                <div className="crud-panel__workflow-title">
                    <BulbOutlined />

                    <strong>Cách thực hiện công việc</strong>

                    <span>
                        {remainingBySelector(
                            items,
                            fields,
                        )}
                    </span>
                </div>

                <img
                    src={workflowDiagram}
                    alt="Lưu đồ cách thực hiện công việc"
                    className="crud-panel__workflow-img"
                />
            </div>

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

                        <Upload
                            accept=".csv,text/csv"
                            showUploadList={false}
                            beforeUpload={handleImport}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                className="crud-panel__import"
                                title="Nhập dữ liệu từ file CSV (Excel)"
                            >
                                Nhập Excel
                            </Button>
                        </Upload>

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

            <Modal
                open={detailRow !== null}
                title={`Chi tiết ${entityName ?? title}`}
                footer={null}
                width={detailWidth ?? 720}
                destroyOnHidden
                onCancel={() => setDetailRow(null)}
            >
                {detailRow && fields.length > 0 && (
                    <Descriptions
                        column={2}
                        size="small"
                        bordered
                    >
                        {fields.map((field) => (
                            <Descriptions.Item
                                key={field.name}
                                label={field.label}
                                span={
                                    field.type === "textarea"
                                        ? 2
                                        : 1
                                }
                            >
                                {renderDetailValue(
                                    detailRow,
                                    field,
                                )}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}


export default CrudManager;