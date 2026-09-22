import {
    useMemo,
} from "react";

import type {
    CrudFieldOption,
} from "@/components/dashboard/CrudManager";

import {
    useCrud,
} from "@/store/useCrud";

import {
    CATALOG_DEFS,
} from "@/config/catalogs";

import type {
    CatalogDef,
} from "@/config/catalogs";

import {
    readCrudItems,
} from "@/store/useCrud";


export const readCatalogOptions = (
    catalog: CatalogDef,
): CrudFieldOption[] => {
    const records =
        readCrudItems<CatalogRecord>(
            catalog.storageKey,
            seedRecords(
                catalog,
            ),
        );

    return records.map(
        (item) => ({
            value: item.value,
            label: item.label,
        }),
    );
};


export const getCatalogByKey = (
    key: string,
): CatalogDef | undefined => {
    return CATALOG_DEFS.find(
        (catalog) =>
            catalog.key === key,
    );
};

export type CatalogRecord = CrudFieldOption & { id: string };

export interface CatalogApi {
    items: CatalogRecord[];

    options: CrudFieldOption[];

    create: (item: CatalogRecord) => void;

    update: (item: CatalogRecord) => void;

    remove: (id: string) => void;

    reset: () => void;
}

const seedRecords = (
    category: CatalogDef,
): CatalogRecord[] => {
    return category.seed.map(
        (option, index) => ({
            id: String(option.value ?? index),
            ...option,
        }),
    );
};


export function useCatalog(
    catalog: CatalogDef,
): CatalogApi {
    const seed = useMemo(
        () =>
            seedRecords(
                catalog,
            ),
        [catalog],
    );

    const {
        items,
        create,
        update,
        remove,
        reset,
    } =
        useCrud<CatalogRecord>(
            catalog.storageKey,
            seed,
        );

    const options = useMemo(
        () =>
            items.map(
                (item) => ({
                    value: item.value,
                    label: item.label,
                }),
            ),
        [items],
    );

    return {
        items,
        options,
        create,
        update,
        remove,
        reset,
    };
}


export function useCatalogOptions(
    key: string,
): CrudFieldOption[] {
    const catalog =
        getCatalogByKey(
            key,
        );

    const empty: CrudFieldOption[] = [];

    const hookResult =
        useCatalog(
            catalog ??
                {
                    key,
                    title: key,
                    description: "",
                    storageKey: `can-tho-catalog-${key}`,
                    seed: [],
                },
        );

    if (!catalog) {
        return empty;
    }

    return hookResult.options;
}