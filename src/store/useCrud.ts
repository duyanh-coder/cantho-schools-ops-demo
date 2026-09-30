import {
    useEffect,
    useMemo,
    useState,
} from "react";


export const CRUD_STORAGE_PREFIX = "htql:crud:";

export const CRUD_SEED_VERSION_PREFIX = "htql:crud-seed:";

/**
 * Phiên bản dữ liệu mẫu của một kho CRUD. Khi dữ liệu mẫu trong `canTho` được
 * nâng cấp (thêm lớp, thêm nhân sự, đổi id…), cache localStorage cũ vẫn giữ dữ
 * liệu cũ và giao diện hiển thị sai. Tăng số phiên bản ở kho tương ứng để cache
 * cũ bị bỏ và nạp lại từ seed.
 */
export const DEFAULT_SEED_VERSION = 1;

const seedVersionKeyOf = (storageKey: string): string =>
    `${CRUD_SEED_VERSION_PREFIX}${storageKey}`;

const readSeedVersion = (storageKey: string): string | null =>
    localStorage.getItem(seedVersionKeyOf(storageKey));

const writeSeedVersion = (
    storageKey: string,
    seedVersion: number,
): void => {
    localStorage.setItem(
        seedVersionKeyOf(storageKey),
        String(seedVersion),
    );
};

const clearCrudStorage = (storageKey: string): void => {
    localStorage.removeItem(`${CRUD_STORAGE_PREFIX}${storageKey}`);
    localStorage.removeItem(seedVersionKeyOf(storageKey));
};

/**
 * Đọc cache đã lưu. Trả `null` khi cache rỗng, hỏng hoặc được ghi từ phiên bản
 * seed khác, để caller dùng seed mới.
 */
const readCachedItems = <T extends { id: string }>(
    storageKey: string,
    seedVersion: number,
): T[] | null => {
    const raw = localStorage.getItem(`${CRUD_STORAGE_PREFIX}${storageKey}`);

    if (!raw) {
        return null;
    }

    if (readSeedVersion(storageKey) !== String(seedVersion)) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as T[];

        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch {
        /* ignore broken cache and fall back to seed */
    }

    return null;
};

export const readCrudItems = <T extends { id: string }>(
    storageKey: string,
    seed: T[],
    seedVersion: number = DEFAULT_SEED_VERSION,
): T[] => {
    const cached = readCachedItems<T>(storageKey, seedVersion);

    if (cached) {
        return cached;
    }

    clearCrudStorage(storageKey);
    writeSeedVersion(storageKey, seedVersion);

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
    seedVersion: number = DEFAULT_SEED_VERSION,
): CrudApi<T> {
    const fullKey = `${CRUD_STORAGE_PREFIX}${storageKey}`;

    const [items, setItems] = useState<T[]>(() =>
        readCrudItems<T>(storageKey, seed, seedVersion));

    useEffect(() => {
        localStorage.setItem(fullKey, JSON.stringify(items));
        writeSeedVersion(storageKey, seedVersion);
    }, [fullKey, items, seedVersion, storageKey]);

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
                clearCrudStorage(storageKey);

                setItems(seed);
            },
        }),
        [items, seed, storageKey],
    );
}
