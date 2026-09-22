import {
    describe,
    expect,
    it,
} from "vitest";

import {
    canAccess,
    getAccessiblePaths,
    getRoleLabel,
} from "@/utils/permission";


describe("permission - canAccess", () => {
    it("gives admin full access to every operation route", () => {
        const paths =
            getAccessiblePaths(
                "admin",
            );

        expect(paths).toContain("/operations/alerts");

        expect(paths).toContain("/operations/reports");

        expect(paths).toContain("/operations/students");
    });

    it("excludes alerts for the principal role", () => {
        expect(
            canAccess(
                "hieutruong",
                "/operations/reports",
            ),
        ).toBe(true);

        expect(
            canAccess(
                "hieutruong",
                "/operations/alerts",
            ),
        ).toBe(false);
    });

    it("restricts the clerk role to operational modules", () => {
        expect(
            canAccess(
                "vanthu",
                "/operations/personnel",
            ),
        ).toBe(true);

        expect(
            canAccess(
                "vanthu",
                "/operations/students",
            ),
        ).toBe(true);

        expect(
            canAccess(
                "vanthu",
                "/operations/reports",
            ),
        ).toBe(false);

        expect(
            canAccess(
                "vanthu",
                "/operations/alerts",
            ),
        ).toBe(false);
    });

    it("denies unknown routes for any role", () => {
        expect(
            canAccess(
                "admin",
                "/operations/nope",
            ),
        ).toBe(false);

        expect(
            canAccess(
                "vanthu",
                "/",
            ),
        ).toBe(false);
    });
});


describe("permission - getRoleLabel", () => {
    it("returns the Vietnamese label for known roles", () => {
        expect(
            getRoleLabel(
                "admin",
            ),
        ).toBe("Quản trị viên");

        expect(
            getRoleLabel(
                "hieutruong",
            ),
        ).toBe("Hiệu trưởng");
    });

    it("falls back to the raw key for unknown roles", () => {
        expect(
            getRoleLabel(
                "unknown" as never,
            ),
        ).toBe("unknown");
    });
});