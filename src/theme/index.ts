import type { ThemeConfig } from "antd";

import { colors } from "./colors";

export const appTheme: ThemeConfig = {
    token: {
        colorPrimary: colors.brand.primary,

        colorInfo: colors.status.info,

        colorSuccess: colors.status.success,

        colorWarning: colors.status.warning,

        colorError: colors.status.error,

        colorBgLayout: colors.neutral.background,

        colorBgContainer: colors.neutral.surface,

        colorText: colors.neutral.textPrimary,

        colorTextSecondary:
            colors.neutral.textSecondary,

        borderRadius: 12,

        fontFamily: `
            Inter,
            "Segoe UI",
            Roboto,
            Arial,
            sans-serif
        `,
    },

    components: {
        Card: {
            borderRadiusLG: 16,
        },

        Layout: {
            bodyBg:
                colors.neutral.background,
        },

        Menu: {
            itemBorderRadius: 10,
        },
    },
};

export default appTheme;