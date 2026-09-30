/**
 * Biểu đồ SVG tối giản cho báo cáo quản trị.
 *
 * Dựng bằng đường dẫn SVG thuần nên không phụ thuộc thư viện biểu đồ và
 * dễ kiểm thử: mọi phép tính tọa độ nằm trong các hàm thuần bên dưới.
 */

export interface ChartDatum {
    label: string;

    value: number;

    /** Màu thanh; mặc định dùng bảng màu chung. */
    color?: string;
}

export interface ChartSeries {
    key: string;

    label: string;

    color: string;
}

export const CHART_PALETTE = [
    "#0891b2",
    "#2563eb",
    "#0d9488",
    "#f59e0b",
    "#db2777",
    "#7c3aed",
] as const;

export const colorAt = (
    index: number,
): string => CHART_PALETTE[index % CHART_PALETTE.length];


export interface BarChartModel {
    rows: Array<{
        label: string;

        value: number;

        height: number;

        y: number;

        color: string;

        percent: number;
    }>;

    maxValue: number;
}


/**
 * Quy đổi danh sách số sang toạ độ cột dọc.
 *
 * Chia đều bề rộng cho từng nhãn và đặt chiều cao cột theo tỉ lệ với giá
 * trị lớn nhất. Nếu mọi giá trị bằng 0 thì các cột có chiều cao 0.
 */
export const buildBarChart = (
    data: ChartDatum[],
    height = 180,
): BarChartModel => {
    const maxValue = Math.max(0, ...data.map((item) => item.value));

    return {
        maxValue,

        rows: data.map((item, index) => {
            const ratio = maxValue > 0 ? item.value / maxValue : 0;

            const barHeight = Math.round(ratio * height * 100) / 100;

            return {
                label: item.label,

                value: item.value,

                height: barHeight,

                y: height - barHeight,

                color: item.color ?? colorAt(index),

                percent: Math.round(ratio * 1000) / 10,
            };
        }),
    };
};


/**
 * Quy đổi danh sách số sang thanh ngang, dùng để so sánh các cơ sở.
 */
export const buildBarList = (
    data: ChartDatum[],
): Array<ChartDatum & { percent: number; maxValue: number }> => {
    const maxValue = Math.max(0, ...data.map((item) => item.value));

    return data.map((item, index) => ({
        ...item,

        color: item.color ?? colorAt(index),

        maxValue,

        percent: maxValue > 0
            ? Math.round((item.value / maxValue) * 1000) / 10
            : 0,
    }));
};


export interface DonutSegment {
    key: string;

    label: string;

    value: number;

    percent: number;

    /** Vị trí bắt đầu của đoạn, tính theo phần trăm quanh vòng. */
    startPercent: number;

    color: string;
}


/**
 * Tách vòng tròn thành các đoạn theo tỉ lệ, bắt đầu từ 12 giờ và đi theo
 * chiều kim đồng hồ. `percent` làm tròn một chữ số để tổng hiển thị ổn định.
 */
export const buildDonut = (
    data: ChartDatum[],
): { segments: DonutSegment[]; total: number } => {
    const total = data.reduce(
        (sum, item) => sum + Math.max(0, item.value),
        0,
    );

    let cursor = 0;

    const segments = data.map((item, index) => {
        const value = Math.max(0, item.value);

        const percent = total > 0
            ? Math.round((value / total) * 1000) / 10
            : 0;

        const start = cursor;

        cursor += percent;

        return {
            key: item.label,

            label: item.label,

            value,

            percent,

            color: item.color ?? colorAt(index),

            startPercent: start,
        };
    });

    return { segments, total };
};


export interface StackedRow {
    label: string;

    parts: Array<{
        key: string;

        label: string;

        value: number;

        color: string;

        percent: number;
    }>;

    total: number;
}


/**
 * Gom nhiều chuỗi theo nhãn để vẽ thanh xếp chồng, ví dụ nhu cầu
 * hai buổi / nội trú / ăn theo từng cơ sở.
 */
export const buildStackedRows = (
    rows: Array<{ label: string }>,
    series: ChartSeries[],
    valuesByKey: Map<string, Map<string, number>>,
): StackedRow[] => rows.map((row) => {
    const values = valuesByKey.get(row.label) ?? new Map<string, number>();

    const total = series.reduce(
        (sum, item) => sum + Math.max(0, values.get(item.key) ?? 0),
        0,
    );

    return {
        label: row.label,

        total,

        parts: series.map((item) => {
            const value = Math.max(0, values.get(item.key) ?? 0);

            return {
                key: item.key,

                label: item.label,

                value,

                color: item.color,

                percent: total > 0
                    ? Math.round((value / total) * 1000) / 10
                    : 0,
            };
        }).filter((part) => part.value > 0),
    };
});