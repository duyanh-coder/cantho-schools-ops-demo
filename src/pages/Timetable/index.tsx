import {
  CalendarOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Button, Col, Empty, Row, Select } from "antd";
import { useMemo, useState } from "react";

import MobileActionBar from "@/components/MobileActionBar";
import OperationPageHeader from "@/components/OperationPageHeader";

import "./style.scss";

import { getCurrentRegionMockData } from "@/mock";

interface DayOption {
  key: string;
  label: string;
  date: string;
}

const dayOptions: DayOption[] = [
  {
    key: "monday",
    label: "Thứ Hai",
    date: "17/08",
  },
  {
    key: "tuesday",
    label: "Thứ Ba",
    date: "18/08",
  },
  {
    key: "wednesday",
    label: "Thứ Tư",
    date: "19/08",
  },
  {
    key: "thursday",
    label: "Thứ Năm",
    date: "20/08",
  },
  {
    key: "friday",
    label: "Thứ Sáu",
    date: "21/08",
  },
];

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

const TimetablePage = () => {
  const { timetables, campuses, classes, teachers } =
    getCurrentRegionMockData();

  const [selectedDay, setSelectedDay] = useState("monday");

  const [selectedFacility, setSelectedFacility] = useState("all");

  const [selectedClass, setSelectedClass] = useState("all");

  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const currentDayIndex = dayOptions.findIndex(
    (item) => item.key === selectedDay,
  );

  const currentDay = dayOptions[currentDayIndex];

  // const timetableItems = useMemo(() => {
  //   return timetables.filter((item) => {
  //     const matchFacility =
  //       selectedFacility === "all" || item.campusId === selectedFacility;

  //     const matchClass =
  //       selectedClass === "all" || item.classId === selectedClass;

  //     const matchTeacher =
  //       selectedTeacher === "all" || item.teacherId === selectedTeacher;

  //     return matchFacility && matchClass && matchTeacher;
  //   });
  // }, [timetables, selectedFacility, selectedClass, selectedTeacher]);

  const timetableItems = useMemo(() => {
    return timetables.filter((item) => {
      const matchDay = item.day === selectedDay;

      const matchFacility =
        selectedFacility === "all" || item.campusId === selectedFacility;

      const matchClass =
        selectedClass === "all" || item.classId === selectedClass;

      const matchTeacher =
        selectedTeacher === "all" || item.teacherId === selectedTeacher;

      return matchDay && matchFacility && matchClass && matchTeacher;
    });
  }, [
    timetables,
    selectedDay,
    selectedFacility,
    selectedClass,
    selectedTeacher,
  ]);

  const availableClasses = useMemo(() => {
    if (selectedFacility === "all") {
      return classes;
    }

    return classes.filter((item) => item.campusId === selectedFacility);
  }, [classes, selectedFacility]);

  const availableTeachers = useMemo(() => {
    if (selectedFacility === "all") {
      return teachers;
    }

    const teacherIds = new Set(
      timetables
        .filter((item) => item.campusId === selectedFacility)
        .map((item) => item.teacherId),
    );

    return teachers.filter((teacher) => teacherIds.has(teacher.id));
  }, [teachers, timetables, selectedFacility]);

  const handlePreviousDay = () => {
    if (currentDayIndex <= 0) {
      return;
    }

    setSelectedDay(dayOptions[currentDayIndex - 1].key);
  };

  const handleNextDay = () => {
    if (currentDayIndex >= dayOptions.length - 1) {
      return;
    }

    setSelectedDay(dayOptions[currentDayIndex + 1].key);
  };

  return (
    <div className="timetable-page">
      <OperationPageHeader
        eyebrow="TIMETABLE"
        title="Thời khóa biểu"
        description="Theo dõi kế hoạch giảng dạy và lịch học tại các cơ sở giáo dục."
        icon={<CalendarOutlined />}
      />

      <section className="timetable-control-panel">
        <div className="timetable-control-panel__filters">
          <div className="timetable-control-panel__field">
            <span className="timetable-control-panel__label">
              <EnvironmentOutlined />
              Cơ sở
            </span>

            <Select
              value={selectedFacility}
              onChange={(value) => {
                setSelectedFacility(value);

                setSelectedClass("all");

                setSelectedTeacher("all");
              }}
              className="timetable-control-panel__select"
              options={[
                {
                  value: "all",
                  label: "Tất cả cơ sở",
                },

                ...campuses.map((campus) => ({
                  value: campus.id,
                  label: campus.name,
                })),
              ]}
            />
          </div>

          <div className="timetable-control-panel__field">
            <span className="timetable-control-panel__label">Lớp</span>

            <Select
              value={selectedClass}
              onChange={setSelectedClass}
              className="timetable-control-panel__select"
              options={[
                {
                  value: "all",
                  label: "Tất cả lớp",
                },

                ...availableClasses.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
          </div>

          <div className="timetable-control-panel__field">
            <span className="timetable-control-panel__label">Giáo viên</span>

            <Select
              value={selectedTeacher}
              onChange={setSelectedTeacher}
              showSearch
              optionFilterProp="label"
              className="timetable-control-panel__select"
              options={[
                {
                  value: "all",
                  label: "Tất cả giáo viên",
                },

                ...availableTeachers.map((teacher) => ({
                  value: teacher.id,
                  label: teacher.fullName,
                })),
              ]}
            />
          </div>
        </div>

        <div className="timetable-control-panel__day">
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            disabled={currentDayIndex <= 0}
            onClick={handlePreviousDay}
          />

          <div className="timetable-day-display">
            <strong>{currentDay.label}</strong>

            <span>{currentDay.date}/2026</span>
          </div>

          <Button
            shape="circle"
            icon={<RightOutlined />}
            disabled={currentDayIndex >= dayOptions.length - 1}
            onClick={handleNextDay}
          />
        </div>
      </section>

      <section className="timetable-week">
        {dayOptions.map((day) => (
          <button
            key={day.key}
            type="button"
            className={[
              "timetable-week__item",
              selectedDay === day.key ? "timetable-week__item--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setSelectedDay(day.key)}
          >
            <span>{day.label}</span>

            <strong>{day.date}</strong>
          </button>
        ))}
      </section>

      <section className="timetable-content-panel">
        <div className="timetable-content-panel__header">
          <div>
            <span className="timetable-content-panel__eyebrow">
              LỊCH GIẢNG DẠY
            </span>

            <h2>{currentDay.label}</h2>
          </div>

          <span className="timetable-content-panel__date">
            {currentDay.date}/2026
          </span>
        </div>

        {timetableItems.length === 0 ? (
          <div className="timetable-empty">
            <Empty description="Chưa có lịch giảng dạy" />
          </div>
        ) : (
          <Row gutter={[18, 18]}>
            {timetableItems.map((item) => {
              const classItem = classes.find(
                (value) => value.id === item.classId,
              );

              const teacher = teachers.find(
                (value) => value.id === item.teacherId,
              );

              const campus = campuses.find(
                (value) => value.id === item.campusId,
              );

              return (
                <Col key={item.id} xs={24} sm={12} xl={8}>
                  <article className="timetable-item">
                    <div className="timetable-item__period">
                      <span>Tiết</span>

                      <strong>{item.period}</strong>
                    </div>

                    <div className="timetable-item__content">
                      <h3>
                        {SUBJECT_LABELS[item.subjectId] ?? item.subjectId}
                      </h3>

                      <div className="timetable-item__details">
                        <span>Lớp: {classItem?.name ?? "-"}</span>

                        <span>GV: {teacher?.fullName ?? "-"}</span>

                        <span>Phòng: {item.room}</span>

                        <span>
                          {item.startTime}
                          {" - "}
                          {item.endTime}
                        </span>

                        <span>{campus?.name ?? "-"}</span>
                      </div>
                    </div>
                  </article>
                </Col>
              );
            })}
          </Row>
        )}
      </section>

      <MobileActionBar
        actions={[
          {
            key: "previous",
            label: "Trước",
            icon: <LeftOutlined />,
            onClick: handlePreviousDay,
          },
          {
            key: "switch",
            label: "Đổi ngày",
            icon: <SwapOutlined />,
            onClick: () => {
              const nextIndex =
                currentDayIndex >= dayOptions.length - 1
                  ? 0
                  : currentDayIndex + 1;

              setSelectedDay(dayOptions[nextIndex].key);
            },
          },
          {
            key: "next",
            label: "Tiếp",
            icon: <RightOutlined />,
            primary: true,
            onClick: handleNextDay,
          },
        ]}
      />
    </div>
  );
};

export default TimetablePage;
