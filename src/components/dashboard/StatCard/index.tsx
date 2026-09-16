import type { ReactNode } from "react";

import "./style.scss";

interface StatCardProps {
  title: string;
  value: ReactNode;
  suffix?: ReactNode;
  icon: ReactNode;
  tone: "blue" | "green" | "orange" | "purple";
  note?: string;
}

const StatCard = ({
  title,
  value,
  suffix,
  icon,
  tone,
  note,
}: StatCardProps) => {
  return (
    <div
      className={[
        "dashboard-stat-card",
        `dashboard-stat-card--${tone}`,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="dashboard-stat-card__icon">{icon}</div>

      <div className="dashboard-stat-card__body">
        <span className="dashboard-stat-card__title">{title}</span>

        <div className="dashboard-stat-card__value">
          {value}

          {suffix && <em>{suffix}</em>}
        </div>

        {note && <span className="dashboard-stat-card__note">{note}</span>}
      </div>
    </div>
  );
};

export default StatCard;