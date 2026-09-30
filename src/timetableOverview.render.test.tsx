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

import TimetablePage from "@/pages/Timetable";

const renderPage = (search = "?tab=grid") => render(
    <MemoryRouter initialEntries={[`/operations/timetable${search}`]}>
        <Routes>
            <Route
                path="/operations/timetable"
                element={<TimetablePage />}
            />
        </Routes>
    </MemoryRouter>,
);

describe("TimetablePage renders the overview grid tab", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("keeps the five management tabs", () => {
        renderPage();

        expect(screen.getByText("Lưới thời khóa biểu")).toBeTruthy();

        expect(screen.getByText(/^Kiểm tra & chỉnh sửa \(\d+\)$/))
            .toBeTruthy();

        expect(screen.getByText("Phân công giảng dạy")).toBeTruthy();

        expect(screen.getByText("Phiên bản & lịch sử")).toBeTruthy();

        expect(screen.getByText("Phòng & công suất")).toBeTruthy();
    });

    it("shows the weekly summary derived from the visible grid", () => {
        renderPage();

        expect(screen.getByText(/Tổng quan tuần/i)).toBeTruthy();

        for (const label of [
            "Tổng tiết",
            "Lớp có lịch",
            "Giáo viên có lịch",
            "Phòng sử dụng",
            "Phân hiệu hoạt động",
        ]) {
            expect(screen.getByText(label)).toBeTruthy();
        }
    });

    it("keeps the legacy quota KPIs for the management tabs", () => {
        renderPage();

        expect(screen.getByText("Thiếu tiết")).toBeTruthy();

        expect(screen.getByText("Vượt định mức")).toBeTruthy();
    });

    it("exposes the academic year, semester and campus scope controls", () => {
        renderPage();

        expect(screen.getByText(/Tuần \d+ · .* năm học 2026-2027/)).toBeTruthy();

        expect(screen.getByText(/Trường THCS Ninh Kiều/)).toBeTruthy();

        expect(screen.getByRole("button", {
            name: /Đặt lại bộ lọc/i,
        })).toBeTruthy();
    });

    it("never shows the legacy campus name as the current school name", () => {
        renderPage();

        expect(screen.queryByText(/Đoàn Thị Điểm/)).toBeNull();
    });
});