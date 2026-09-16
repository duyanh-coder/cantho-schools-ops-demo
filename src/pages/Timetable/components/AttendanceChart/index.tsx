import "./style.scss";

interface AttendanceChartProps {
    series: {
        label: string;

        value: number;
    }[];
}

const WIDTH = 340;

const HEIGHT = 150;

const PAD_X = 30;

const PAD_Y = 16;

const AttendanceChart = ({ series }: AttendanceChartProps) => {
    const max = Math.max(100, ...series.map((item) => item.value));

    const innerW = WIDTH - PAD_X * 2;

    const innerH = HEIGHT - PAD_Y * 2;

    const xAt = (index: number) =>
        PAD_X + (index * innerW) / Math.max(1, series.length - 1);

    const yAt = (value: number) =>
        PAD_Y + innerH - (Math.min(value, max) / max) * innerH;

    const points = series.map((item, index) => ({
        x: xAt(index),

        y: yAt(item.value),
    }));

    const last = points[points.length - 1];

    const first = points[0];

    const line = points
        .map(
            (point, index) =>
                `${index === 0 ? "M" : "L"}${point.x},${point.y}`,
        )
        .join(" ");

    const area = `${line} L${last.x},${HEIGHT - PAD_Y} L${first.x},${
        HEIGHT - PAD_Y
    } Z`;

    return (
        <section className="page-panel tt-attendance-chart">
            <header className="page-panel__head">
                <div>
                    <h3>Tỷ lệ chuyên cần theo ngày</h3>

                    <p>Biến động tỷ lệ có mặt trong tuần (% ).</p>
                </div>
            </header>

            <div className="tt-attendance-chart__wrap">
                <svg
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    className="tt-attendance-chart__svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient
                            id="ttAttendanceArea"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#22c55e"
                                stopOpacity="0.28"
                            />

                            <stop
                                offset="100%"
                                stopColor="#22c55e"
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>

                    {[0, 25, 50, 75, 100].map((tick) => (
                        <g key={tick}>
                            <line
                                x1={PAD_X}
                                x2={WIDTH - PAD_X}
                                y1={yAt(tick)}
                                y2={yAt(tick)}
                                className="tt-attendance-chart__grid"
                            />

                            <text
                                x={2}
                                y={yAt(tick) + 3}
                                className="tt-attendance-chart__tick"
                            >
                                {tick}%
                            </text>
                        </g>
                    ))}

                    <path
                        d={area}
                        fill="url(#ttAttendanceArea)"
                    />

                    <path
                        d={line}
                        className="tt-attendance-chart__line"
                    />

                    {points.map((point, index) => (
                        <circle
                            key={series[index].label}
                            cx={point.x}
                            cy={point.y}
                            r="3.5"
                            className="tt-attendance-chart__dot"
                        >
                            <title>
                                {series[index].label}: {series[index].value}%
                            </title>
                        </circle>
                    ))}
                </svg>
            </div>

            <div className="tt-attendance-chart__labels">
                {series.map((item) => (
                    <span key={item.label}>{item.label}</span>
                ))}
            </div>
        </section>
    );
};

export default AttendanceChart;