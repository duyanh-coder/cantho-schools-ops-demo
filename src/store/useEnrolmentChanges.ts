import {
    useCallback,
    useMemo,
} from "react";

import {
    canThoEnrolmentChanges,
} from "@/mock/canTho";

import type {
    EnrolmentChange,
} from "@/mock/common/types";

import {
    useCrud,
} from "./useCrud";

import type {
    CrudApi,
} from "./useCrud";


export const ENROLMENT_CHANGES_STORAGE_KEY = "can-tho-enrolment-changes";

const sortedByDate = (
    changes: EnrolmentChange[],
): EnrolmentChange[] => [...changes].sort(
    (a, b) => b.effectiveDate.localeCompare(a.effectiveDate),
);

export interface EnrolmentChangesApi extends CrudApi<EnrolmentChange> {
    byClass: EnrolmentChange[];

    bySchool: EnrolmentChange[];

    /**
     * Ghi nhận một thay đổi tiếp nhận cho lớp. Trả về thay đổi vừa tạo,
     * hoặc lý do nếu dữ liệu không đầy đủ.
     */
    recordChange: (
        draft: Omit<EnrolmentChange, "id" | "status"> & {
            id?: string;

            status?: EnrolmentChange["status"];
        },
    ) => string | EnrolmentChange | null;

    /**
     * Duyệt hoặc bác một thay đổi đang chờ, trả về lý do nếu không hợp lệ.
     */
    settleChange: (
        changeId: string,
        status: EnrolmentChange["status"],
    ) => string | null;
}

export function useEnrolmentChanges(
    classId?: string,
): EnrolmentChangesApi {
    const base = useCrud<EnrolmentChange>(
        ENROLMENT_CHANGES_STORAGE_KEY,
        canThoEnrolmentChanges,
    );

    const byClass = useMemo(
        () => classId
            ? sortedByDate(
                base.items.filter(
                    (change) => change.classId === classId,
                ),
            )
            : [],
        [base.items, classId],
    );

    const bySchool = useMemo(
        () => sortedByDate(base.items),
        [base.items],
    );

    const recordChange = useCallback((
        draft: Omit<EnrolmentChange, "id" | "status"> & {
            id?: string;

            status?: EnrolmentChange["status"];
        },
    ): string | EnrolmentChange | null => {
        if (!draft.classId) {
            return "Thay đổi tiếp nhận phải gắn với một lớp học.";
        }

        if (!draft.studentName.trim()) {
            return "Thay đổi tiếp nhận phải có họ tên học sinh.";
        }

        if (!draft.effectiveDate) {
            return "Thay đổi tiếp nhận phải có ngày hiệu lực.";
        }

        if (
            draft.changeType !== "increase" &&
            draft.changeType !== "decrease"
        ) {
            return "Loại thay đổi tiếp nhận không hợp lệ.";
        }

        const duplicated = base.items.some((change) =>
            change.classId === draft.classId &&
            change.studentName === draft.studentName.trim() &&
            change.effectiveDate === draft.effectiveDate &&
            change.changeType === draft.changeType &&
            change.status === "pending");

        if (duplicated) {
            return "Đã có thay đổi chờ duyệt tương tự cho lớp này.";
        }

        const created: EnrolmentChange = {
            ...draft,
            id: draft.id ??
                `can-tho-enrolment-${String(base.items.length + 1).padStart(3, "0")}`,
            studentName: draft.studentName.trim(),
            status: draft.status ?? "pending",
        };

        base.create(created);

        return created;
    }, [base]);

    const settleChange = useCallback((
        changeId: string,
        status: EnrolmentChange["status"],
    ): string | null => {
        const target = base.items.find((change) => change.id === changeId);

        if (!target) {
            return "Không tìm thấy thay đổi tiếp nhận.";
        }

        if (target.status !== "pending") {
            return "Thay đổi này đã được xử lý.";
        }

        base.update({ ...target, status });

        return null;
    }, [base]);

    const api = useMemo<EnrolmentChangesApi>(
        () => ({
            ...base,
            items: bySchool,
            byClass,
            bySchool,
            recordChange,
            settleChange,
        }),
        [base, byClass, bySchool, recordChange, settleChange],
    );

    return api;
}
