import {
    render,
    screen,
} from "@testing-library/react";

import {
    describe,
    expect,
    it,
} from "vitest";

import ReportOverview from "@/pages/Reports/ReportOverview";

import {
    buildReportOverview,
    TREND_UNAVAILABLE_NOTE,
} from "@/pages/Reports/reportStats";

import {
    getCurrentRegionMockData,
} from "@/mock";

import {
    canThoBoardingProfiles,
    canThoEnrolmentChanges,
    canThoRooms,
} from "@/mock/canTho";


const region = getCurrentRegionMockData();

const overview = buildReportOverview({
    campuses: region.campuses,
    classes: region.classes,
    students: region.students,
    personnel: region.personnel,
    rooms: canThoRooms,
    boardingProfiles: canThoBoardingProfiles,
    enrolmentChanges: canThoEnrolmentChanges,
    grades: [],
});


describe("ReportOverview hiển thị chỉ số ban giám hiệu", () => {
    it("render đủ sáu thẻ chỉ số", () => {
        render(<ReportOverview overview={overview} />);

        [
            "Học sinh",
            "Lớp học",
            "Nhân sự",
            "Phòng học",
            "Nội trú",
            "Cơ sở",
        ].forEach((label) => {
            // "Học sinh" và "Lớp học" xuất hiện ở cả thẻ chỉ số lẫn
            // bảng tổng hợp nên dùng truy vấn theo tập hợp.
            expect(screen.getAllByText(label).length).toBeGreaterThan(0);
        });
    });

    it("hiện số học sinh khớp với mô hình", () => {
        const { container } = render(
            <ReportOverview overview={overview} />,
        );

        expect(container.textContent)
            .toContain(
                overview.totals.studentCount.toLocaleString(
                    "vi-VN",
                ),
            );
    });

    it("hiện tỷ lệ nội trú", () => {
        render(<ReportOverview overview={overview} />);

        expect(
            screen.getByText(
                new RegExp(
                    `${overview.totals.boardingRate}% học sinh nội trú`,
                ),
            ),
        ).toBeTruthy();
    });
});


describe("ReportOverview hiển thị biểu đồ", () => {
    it("render đủ tám biểu đồ quản trị", () => {
        render(<ReportOverview overview={overview} />);

        [
            "Học sinh theo khối",
            "Quy mô học sinh theo cơ sở",
            "Nhu cầu học sinh theo cơ sở",
            "Cơ cấu nhân sự",
            "Biến động tăng học sinh",
            "Biến động giảm học sinh",
            "Trạng thái lớp học",
            "Tình trạng phòng học",
        ].forEach((title) => {
            expect(screen.getByText(title)).toBeTruthy();
        });
    });

    it("ghi chú xu hướng khi chỉ có một năm học", () => {
        render(<ReportOverview overview={overview} />);

        expect(screen.getByText(TREND_UNAVAILABLE_NOTE)).toBeTruthy();
    });

    it("không ghi chú xu hướng khi có nhiều năm học", () => {
        const manyYears = buildReportOverview({
            campuses: region.campuses,
            classes: region.classes,
            students: region.students,
            personnel: region.personnel,
            rooms: canThoRooms,
            boardingProfiles: [
                ...canThoBoardingProfiles,
                ...canThoBoardingProfiles.map((profile) => ({
                    ...profile,
                    id: `${profile.id}-next`,
                    academicYearId: "2027-2028",
                })),
            ],
            enrolmentChanges: canThoEnrolmentChanges,
            grades: [],
        });

        render(<ReportOverview overview={manyYears} />);

        expect(manyYears.hasTrendData).toBe(true);

        expect(screen.queryByText(TREND_UNAVAILABLE_NOTE)).toBeNull();
    });
});


describe("ReportOverview hiển thị bảng tổng hợp", () => {
    it("render đủ cột và đủ dòng theo cơ sở", () => {
        render(<ReportOverview overview={overview} />);

        [
            "Mã cơ sở",
            "Tên cơ sở",
            "Loại",
            "Lớp",
            "Học sinh",
            "TB/lớp",
            "Phòng học",
            "Nhân sự",
        ].forEach((column) => {
            expect(screen.getAllByText(column).length).toBeGreaterThan(0);
        });

        overview.campusRows.forEach((row) => {
            // Mã và tên cơ sở cũng được dùng làm nhãn ở biểu đồ cột ngang
            // và biểu đồ cột xếp chồng nên có thể xuất hiện nhiều lần.
            expect(screen.getAllByText(row.code).length)
                .toBeGreaterThan(0);

            expect(screen.getAllByText(row.name).length)
                .toBeGreaterThan(0);
        });
    });
});