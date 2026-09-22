import {
    useEffect,
    useState,
} from "react";

import type {
    RoleKey,
} from "@/utils/permission";


export const AUTH_STORAGE_KEY = "htql:auth:session";

export const AUTH_DEMO_PASSWORD = "123456";

export interface AuthUser {
    id: string;

    username: string;

    fullName: string;

    role: RoleKey;
}

export interface AuthAccounts {
    [key: string]: AuthUser;
}

export const AUTH_ACCOUNTS: AuthAccounts = {
    admin: {
        id: "u-admin",
        username: "admin",
        fullName: "Quản trị hệ thống",
        role: "admin",
    },
    hieutruong: {
        id: "u-hieutruong",
        username: "hieutruong",
        fullName: "Nguyễn Văn A",
        role: "hieutruong",
    },
    vanthu: {
        id: "u-vanthu",
        username: "vanthu",
        fullName: "Trần Thị B",
        role: "vanthu",
    },
};

export interface AuthApi {
    user: AuthUser | null;

    signIn: (
        username: string,
        password: string,
    ) => boolean;

    signOut: () => void;
}

const readSession = (): AuthUser | null => {
    try {
        const raw =
            localStorage.getItem(
                AUTH_STORAGE_KEY,
            );

        if (!raw) {
            return null;
        }

        const parsed =
            JSON.parse(
                raw,
            ) as AuthUser;

        if (
            parsed &&
            typeof parsed.username === "string" &&
            typeof parsed.role === "string"
        ) {
            return parsed;
        }
    } catch {
        /* ignore broken cache and start signed out */
    }

    return null;
};

export function useAuth(): AuthApi {
    const [user, setUser] =
        useState<AuthUser | null>(
            () =>
                readSession(),
        );

    useEffect(() => {
        if (user) {
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify(
                    user,
                ),
            );
        } else {
            localStorage.removeItem(
                AUTH_STORAGE_KEY,
            );
        }
    }, [
        user,
    ]);

    const signIn = (
        username: string,
        password: string,
    ): boolean => {
        const account =
            AUTH_ACCOUNTS[
                username.trim().toLowerCase()
            ];

        if (
            account &&
            password ===
                AUTH_DEMO_PASSWORD
        ) {
            setUser(
                account,
            );

            return true;
        }

        return false;
    };

    const signOut = () => {
        setUser(
            null,
        );
    };

    return {
        user,
        signIn,
        signOut,
    };
}