import {
    render,
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

import {
    SUBJECT_TONE_COLORS,
} from "@/components/TimetableCalendar/lookups";

const hexes = new Set(
    Object.values(SUBJECT_TONE_COLORS).map((color) =>
        color.toLowerCase()),
);

/**
 * jsdom chuẩn hoá màu trong inline style thành `rgb(...)` nên phải đưa về
 * dạng hex trước khi so với bảng màu.
 */
const toHex = (value: string): string => {
    const trimmed = value.trim().toLowerCase();

    if (trimmed.startsWith("#")) {
        return trimmed;
    }

    const channels = (trimmed.match(/\d+/g) ?? []).map(Number);

    if (channels.length !== 3) {
        return "";
    }

    return `#${channels
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`;
};

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

const legendColors = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>(
        ".tt-cal__legend-swatch",
    ))
        .map((node) => toHex(node.style.backgroundColor));

const gridTones = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLElement>(".tt-cal-event"))
        .map((node) =>
            toHex(node.style.getPropertyValue("--tt-cal-tone")));

describe("Màu môn học giữa dải chú giải và lưới", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("mọi ô lưới dùng màu có trong bảng màu chung", () => {
        const { container } = renderGrid();

        const tones = gridTones(container);

        expect(tones.length).toBeGreaterThan(0);

        tones.forEach((tone) => {
            expect(hexes.has(tone)).toBe(true);
        });
    });

    it("dải chú giải và lưới cùng dùng một bảng màu", () => {
        const { container } = renderGrid();

        const legend = legendColors(container);

        expect(legend.length).toBeGreaterThan(0);

        const grid = new Set(gridTones(container));

        legend.forEach((color) => {
            expect(hexes.has(color)).toBe(true);
            expect(grid.has(color)).toBe(true);
        });
    });
});