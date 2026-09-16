import {
    CheckCircleFilled,
    RightOutlined,
} from "@ant-design/icons";

import "./style.scss";

export interface CampusStatusPanelItem {
    id: string;

    code: string;

    name: string;

    todayLessons: number;

    isActive: boolean;
}

interface CampusStatusPanelProps {
    campuses: CampusStatusPanelItem[];

    selectedCampusId: string;

    onSelect: (id: string) => void;
}

const CampusStatusPanel = ({
    campuses,
    selectedCampusId,
    onSelect,
}: CampusStatusPanelProps) => {
    return (
        <section className="page-panel tt-campus-status">
            <header className="page-panel__head">
                <div>
                    <h3>Tiến độ điểm trường</h3>

                    <p>Số tiết giảng dạy hôm nay theo từng cơ sở.</p>
                </div>
            </header>

            <div className="tt-campus-status__list">
                {campuses.map((campus) => (
                    <button
                        key={campus.id}
                        type="button"
                        onClick={() => onSelect(campus.id)}
                        className={[
                            "tt-campus-status__item",
                            selectedCampusId === campus.id
                                ? "tt-campus-status__item--active"
                                : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        <span
                            className={[
                                "tt-campus-status__dot",
                                campus.isActive
                                    ? "tt-campus-status__dot--active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        />

                        <span className="tt-campus-status__info">
                            <strong>{campus.name}</strong>

                            <span>{campus.code}</span>
                        </span>

                        <span className="tt-campus-status__meta">
                            <em>{campus.todayLessons}</em>

                            tiết
                        </span>

                        <RightOutlined className="tt-campus-status__arrow" />

                        {campus.isActive && (
                            <CheckCircleFilled className="tt-campus-status__check" />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CampusStatusPanel;