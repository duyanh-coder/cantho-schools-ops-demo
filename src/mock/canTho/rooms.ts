import type { SchoolRoom } from "../common/types";

import { canThoFacilities } from "./facilities";

/**
 * Tiền tố mã phòng theo cơ sở. Phải duy nhất trong toàn hệ vì mã phòng hiển
 * thị ngắn (`MAIN1`, `B12`...), nên mỗi cơ sở một chữ cái riêng.
 */
const PREFIX_BY_CAMPUS: Record<string, string> = {
    "campus-main": "main",
    "campus-chu-van-an": "b",
    "campus-thoi-binh": "c",
    "campus-an-lac": "d",
    "campus-tran-hung-dao": "e",
    "campus-huynh-thuc-khang": "f",
    "can-tho-campus-007": "g",
    "can-tho-campus-008": "h",
    "can-tho-campus-009": "i",
    "can-tho-campus-010": "j",
};

const DEFAULT_CAPACITY_BY_CATEGORY: Record<string, number> = {
    classroom: 40,
    function_room: 30,
};

/**
 * Phòng học và phòng chức năng của mọi cơ sở trong hệ, không chỉ 6 cơ sở của
 * Ninh Kiều, để danh sách lớp của các trường khác cũng có phòng để gán.
 *
 * Hai quy tắc giữ `id`/mã phòng duy nhất toàn hệ:
 * 1. Phòng thực hành gắn hậu tố `th` vì cùng cơ sở với phòng học.
 * 2. Số thứ tự chạy liên tục theo từng cặp cơ sở + loại phòng, vì một cơ sở
 *    có thể khai nhiều cơ sở vật chất cùng loại (nhiều phòng thực hành).
 */
const generatedRooms: SchoolRoom[] = [];

const sequenceByCampusCategory = new Map<string, number>();

for (const facility of canThoFacilities) {
    const isFunctionRoom = facility.category === "function_room";

    if (facility.category !== "classroom" && !isFunctionRoom) {
        continue;
    }

    const prefix = PREFIX_BY_CAMPUS[facility.campusId] ?? "main";
    const sequenceKey = `${facility.campusId}|${facility.category}`;

    let sequence = sequenceByCampusCategory.get(sequenceKey) ?? 0;

    for (let index = 0; index < facility.quantity; index += 1) {
        sequence += 1;

        const number = String(sequence).padStart(2, "0");

        generatedRooms.push({
            id: `room-${prefix}-${isFunctionRoom ? "th-" : ""}${number}`,
            schoolId: facility.schoolId,
            campusId: facility.campusId,
            code: `${prefix.toUpperCase()}${isFunctionRoom ? "TH" : ""}${sequence}`,
            category: facility.category as "classroom" | "function_room",
            capacity: DEFAULT_CAPACITY_BY_CATEGORY[facility.category] ?? 40,
            condition: facility.condition,
        });
    }

    sequenceByCampusCategory.set(sequenceKey, sequence);
}

export const canThoRooms: SchoolRoom[] = generatedRooms;
