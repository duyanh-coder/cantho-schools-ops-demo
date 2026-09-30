import {
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoAcademicYears,
    canThoBoardingProfiles,
    canThoCampuses,
    canThoClasses,
    canThoEnrolmentChanges,
    canThoMockData,
    canThoPersonnel,
    canThoRooms,
    canThoStudents,
} from "@/mock/canTho";

import {
    buildReportOverview,
    gradeLabel,
    gradeRangeOf,
    REPORT_SCHOOL_ID,
    TREND_UNAVAILABLE_NOTE,
} from "@/pages/Reports/reportStats";


const sources = {
    campuses: canThoCampuses,
    classes: canThoClasses,
    students: canThoStudents,
    personnel: canThoPersonnel,
    rooms: canThoRooms,
    boardingProfiles: canThoBoardingProfiles,
    enrolmentChanges: canThoEnrolmentChanges,
    grades: [],
};

const overview = buildReportOverview(sources);


describe("gradeRangeOf", () => {
    it("giới hạn khối theo bậc học", () => {
        expect(gradeRangeOf("THCS")).toEqual({ min: 6, max: 9 });

        expect(gradeRangeOf("THPT")).toEqual({ min: 10, max: 12 });

        expect(gradeRangeOf("THCS_THPT")).toEqual({ min: 6, max: 12 });
    });
});


describe("gradeLabel", () => {
    it("gắn nhãn tiếng Việt và có nhãn dự phòng", () => {
        expect(gradeLabel(6)).toBe("Lớp 6");

        expect(gradeLabel(12)).toBe("Lớp 12");

        expect(gradeLabel(99)).toBe("Lớp 99");
    });
});


describe("buildReportOverview phạm vi trường", () => {
    it("chỉ lấy các cơ sở của trường mẫu", () => {
        expect(overview.totals.campusCount).toBe(6);

        overview.campusRows.forEach((row) => {
            const campus = canThoCampuses.find((item) =>
                item.id === row.campusId);

            expect(campus?.schoolId).toBe(REPORT_SCHOOL_ID);
        });
    });

    it("đưa trụ sở chính lên đầu danh sách", () => {
        expect(overview.campusRows[0].isMainCampus).toBe(true);

        expect(overview.campusRows[0].code).toBe("NK-MAIN");

        expect(
            overview.campusRows.slice(1).every((row) => !row.isMainCampus),
        ).toBe(true);
    });

    it("chỉ tính khối thuộc bậc THCS", () => {
        overview.gradeRows.forEach((row) => {
            expect(row.grade).toBeGreaterThanOrEqual(6);

            expect(row.grade).toBeLessThanOrEqual(9);
        });
    });

    it("không lẫn số liệu của trường khác", () => {
        const otherSchoolClasses = canThoClasses.filter((item) => {
            const campus = canThoCampuses.find((c) => c.id === item.campusId);

            return campus?.schoolId !== REPORT_SCHOOL_ID;
        });

        expect(otherSchoolClasses.length).toBeGreaterThan(0);

        expect(overview.totals.classCount).toBeLessThan(
            canThoClasses.length,
        );
    });
});


describe("buildReportOverview tổng hợp số", () => {
    it("khớp với đếm trực tiếp trên dữ liệu", () => {
        const campusIds = new Set(
            canThoCampuses
                .filter((campus) => campus.schoolId === REPORT_SCHOOL_ID)
                .map((campus) => campus.id),
        );

        const classes = canThoClasses.filter((item) =>
            campusIds.has(item.campusId));

        const classIds = new Set(classes.map((item) => item.id));

        const students = canThoStudents.filter((student) =>
            student.classId !== undefined && classIds.has(student.classId));

        expect(overview.totals.classCount).toBe(classes.length);

        expect(overview.totals.studentCount).toBe(students.length);

        expect(overview.totals.maleCount + overview.totals.femaleCount)
            .toBe(overview.totals.studentCount);
    });

    it("tách phòng học và phòng chức năng không trùng lặp", () => {
        expect(overview.totals.classroomCount + overview.totals.functionRoomCount)
            .toBe(overview.totals.roomCount);

        expect(overview.totals.roomCount).toBeGreaterThan(0);
    });

    it("tổng các dòng cơ sở khớp tổng chung", () => {
        const sum = overview.campusRows.reduce(
            (total, row) => total + row.studentCount,
            0,
        );

        expect(sum).toBe(overview.totals.studentCount);

        expect(
            overview.campusRows.reduce(
                (total, row) => total + row.classCount,
                0,
            ),
        ).toBe(overview.totals.classCount);
    });

    it("tỷ lệ nội trú trong khoảng 0-100", () => {
        expect(overview.totals.boardingRate).toBeGreaterThanOrEqual(0);

        expect(overview.totals.boardingRate).toBeLessThanOrEqual(100);
    });
});


describe("buildReportOverview nhu cầu học sinh", () => {
    it("tính nhu cầu từ hồ sơ BoardingProfile của đúng trường", () => {
        const campusIds = new Set(
            canThoCampuses
                .filter((campus) => campus.schoolId === REPORT_SCHOOL_ID)
                .map((campus) => campus.id),
        );

        const classIds = new Set(
            canThoClasses
                .filter((item) => campusIds.has(item.campusId))
                .map((item) => item.id),
        );

        const studentIds = new Set(
            canThoStudents
                .filter((student) =>
                    student.classId !== undefined
                    && classIds.has(student.classId))
                .map((student) => student.id),
        );

        const profiles = canThoBoardingProfiles.filter((profile) =>
            studentIds.has(profile.studentId));

        expect(overview.totals.boardingCount).toBe(
            profiles.filter((profile) => profile.boarding).length,
        );

        expect(overview.totals.twoSessionCount).toBe(
            profiles.filter((profile) => profile.twoSession).length,
        );

        expect(overview.totals.mealCount).toBe(
            profiles.filter((profile) => profile.mealRequired).length,
        );
    });

    it("mỗi cơ sở có tối đa số nội trú bằng số hồ sơ của cơ sở", () => {
        overview.campusRows.forEach((row) => {
            expect(row.boardingCount).toBeLessThanOrEqual(row.studentCount);

            expect(row.boardingCount).toBeLessThanOrEqual(
                row.personnelCount + row.studentCount,
            );
        });
    });
});


describe("buildReportOverview lọc năm học", () => {
    it("lấy toàn bộ năm học khi không chọn", () => {
        expect(overview.academicYearId).toBe("");

        // Danh sách năm học lấy từ hồ sơ nhu cầu có dữ liệu, nên là tập con
        // của các năm học trong hệ thống chứ không phải toàn bộ danh mục.
        const yearIds = new Set(
            canThoBoardingProfiles.map((profile) => profile.academicYearId),
        );

        expect(overview.academicYearIds.length).toBe(yearIds.size);

        overview.academicYearIds.forEach((id) => {
            expect(yearIds.has(id)).toBe(true);

            expect(canThoAcademicYears.some((year) => year.id === id))
                .toBe(true);
        });
    });

    it("mọi năm học trong danh sách đều cho ra nhu cầu khác 0", () => {
        overview.academicYearIds.forEach((id) => {
            const scoped = buildReportOverview(sources, id);

            expect(scoped.totals.boardingCount
                + scoped.totals.twoSessionCount
                + scoped.totals.mealCount)
                .toBeGreaterThan(0);
        });
    });

    it("giới hạn nhu cầu theo năm học đã chọn", () => {
        const year = canThoAcademicYears[0];

        const scoped = buildReportOverview(sources, year.id);

        const all = buildReportOverview(sources);

        expect(scoped.academicYearId).toBe(year.id);

        expect(scoped.totals.boardingCount)
            .toBeLessThanOrEqual(all.totals.boardingCount);

        // Quy mô lớp và học sinh không phụ thuộc hồ sơ nhu cầu.
        expect(scoped.totals.classCount).toBe(all.totals.classCount);

        expect(scoped.totals.studentCount).toBe(all.totals.studentCount);
    });

    it("không vỡ khi chọn năm học không có dữ liệu", () => {
        const empty = buildReportOverview(sources, "khong-ton-tai");

        expect(empty.totals.boardingCount).toBe(0);

        expect(empty.totals.classCount).toBe(overview.totals.classCount);

        expect(empty.campusRows.length).toBe(overview.campusRows.length);
    });
});


describe("buildReportOverview xu hướng", () => {
    it("ghi chú khi chỉ có một năm học dữ liệu", () => {
        expect(overview.academicYearIds).toHaveLength(1);

        expect(overview.hasTrendData).toBe(false);

        expect(overview.trendNote).toBe(TREND_UNAVAILABLE_NOTE);
    });

    it("bỏ ghi chú khi có từ hai năm học trở lên", () => {
        const manyYears = buildReportOverview({
            ...sources,

            boardingProfiles: [
                ...canThoBoardingProfiles,

                ...canThoBoardingProfiles.map((profile) => ({
                    ...profile,

                    id: `${profile.id}-next-year`,

                    academicYearId: "2027-2028",
                })),
            ],
        });

        expect(manyYears.academicYearIds.length).toBeGreaterThan(1);

        expect(manyYears.hasTrendData).toBe(true);

        expect(manyYears.trendNote).toBe("");
    });
});


describe("buildReportOverview biến động học sinh", () => {
    it("gom theo ngày hiệu lực và tính biến động ròng", () => {
        overview.enrolmentRows.forEach((row) => {
            expect(row.label).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

            expect(row.net).toBe(row.increase - row.decrease);
        });
    });

    it("sắp ngày tăng dần", () => {
        const dates = overview.enrolmentRows.map((row) => row.date);

        expect([...dates].sort()).toEqual(dates);
    });
});


describe("buildReportOverview cơ cấu", () => {
    it("tổng nhóm nhân sự bằng tổng cán bộ", () => {
        const sum = overview.personnelGroups.reduce(
            (total, group) => total + group.count,
            0,
        );

        expect(sum).toBe(overview.totals.staffCount);
    });

    it("chỉ liệt kê trạng thái lớp và điều kiện phòng có dữ liệu", () => {
        overview.classStatusRows.forEach((row) => {
            expect(row.count).toBeGreaterThan(0);
        });

        overview.roomConditionRows.forEach((row) => {
            expect(row.count).toBeGreaterThan(0);
        });
    });

    it("giữ đúng nhóm nhân sự theo vai trò", () => {
        expect(
            overview.personnelGroups.map((group) => group.key),
        ).toEqual(["manager", "teacher", "staff"]);
    });
});


describe("buildReportOverview không phụ thuộc vùng dữ liệu khác", () => {
    it("loại trừ học sinh của trường khác", () => {
        const otherCampusIds = new Set(
            canThoCampuses
                .filter((campus) => campus.schoolId !== REPORT_SCHOOL_ID)
                .map((campus) => campus.id),
        );

        const leaked = canThoStudents.filter((student) => {
            if (student.classId === undefined) {
                return false;
            }

            const schoolClass = canThoClasses.find((item) =>
                item.id === student.classId);

            return schoolClass !== undefined
                && otherCampusIds.has(schoolClass.campusId);
        });

        expect(leaked.length).toBeGreaterThan(0);

        expect(overview.totals.studentCount).toBeLessThan(
            canThoStudents.length,
        );
    });

    it("nhân sự chỉ gồm người của trường mẫu", () => {
        const leaked = canThoPersonnel.filter((person) =>
            person.schoolId !== REPORT_SCHOOL_ID);

        expect(leaked.length).toBeGreaterThan(0);

        expect(overview.totals.staffCount)
            .toBeLessThanOrEqual(canThoPersonnel.length);
    });

    it("không lấy dữ liệu trường khác qua biến động học sinh", () => {
        const leaked = canThoEnrolmentChanges.filter((change) =>
            change.schoolId !== REPORT_SCHOOL_ID);

        expect(leaked.length).toBeGreaterThan(0);

        const campusIds = new Set(
            canThoCampuses
                .filter((campus) => campus.schoolId === REPORT_SCHOOL_ID)
                .map((campus) => campus.id),
        );

        // Ngày nào có biến động của trường khác mà không có biến động
        // trong phạm vi báo cáo thì tuyệt đối không được xuất hiện.
        const leakedOnlyDates = new Set(
            leaked.map((change) => change.effectiveDate),
        );

        const scopedDates = new Set(
            canThoEnrolmentChanges
                .filter((change) =>
                    change.schoolId === REPORT_SCHOOL_ID
                    && (change.campusId === undefined
                        || campusIds.has(change.campusId)))
                .map((change) => change.effectiveDate),
        );

        const reportDates = new Set(
            overview.enrolmentRows.map((row) => row.date),
        );

        expect(reportDates.size).toBe(scopedDates.size);

        reportDates.forEach((date) => {
            expect(scopedDates.has(date)).toBe(true);
        });

        [...leakedOnlyDates].forEach((date) => {
            if (!scopedDates.has(date)) {
                expect(reportDates.has(date)).toBe(false);
            }
        });
    });

    it("dùng cùng bộ dữ liệu với khu vực hiện tại", () => {
        expect(sources.campuses).toBe(canThoMockData.campuses);

        expect(sources.classes).toBe(canThoMockData.classes);

        expect(sources.personnel).toBe(canThoMockData.personnel);
    });
});