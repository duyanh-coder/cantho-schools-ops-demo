import "./style.scss";

interface OverviewChartProps {
    series: {
        label: string;

        value: number;
    }[];
}

const OverviewChart = ({ series }: OverviewChartProps) => {
    const max = Math.max(1, ...series.map((item) => item.value));

    return (
        <section className="page-panel tt-overview-chart">
            <header className="page-panel__head">
                <div>
                    <h3>Phân bố tiết học trong tuần</h3>

                    <p>Số tiết giảng dạy theo từng ngày trong tuần.</p>
                </div>
            </header>

            <div className="tt-overview-chart__chart">
                {series.map((item) => (
                    <div key={item.label} className="tt-overview-chart__col">
                        <span className="tt-overview-chart__value">
                            {item.value}
                        </span>

                        <div
                            className="tt-overview-chart__bar"
                            style={{
                                height: `${Math.max(
                                    8,
                                    (item.value / max) * 100,
                                )}%`,
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="tt-overview-chart__labels">
                {series.map((item) => (
                    <span key={item.label}>{item.label}</span>
                ))}
            </div>
        </section>
    );
};

export default OverviewChart;