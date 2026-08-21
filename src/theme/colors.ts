export const colors = {
    brand: {
        primary: "#1677ff",
        secondary: "#13c2c2",
        accent: "#6366f1",
    },

    functional: {
        dashboard: "#1677ff",
        gis: "#0891b2",
        school: "#7c3aed",
        timetable: "#722ed1",
        teaching: "#16a34a",
        documents: "#ea580c",
        tasks: "#db2777",
        alerts: "#dc2626",
        reports: "#4f46e5",
        chatbot: "#0284c7",
        admin: "#475569",
    },

    ui: {
        primarySoft: "rgba(22, 119, 255, 0.10)",
        primaryBorder: "rgba(22, 119, 255, 0.30)",

        cardBackground:
            "linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.92))",

        panelBackground:
            "rgba(255, 255, 255, 0.96)",

        border:
            "rgba(148, 163, 184, 0.30)",

        borderLight:
            "rgba(148, 163, 184, 0.18)",

        shadowXs:
            "0 2px 6px rgba(15, 23, 42, 0.04)",

        shadowSm:
            "0 4px 14px rgba(15, 23, 42, 0.06)",

        shadowCard:
            "0 8px 24px rgba(15, 23, 42, 0.08)",

        shadowCardHover:
            "0 18px 40px rgba(15, 23, 42, 0.14)",
    },

    neutral: {
        white: "#ffffff",
        black: "#000000",

        textPrimary: "#172033",
        textSecondary: "#64748b",
        textMuted: "#94a3b8",

        background: "#f4f7fb",
        surface: "#ffffff",

        border: "#e2e8f0",
    },

    status: {
        success: "#16a34a",
        warning: "#f59e0b",
        error: "#dc2626",
        info: "#1677ff",
    },
} as const;

export default colors;