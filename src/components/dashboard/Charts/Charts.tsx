import {
    CHART_PALETTE,
    buildBarChart,
    buildBarList,
    buildDonut,
} from "@/components/dashboard/Charts";

import type {
    ChartDatum,
    ChartSeries,
    StackedRow,
} from "@/components/dashboard/Charts";

import {
    buildStackedRows,
} from "@/components/dashboard/Charts";

import "./style.scss";


const fmt = (value: number): string => value.toLocaleString("vi-VN");


export interface ChartCardProps {
    title: string;

    note?: string;

    extra?: string;

    children: React.ReactNode;
}


export function ChartCard({
    title,
    note,
    extra,
    children,
}: ChartCardProps) {
    return (
        <section className="chart-card">
            <header className="chart-card__head">
                <div>
                    <h3>{title}</h3>

                    {note && <span>{note}</span>}
                </div>

                {extra && <em>{extra}</em>}
            </header>

            <div className="chart-card__body">{children}</div>
        </section>
    );
}


export interface ColumnChartProps {
    data: ChartDatum[];

    emptyText?: string;
}


/** Biểu đồ cột dọc, dùng cho học sinh theo khối và biến động nhập học. */
export function ColumnChart({
    data,
    emptyText = "Chưa có dữ liệu",
}: ColumnChartProps) {
    if (data.length === 0) {
        return <p className="chart-empty">{emptyText}</p>;
    }

    const model = buildBarChart(data);

    return (
        <div className="chart-columns">
            <div className="chart-columns__plot">
                {model.rows.map((row) => (
                    <div
                        key={row.label}
                        className="chart-columns__slot"
                    >
                        <span className="chart-columns__value">
                            {row.value > 0 ? fmt(row.value) : ""}
                        </span>

                        <div
                            className="chart-columns__bar"
                            style={{
                                height: `${row.height}px`,
                                background: row.color,
                            }}
                        />

                        <span className="chart-columns__label">
                            {row.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}


export interface BarListProps {
    data: ChartDatum[];

    unit?: string;

    emptyText?: string;
}


/** Thanh ngang, dùng để so sánh các cơ sở. */
export function BarList({
    data,
    unit = "",
    emptyText = "Chưa có dữ liệu",
}: BarListProps) {
    if (data.length === 0) {
        return <p className="chart-empty">{emptyText}</p>;
    }

    const rows = buildBarList(data);

    return (
        <div className="chart-barlist">
            {rows.map((row) => (
                <div
                    key={row.label}
                    className="chart-barlist__row"
                >
                    <span className="chart-barlist__label">
                        {row.label}
                    </span>

                    <div className="chart-barlist__track">
                        <div
                            className="chart-barlist__fill"
                            style={{
                                width: `${row.percent}%`,
                                background: row.color,
                            }}
                        />

                        <em>{fmt(row.value)}{unit}</em>
                    </div>
                </div>
            ))}
        </div>
    );
}


export interface DonutChartProps {
    data: ChartDatum[];

    centerLabel: string;

    emptyText?: string;
}


/** Vòng tròn tỉ trọng kèm chú giải. */
export function DonutChart({
    data,
    centerLabel,
    emptyText = "Chưa có dữ liệu",
}: DonutChartProps) {
    const { segments, total } = buildDonut(data);

    if (total <= 0) {
        return <p className="chart-empty">{emptyText}</p>;
    }

    return (
        <div className="chart-donut">
            <svg
                viewBox="0 0 42 42"
                className="chart-donut__svg"
                role="img"
                aria-label={centerLabel}
            >
                <circle
                    className="chart-donut__track"
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                />

                {segments.map((segment) => (
                    <circle
                        key={segment.key}
                        className="chart-donut__segment"
                        cx="21"
                        cy="21"
                        r="15.9155"
                        fill="transparent"
                        stroke={segment.color}
                        strokeDasharray={`${segment.percent} ${100 - segment.percent}`}
                        strokeDashoffset={25 - segment.startPercent}
                    />
                ))}

                <text
                    className="chart-donut__center-value"
                    x="21"
                    y="20"
                >
                    {fmt(total)}
                </text>

                <text
                    className="chart-donut__center-label"
                    x="21"
                    y="26"
                >
                    {centerLabel}
                </text>
            </svg>

            <ul className="chart-donut__legend">
                {segments.map((segment, index) => (
                    <li key={segment.key}>
                        <span
                            className="chart-donut__dot"
                            style={{
                                background: segment.color
                                    ?? CHART_PALETTE[index % CHART_PALETTE.length],
                            }}
                        />

                        <em>{segment.label}</em>

                        <strong>
                            {fmt(segment.value)}
                            <small>{segment.percent}%</small>
                        </strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export interface GroupedBarProps {
    rows: Array<{ label: string }>;

    series: ChartSeries[];

    valuesByKey: Map<string, Map<string, number>>;

    unit?: string;

    emptyText?: string;
}


/** Thanh xếp chồng nhiều chuỗi, dùng cho nhóm nhu cầu học sinh. */
export function StackedBars({
    rows,
    series,
    valuesByKey,
    unit = "",
    emptyText = "Chưa có dữ liệu",
}: GroupedBarProps) {
    if (rows.length === 0) {
        return <p className="chart-empty">{emptyText}</p>;
    }

    const stacked: StackedRow[] = buildStackedRows(rows, series, valuesByKey);

    return (
        <div className="chart-stacked">
            <div className="chart-stacked__legend">
                {series.map((item) => (
                    <span key={item.key}>
                        <i style={{ background: item.color }} />

                        {item.label}
                    </span>
                ))}
            </div>

            {stacked.map((row) => (
                <div
                    key={row.label}
                    className="chart-stacked__row"
                >
                    <span className="chart-stacked__label">
                        {row.label}
                    </span>

                    <div className="chart-stacked__track">
                        {row.parts.map((part) => (
                            <div
                                key={part.key}
                                className="chart-stacked__part"
                                style={{
                                    flexGrow: part.value,
                                    background: part.color,
                                }}
                                title={`${part.label}: ${fmt(part.value)}`}
                            />
                        ))}
                    </div>

                    <em className="chart-stacked__total">
                        {fmt(row.total)}{unit}
                    </em>
                </div>
            ))}
        </div>
    );
}