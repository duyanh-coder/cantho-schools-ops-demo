import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildBarChart,
    buildBarList,
    buildDonut,
    buildStackedRows,
    colorAt,
} from "@/components/dashboard/Charts";


describe("colorAt", () => {
    it("lặp lại bảng màu khi vượt quá độ dài", () => {
        expect(colorAt(0)).toBe(colorAt(6));

        expect(colorAt(1)).not.toBe(colorAt(0));
    });
});


describe("buildBarChart", () => {
    it("quy đổi chiều cao theo giá trị lớn nhất", () => {
        const model = buildBarChart([
            { label: "A", value: 50 },
            { label: "B", value: 100 },
            { label: "C", value: 25 },
        ]);

        expect(model.maxValue).toBe(100);

        const byLabel = new Map(model.rows.map((row) => [row.label, row]));

        expect(byLabel.get("B")?.height).toBe(180);

        expect(byLabel.get("A")?.height).toBe(90);

        expect(byLabel.get("C")?.height).toBe(45);
    });

    it("đặt gốc cột tại đáy", () => {
        const model = buildBarChart([{ label: "A", value: 10 }]);

        expect(model.rows[0].y).toBe(180 - model.rows[0].height);

        expect(model.rows[0].y + model.rows[0].height).toBe(180);
    });

    it("không chia cho 0 khi mọi giá trị bằng 0", () => {
        const model = buildBarChart([
            { label: "A", value: 0 },
            { label: "B", value: 0 },
        ]);

        model.rows.forEach((row) => {
            expect(row.height).toBe(0);

            expect(row.percent).toBe(0);
        });
    });

    it("giữ màu tự chọn nếu có", () => {
        const model = buildBarChart([{ label: "A", value: 1, color: "#ff0000" }]);

        expect(model.rows[0].color).toBe("#ff0000");
    });
});


describe("buildBarList", () => {
    it("tính phần trăm theo giá trị lớn nhất", () => {
        const rows = buildBarList([
            { label: "A", value: 20 },
            { label: "B", value: 10 },
        ]);

        expect(rows[0].percent).toBe(100);

        expect(rows[1].percent).toBe(50);
    });

    it("không chia cho 0 với danh sách rỗng", () => {
        expect(buildBarList([])).toEqual([]);
    });
});


describe("buildDonut", () => {
    it("chia tỷ lệ và cộng dồn điểm bắt đầu", () => {
        const { segments, total } = buildDonut([
            { label: "Lãnh đạo", value: 3 },
            { label: "Giáo viên", value: 9 },
            { label: "Nhân viên", value: 8 },
        ]);

        expect(total).toBe(20);

        expect(segments[0].percent).toBe(15);

        expect(segments[1].percent).toBe(45);

        expect(segments[2].percent).toBe(40);

        expect(segments[0].startPercent).toBe(0);

        expect(segments[1].startPercent).toBe(segments[0].percent);

        expect(segments[2].startPercent)
            .toBe(segments[0].percent + segments[1].percent);
    });

    it("trả tổng 0 khi không có dữ liệu", () => {
        const { segments, total } = buildDonut([{ label: "A", value: 0 }]);

        expect(total).toBe(0);

        expect(segments[0].percent).toBe(0);
    });

    it("bỏ giá trị âm thay vì tạo phần trăm âm", () => {
        const { total } = buildDonut([
            { label: "A", value: 10 },
            { label: "B", value: -5 },
        ]);

        expect(total).toBe(10);
    });
});


describe("buildStackedRows", () => {
    const series = [
        { key: "a", label: "A", color: "#111111" },
        { key: "b", label: "B", color: "#222222" },
    ];

    it("tính tổng và tỷ lệ từng phần", () => {
        const values = new Map([
            ["NK", new Map([["a", 3], ["b", 7]])],
        ]);

        const rows = buildStackedRows([{ label: "NK" }], series, values);

        expect(rows[0].total).toBe(10);

        expect(rows[0].parts[0].percent).toBe(30);

        expect(rows[0].parts[1].percent).toBe(70);
    });

    it("bỏ phần có giá trị 0", () => {
        const values = new Map([
            ["NK", new Map([["a", 5], ["b", 0]])],
        ]);

        const rows = buildStackedRows([{ label: "NK" }], series, values);

        expect(rows[0].parts).toHaveLength(1);

        expect(rows[0].parts[0].key).toBe("a");
    });

    it("giữ dòng rỗng cho nhãn không có dữ liệu", () => {
        const rows = buildStackedRows(
            [{ label: "Không có" }],
            series,
            new Map(),
        );

        expect(rows[0].total).toBe(0);

        expect(rows[0].parts).toEqual([]);
    });
});