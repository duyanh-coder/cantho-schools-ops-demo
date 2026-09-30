import {
    renderHook,
} from "@testing-library/react";

import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    canThoClasses,
    canThoGrades,
    canThoPersonnel,
    gradeByNumberOf,
    gradeCodePrefixOf,
    gradeIdOf,
} from "@/mock/canTho";

import {
    CLASSES_STORAGE_KEY,
    classBlockers,
    classDraftBlockers,
    classIdOf,
    useClasses,
} from "@/store/useClasses";

import type {
    ClassDraft,
} from "@/store/useClasses";

import {
    GRADES_STORAGE_KEY,
    gradeBlockers,
} from "@/store/useGrades";

import {
    usePersonnel,
} from "@/store/usePersonnel";

const SCHOOL_001 = "can-tho-school-001";

describe("PHASE 05 grade store rules", () => {
    it("moves to a fresh storage key so seeded grades are re-read", () => {
        expect(GRADES_STORAGE_KEY).toBe("can-tho-grades");
    });

    it("moves classes to a fresh storage key so gradeId is filled in", () => {
        expect(CLASSES_STORAGE_KEY).toBe("can-tho-classes-v2");
    });

    it("seeds one grade per grade level of each school", () => {
        expect(canThoGrades).toHaveLength(13);

        const codes = new Set<string>();

        for (const schoolId of new Set(
            canThoGrades.map((grade) => grade.schoolId),
        )) {
            const grades = canThoGrades.filter(
                (grade) => grade.schoolId === schoolId,
            );

            expect(new Set(grades.map((g) => g.sortOrder)).size)
                .toBe(grades.length);

            for (const grade of grades) {
                expect(grade.id).toBe(gradeIdOf(schoolId, grade.sortOrder));
                expect(grade.code).toMatch(/^[A-Z]{2}-K\d{1,2}$/);
                expect(grade.name).toBe(`Khối ${grade.sortOrder}`);

                codes.add(grade.code);
            }
        }

        expect(codes.size).toBe(canThoGrades.length);
    });

    it("resolves a grade by number for a school", () => {
        expect(gradeByNumberOf(SCHOOL_001, 6)?.id)
            .toBe(`${SCHOOL_001}-g6`);
        expect(gradeByNumberOf(SCHOOL_001, 12)).toBeUndefined();
    });

    it("refuses to delete a grade that still has classes", () => {
        const grade = gradeByNumberOf(SCHOOL_001, 6);

        expect(grade).toBeDefined();

        const blockers = gradeBlockers(grade!, canThoClasses);

        expect(blockers).toHaveLength(1);
        expect(blockers[0]).toContain("lớp học");
    });

    it("allows deleting a grade without classes", () => {
        const orphan: (typeof canThoGrades)[number] = {
            id: "can-tho-school-001-g12",
            schoolId: SCHOOL_001,
            code: "NK-K12",
            name: "Khối 12",
            sortOrder: 12,
            status: "active",
        };

        expect(gradeBlockers(orphan, canThoClasses)).toStrictEqual([]);
    });

    it("builds the grade code prefix from the school, not the id tail", () => {
        expect(gradeCodePrefixOf(SCHOOL_001)).toBe("NK");
        expect(gradeCodePrefixOf("can-tho-school-002")).toBe("CR");
        expect(gradeCodePrefixOf("can-tho-school-003")).toBe("BT");
        expect(gradeCodePrefixOf("can-tho-school-004")).toBe("CK");
        expect(gradeCodePrefixOf("can-tho-school-999")).toBe("CAN");
    });
});

describe("PHASE 05 class store rules", () => {
    const references = {
        studentClassIds: new Set(["can-tho-class-001"]),
        timetableClassIds: new Set(["can-tho-class-026"]),
        assignmentClassIds: new Set(["can-tho-class-003"]),
        historyClassIds: new Set(["can-tho-class-024"]),
    };

    it("reports every blocker of a referenced class", () => {
        expect(classBlockers("can-tho-class-001", references))
            .toStrictEqual(["Lớp còn học sinh đang theo học."]);

        expect(classBlockers("can-tho-class-026", references))
            .toStrictEqual(["Lớp còn thời khóa biểu."]);

        expect(classBlockers("can-tho-class-003", references))
            .toStrictEqual(["Lớp còn phân công giảng dạy."]);

        expect(classBlockers("can-tho-class-024", references))
            .toStrictEqual(["Lớp còn biến động khối/lớp học."]);
    });

    it("reports nothing for an unreferenced class", () => {
        const classItem = canThoClasses.find(
            (c) => c.schoolId === SCHOOL_001 && c.id === "can-tho-class-051",
        );

        expect(classItem).toBeDefined();
        expect(classBlockers(classItem!.id, references)).toStrictEqual([]);
    });
});

describe("PHASE 05 class draft rules", () => {
    const activeHomeroom = canThoPersonnel.find(
        (person) =>
            person.schoolId === SCHOOL_001 &&
            person.status === "active" &&
            person.campusIds.includes("campus-main"),
    )!;

    const validDraft: ClassDraft = {
        schoolId: SCHOOL_001,
        campusId: "campus-main",
        code: "6A9",
        name: "6A9",
        grade: 6,
        academicYear: "2026-2027",
        homeroomTeacherId: activeHomeroom.id,
        status: "active",
    };

    it("generates a stable class id outside the seeded range", () => {
        const id = classIdOf(SCHOOL_001, "2026-2027", "6A9");

        expect(id).toBe("can-tho-class-s001-2026-2027-6a9");
        expect(classIdOf(SCHOOL_001, "2026-2027", "6A9")).toBe(id);
        expect(canThoClasses.some((c) => c.id === id)).toBe(false);
    });

    it("accepts a complete draft with an eligible homeroom teacher", () => {
        expect(classDraftBlockers(validDraft, {
            classes: canThoClasses,
            personnel: canThoPersonnel,
        })).toStrictEqual([]);
    });

    it("requires name, code, grade, campus and academic year", () => {
        const blockers = classDraftBlockers({
            ...validDraft,
            name: "  ",
            code: " 6 A1 ",
            grade: 0,
            campusId: "",
            academicYear: " ",
        }, {
            classes: canThoClasses,
            personnel: canThoPersonnel,
        });

        expect(blockers).toContain("Tên lớp là bắt buộc.");
        expect(blockers).toContain("Mã lớp không được chứa khoảng trắng.");
        expect(blockers).toContain("Khối của lớp không hợp lệ.");
        expect(blockers).toContain("Lớp phải thuộc một cơ sở.");
        expect(blockers).toContain("Lớp phải thuộc một năm học.");
    });

    it("refuses a code already used in the same school year", () => {
        const existing = canThoClasses.find(
            (c) => c.schoolId === SCHOOL_001 &&
                c.academicYear === "2026-2027",
        )!;

        const blockers = classDraftBlockers({
            ...validDraft,
            code: existing.code,
        }, {
            classes: canThoClasses,
            personnel: canThoPersonnel,
        });

        expect(blockers).toStrictEqual([
            "Mã hoặc tên lớp đã tồn tại trong năm học này.",
        ]);
    });

    it("allows the same code in another academic year", () => {
        const existing = canThoClasses.find(
            (c) => c.schoolId === SCHOOL_001 &&
                c.academicYear === "2026-2027",
        )!;

        const blockers = classDraftBlockers({
            ...validDraft,
            code: existing.code,
            name: existing.code,
            academicYear: "2027-2028",
        }, {
            classes: canThoClasses,
            personnel: canThoPersonnel,
        });

        expect(blockers).toStrictEqual([]);
    });

    it("requires a homeroom teacher", () => {
        const blockers = classDraftBlockers({
            ...validDraft,
            homeroomTeacherId: undefined,
        }, {
            classes: canThoClasses,
            personnel: canThoPersonnel,
        });

        expect(blockers).toStrictEqual([
            "Lớp phải có giáo viên chủ nhiệm.",
        ]);
    });

    it("refuses a missing, inactive, foreign or off-campus teacher", () => {
        const context = { classes: canThoClasses, personnel: canThoPersonnel };

        expect(classDraftBlockers({
            ...validDraft,
            homeroomTeacherId: "khong-ton-tai",
        }, context)).toStrictEqual([
            "GVCN không tồn tại trong danh sách nhân sự.",
        ]);

        const inactive = canThoPersonnel.find(
            (person) => person.status === "inactive",
        );

        if (inactive) {
            expect(classDraftBlockers({
                ...validDraft,
                homeroomTeacherId: inactive.id,
            }, context).join(" ")).toContain("không hoạt động");
        }

        const otherSchool = canThoPersonnel.find(
            (person) => person.schoolId !== SCHOOL_001,
        )!;

        expect(classDraftBlockers({
            ...validDraft,
            homeroomTeacherId: otherSchool.id,
        }, context).join(" ")).toContain("không thuộc trường");

        const otherCampus = canThoPersonnel.find(
            (person) =>
                person.schoolId === SCHOOL_001 &&
                person.status === "active" &&
                !person.campusIds.includes("campus-main"),
        )!;

        expect(classDraftBlockers({
            ...validDraft,
            homeroomTeacherId: otherCampus.id,
        }, context).join(" ")).toContain("cơ sở của lớp");
    });
});

describe("class list GVCN column resolves a name for every row", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("finds a homeroom teacher through the personnel store", () => {
        const { result: classesApi } = renderHook(() => useClasses());

        const { result: personnelApi } = renderHook(() => usePersonnel());

        const unresolved = classesApi.current.items.filter(
            (classItem) => !classItem.homeroomTeacherId ||
                !personnelApi.current.byId.get(classItem.homeroomTeacherId),
        );

        expect(
            unresolved.map((classItem) => classItem.id),
        ).toStrictEqual([]);

        expect(classesApi.current.items.length).toBe(151);
    });

    it("ignores a class cache written before the GVCN upgrade", () => {
        const fullKey = `htql:crud:${CLASSES_STORAGE_KEY}`;

        localStorage.setItem(fullKey, JSON.stringify([
            { id: "can-tho-class-013", schoolId: SCHOOL_001 },
        ]));

        const { result } = renderHook(() => useClasses());

        expect(result.current.items.length).toBe(151);

        expect(
            result.current.items.find(
                (classItem) => classItem.id === "can-tho-class-013",
            )?.homeroomTeacherId,
        ).toBeTruthy();
    });
});
