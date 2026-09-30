import {
    act,
    renderHook,
} from "@testing-library/react";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    CRUD_SEED_VERSION_PREFIX,
    CRUD_STORAGE_PREFIX,
    useCrud,
} from "@/store/useCrud";


interface Todo {
    id: string;

    label: string;

    done: boolean;
}

const seed: Todo[] = [
    { id: "t1", label: "Soạn giáo án tuần sau", done: false },
    { id: "t2", label: "Chấm bài kiểm tra HK1", done: false },
];


const storageKeyFor = (storageKey: string): string =>
    `${CRUD_STORAGE_PREFIX}${storageKey}`;


const renderTodoCrud = (storageKey: string) =>
    renderHook(() => useCrud<Todo>(storageKey, seed));


const readPersisted = (storageKey: string): Todo[] => {
    const raw = localStorage.getItem(storageKeyFor(storageKey));

    if (!raw) {
        return [];
    }

    return JSON.parse(raw) as Todo[];
};


describe("useCrud", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("starts from the seed items", () => {
        const { result } = renderTodoCrud("can-tho-test");

        expect(result.current.items).toHaveLength(2);

        expect(result.current.items).toEqual(seed);
    });

    it("prepends on create", () => {
        const { result } = renderTodoCrud("can-tho-test");

        act(() => {
            result.current.create({
                id: "t3",
                label: "Họp tổ chuyên môn",
                done: false,
            });
        });

        expect(result.current.items).toHaveLength(3);

        expect(result.current.items[0].id).toBe("t3");
    });

    it("updates an item in place", () => {
        const { result } = renderTodoCrud("can-tho-test");

        act(() => {
            result.current.update({
                id: "t2",
                label: "Đã chấm xong",
                done: true,
            });
        });

        expect(result.current.items).toHaveLength(2);

        expect(
            result.current.items.find((item) => item.id === "t2")?.done,
        ).toBe(true);
    });

    it("removes an item by id", () => {
        const { result } = renderTodoCrud("can-tho-test");

        act(() => {
            result.current.remove("t1");
        });

        expect(result.current.items).toHaveLength(1);

        expect(result.current.items[0].id).toBe("t2");
    });

    it("persists to localStorage", () => {
        const { result } = renderTodoCrud("can-tho-test");

        act(() => {
            result.current.create({
                id: "t3",
                label: "Báo cáo tuần",
                done: false,
            });
        });

        expect(readPersisted("can-tho-test")).toHaveLength(3);
    });

    it("restores persisted items as seed on remount", () => {
        const first = renderTodoCrud("can-tho-remount");

        act(() => {
            first.result.current.create({
                id: "t9",
                label: "Ghi nhớ trước khi reload",
                done: true,
            });
        });

        first.unmount();

        const { result } = renderTodoCrud("can-tho-remount");

        expect(result.current.items).toHaveLength(3);

        expect(result.current.items[0].id).toBe("t9");
    });

    it("resets back to seed and clears storage", () => {
        const { result } = renderTodoCrud("can-tho-reset");

        act(() => {
            result.current.create({
                id: "tX",
                label: "Sẽ bị xoá khi reset",
                done: false,
            });
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.items).toEqual(seed);

        expect(readPersisted("can-tho-reset")).toEqual(seed);
    });
});

describe("useCrud seed versioning", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("drops a cache written by an older seed version", () => {
        const first = renderHook(() =>
            useCrud<Todo>("can-tho-version", seed, 1));

        act(() => {
            first.result.current.create({
                id: "tStale",
                label: "Ghi từ seed cũ",
                done: false,
            });
        });

        expect(readPersisted("can-tho-version")).toHaveLength(3);

        first.unmount();

        const { result } = renderHook(() =>
            useCrud<Todo>("can-tho-version", seed, 2));

        expect(result.current.items).toEqual(seed);

        expect(
            localStorage.getItem(
                `${CRUD_SEED_VERSION_PREFIX}can-tho-version`,
            ),
        ).toBe("2");
    });

    it("keeps the cache while the seed version is unchanged", () => {
        const first = renderHook(() =>
            useCrud<Todo>("can-tho-same-version", seed, 4));

        act(() => {
            first.result.current.create({
                id: "tKeep",
                label: "Ghi nhớ xuyên phiên bản",
                done: true,
            });
        });

        first.unmount();

        const { result } = renderHook(() =>
            useCrud<Todo>("can-tho-same-version", seed, 4));

        expect(result.current.items).toHaveLength(3);

        expect(result.current.items[0].id).toBe("tKeep");
    });
});
