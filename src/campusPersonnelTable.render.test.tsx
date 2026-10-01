import {
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

import CampusDetail from "@/pages/Campuses/CampusDetail";

import {
    canThoPersonnel,
} from "@/mock/canTho";

import {
    buildCampusKpis,
} from "@/utils/campusScale";

const CAMPUS_ID = "campus-main";

/**
 * Bảng nhân sự dùng chung với mục "NHÂN SỰ" ở tổng quan trường, nên kiểm
 * tra ở đây cũng bảo vệ luôn bản dùng chung đó.
 */
const renderCampusStaffTab = () =>
    render(
        <MemoryRouter
            initialEntries={[
                `/operations/campuses/${CAMPUS_ID}?tab=staff`,
            ]}
        >
            <Routes>
                <Route
                    path="/operations/campuses/:campusId"
                    element={<CampusDetail />}
                />
            </Routes>
        </MemoryRouter>,
    );

describe("tab Nhân sự ở chi tiết cơ sở", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("hiện tiêu đề NHÂN SỰ kèm số liệu khớp danh sách", () => {
        renderCampusStaffTab();

        const kpis =
            buildCampusKpis(CAMPUS_ID, canThoPersonnel);

        expect(screen.getByText("NHÂN SỰ")).toBeTruthy();

        expect(
            screen.getByText(
                `Cán bộ, giáo viên, nhân viên (${kpis.totalPersonnel
                    .toLocaleString("vi-VN")})`,
            ),
        ).toBeTruthy();

        expect(screen.getByText("Giáo viên:")).toBeTruthy();
        expect(screen.getByText("Cán bộ quản lý:")).toBeTruthy();
        expect(screen.getByText("Nhân viên:")).toBeTruthy();
    });

    it("dùng bộ cột của mục nhân sự ở tổng quan", () => {
        const { container } = renderCampusStaffTab();

        [
            "Chức vụ / Vai trò",
            "Bộ môn / Chuyên môn",
            "Tổ bộ môn",
            "Chi tiết",
        ].forEach((title) => {
            // antd render thêm một bản ẩn của tiêu đề để đo bề rộng, nên
            // dùng getAllByText thay vì getByText.
            expect(screen.getAllByText(title).length)
                .toBeGreaterThan(0);
        });

        // Cột Cơ sở mang responsive: ["lg"], jsdom không báo khớp
        // breakpoint nên cột này không được kiểm ở test render.
        expect(screen.queryByText("Cơ sở")).toBeNull();

        expect(
            container.querySelectorAll(".ant-avatar").length,
        ).toBeGreaterThan(0);
    });

    it("chỉ liệt kê nhân sự của cơ sở đang xem", () => {
        renderCampusStaffTab();

        const ofCampus = canThoPersonnel.filter(
            (item) => item.campusIds.includes(CAMPUS_ID),
        );

        expect(ofCampus.length).toBeGreaterThan(8);

        // Trang đầu chỉ hiện 8 dòng nên kiểm theo trang đầu.
        ofCampus.slice(0, 8).forEach((item) => {
            expect(
                screen.getAllByText(item.fullName, { exact: true }).length,
            ).toBeGreaterThan(0);
        });

        const outside = ofCampus.slice(8).map((item) => item.fullName);

        expect(outside.length).toBeGreaterThan(0);

        outside.forEach((fullName) => {
            expect(screen.queryByText(fullName, { exact: true }))
                .toBeNull();
        });
    });
});