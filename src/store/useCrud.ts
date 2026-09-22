import {
    useEffect,
    useMemo,
    useState,
} from "react";


export const CRUD_STORAGE_PREFIX = "htql:crud:";


export const readCrudItems = <T extends { id: string }>(
    storageKey: string,
    seed: T[],
): T[] => {
    const fullKey = `${CRUD_STORAGE_PREFIX}${storageKey}`;

    const raw = localStorage.getItem(fullKey);

    if (raw) {
        try {
            const parsed = JSON.parse(raw) as T[];

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch {
            /* ignore broken cache and fall back to seed */
        }
    }

    return seed;
};


export interface CrudApi<T extends { id: string }> {
    items: T[];

    create: (item: T) => void;

    update: (item: T) => void;

    remove: (id: string) => void;

    reset: () => void;
}


export function useCrud<T extends { id: string }>(
    storageKey: string,
    seed: T[],
): CrudApi<T> {
    const fullKey = `${CRUD_STORAGE_PREFIX}${storageKey}`;

    const [items, setItems] = useState<T[]>(() => {
        const raw = localStorage.getItem(fullKey);

        if (raw) {
            try {
                const parsed = JSON.parse(raw) as T[];

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch {
                /* ignore broken cache and fall back to seed */
            }
        }

        return seed;
    });

    useEffect(() => {
        localStorage.setItem(fullKey, JSON.stringify(items));
    }, [fullKey, items]);

    return useMemo<CrudApi<T>>(
        () => ({
            items,
            create: (item) => {
                setItems((prev) => [item, ...prev]);
            },
            update: (item) => {
                setItems((prev) =>
                    prev.map((entry) =>
                        entry.id === item.id ? item : entry,
                    ),
                );
            },
            remove: (id) => {
                setItems((prev) =>
                    prev.filter((entry) => entry.id !== id),
                );
            },
            reset: () => {
                localStorage.removeItem(fullKey);

                setItems(seed);
            },
        }),
        [items, fullKey, seed],
    );
}