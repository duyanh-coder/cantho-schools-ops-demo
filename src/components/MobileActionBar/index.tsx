import type { ReactNode } from "react";

import "./style.scss";

export interface MobileActionItem {
    key: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    primary?: boolean;
}

interface MobileActionBarProps {
    actions: MobileActionItem[];
}

const MobileActionBar = ({
    actions,
}: MobileActionBarProps) => {
    return (
        <div className="mobile-action-bar">
            {actions.map((action) => (
                <button
                    key={action.key}
                    type="button"
                    className={[
                        "mobile-action-bar__item",
                        action.primary
                            ? "mobile-action-bar__item--primary"
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    onClick={action.onClick}
                >
                    {action.icon && (
                        <span className="mobile-action-bar__icon">
                            {action.icon}
                        </span>
                    )}

                    <span className="mobile-action-bar__label">
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default MobileActionBar;