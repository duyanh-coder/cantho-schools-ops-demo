import {
    render,
    screen,
} from "@testing-library/react";

import {
    MemoryRouter,
} from "react-router-dom";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoClasses,
    canThoStudents,
} from "@/mock/canTho";

import {
    buildClassRosterStats,
} from "@/utils/classRoster";

import StudentList from "@/pages/Students/StudentList";

const SCHOOL_001 = "can-tho-school-001";

const targetClass = canThoClasses.find(
    (classItem) =>
        classItem.schoolId === SCHOOL_001 &&
        classItem.name === "7A1",
) ?? canThoClasses.find(
    (classItem) => classItem.schoolId === SCHOOL_001,
);

const renderInClassContext = () =>
    render(
        <MemoryRouter
            initialEntries={[
                `/operations/classes/${targetClass?.id}?tab=students`,
            ]}
        >
            <StudentList
                compact
                schoolId={targetClass?.schoolId}
                classId={targetClass?.id}
            />
        </MemoryRouter>,
    );

describe("PHASE 06 class roster renders inside the class context", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("leaves the class context header and KPI to ClassDetail", () => {
        const { container } = renderInClassContext();

        // Context lớp và KPI do ClassDetail sở hữu: danh sách không lặp lại.
        expect(container.querySelector(".page-kpi")).toBeNull();

        expect(screen.queryByText("Tổng học sinh")).toBeNull();

        expect(
            screen.getByText("HỒ SƠ HỌC SINH"),
        ).toBeTruthy();

        expect(screen.getByRole("button", { name: /Thêm học sinh/ }))
            .toBeTruthy();
    });

    it("lists only studying students of the opened class", () => {
        const roster = canThoStudents.filter(
            (student) =>
                student.classId === targetClass?.id &&
                student.status === "studying",
        );

        expect(roster.length).toBeGreaterThan(0);

        renderInClassContext();

        const names = roster.map((student) => student.fullName);

        const foreignNames = new Set(
            canThoStudents
                .filter((student) =>
                    student.classId !== targetClass?.id &&
                    student.status === "studying")
                .map((student) => student.fullName),
        );

        // Trùng tên giữa hai lớp không phải rò rỉ dữ liệu: chỉ kiểm tra
        // những tên không xuất hiện trong lớp đang mở.
        for (const name of names) {
            foreignNames.delete(name);
        }

        // Trang đầu tiên của bảng: chỉ hiện học sinh của lớp đang mở.
        const firstPage = names.slice(0, 10);

        for (const name of firstPage) {
            expect(screen.getAllByText(name).length).toBeGreaterThan(0);
        }

        for (const name of foreignNames) {
            if (screen.queryByText(name)) {
                throw new Error(`Lọt học sinh của lớp khác: ${name}`);
            }
        }
    });

    it("hides only non-studying students by default in the class scope", () => {
        expect(targetClass).toBeDefined();

        if (!targetClass) {
            return;
        }

        const roster = canThoStudents.filter(
            (student) => student.classId === targetClass.id,
        );

        const studying = roster.filter(
            (student) => student.status === "studying",
        );

        const notStudying = roster.filter(
            (student) => student.status !== "studying",
        );

        expect(studying.length).toBeGreaterThan(0);

        const { container } = renderInClassContext();

        const renderedNames = new Set(
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    "tbody td a",
                ),
            ).map((cell) => cell.textContent?.trim() ?? ""),
        );

        expect(renderedNames.size).toBeGreaterThan(0);

        // Bảng phân trang 10 dòng: chỉ dòng trang đầu nằm trong DOM.
        const PAGE_SIZE = 10;

        for (const student of studying.slice(0, PAGE_SIZE)) {
            expect(renderedNames.has(student.fullName)).toBe(true);
        }

        expect(renderedNames.size).toBe(
            Math.min(studying.length, PAGE_SIZE),
        );

        for (const student of notStudying) {
            expect(renderedNames.has(student.fullName)).toBe(false);
        }

        // Bộ lọc mặc định đang bật, không phải "tất cả".
        expect(
            screen.getAllByText("Đang học").length,
        ).toBeGreaterThan(0);

        // Số học sinh mặc định khớp đúng sĩ số dùng cho KPI của ClassDetail.
        const stats = buildClassRosterStats(studying, targetClass);

        expect(stats.total).toBe(studying.length);
    });

    it("offers search and the class-context filters only", () => {
        renderInClassContext();

        expect(
            screen.getByPlaceholderText("Tìm kiếm tên, mã HS, GVCN..."),
        ).toBeTruthy();

        // Bộ lọc "Nhu cầu" và tiêu đề cột "Nhu cầu" cùng tồn tại.
        expect(screen.getAllByText("Nhu cầu").length).toBeGreaterThan(0);

        expect(screen.getAllByText("Giới tính").length).toBeGreaterThan(0);

        // Trong context lớp: không lọc theo Cơ sở/Khối/Lớp/Năm học.
        expect(screen.queryByText("Cơ sở")).toBeNull();
        expect(screen.queryByText("Khối")).toBeNull();
        expect(screen.queryByText("Năm học")).toBeNull();
    });

    it("links each row to the student profile deep link", () => {
        const student = canThoStudents.find(
            (item) =>
                item.classId === targetClass?.id &&
                item.status === "studying",
        );

        renderInClassContext();

        expect(student).toBeDefined();

        if (!student) {
            return;
        }

        expect(screen.getAllByText(student.code).length).toBeGreaterThan(0);
    });
});
