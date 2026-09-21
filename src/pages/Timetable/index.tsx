import {
    BookOutlined,
    CalendarOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    getCurrentRegionMockData,
} from "@/mock";

import {
    SCHOOL_FOCUS,
} from "@/config";

import CampusStatusPanel from "./components/CampusStatus";
import FilterBar from "./components/FilterBar";
import OverviewChart from "./components/OverviewChart";
import StatsCard from "@/components/dashboard/StatCard";

import "./style.scss";

const SUBJECT_LABELS: Record<string, string> = {
    math: "Toán",
    literature: "Ngữ văn",
    english: "Tiếng Anh",
    physics: "Vật lý",
    chemistry: "Hóa học",
    biology: "Sinh học",
    history: "Lịch sử",
    geography: "Địa lý",
    civic_education: "Giáo dục công dân",
    informatics: "Tin học",
    technology: "Công nghệ",
    physical_education: "Thể dục",
    music: "Âm nhạc",
    art: "Mỹ thuật",
};

const dayOptions = [
    { key: "monday", label: "Thứ Hai", date: "17/08" },
    { key: "tuesday", label: "Thứ Ba", date: "18/08" },
    { key: "wednesday", label: "Thứ Tư", date: "19/08" },
    { key: "thursday", label: "Thứ Năm", date: "20/08" },
    { key: "friday", label: "Thứ Sáu", date: "21/08" },
];

const TimetablePage = () => {
    const {
        campuses,
        classes,
        schools,
        teachers,
        timetables,
        alerts,
    } = getCurrentRegionMockData();

    const [selectedSchool, setSelectedSchool] = useState<string>(
        SCHOOL_FOCUS.id,
    );

    const [selectedCampus, setSelectedCampus] = useState("all");

    const [selectedYear, setSelectedYear] = useState("2026-2027");

    const [selectedDay, setSelectedDay] = useState("monday");

    const filteredCampuses = useMemo(() => {
        return selectedSchool === "all"
            ? campuses
            : campuses.filter(
                  (campus) => campus.schoolId === selectedSchool,
              );
    }, [campuses, selectedSchool]);

    const focusSchools = useMemo(() => {
        return schools.filter(
            (school) => school.id === SCHOOL_FOCUS.id,
        );
    }, [schools]);

    const matchCampus = useCallback(
        (campusId: string) => {
            const inScope = filteredCampuses.some(
                (campus) => campus.id === campusId,
            );

            return (
                inScope &&
                (selectedCampus === "all" ||
                    campusId === selectedCampus)
            );
        },
        [filteredCampuses, selectedCampus],
    );

    const availableClasses = useMemo(() => {
        return classes.filter(
            (item) =>
                item.academicYear === selectedYear &&
                filteredCampuses.some(
                    (campus) => campus.id === item.campusId,
                ),
        );
    }, [classes, filteredCampuses, selectedYear]);

    const availableTeachers = useMemo(() => {
        return teachers.filter((teacher) =>
            teacher.campusIds.some((campusId) =>
                filteredCampuses.some(
                    (campus) => campus.id === campusId,
                ),
            ),
        );
    }, [teachers, filteredCampuses]);

    const weekLessons = useMemo(() => {
        return timetables.filter(
            (item) =>
                matchCampus(item.campusId) &&
                availableClasses.some(
                    (classItem) => classItem.id === item.classId,
                ),
        );
    }, [timetables, matchCampus, availableClasses]);

    const dayLessons = weekLessons.filter(
        (item) => item.day === selectedDay,
    );

    const seriesByDay = useMemo(() => {
        return dayOptions.map((day) => ({
            label: day.label,
            value: weekLessons.filter(
                (item) => item.day === day.key,
            ).length,
        }));
    }, [weekLessons]);

    const campusStatusItems = useMemo(() => {
        return filteredCampuses.map((campus) => {
            const today = dayLessons.filter(
                (item) => item.campusId === campus.id,
            ).length;

            return {
                id: campus.id,
                code: campus.code,
                name: campus.name,
                todayLessons: today,
                isActive: campus.status === "active",
            };
        });
    }, [filteredCampuses, dayLessons]);

    const alertItems = useMemo(() => {
        return alerts
            .filter(
                (item) =>
                    !item.campusId || matchCampus(item.campusId),
            )
            .slice(0, 5);
    }, [alerts, matchCampus]);

    const currentDay = dayOptions.find(
        (day) => day.key === selectedDay,
    );

    const timetableCards = dayLessons
        .map((item) => {
            const classItem = classes.find(
                (value) => value.id === item.classId,
            );

            const teacher = teachers.find(
                (value) => value.id === item.teacherId,
            );

            const campus = campuses.find(
                (value) => value.id === item.campusId,
            );

            return { item, classItem, teacher, campus };
        })
        .sort((a, b) => a.item.period - b.item.period);

    const handleMoveDay = (offset: number) => {
        const index = dayOptions.findIndex(
            (day) => day.key === selectedDay,
        );

        const next = dayOptions[index + offset];

        if (next) {
            setSelectedDay(next.key);
        }
    };

    return (
        <div className="timetable-page">
            <div className="page-sticky">
                <header className="page-head">
                    <div className="page-head__title">
                        <span className="page-head__eyebrow">
                            LỊCH GIẢNG DẠY
                        </span>

                        <h2>Thời khóa biểu</h2>
                    </div>

                    <div className="page-head__meta">
                        <span>Năm học {selectedYear}</span>

                        <span>
                            {currentDay?.label} · {currentDay?.date}
                        </span>
                    </div>
                </header>

                <FilterBar
                selectedSchool={selectedSchool}
                schools={focusSchools}
                selectedCampus={selectedCampus}
                campuses={filteredCampuses}
                selectedYear={selectedYear}
                years={["2026-2027"]}
                selectedDay={selectedDay}
                days={dayOptions}
                onSelectDay={setSelectedDay}
                onMoveDay={handleMoveDay}
                onSchoolChange={setSelectedSchool}
                onCampusChange={setSelectedCampus}
                onYearChange={setSelectedYear}
                />
            </div>

            <div className="page-kpi">
                <StatsCard
                    tone="blue"
                    title="Số lớp"
                    value={availableClasses.length}
                    note="Năm học 2026-2027"
                    icon={<BookOutlined />}
                />

                <StatsCard
                    tone="green"
                    title="Giáo viên"
                    value={availableTeachers.length}
                    note="Đang hoạt động"
                    icon={<TeamOutlined />}
                />

                <StatsCard
                    tone="orange"
                    title="Tiết trong tuần"
                    value={weekLessons.length}
                    note="Thứ Hai - Thứ Sáu"
                    icon={<CalendarOutlined />}
                />

                <StatsCard
                    tone="purple"
                    title="Tiết hôm nay"
                    value={dayLessons.length}
                    note="Ngày đang chọn"
                    icon={<CalendarOutlined />}
                />
            </div>

            <div className="page-grid">
                <div className="page-grid__chart">
                    <OverviewChart series={seriesByDay} />
                </div>

                <div className="page-grid__side">
                    <CampusStatusPanel
                        campuses={campusStatusItems}
                        selectedCampusId={selectedCampus}
                        onSelect={setSelectedCampus}
                    />
                </div>
            </div>

            <div className="tt-alerts">
                <section className="page-panel tt-alerts-panel">
                    <header className="page-panel__head">
                        <div>
                            <h3>Cảnh báo hoạt động</h3>

                            <p>Sự cố cần lưu ý từ các điểm trường.</p>
                        </div>
                    </header>

                    <div className="tt-alerts-panel__list">
                        {alertItems.map((alert) => (
                            <article
                                key={alert.id}
                                className="tt-alerts-panel__item"
                            >
                                <span
                                    className={[
                                        "tt-alerts-panel__dot",
                                        `tt-alerts-panel__dot--${alert.level}`,
                                    ].join(" ")}
                                />

                                <div className="tt-alerts-panel__body">
                                    <strong>{alert.title}</strong>

                                    <p>{alert.description}</p>

                                    <span>
                                        {new Date(
                                            alert.createdAt,
                                        ).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>

            <section className="page-panel tt-day-list">
                <header className="page-panel__head">
                    <div>
                        <h3>Chi tiết lịch giảng dạy - {currentDay?.label}</h3>

                        <p>Các tiết học được xếp lịch cho ngày đã chọn.</p>
                    </div>
                </header>

                <div className="tt-day-list__grid">
                    {timetableCards.map(({ item, classItem, teacher, campus }) => (
                        <article
                            key={item.id}
                            className="tt-day-item"
                        >
                            <span className="tt-day-item__period">
                                Tiết {item.period}
                            </span>

                            <div className="tt-day-item__body">
                                <h4>
                                    {SUBJECT_LABELS[item.subjectId] ?? item.subjectId}
                                </h4>

                                <span>
                                    Lớp {classItem?.name ?? "-"} · {teacher?.fullName ?? "-"}
                                </span>

                                <span>
                                    {campus?.name ?? "-"} · Phòng {item.room}
                                </span>
                            </div>
                        </article>
                    ))}

                    {timetableCards.length === 0 && (
                        <p className="tt-day-list__empty">
                            Không có tiết học cho ngày đã chọn.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TimetablePage;