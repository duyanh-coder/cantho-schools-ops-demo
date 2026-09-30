import { describe, expect, it } from "vitest";

import {
    canThoCampuses,
    canThoClasses,
    canThoPersonnel,
    canThoRooms,
    canThoSemesters,
} from "@/mock/canTho";

import {
    plannedTimetables,
} from "@/mock/canTho/timetablePlan";

import {
    subjects,
} from "@/mock/common";

import type {
    TimetableEntry,
} from "@/mock/common/types";

import {
    PERIOD_TIME,
} from "@/mock/common/types";

import {
    buildTimetableLookups,
} from "@/components/TimetableCalendar/lookups";

import {
    CALENDAR_DAYS,
    applyCalendarFilters,
    buildCalendarDays,
    currentSlotAt,
    datesOfWeek,
    deriveSessionBlocks,
    filterScopeOf,
    groupEventsBySlot,
    normalizeCalendarFilters,
    optionScopeOf,
    resolveCalendarWeek,
    toTimetableEvents,
    weekCountOfSemester,
    weekMatches,
    weekOfDate,
    weekRangeLabel,
} from "@/components/TimetableCalendar/helpers";

import {
    detectCalendarConflicts,
    detectWorkloadStrain,
} from "@/utils/timetable";

const semester = canThoSemesters.find(
    (item) => item.id === "2026-2027-HK1",
);

if (!semester) {
    throw new Error("Thiếu học kỳ 2026-2027-HK1 trong dữ liệu mock.");
}

const lookups = buildTimetableLookups(
    subjects,
    canThoClasses,
    canThoPersonnel,
    canThoCampuses,
    canThoRooms,
);

const makeEntry = (
    value: Partial<TimetableEntry> & Pick<TimetableEntry, "id">,
): TimetableEntry => ({
    academicYearId: "2026-2027",
    semesterId: "2026-2027-HK1",
    campusId: "campus-main",
    classId: "can-tho-class-001",
    subjectId: "math",
    teacherId: "can-tho-personnel-001",
    roomId: "room-main-01",
    dayOfWeek: "monday",
    period: 1,
    week: 0,
    status: "APPROVED",
    version: 1,
    ...value,
});

describe("PERIOD_TIME 10 tiết, 2 buổi", () => {
    it("chia 5 tiết sáng và 5 tiết chiều", () => {
        expect(PERIOD_TIME).toHaveLength(10);

        expect(PERIOD_TIME.filter(
            (item) => item.session === "morning",
        )).toHaveLength(5);

        expect(PERIOD_TIME.filter(
            (item) => item.session === "afternoon",
        )).toHaveLength(5);
    });

    it("mỗi tiết có giờ bắt đầu và kết thúc tăng dần", () => {
        const toMinutes = (value: string): number => {
            const [hour, minute] = value
                .split(":")
                .map((part) => Number.parseInt(part, 10));

            return (hour ?? 0) * 60 + (minute ?? 0);
        };

        for (let index = 1; index < PERIOD_TIME.length; index += 1) {
            const previous = PERIOD_TIME[index - 1];
            const current = PERIOD_TIME[index];

            expect(toMinutes(current.startTime))
                .toBeGreaterThan(toMinutes(previous.endTime));
        }
    });
});

describe("Suy ra tuần học từ học kỳ", () => {
    it("tuần 1 bắt đầu từ thứ Hai đầu tiên kể từ ngày bắt đầu", () => {
        const dates = datesOfWeek(semester, 1);

        expect(dates).toHaveLength(6);

        expect(dates[0].getDay()).toBe(1);

        expect([
            dates[0].getDate(),
            dates[0].getMonth() + 1,
        ]).toEqual([7, 9]);
    });

    it("lưới tuần học chạy từ thứ Hai đến thứ Bảy", () => {
        expect(CALENDAR_DAYS).toEqual([
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ]);

        expect(datesOfWeek(semester, 4).at(-1)?.getDay()).toBe(6);
    });

    it("tuần 4 chứa ngày hiện tại của dữ liệu", () => {
        expect(weekOfDate(semester, new Date(2026, 8, 30))).toBe(4);

        expect(datesOfWeek(semester, 4)[0].getDate()).toBe(28);
    });

    it("trả về null khi ngày nằm ngoài học kỳ", () => {
        expect(weekOfDate(semester, new Date(2026, 7, 1))).toBeNull();
    });

    it("số tuần học bao phủ cả học kỳ", () => {
        const total = weekCountOfSemester(semester);

        expect(total).toBeGreaterThanOrEqual(16);

        expect(weekOfDate(semester, new Date(2026, 11, 31)))
            .toBeLessThanOrEqual(total);
    });

    it("nhãn tuần có khoảng ngày", () => {
        expect(weekRangeLabel(semester, 4)).toBe("Tuần 4 · 28/09 - 03/10");
    });

    it("không suy ra được ngày khi thiếu học kỳ", () => {
        expect(datesOfWeek(undefined, 1)).toEqual([]);

        expect(weekOfDate(undefined, new Date())).toBeNull();
    });

    it("lọc tuần 0 quy về tuần hiện hành chứ không rơi về tuần 1", () => {
        expect(resolveCalendarWeek(0, 4)).toBe(4);

        expect(resolveCalendarWeek(undefined, 4)).toBe(4);

        expect(resolveCalendarWeek(7, 4)).toBe(7);

        expect(datesOfWeek(semester, resolveCalendarWeek(0, 4)))
            .toHaveLength(6);
    });
});

describe("Lọc theo tuần", () => {
    it("tiết lặp hằng tuần khớp mọi tuần", () => {
        const entry = makeEntry({ id: "repeat", week: 0 });

        expect(weekMatches(entry, 1)).toBe(true);

        expect(weekMatches(entry, 4)).toBe(true);
    });

    it("tiết gắn tuần chỉ khớp đúng tuần đó", () => {
        const entry = makeEntry({ id: "week-4", week: 4 });

        expect(weekMatches(entry, 4)).toBe(true);

        expect(weekMatches(entry, 3)).toBe(false);
    });
});

describe("Lọc theo ngữ cảnh", () => {
    const entries = [
        makeEntry({ id: "a" }),
        makeEntry({
            id: "b",
            campusId: "campus-chu-van-an",
            classId: "can-tho-class-003",
        }),
        makeEntry({
            id: "c",
            classId: "can-tho-class-002",
            roomId: "room-main-02",
        }),
    ];

    it("lọc theo cơ sở", () => {
        expect(applyCalendarFilters(
            entries,
            { campusId: "campus-chu-van-an" },
        ).map((entry) => entry.id)).toEqual(["b"]);
    });

    it("cơ sở rỗng nghĩa là không lọc", () => {
        expect(applyCalendarFilters(entries, { campusId: "" }))
            .toHaveLength(3);
    });

    it("lọc theo khối thông qua tra cứu lớp", () => {
        const grade = lookups.classById.get("can-tho-class-002")?.grade;

        expect(grade).toBe(7);

        expect(applyCalendarFilters(
            entries,
            { grade },
            lookups,
        ).map((entry) => entry.id)).toEqual(["c"]);
    });

    it("lọc theo lớp và phòng", () => {
        expect(applyCalendarFilters(
            entries,
            { classId: "can-tho-class-001" },
        ).map((entry) => entry.id)).toEqual(["a"]);

        expect(applyCalendarFilters(
            entries,
            { roomId: "room-main-02" },
        ).map((entry) => entry.id)).toEqual(["c"]);
    });

    it("lọc theo giáo viên", () => {
        expect(applyCalendarFilters(
            entries,
            { teacherId: "can-tho-personnel-001" },
        )).toHaveLength(3);
    });

    it("lọc theo học kỳ và tuần cùng lúc", () => {
        const mixed = [
            ...entries,
            makeEntry({ id: "d", semesterId: "2026-2027-HK2" }),
            makeEntry({ id: "e", week: 4 }),
            makeEntry({ id: "f", week: 3 }),
        ];

        expect(applyCalendarFilters(
            mixed,
            { semesterId: "2026-2027-HK1" },
            lookups,
            4,
        ).map((entry) => entry.id)).toEqual(["a", "b", "c", "e"]);
    });
});

describe("Chuẩn hóa sự kiện", () => {
    it("bổ sung tên hiển thị, buổi và giờ", () => {
        const [event] = toTimetableEvents([
            makeEntry({ id: "e-1", period: 6 }),
        ], lookups);

        expect(event.session).toBe("afternoon");

        expect(event.startTime).toBe("13:00");

        expect(event.className.length).toBeGreaterThan(0);

        expect(event.teacherName.length).toBeGreaterThan(0);

        expect(event.subjectName.length).toBeGreaterThan(0);

        expect(event.colorTone).toBeTruthy();
    });

    it("gom sự kiện theo ô thời gian", () => {
        const events = toTimetableEvents([
            makeEntry({ id: "e-1", dayOfWeek: "monday", period: 1 }),
            makeEntry({ id: "e-2", dayOfWeek: "monday", period: 1 }),
            makeEntry({ id: "e-3", dayOfWeek: "tuesday", period: 1 }),
        ], lookups);

        const bySlot = groupEventsBySlot(events);

        expect(bySlot.get("monday|1")).toHaveLength(2);

        expect(bySlot.get("tuesday|1")).toHaveLength(1);
    });

    it("chỉ render buổi có dữ liệu thực tế", () => {
        const events = toTimetableEvents([
            makeEntry({ id: "e-1", period: 1 }),
            makeEntry({ id: "e-2", period: 7 }),
        ], lookups);

        const blocks = deriveSessionBlocks(events);

        expect(blocks.map((block) => block.session))
            .toEqual(["morning", "afternoon"]);

        expect(blocks[0].periods).toHaveLength(1);

        expect(blocks[1].periods).toHaveLength(1);

        expect(blocks[1].periods[0].period).toBe(7);
    });

    it("không có dữ liệu thì không dựng khối buổi nào", () => {
        expect(deriveSessionBlocks([])).toEqual([]);
    });
});

describe("Lọc theo buổi và môn", () => {
    const entries = [
        makeEntry({ id: "morning", period: 2, subjectId: "math" }),
        makeEntry({ id: "afternoon", period: 7, subjectId: "physics" }),
    ];

    it("chỉ giữ tiết thuộc buổi đang chọn", () => {
        expect(applyCalendarFilters(entries, { session: "afternoon" })
            .map((entry) => entry.id)).toEqual(["afternoon"]);

        expect(applyCalendarFilters(entries, { session: "morning" })
            .map((entry) => entry.id)).toEqual(["morning"]);
    });

    it("bỏ trống buổi thì giữ cả hai buổi", () => {
        expect(applyCalendarFilters(entries)).toHaveLength(2);
    });

    it("lọc theo môn học", () => {
        expect(applyCalendarFilters(entries, { subjectId: "math" })
            .map((entry) => entry.id)).toEqual(["morning"]);

        expect(applyCalendarFilters(entries, { subjectId: "literature" }))
            .toEqual([]);
    });
});

describe("Phạm vi lựa chọn của bộ lọc", () => {
    const strainClass = "can-tho-class-027";
    const twoSessionClass = "can-tho-class-026";

    const strainTeacher = "can-tho-personnel-003";
    const twoSessionTeacher = "can-tho-personnel-006";

    const entriesOf = (teacherId: string): TimetableEntry[] =>
        plannedTimetables.filter((entry) => entry.teacherId === teacherId);

    it("dữ liệu mock có hai lớp học hai buổi", () => {
        const afternoon = plannedTimetables.filter((entry) =>
            entry.period >= 6);

        expect(new Set(afternoon.map((entry) => entry.classId)))
            .toEqual(new Set([twoSessionClass, strainClass]));

        expect(afternoon.every((entry) => entry.teacherId !== undefined))
            .toBe(true);
    });

    it("phạm vi bỏ chính lớp đang chọn nên danh sách không tự thu hẹp", () => {
        const entries = [
            makeEntry({ id: "a", classId: "can-tho-class-001" }),
            makeEntry({ id: "b", classId: "can-tho-class-002" }),
        ];

        const scope = optionScopeOf(
            entries,
            { classId: "can-tho-class-001" },
            lookups,
        );

        expect(new Set(scope.map((entry) => entry.classId)))
            .toEqual(new Set(["can-tho-class-001", "can-tho-class-002"]));
    });

    it("lọc theo giáo viên cố định và buổi đang xem", () => {
        const scope = optionScopeOf(
            plannedTimetables,
            { teacherId: twoSessionTeacher, session: "afternoon" },
            lookups,
        );

        expect(new Set(scope.map((entry) => entry.classId)))
            .toEqual(new Set([twoSessionClass]));

        expect(scope.every((entry) => entry.period >= 6)).toBe(true);
    });

    it("phạm vi rỗng khi buổi đang xem không có tiết nào", () => {
        const afternoon = entriesOf(strainTeacher).filter((entry) =>
            entry.period >= 6);

        expect(optionScopeOf(afternoon, { session: "morning" }, lookups))
            .toEqual([]);
    });

    it("lấy đúng tập khối/lớp/môn/phòng trong phạm vi", () => {
        const scope = filterScopeOf(
            entriesOf(twoSessionTeacher).filter((entry) =>
                entry.period >= 6),
            lookups,
        );

        expect([...scope.classIds]).toEqual([twoSessionClass]);

        expect([...scope.grades]).toEqual([
            lookups.classById.get(twoSessionClass)?.grade,
        ]);

        expect(scope.subjectIds.size).toBeGreaterThan(0);

        expect(scope.roomIds.size).toBeGreaterThan(0);
    });
});

describe("Chuẩn hoá bộ lọc theo phạm vi", () => {
    const scope = filterScopeOf([
        makeEntry({
            id: "a",
            classId: "can-tho-class-027",
            subjectId: "math",
            roomId: "room-main-01",
        }),
    ], lookups);

    it("bỏ lớp, môn và phòng không còn trong phạm vi", () => {
        const next = normalizeCalendarFilters({
            classId: "can-tho-class-001",
            subjectId: "literature",
            roomId: "room-main-01",
            grade: 6,
        }, scope);

        expect(next.classId).toBeUndefined();

        expect(next.subjectId).toBeUndefined();

        expect(next.roomId).toBe("room-main-01");

        expect(next.grade).toBeUndefined();
    });

    it("giữ nguyên lựa chọn còn hợp lệ", () => {
        const filters = {
            classId: "can-tho-class-027",
            subjectId: "math",
            roomId: "room-main-01",
        };

        expect(normalizeCalendarFilters(filters, scope)).toBe(filters);
    });

    it("trả về chính đối tượng cũ khi không có gì thay đổi", () => {
        const filters = { teacherId: "can-tho-personnel-003" };

        expect(normalizeCalendarFilters(filters, scope)).toBe(filters);
    });
});

describe("Đánh dấu hôm nay và tiết đang diễn ra", () => {
    const days = buildCalendarDays(
        semester,
        4,
        new Date(2026, 8, 30),
    );

    it("đánh dấu đúng một ngày là hôm nay", () => {
        expect(days.filter((day) => day.isToday)).toHaveLength(1);

        expect(days.find((day) => day.isToday)?.day).toBe("wednesday");
    });

    it("nhận diện tiết đang diễn ra kèm tiến độ", () => {
        const current = currentSlotAt(new Date(2026, 8, 30, 13, 30), days);

        expect(current?.day).toBe("wednesday");

        expect(current?.period).toBe(6);

        expect(current?.progress).toBeGreaterThan(0);

        expect(current?.progress).toBeLessThanOrEqual(1);
    });

    it("ngoài khung giờ học thì không có tiết đang diễn ra", () => {
        expect(currentSlotAt(new Date(2026, 8, 30, 12, 0), days))
            .toBeNull();

        expect(currentSlotAt(new Date(2026, 8, 30, 20, 0), days))
            .toBeNull();
    });

    it("thứ Bảy cũng được coi là hôm nay khi rơi vào thứ Bảy", () => {
        const saturday = buildCalendarDays(
            semester,
            4,
            new Date(2026, 9, 3),
        );

        expect(saturday).toHaveLength(6);

        expect(saturday.find((day) => day.isToday)?.day).toBe("saturday");

        const current = currentSlotAt(new Date(2026, 9, 3, 9, 15), saturday);

        expect(current?.day).toBe("saturday");

        expect(current?.label).toBe("09:15");
    });
});

describe("Phát hiện quá tải giáo viên", () => {
    const heavy = Array.from({ length: 9 }, (_item, index) =>
        makeEntry({
            id: `heavy-${index + 1}`,
            teacherId: "can-tho-personnel-100",
            classId: "can-tho-class-001",
            dayOfWeek: "wednesday",
            period: index + 1,
        }));

    it("báo quá tải khi vượt 8 tiết trong một ngày", () => {
        const [strain] = detectWorkloadStrain(heavy);

        expect(strain).toBeDefined();

        expect(strain?.type).toBe("workload_strain");

        expect(strain?.rows).toHaveLength(9);
    });

    it("tính cả tiết thứ Bảy vào ngưỡng quá tải", () => {
        const saturdayHeavy = Array.from({ length: 9 }, (_item, index) =>
            makeEntry({
                id: `saturday-heavy-${index + 1}`,
                teacherId: "can-tho-personnel-100",
                classId: "can-tho-class-001",
                dayOfWeek: "saturday",
                period: index + 1,
            }));

        const [strain] = detectWorkloadStrain(saturdayHeavy);

        expect(strain?.rows).toHaveLength(9);
    });

    it("không báo quá tải khi tổng tiết trong ngày vẫn hợp lệ", () => {
        const light = heavy.slice(0, 4).map((entry) => ({
            ...entry,
            id: `light-${entry.period}`,
        }));

        expect(detectWorkloadStrain(light)).toEqual([]);
    });

    it("cho phép tinh chỉnh ngưỡng theo tuần", () => {
        const five = heavy.slice(0, 5);

        expect(detectWorkloadStrain(five, {
            maxPeriodsPerDay: 4,
        })).toHaveLength(1);

        expect(detectWorkloadStrain(five)).toEqual([]);
    });

    it("bộ xung đột dùng chung gồm cả quá tải", () => {
        const types = detectCalendarConflicts(heavy).map(
            (conflict) => conflict.type,
        );

        expect(types).toContain("workload_strain");
    });
});
