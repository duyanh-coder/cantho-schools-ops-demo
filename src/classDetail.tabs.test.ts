import { describe, expect, it } from "vitest";

import source from "./pages/Classes/ClassDetail.tsx?raw";

const tabItemsBlock = (() => {
    const start = source.indexOf("const tabItems = [");

    expect(start).toBeGreaterThan(-1);

    const end = source.indexOf("\n    ];", start);

    expect(end).toBeGreaterThan(start);

    return source.slice(start, end);
})();

const DETAIL_TABS = [
    "overview",
    "students",
    "teachers",
    "timetable",
    "enrollment",
    "needs",
    "records",
];

const RETIRED_TABS = [
    "homeroom",
    "room",
    "roster",
    "activities",
    "history",
];

describe("PHASE 05 class detail tabs", () => {
    it("declares exactly the seven agreed tabs", () => {
        const block = source.match(
            /const TAB_KEYS = \[([\s\S]*?)\] as const;/,
        )?.[1] ?? "";

        const keys = [...block.matchAll(/"([a-z]+)"/g)]
            .map((match) => match[1]);

        expect(keys).toStrictEqual(DETAIL_TABS);
    });

    it("renders no tab outside the agreed set", () => {
        const rendered = [...tabItemsBlock.matchAll(/key: "([a-z]+)"/g)]
            .map((match) => match[1]);

        expect(rendered).toStrictEqual(DETAIL_TABS);
    });

    it("drops the retired tabs", () => {
        for (const key of RETIRED_TABS) {
            expect(tabItemsBlock).not.toContain(`key: "${key}"`);
        }
    });

    it("routes every tab card to a tab that still exists", () => {
        const tabTargets = [...source.matchAll(/tab: "([a-z]+)" as TabKey/g)]
            .map((match) => match[1]);

        expect(tabTargets.length).toBeGreaterThan(0);

        for (const target of tabTargets) {
            expect(DETAIL_TABS).toContain(target);
        }
    });
});
