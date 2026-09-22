import {
    ApartmentOutlined,
    BankOutlined,
    EnvironmentOutlined,
    PartitionOutlined,
    ReadOutlined,
    TeamOutlined,
} from "@ant-design/icons";

import {
    Tabs,
} from "antd";

import type {
    TabsProps,
} from "antd";

import {
    useMemo,
} from "react";

import { useSearchParams } from "react-router-dom";

import CrudManager from "@/components/dashboard/CrudManager";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";

import {
    canThoMockData,
} from "@/mock";

import type {
    Campus,
    School,
} from "@/mock/common/types";

import PersonnelPage from "@/pages/Personnel";

import SectorPage from "@/pages/Sector";

import StudentsPage from "@/pages/Students";

import {
    useCatalogOptions,
} from "@/store/useCatalog";

import "./style.scss";


const principalOptions = canThoMockData.personnel
    .map((item) => ({
        value: item.id,
        label: item.fullName,
    }));

const schoolOptions = canThoMockData.schools.map((school) => ({
    value: school.id,
    label: school.name,
}));


const buildSchoolFields = (
    educationLevelOptions: Array<{ value: string | number; label: string }>,
    statusOptions: Array<{ value: string | number; label: string }>,
): CrudField<School>[] => [
    {
        name: "regionId",
        label: "Miền",
        hideInForm: true,
        table: false,
        initialValue: "can-tho",
    },
    {
        name: "wardId",
        label: "Phường/Xã",
        hideInForm: true,
        table: false,
        initialValue: "can-tho-ward-001",
    },
    {
        name: "name",
        label: "Tên trường",
        required: true,
        tableWidth: 260,
    },
    {
        name: "code",
        label: "Mã trường",
        required: true,
        tableWidth: 140,
    },
    {
        name: "educationLevel",
        label: "Cấp học",
        required: true,
        type: "select",
        options: educationLevelOptions,
        tableWidth: 150,
    },
    {
        name: "principalId",
        label: "Hiệu trưởng",
        type: "select",
        options: principalOptions,
        tableWidth: 190,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: statusOptions,
        tableWidth: 130,
        initialValue: "active",
    },
];


const buildCampusFields = (
    schoolOptionsArg: Array<{ value: string | number; label: string }>,
    yesNoOptions: Array<{ value: string | number; label: string }>,
    statusOptions: Array<{ value: string | number; label: string }>,
): CrudField<Campus>[] => [
    {
        name: "wardId",
        label: "Phường/Xã",
        hideInForm: true,
        table: false,
        initialValue: "can-tho-ward-001",
    },
    {
        name: "location",
        label: "Vị trí",
        hideInForm: true,
        table: false,
        initialValue: { lat: 10.0348, lng: 105.7702 },
    },
    {
        name: "name",
        label: "Tên cơ sở",
        required: true,
        tableWidth: 240,
    },
    {
        name: "code",
        label: "Mã cơ sở",
        required: true,
        tableWidth: 130,
    },
    {
        name: "schoolId",
        label: "Trực thuộc trường",
        required: true,
        type: "select",
        options: schoolOptionsArg,
        tableWidth: 240,
    },
    {
        name: "address",
        label: "Địa chỉ",
        type: "textarea",
        span: 24,
        tableWidth: 240,
    },
    {
        name: "isMainCampus",
        label: "Trụ sở chính",
        required: true,
        type: "select",
        options: yesNoOptions,
        tableWidth: 130,
        initialValue: "0",
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: statusOptions,
        tableWidth: 130,
        initialValue: "active",
    },
];


const schoolKpis: CrudKpi[] = [
    {
        title: "Trường học",
        value: canThoMockData.schools.length,
        icon: <BankOutlined />,
        tone: "blue",
        note: "đơn vị giáo dục",
    },
    {
        title: "Cấp học",
        value: canThoMockData.schools.filter(
            (item) => item.educationLevel === "THCS",
        ).length,
        icon: <ReadOutlined />,
        tone: "green",
        note: "THCS quản lý",
    },
    {
        title: "Đang hoạt động",
        value: canThoMockData.schools.filter(
            (item) => item.status === "active",
        ).length,
        icon: <ApartmentOutlined />,
        tone: "orange",
        note: "100% kích hoạt",
    },
    {
        title: "Có hiệu trưởng",
        value: canThoMockData.schools.filter(
            (item) => Boolean(item.principalId),
        ).length,
        icon: <TeamOutlined />,
        tone: "purple",
        note: "đã bổ nhiệm",
    },
];


const campusKpis: CrudKpi[] = [
    {
        title: "Tổng cơ sở",
        value: canThoMockData.campuses.length,
        icon: <EnvironmentOutlined />,
        tone: "blue",
        note: "cơ sở trực thuộc",
    },
    {
        title: "Trụ sở chính",
        value: canThoMockData.campuses.filter(
            (item) => item.isMainCampus,
        ).length,
        icon: <BankOutlined />,
        tone: "green",
        note: "chính quyền đóng tại đây",
    },
    {
        title: "Đang hoạt động",
        value: canThoMockData.campuses.filter(
            (item) => item.status === "active",
        ).length,
        icon: <PartitionOutlined />,
        tone: "orange",
        note: "phục vụ giảng dạy",
    },
];


const TAB_KEYS = ["schools", "personnel", "sectors", "students"] as const;

type TabKey = (typeof TAB_KEYS)[number];


const isValidTab = (
    value: string | null,
): value is TabKey => {
    return (
        TAB_KEYS.includes(value as TabKey) ||
        value === null
    );
};


function SchoolsHub() {
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab =
        useMemo(() => {
            const raw = searchParams.get("tab");

            if (!isValidTab(raw)) {
                return "schools" as TabKey;
            }

            const next = raw ?? "schools";

            if (next === "schools") {
                return "schools" as TabKey;
            }

            if (next === "personnel") {
                return "personnel" as TabKey;
            }

            if (next === "sectors") {
                return "sectors" as TabKey;
            }

            return "students" as TabKey;
        }, [searchParams]);


    const handleTabChange = (
        key: string,
    ) => {
        setSearchParams(
            key === "schools"
                ? {}
                : { tab: key },
            { replace: true },
        );
    };


    const schoolFields =
        buildSchoolFields(
            useCatalogOptions("education-level"),
            useCatalogOptions("status"),
        );

    const campusFields =
        buildCampusFields(
            schoolOptions,
            useCatalogOptions("yes-no"),
            useCatalogOptions("status"),
        );

    const items:
        TabsProps["items"] = [
            {
                key: "schools",
                label: "Trường & Cơ sở",
                children: (
                    <div className="schools-hub__entity">
                        <Tabs
                            defaultActiveKey="schools-list"
                            tabBarStyle={{ margin: 0 }}
                            items={[
                                {
                                    key: "schools-list",
                                    label: "Danh sách trường",
                                    children: (
                                        <CrudManager<School>
                                            eyebrow="QUẢN LÝ TRƯỜNG HỌC"
                                            title="Trường học trực thuộc"
                                            description="Quản lý trường, cấp học và hiệu trưởng phụ trách trong hệ thống."
                                            storageKey="can-tho-schools"
                                            seed={canThoMockData.schools}
                                            fields={schoolFields}
                                            kpis={schoolKpis}
                                            entityName="trường"
                                            newLabel="Thêm trường"
                                        />
                                    ),
                                },
                                {
                                    key: "campuses-list",
                                    label: "Danh sách cơ sở",
                                    children: (
                                        <CrudManager<Campus>
                                            eyebrow="QUẢN LÝ CƠ SỞ"
                                            title="Cơ sở trực thuộc trường"
                                            description="Quản lý các cơ sở, địa chỉ và trụ sở chính của từng trường."
                                            storageKey="can-tho-campuses"
                                            seed={canThoMockData.campuses}
                                            fields={campusFields}
                                            kpis={campusKpis}
                                            entityName="cơ sở"
                                            newLabel="Thêm cơ sở"
                                        />
                                    ),
                                },
                            ]}
                        />
                    </div>
                ),
            },
            {
                key: "personnel",
                label: "Nhân sự",
                children: (
                    <PersonnelPage compact />
                ),
            },
            {
                key: "sectors",
                label: "Khối & tổ",
                children: (
                    <SectorPage compact />
                ),
            },
            {
                key: "students",
                label: "Học sinh",
                children: (
                    <StudentsPage />
                ),
            },
        ];

    return (
        <div className="schools-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            SCHOOLS & CAMPUSES
                        </span>

                        <h2>Trường & Cơ sở</h2>

                        <p>
                            Quản lý tập trung trường học, cơ sở trực thuộc cùng
                            nhân sự, khối tổ và học sinh trong hệ thống.
                        </p>
                    </div>
                </header>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={items}
                className="schools-hub"
                tabBarStyle={{ margin: 0 }}
            />
        </div>
    );
}


export default SchoolsHub;