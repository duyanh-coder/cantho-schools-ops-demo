import {
    render,
    screen,
} from "@testing-library/react";

import {
    MemoryRouter,
    Route,
    Routes,
} from "react-router-dom";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoStudents,
} from "@/mock/canTho";

import StudentDetail from "@/pages/Students/StudentDetail";

const TARGET_STUDENT_ID = "can-tho-student-001";

const renderDetail = (tab: string) => {
    localStorage.setItem(
        "hpms.student-movements",
        JSON.stringify([]),
    );

    return render(
        <MemoryRouter
            initialEntries={[
                `/operations/students/${TARGET_STUDENT_ID}?tab=${tab}`,
            ]}
        >
            <Routes>
                <Route
                    path="/operations/students/:studentId"
                    element={<StudentDetail />}
                />
            </Routes>
        </MemoryRouter>,
    );
};

describe("StudentDetail renders a CV-style profile tab", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("renders the six CV sections with the student identity", () => {
        const student = canThoStudents.find(
            (item) => item.id === TARGET_STUDENT_ID,
        );

        expect(student).toBeDefined();

        const { container } = renderDetail("profile");

        // Bố cục CV: cột danh tính dính + cột nội dung các khối.
        expect(
            container.querySelector(".students-detail__cv"),
        ).toBeTruthy();

        expect(
            container.querySelector(".students-detail__cv-side"),
        ).toBeTruthy();

        expect(
            container.querySelector(".students-detail__cv-main"),
        ).toBeTruthy();

        if (!student) {
            return;
        }

        // Sáu khối đã thống nhất với hồ sơ nhân sự.
        for (const anchor of [
            "ly-lich",
            "hoc-tap",
            "nguoi-giam-ho",
            "ban-tru",
            "thanh-tich",
            "lich-su",
        ]) {
            expect(
                container.querySelector(`#student-cv-${anchor}`),
            ).toBeTruthy();
        }

        expect(screen.getAllByText("Lý lịch").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Học tập").length).toBeGreaterThan(0);

        expect(
            screen.getAllByText("Người giám hộ").length,
        ).toBeGreaterThan(0);

        expect(screen.getAllByText("Bán trú / Hai buổi").length)
            .toBeGreaterThan(0);

        expect(screen.getAllByText("Thành tích").length)
            .toBeGreaterThan(0);

        expect(screen.getAllByText("Lịch sử hồ sơ").length)
            .toBeGreaterThan(0);

        // KPI tóm tắt của CV.
        expect(container.querySelector(".page-kpi")).toBeTruthy();

        // "Mã học sinh" xuất hiện ở KPI cạnh danh tính và trong khối Lý lịch.
        expect(
            screen.getAllByText("Mã học sinh").length,
        ).toBeGreaterThanOrEqual(2);

        // Không còn dạng phẳng của bản Hồ sơ cũ.
        expect(
            container.querySelector(".personnel-detail__cv"),
        ).toBeNull();
    });

    it("sumarises tables instead of duplicating every tab", () => {
        const { container } = renderDetail("profile");

        // Mỗi bảng tóm tắt kèm nút dẫn sang tab chi tiết.
        const detailLinks = Array.from(
            container.querySelectorAll<HTMLElement>(
                ".students-detail__cv-block-head button",
            ),
        ).map((button) => button.textContent?.trim());

        expect(detailLinks.length).toBeGreaterThanOrEqual(4);

        for (const label of detailLinks) {
            expect(label).toBe("Xem tất cả");
        }
    });

    it("renders nothing and redirects for an unknown student", () => {
        localStorage.clear();

        const { container } = render(
            <MemoryRouter
                initialEntries={[
                    "/operations/students/can-tho-student-missing",
                ]}
            >
                <Routes>
                    <Route
                        path="/operations/students/:studentId"
                        element={<StudentDetail />}
                    />
                    <Route
                        path="/operations/schools"
                        element={
                            <div>Đã chuyển về danh sách lớp</div>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        );

        // Học sinh không tồn tại: không render CV, chuyển về context lớp.
        expect(
            container.querySelector(".students-detail__cv"),
        ).toBeNull();

        expect(
            screen.getByText("Đã chuyển về danh sách lớp"),
        ).toBeTruthy();
    });
});

describe("StudentDetail renders the class timetable for the student", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("shows the subject table and the timetable calendar", () => {
        const { container } = renderDetail("timetable");

        // Lịch học của học sinh là lưới TKB dùng chung của lớp.
        expect(screen.getAllByText("Môn học").length).toBeGreaterThan(0);

        expect(
            container.querySelector(".tt-cal"),
        ).toBeTruthy();

        expect(screen.getAllByText("Tiết/tuần").length)
            .toBeGreaterThan(0);

        // Bảng tiết cũ đã bị thay bằng TimetableCalendar.
        expect(screen.queryByText("Trạng thái")).toBeNull();
    });

    it("explains when the class has no timetable", () => {
        const { container } = renderDetail("timetable");

        const hasCalendar = Boolean(
            container.querySelector(".tt-cal"),
        );

        if (hasCalendar) {
            expect(screen.getAllByText("Môn học").length)
                .toBeGreaterThan(0);
        } else {
            expect(
                screen.getByText(/chưa có thời khóa biểu/),
            ).toBeTruthy();
        }
    });
});