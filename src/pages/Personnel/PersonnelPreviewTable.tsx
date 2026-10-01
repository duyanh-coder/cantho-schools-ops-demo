import {
    EyeOutlined,
} from "@ant-design/icons";

import {
    Avatar,
    Button,
    Table,
    Tooltip,
    Typography,
} from "antd";

import type {
    ColumnsType,
    TablePaginationConfig,
} from "antd/es/table";

import {
    useMemo,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import type {
    Personnel,
} from "@/mock/common/types";

import {
    useCampuses,
} from "@/store/useCampuses";

import {
    personnelCampusNames,
    personnelInitials,
    personnelSectorName,
    personnelSubjectNames,
} from "./labels";


interface PersonnelPreviewTableProps {
    items: Personnel[];

    pagination?: TablePaginationConfig | false;

    showTeamColumn?: boolean;

    detailTab?: string;

    emptyText?: string;
}

const mutedText = (
    label: string,
) => (
    <Typography.Text type="secondary">
        {label}
    </Typography.Text>
);

/**
 * Bảng nhân sự dùng chung cho mục "NHÂN SỰ" ở tổng quan trường và tab
 * "Nhân sự" ở chi tiết cơ sở, để hai màn luôn hiển thị giống nhau.
 *
 * Bảng chỉ hiển thị, mọi thao tác cập nhật nằm ở danh sách nhân sự cấp
 * trường.
 */
const PersonnelPreviewTable = ({
    items,
    pagination = false,
    showTeamColumn = false,
    detailTab,
    emptyText = "Chưa có dữ liệu nhân sự.",
}: PersonnelPreviewTableProps) => {
    const navigate =
        useNavigate();

    const campusesById =
        useCampuses().byId;

    const columns = useMemo<ColumnsType<Personnel>>(
        () => {
            const personnelHref = (
                row: Personnel,
            ): string => {
                return `/operations/personnel/${row.id}${
                    detailTab ? `?tab=${detailTab}` : ""
                }`;
            };

            const teamColumn: ColumnsType<Personnel>[number] = {
                title: "Tổ bộ môn",
                dataIndex: "teamId",
                width: 180,
                render: (value: string | undefined) => {
                    const label = personnelSectorName(value);

                    if (!label) {
                        return mutedText("—");
                    }

                    return label;
                },
            };

            return [
                {
                    title: "",
                    width: 48,
                    render: (_, row) => (
                        <Avatar
                            size={30}
                            style={{
                                backgroundColor: row.gender === "female"
                                    ? "#eb2f96"
                                    : "#1677ff",
                            }}
                        >
                            {personnelInitials(row.fullName)}
                        </Avatar>
                    ),
                },
                {
                    title: "Họ và tên",
                    dataIndex: "fullName",
                    width: 200,
                    render: (value: string, row) => (
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 0, fontWeight: 600 }}
                            onClick={() =>
                                navigate(personnelHref(row))}
                        >
                            {value}
                        </Button>
                    ),
                },
                {
                    title: "Chức vụ / Vai trò",
                    dataIndex: "roleTitle",
                    width: 220,
                },
                {
                    title: "Bộ môn / Chuyên môn",
                    dataIndex: "subjectIds",
                    width: 180,
                    render: (value: string[] | undefined) => {
                        const label = personnelSubjectNames(value);

                        if (!label) {
                            return mutedText("Chưa cập nhật");
                        }

                        return label;
                    },
                },
                ...(showTeamColumn
                    ? [teamColumn]
                    : []),
                {
                    title: "Cơ sở",
                    dataIndex: "campusIds",
                    responsive: ["lg"],
                    render: (value: string[] | undefined) => {
                        const label = personnelCampusNames(
                            campusesById,
                            value,
                        );

                        if (!label) {
                            return mutedText("—");
                        }

                        return label;
                    },
                },
                {
                    title: "Chi tiết",
                    key: "__navigate",
                    width: 90,
                    align: "center",
                    render: (_: unknown, row: Personnel) => (
                        <Tooltip title="Xem hồ sơ cán bộ/giáo viên">
                            <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() =>
                                    navigate(personnelHref(row))}
                            />
                        </Tooltip>
                    ),
                },
            ];
        },
        [campusesById, detailTab, navigate, showTeamColumn],
    );

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={items}
            pagination={pagination}
            size="small"
            scroll={{ x: true }}
            locale={{
                emptyText,
            }}
        />
    );
};

export default PersonnelPreviewTable;

export type {
    PersonnelPreviewTableProps,
};