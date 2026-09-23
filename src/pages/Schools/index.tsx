import {
    SelectOutlined,
} from "@ant-design/icons";

import {
    Select,
    Space,
    Tabs,
} from "antd";

import type {
    TabsProps,
} from "antd";

import {
    useMemo,
} from "react";

import { useSearchParams } from "react-router-dom";

import {
    canThoMockData,
} from "@/mock";

import CampusesPage from "@/pages/Campuses";

import ClassList from "@/pages/Classes/ClassList";

import PersonnelList from "@/pages/Personnel/PersonnelList";

import SectorPage from "@/pages/Sector";

import StudentList from "@/pages/Students/StudentList";

import SchoolOverview from "./SchoolOverview";

import "./style.scss";


const schoolOptions = canThoMockData.schools.map((school) => ({
    value: school.id,
    label: school.name,
}));


const TAB_KEYS = [
    "schools",
    "campuses",
    "personnel",
    "sectors",
    "classes",
    "students",
] as const;

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

            if (next === "campuses") {
                return "campuses" as TabKey;
            }

            if (next === "personnel") {
                return "personnel" as TabKey;
            }

            if (next === "sectors") {
                return "sectors" as TabKey;
            }

            if (next === "classes") {
                return "classes" as TabKey;
            }

            if (next === "students") {
                return "students" as TabKey;
            }

            return "schools" as TabKey;
        }, [searchParams]);

    const schoolId =
        useMemo(() => {
            const raw = searchParams.get("school");

            const matched = canThoMockData.schools.find(
                (school) => school.id === raw,
            );

            return matched?.id
                ?? canThoMockData.schools[0]?.id;
        }, [searchParams]);

    const selectedSchool =
        canThoMockData.schools.find(
            (school) => school.id === schoolId,
        );

    const syncParams = (
        patch: {
            tab?: string;

            school?: string;
        },
    ) => {
        const next: Record<string, string> = {};

        if (patch.tab) {
            next.tab = patch.tab;
        }

        if (patch.school) {
            next.school = patch.school;
        }

        setSearchParams(
            Object.keys(next).length > 0
                ? next
                : {},
            { replace: true },
        );
    };


    const handleTabChange = (
        key: string,
    ) => {
        syncParams({
            tab: key === "schools"
                ? ""
                : key,
            school: schoolId,
        });
    };

    const handleSchoolChange = (
        nextSchoolId: string,
    ) => {
        syncParams({
            tab: activeTab === "schools"
                ? ""
                : activeTab,
            school: nextSchoolId,
        });
    };


    const items:
        TabsProps["items"] = [
            {
                key: "schools",
                label: "Tổng quan trường",
                children: (
                    <SchoolOverview school={selectedSchool} />
                ),
            },
            {
                key: "campuses",
                label: "Danh sách cơ sở",
                children: (
                    <CampusesPage compact schoolId={schoolId} />
                ),
            },
            {
                key: "personnel",
                label: "Nhân sự",
                children: (
                    <PersonnelList compact schoolId={schoolId} />
                ),
            },
            {
                key: "sectors",
                label: "Khối & tổ",
                children: (
                    <SectorPage compact schoolId={schoolId} />
                ),
            },
            {
                key: "classes",
                label: "Lớp học",
                children: (
                    <ClassList compact schoolId={schoolId} />
                ),
            },
            {
                key: "students",
                label: "Học sinh",
                children: (
                    <StudentList compact schoolId={schoolId} />
                ),
            },
        ];

    return (
        <div className="schools-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            TRƯỜNG & PHÂN HIỆU
                        </span>

                        <h2>Trường & Phân hiệu</h2>

                        <p>
                            Quản lý tập trung trường học, cơ sở trực thuộc cùng
                            nhân sự, khối tổ, lớp học và học sinh trong hệ thống.
                        </p>
                    </div>
                </header>
            </div>

            <div className="schools-page__school-select">
                <Space
                    size={8}
                    wrap
                >
                    <SelectOutlined />

                    <span>Trường đang xem</span>

                    <Select
                        value={schoolId}
                        onChange={handleSchoolChange}
                        options={schoolOptions}
                        showSearch
                        optionFilterProp="label"
                        style={{ minWidth: 300 }}
                        placeholder="Chọn trường"
                    />
                </Space>
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