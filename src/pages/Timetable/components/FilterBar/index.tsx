import {
    CalendarOutlined,
    EnvironmentOutlined,
    LeftOutlined,
    ReadOutlined,
    RightOutlined,
} from "@ant-design/icons";
import {
    Button,
    Divider,
    Select,
} from "antd";

import type { DayOption } from "../../types";

import "./style.scss";

interface FilterBarProps {
    selectedSchool: string;
    schools: { id: string; name: string }[];

    selectedCampus: string;
    campuses: { id: string; code: string; name: string }[];

    selectedYear: string;
    years: string[];

    selectedDay: string;
    days: DayOption[];
    onSelectDay: (key: string) => void | (() => void);

    onMoveDay: (offset: number) => void;

    onSchoolChange: (value: string) => void;
    onCampusChange: (value: string) => void;
    onYearChange: (value: string) => void;
}

const FilterBar = ({
    selectedSchool,
    schools,
    selectedCampus,
    campuses,
    selectedYear,
    years,
    selectedDay,
    days,
    onSelectDay,
    onMoveDay,
    onSchoolChange,
    onCampusChange,
    onYearChange,
}: FilterBarProps) => {
    const currentIndex = Math.max(
        0,
        days.findIndex((day) => day.key === selectedDay),
    );

    return (
        <section className="tt-filter">
            <div className="tt-filter__fields">
                <div className="tt-filter__field">
                    <span className="tt-filter__label">
                        <ReadOutlined />
                        Trường
                    </span>

                    <Select
                        className="tt-filter__select"
                        value={selectedSchool}
                        onChange={onSchoolChange}
                        options={[
                            {
                                value: "all",
                                label: "Tất cả trường",
                            },

                            ...schools.map((school) => ({
                                value: school.id,
                                label: school.name,
                            })),
                        ]}
                    />
                </div>

                <div className="tt-filter__field">
                    <span className="tt-filter__label">
                        <EnvironmentOutlined />
                        Điểm trường
                    </span>

                    <Select
                        className="tt-filter__select"
                        value={selectedCampus}
                        onChange={onCampusChange}
                        options={[
                            {
                                value: "all",
                                label: "Tất cả điểm trường",
                            },

                            ...campuses.map((campus) => ({
                                value: campus.id,
                                label: campus.name,
                            })),
                        ]}
                    />
                </div>

                <div className="tt-filter__field">
                    <span className="tt-filter__label">
                        <CalendarOutlined />
                        Năm học
                    </span>

                    <Select
                        className="tt-filter__select"
                        value={selectedYear}
                        onChange={onYearChange}
                        options={years.map((year) => ({
                            value: year,
                            label: `Năm học ${year}`,
                        }))}
                    />
                </div>
            </div>

            <Divider className="tt-filter__divider" />

            <div className="tt-filter__days">
                <Button
                    type="text"
                    shape="circle"
                    icon={<LeftOutlined />}
                    className="tt-filter__day-nav"
                    disabled={currentIndex <= 0}
                    onClick={() => onMoveDay(-1)}
                />

                <div className="tt-filter__day-list">
                    {days.map((day) => (
                        <button
                            key={day.key}
                            type="button"
                            onClick={() => onSelectDay(day.key)}
                            className={[
                                "tt-filter__day",
                                selectedDay === day.key
                                    ? "tt-filter__day--active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <span>{day.label}</span>

                            <strong>{day.date}</strong>
                        </button>
                    ))}
                </div>

                <Button
                    type="text"
                    shape="circle"
                    icon={<RightOutlined />}
                    className="tt-filter__day-nav"
                    disabled={currentIndex >= days.length - 1}
                    onClick={() => onMoveDay(1)}
                />
            </div>
        </section>
    );
};

export default FilterBar;