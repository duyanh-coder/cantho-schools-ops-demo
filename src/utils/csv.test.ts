import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildCsv,
    parseCsv,
} from "@/utils/csv";


describe("parseCsv", () => {
    it("parses plain comma-separated values", () => {
        const result =
            parseCsv(
                "ho_ten,gioi_tinh\nNguyen A,Nam\nTran B,Nu",
            );

        expect(result.headers).toEqual([
            "ho_ten",
            "gioi_tinh",
        ]);

        expect(result.rows).toEqual([
            ["Nguyen A", "Nam"],
            ["Tran B", "Nu"],
        ]);
    });

    it("strips the UTF-8 BOM header", () => {
        const result =
            parseCsv(
                "\uFEFFma_so,ten\n01,Hoc sinh A",
            );

        expect(result.headers[0]).toBe("ma_so");
    });

    it("supports quoted cells containing commas", () => {
        const result =
            parseCsv(
                "ho_ten,ghi_chu\n\"Nguyen, Van A\",\"Co, that\"",
            );

        expect(result.rows[0]).toEqual([
            "Nguyen, Van A",
            "Co, that",
        ]);
    });

    it("supports escaped double quotes inside quoted cells", () => {
        const result =
            parseCsv(
                "mo_ta\n\"Ham \"\"so\"\" ho tro\"",
            );

        expect(result.rows[0][0]).toBe(
            'Ham "so" ho tro',
        );
    });

    it("handles CRLF line endings", () => {
        const result =
            parseCsv(
                "a,b\r\n1,2\r\n3,4\r\n",
            );

        expect(result.rows).toEqual([
            ["1", "2"],
            ["3", "4"],
        ]);
    });

    it("returns empty when there is no header row", () => {
        const result =
            parseCsv(
                "chỉ một dòng",
            );

        expect(result.headers).toHaveLength(0);

        expect(result.rows).toHaveLength(0);
    });

    it("skips blank lines", () => {
        const result =
            parseCsv(
                "a,b\n1,2\n\n3,4\n",
            );

        expect(result.rows).toEqual([
            ["1", "2"],
            ["3", "4"],
        ]);
    });
});


describe("buildCsv", () => {
    it("builds a header + body block", () => {
        const csv =
            buildCsv(
                ["a", "b"],
                [
                    ["1", "2"],
                    ["3", "4"],
                ],
            );

        expect(csv).toContain("a,b\n1,2\n3,4");
    });
});