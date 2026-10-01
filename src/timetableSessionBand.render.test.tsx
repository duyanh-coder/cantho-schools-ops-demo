import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    MemoryRouter,
    Route,
    Routes,
} from "react-router-dom";

import TimetablePage from "@/pages/Timetable";

const renderGrid = () => render(
    <MemoryRouter initialEntries={["/operations/timetable?tab=grid"]}>
        <Routes>
            <Route
                path="/operations/timetable"
                element={<TimetablePage />}
            />
        </Routes>
    </MemoryRouter>,
);

const sessionBands = (container: HTMLElement) =>
    Array.from(container.querySelectorAll(".tt-cal__session"))
        .map((node) => node.textContent ?? "");

const periodLabels = (container: HTMLElement) =>
    Array.from(container.querySelectorAll(".tt-cal__time strong"))
        .map((node) => node.textContent ?? "");

describe("Dải buổi của lưới thời khóa biểu", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("mặc định xem cả ngày thì không hiện dải buổi", () => {
        const { container } = renderGrid();

        // Bộ lọc mặc định là "Cả ngày", lưới có tiết sáng và tiết chiều
        // nên không cần dải tên buổi.
        expect(sessionBands(container)).toEqual([]);

        const labels = periodLabels(container);

        expect(labels).toContain("Tiết 1");
        expect(labels).toContain("Tiết 10");
    });

    it("lọc buổi chiều thì chỉ hiện dải BUỔI CHIỀU và tiết của buổi đó", () => {
        const { container } = renderGrid();

        fireEvent.click(screen.getByText("Buổi chiều"));

        expect(sessionBands(container)).toEqual(["Buổi chiều"]);

        const labels = periodLabels(container);

        expect(labels).toContain("Tiết 6");
        expect(labels).toContain("Tiết 10");
        expect(labels).not.toContain("Tiết 1");
        expect(labels).not.toContain("Tiết 5");
    });

    it("lọc buổi sáng thì chỉ hiện dải BUỔI SÁNG và tiết của buổi đó", () => {
        const { container } = renderGrid();

        fireEvent.click(screen.getByText("Buổi sáng"));

        expect(sessionBands(container)).toEqual(["Buổi sáng"]);

        const labels = periodLabels(container);

        expect(labels).toContain("Tiết 1");
        expect(labels).toContain("Tiết 5");
        expect(labels).not.toContain("Tiết 6");
    });

    it("chọn lại Cả ngày thì dải buổi ẩn đi", () => {
        const { container } = renderGrid();

        fireEvent.click(screen.getByText("Buổi chiều"));

        expect(sessionBands(container).length).toBe(1);

        fireEvent.click(screen.getByText("Cả ngày"));

        expect(sessionBands(container)).toEqual([]);

        expect(periodLabels(container)).toContain("Tiết 1");
    });
});