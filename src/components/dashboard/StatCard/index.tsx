import type { ReactNode } from "react";

import "./style.scss";

interface StatCardProps {
  title: string;
  value: ReactNode;
  suffix?: ReactNode;
  icon: ReactNode;
  tone: "blue" | "green" | "orange" | "purple";
  note?: ReactNode;
  titleExtra?: ReactNode;
  onClick?: () => void;
}

const StatCard = ({
  title,
  value,
  suffix,
  icon,
  tone,
  note,
  titleExtra,
  onClick,
}: StatCardProps) => {
  return (
    <div
      className={[
        "dashboard-stat-card",
        `dashboard-stat-card--${tone}`,
        onClick ? "dashboard-stat-card--clickable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="dashboard-stat-card__icon">{icon}</div>

      <div className="dashboard-stat-card__body">
        <div className="dashboard-stat-card__heading">
          <span className="dashboard-stat-card__title">{title}</span>

          {titleExtra && (
            <span className="dashboard-stat-card__title-extra">{titleExtra}</span>
          )}
        </div>

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