import { HomeOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import "./style.scss";

interface OperationPageHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    icon?: ReactNode;
}

const OperationPageHeader = ({
    eyebrow,
    title,
    description,
    icon,
}: OperationPageHeaderProps) => {
    const headerRef = useRef<HTMLElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) {
                return;
            }

            const rect = headerRef.current.getBoundingClientRect();

            setIsSticky(rect.top <= 12);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll,
            );
        };
    }, []);

    return (
        <section
            ref={headerRef}
            className={[
                "operation-page-header",
                isSticky
                    ? "operation-page-header--sticky"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="operation-page-header__content">
                <div className="operation-page-header__main">
                    {icon && (
                        <div className="operation-page-header__icon">
                            {icon}
                        </div>
                    )}

                    <div className="operation-page-header__info">
                        {eyebrow && (
                            <span className="operation-page-header__eyebrow">
                                {eyebrow}
                            </span>
                        )}

                        <h1>{title}</h1>

                        {description && (
                            <p>{description}</p>
                        )}
                    </div>
                </div>

                <div className="operation-page-header__home">
                    <HomeOutlined />

                    <span>
                        School Operation Center
                    </span>
                </div>
            </div>
        </section>
    );
};

export default OperationPageHeader;