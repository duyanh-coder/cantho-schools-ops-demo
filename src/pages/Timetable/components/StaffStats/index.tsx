import {
    CheckCircleFilled,
    ClockCircleFilled,
    CloseCircleFilled,
} from "@ant-design/icons";

import "./style.scss";

export interface StaffStatsPanelItem {
    present: number;

    late: number;

    absent: number;
}

interface StaffStatsPanelProps {
    item: StaffStatsPanelItem;

    totalTeachers: number;
}

const StaffStatsPanel = ({ item, totalTeachers }: StaffStatsPanelProps) => {
    const rows = [
        {
            key: "present",
            label: "Có mặt",
            value: item.present,
            iconClass: "tt-staff-stats__row--present",
            icon: <CheckCircleFilled />,
        },

        {
            key: "late",
            label: "Đi muộn",
            value: item.late,
            iconClass: "tt-staff-stats__row--late",
            icon: <ClockCircleFilled />,
        },

        {
            key: "absent",
            label: "Vắng",
            value: item.absent,
            iconClass: "tt-staff-stats__row--absent",
            icon: <CloseCircleFilled />,
        },
    ];

    return (
        <section className="page-panel tt-staff-stats">
            <header className="page-panel__head">
                <div>
                    <h3>Điểm danh nhân sự hôm nay</h3>

                    <p>
                        Tình trạng chấm công của {totalTeachers} giáo viên trong
                        ngày.
                    </p>
                </div>
            </header>

            <div className="tt-staff-stats__list">
                {rows.map((row) => (
                    <div
                        key={row.key}
                        className={[
                            "tt-staff-stats__row",
                            row.iconClass,
                        ].join(" ")}
                    >
                        <span className="tt-staff-stats__icon">
                            {row.icon}
                        </span>

                        <span className="tt-staff-stats__label">
                            {row.label}
                        </span>

                        <strong className="tt-staff-stats__value">
                            {row.value}
                        </strong>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StaffStatsPanel;