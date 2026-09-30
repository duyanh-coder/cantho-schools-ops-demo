import {
    describe,
    expect,
    it,
} from "vitest";

import type { ItemType } from "antd/es/menu/interface";

import {
    MENU_ITEMS,
} from "@/components/dashboard/Sidebar/menuItems";

import {
    APP_MENU_ITEMS,
} from "@/layouts/AppSidebar/menuItems";

import {
    ROLE_GUIDES,
} from "@/config/roles";

import {
    modulePathByHint,
} from "@/config/taskModules";

import {
    OPERATION_FEATURES,
} from "@/pages/Home/operationFeatures";


/** Đường dẫn Cảnh báo vẫn còn được phép giữ lại trong hệ thống. */
const ALERTS_PATH = "/operations/alerts";

const hint = (
    module: string,
): { module: string; color: string; iconKey: string } => ({
    module,

    color: "blue",

    iconKey: "school",
});


/**
 * Menu của Antd cho phép phần tử `null` và cho phép `key` là số, nên phải
 * quy về chuỗi trước khi so sánh.
 */
/** `path` là thuộc tính riêng của menu dự án, không có trong kiểu của Antd. */
type ProjectMenuItem = {
    key?: ItemType extends null ? never : string | number;

    path?: string;

    label?: unknown;

    children?: ItemType[];
};

const pathsOf = (
    items: ItemType[],
): string[] => items.flatMap((item) => {
    if (!item) {
        return [];
    }

    const entry = item as ProjectMenuItem;

    return [
        ...(entry.key === undefined ? [] : [String(entry.key)]),

        ...(entry.path ? [entry.path] : []),

        ...pathsOf(entry.children ?? []),
    ];
});

const labelsOf = (
    items: ItemType[],
): string[] => items.flatMap((item) => {
    if (!item) {
        return [];
    }

    const entry = item as ProjectMenuItem;

    return [
        typeof entry.label === "string" ? entry.label : "",

        ...labelsOf(entry.children ?? []),
    ];
});

const ALERT_LABEL = "Cảnh báo";


describe("Cảnh báo không còn trên menu dashboard", () => {
    it("không có đường dẫn nào dẫn tới cảnh báo", () => {
        const paths = pathsOf(MENU_ITEMS);

        expect(paths.some((path) => path.startsWith(ALERTS_PATH)))
            .toBe(false);

        expect(paths.some((path) => path.includes("alert"))).toBe(false);
    });

    it("không còn nhãn Cảnh báo", () => {
        expect(labelsOf(MENU_ITEMS)).not.toContain(ALERT_LABEL);
    });
});


describe("Cảnh báo không còn trên menu phụ", () => {
    it("không có đường dẫn nào dẫn tới cảnh báo", () => {
        const paths = pathsOf(APP_MENU_ITEMS);

        expect(paths.some((path) => path.includes("alert"))).toBe(false);
    });

    it("không còn nhãn Cảnh báo", () => {
        expect(labelsOf(APP_MENU_ITEMS)).not.toContain(ALERT_LABEL);
    });
});


describe("Cảnh báo không còn trên trang chủ", () => {
    it("thẻ tính năng không dẫn tới cảnh báo", () => {
        OPERATION_FEATURES.forEach((card) => {
            expect(card.path).not.toBe(ALERTS_PATH);

            expect(card.title).not.toBe(ALERT_LABEL);
        });
    });
});


describe("Cảnh báo không còn trong hướng dẫn vai trò", () => {
    it("mọi vai trò đều không mở tới cảnh báo", () => {
        expect(ROLE_GUIDES.length).toBeGreaterThan(0);

        ROLE_GUIDES.forEach((guide) => {
            guide.features.forEach((feature) => {
                expect(feature.path).not.toBe(ALERTS_PATH);
            });

            expect(
                guide.features.some((feature) =>
                    feature.path.includes("alert")),
            ).toBe(false);
        });
    });
});


describe("định tuyến nhiệm vụ không trỏ về cảnh báo", () => {
    it("tên module cảnh báo rơi về trang vận hành", () => {
        expect(modulePathByHint(hint("cảnh báo")))
            .toBe("/operations/schools");
    });

    it("module không xác định cũng dẫn về trang vận hành", () => {
        expect(modulePathByHint(hint("module-la")))
            .toBe("/operations/schools");
    });

    it("các module còn lại vẫn trỏ đúng", () => {
        expect(modulePathByHint(hint("báo cáo")))
            .toBe("/operations/reports");

        expect(modulePathByHint(hint("thời khóa biểu")))
            .toBe("/operations/timetable");

        expect(modulePathByHint(hint("bản đồ gis")))
            .toBe("/operations/gis");

        expect(modulePathByHint(hint("danh mục")))
            .toBe("/operations/catalogs");
    });
});


describe("các mục khác của menu vẫn còn", () => {
    it("giữ đủ các mục vận hành chính", () => {
        const keys = pathsOf(MENU_ITEMS);

        expect(keys).toContain("/operations/schools");

        expect(keys).toContain("/operations/documents");

        expect(keys).toContain("/operations/timetable");

        expect(keys).toContain("/operations/gis");

        expect(keys).toContain("/operations/reports");

        expect(keys).toContain("/operations/chatbot");
    });
});