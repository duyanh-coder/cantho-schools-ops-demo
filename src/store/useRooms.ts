import {
    useMemo,
} from "react";

import {
    canThoRooms,
} from "@/mock/canTho";

import type {
    SchoolRoom,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const ROOMS_STORAGE_KEY = "can-tho-rooms";

export interface RoomsApi extends CrudApi<SchoolRoom> {
    byId: Map<string, SchoolRoom>;

    byCampus: SchoolRoom[];
}

export function useRooms(
    campusId?: string,
): RoomsApi {
    const base = useCrud<SchoolRoom>(
        ROOMS_STORAGE_KEY,
        canThoRooms,
    );

    const items = base.items;

    const byId = useMemo(
        () => new Map<string, SchoolRoom>(
            items.map((room) => [room.id, room]),
        ),
        [items],
    );

    const byCampus = useMemo(
        () => campusId
            ? items.filter((room) => room.campusId === campusId)
            : items,
        [items, campusId],
    );

    const api = useMemo<RoomsApi>(
        () => ({
            ...base,
            items,
            byId,
            byCampus,
        }),
        [base, items, byId, byCampus],
    );

    return api;
}