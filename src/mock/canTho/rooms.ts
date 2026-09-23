import type { SchoolRoom } from "../common/types";

import { canThoFacilities } from "./facilities";

const SCHOOL_001 = "can-tho-school-001";

const PREFIX_BY_CAMPUS: Record<string, string> = {
    "campus-main": "main",
    "campus-chu-van-an": "b",
    "campus-thoi-binh": "c",
    "campus-an-lac": "d",
    "campus-tran-hung-dao": "e",
    "campus-huynh-thuc-khang": "f",
};

const DEFAULT_CAPACITY_BY_CATEGORY: Record<string, number> = {
    classroom: 40,
    function_room: 30,
};

const generatedRooms: SchoolRoom[] = canThoFacilities
    .filter((facility) =>
        facility.schoolId === SCHOOL_001 &&
        (facility.category === "classroom" || facility.category === "function_room"))
    .flatMap((facility) => {
        const prefix = PREFIX_BY_CAMPUS[facility.campusId] ?? "main";

        return Array.from({ length: facility.quantity }, (_, index) => ({
            id: `room-${prefix}-${String(index + 1).padStart(2, "0")}`,
            schoolId: facility.schoolId,
            campusId: facility.campusId,
            code: `${prefix.toUpperCase()}${index + 1}`,
            category: facility.category as "classroom" | "function_room",
            capacity: DEFAULT_CAPACITY_BY_CATEGORY[facility.category] ?? 40,
            condition: facility.condition,
        }));
    });

export const canThoRooms: SchoolRoom[] = generatedRooms;