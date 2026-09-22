import CrudManager from "@/components/dashboard/CrudManager";

import {
    ApartmentOutlined,
    BookOutlined,
    PartitionOutlined,
    TrophyOutlined,
} from "@ant-design/icons";

import type {
    Sector,
} from "@/mock/common/types";

import {
    canThoMockData,
} from "@/mock";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";

import type {
    ReactNode,
} from "react";

import {
    Space,
    Tag,
    Tooltip,
} from "antd";


const memberOptions = canThoMockData.personnel
    .filter((item) => item.status === "active")
    .map((item) => ({
        value: item.id,
        label: item.fullName,
    }));

const memberNameMap = new Map<string, string>(
    memberOptions.map(
        (option) => [String(option.value), option.label],
    ),
);

const renderMembers = (
    row: Sector,
    nameMap: Map<string, string> = memberNameMap,
): ReactNode => {
    const ids = row.memberIds ?? [];

    if (ids.length === 0) {
        return (
            <span className="crud-panel__muted">
                —
            </span>
        );
    }

    const names = ids.map(
        (id) => nameMap.get(id) ?? id,
    );

    const visible = names.slice(0, 3);

    const hiddenCount = names.length - visible.length;

    return (
        <Tooltip
            title={
                hiddenCount > 0
                    ? names.join("; ")
                    : undefined
            }
        >
            <Space
                size={4}
                wrap
            >
                {visible.map((name) => (
                    <Tag
                        color="blue"
                        key={name}
                    >
                        {name}
                    </Tag>
                ))}

                {hiddenCount > 0 && (
                    <Tag>
                        +{hiddenCount}
                    </Tag>
                )}
            </Space>
        </Tooltip>
    );
};


const buildFields = (
    sectorTypeOptions: Array<{ value: string | number; label: string }>,
    gradeOptions: Array<{ value: string | number; label: string }>,
    statusOptions: Array<{ value: string | number; label: string }>,
    yesNoOptions: Array<{ value: string | number; label: string }>,
    managerOptionsArg: Array<{ value: string | number; label: string }>,
    memberOptionsArg: Array<{ value: string | number; label: string }>,
    memberNamesArg: Map<string, string>,
): CrudField<Sector>[] => [
    {
        name: "name",
        label: "Tên tổ / khối",
        required: true,
        tableWidth: 200,
    },
    {
        name: "type",
        label: "Loại hình",
        required: true,
        type: "select",
        options: sectorTypeOptions,
        tableWidth: 130,
    },
    {
        name: "grade",
        label: "Khối lớp",
        type: "select",
        options: gradeOptions,
        tableWidth: 90,
        hideInForm: false,
    },
    {
        name: "managerId",
        label: "Trưởng khối / tổ trưởng",
        type: "select",
        options: managerOptionsArg,
        tableWidth: 180,
    },
    {
        name: "hasBoarding",
        label: "Tổ chức bán trú",
        type: "select",
        options: yesNoOptions,
        tableWidth: 130,
        initialValue: "0",
    },
    {
        name: "memberIds",
        label: "Thành viên",
        type: "multiselect",
        options: memberOptionsArg,
        tableWidth: 220,
        render: (row) => renderMembers(row, memberNamesArg),
    },
    {
        name: "about",
        label: "Mô tả nhiệm vụ",
        type: "textarea",
        span: 24,
        table: false,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: statusOptions,
        tableWidth: 120,
        initialValue: "active",
    },
];


const buildScopedKpis = (
    scopedSectors: Sector[],
): CrudKpi[] => [
    {
        title: "Tổng khối & tổ chuyên môn",
        value: scopedSectors.length,
        icon: <PartitionOutlined />,
        tone: "blue",
        note: "khối lớp + tổ bộ môn",
    },
    {
        title: "Khối lớp",
        value: scopedSectors.filter(
            (item) => item.type === "grade",
        ).length,
        icon: <BookOutlined />,
        tone: "green",
        note: "các khối thuộc trường",
    },
    {
        title: "Tổ chuyên môn",
        value: scopedSectors.filter(
            (item) => item.type === "subject_group",
        ).length,
        icon: <ApartmentOutlined />,
        tone: "orange",
        note: "tổ bộ môn giảng dạy",
    },
    {
        title: "Tổ trưởng – Trưởng khối",
        value: canThoMockData.personnel.filter(
            (item) =>
                ["Tổ trưởng chuyên môn", "Trưởng khối"].includes(
                    item.roleTitle,
                ),
        ).length,
        icon: <TrophyOutlined />,
        tone: "purple",
        note: "đang quản lý",
    },
];


const SectorPage = ({
    compact,
    schoolId,
}: {
    compact?: boolean;

    schoolId?: string;
}) => {
    const sectorTypeOptions =
        useCatalogOptions(
            "sector-type",
        );

    const gradeOptions =
        useCatalogOptions(
            "grade",
        );

    const statusOptions =
        useCatalogOptions(
            "status",
        );

    const yesNoOptions =
        useCatalogOptions(
            "yes-no",
        );

    const school =
        canThoMockData.schools.find(
            (candidate) => candidate.id === schoolId,
        );

    const scopedSectors =
        schoolId
            ? canThoMockData.sectors.filter(
                (sector) => sector.schoolId === schoolId,
            )
            : canThoMockData.sectors;

    const scopedPersonnel =
        schoolId
            ? canThoMockData.personnel.filter(
                (item) => item.schoolId === schoolId,
            )
            : canThoMockData.personnel;

    const scopedManagerOptions =
        scopedPersonnel
            .filter((item) => item.status === "active")
            .map((item) => ({
                value: item.id,
                label: item.fullName,
            }));

    const scopedMemberNameMap = new Map<string, string>(
        scopedManagerOptions.map(
            (option) => [String(option.value), option.label],
        ),
    );

    const sectorFields =
        buildFields(
            sectorTypeOptions,
            gradeOptions,
            statusOptions,
            yesNoOptions,
            scopedManagerOptions,
            scopedManagerOptions,
            scopedMemberNameMap,
        );

    return (
        <CrudManager<Sector>
            compact={compact}
            eyebrow="KHỐI NGÀNH & TỔ CHUYÊN MÔN"
            title="Khối lớp & tổ bộ môn"
            description={
                schoolId
                    ? `Phân chia khối ngành theo khối lớp và tổ chuyên môn/bộ môn của ${school?.name ?? "trường đang chọn"}, gắn với phân công giáo viên.`
                    : "Phân chia khối ngành theo khối lớp 6–9 và tổ chuyên môn/bộ môn của Trường THCS Ninh Kiều, gắn với phân công giáo viên."
            }
            entityName="khối/tổ"
            newLabel="Thêm khối/tổ mới"
            storageKey="can-tho-sectors"
            seed={canThoMockData.sectors}
            itemFilter={
                schoolId
                    ? (item) => item.schoolId === schoolId
                    : undefined
            }
            createDefaults={
                schoolId
                    ? { schoolId }
                    : undefined
            }
            fields={sectorFields}
            kpis={buildScopedKpis(scopedSectors)}
            filters={[
                { field: "type" },
                { field: "grade" },
                { field: "hasBoarding" },
                { field: "status" },
            ]}
            detail
            detailWidth={960}
        />
    );
};


export default SectorPage;
