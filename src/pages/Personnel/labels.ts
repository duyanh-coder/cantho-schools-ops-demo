import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import {
    CAMPUS_LEGACY_ID_MAP,
} from "@/store/useCampuses";

import type {
    Campus,
} from "@/mock/common/types";


const SUBJECT_NAME = new Map<string, string>(
    subjects.map((subject) => [subject.id, subject.name] as [string, string]),
);

/**
 * Chữ viết tắt trên avatar: chữ đầu họ và chữ đầu tên, đủ nhận ra người
 * mà không cần đọc cả họ tên.
 */
export const personnelInitials = (
    fullName: string,
): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Tên các môn nhân sự phụ trách, ghép bằng dấu chấm giữa. Trả về null khi
 * chưa cập nhật để tầng hiển thị tự quyết định kiểu chữ in mờ.
 */
export const personnelSubjectNames = (
    subjectIds: string[] | undefined,
): string | null => {
    if (!subjectIds || subjectIds.length === 0) {
        return null;
    }

    return subjectIds
        .map((subjectId) => SUBJECT_NAME.get(subjectId) ?? subjectId)
        .join(" · ");
};

/**
 * Tên tổ/bộ môn. Dùng chung nguồn với danh sách nhân sự để cùng một tổ
 * không bị hiển thị khác nhau giữa các màn.
 */
export const personnelSectorName = (
    sectorId: string | undefined,
): string | null => {
    if (!sectorId) {
        return null;
    }

    return canThoMockData.sectors.find(
        (sector) => sector.id === sectorId,
    )?.name
        ?? sectorId;
};

/**
 * Tên cơ sở công tác, tra trong store để nhận tên đã đổi qua thao tác cập
 * nhật. `campusIds` của nhân sự còn mang id cũ nên phải chuẩn hoá trước.
 */
export const personnelCampusName = (
    campusesById: Map<string, Campus>,
    campusId: string,
): string => {
    const normalized = CAMPUS_LEGACY_ID_MAP[campusId] ?? campusId;

    return campusesById.get(normalized)?.name
        ?? campusId;
};

export const personnelCampusNames = (
    campusesById: Map<string, Campus>,
    campusIds: string[] | undefined,
): string | null => {
    if (!campusIds || campusIds.length === 0) {
        return null;
    }

    return campusIds
        .map((campusId) => personnelCampusName(campusesById, campusId))
        .join(", ");
};