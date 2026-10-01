import {
    describe,
    expect,
    it,
} from "vitest";

import routerSource from "./router/index.tsx?raw";

import schoolsSource from "./pages/Schools/index.tsx?raw";

import classListSource from "./pages/Classes/ClassList.tsx?raw";

import classDetailSource from "./pages/Classes/ClassDetail.tsx?raw";

import studentListSource from "./pages/Students/StudentList.tsx?raw";

import studentDetailSource from "./pages/Students/StudentDetail.tsx?raw";

import studentCvSource from "./pages/Students/StudentCv.tsx?raw";

import operationLayoutSource from "./layouts/OperationLayout/index.tsx?raw";

import appSidebarSource from "./layouts/AppSidebar/index.tsx?raw";

import dashboardSidebarSource from "./components/dashboard/Sidebar/index.tsx?raw";

const SCHOOL_TABS = [
    "schools",
    "campuses",
    "personnel",
    "sectors",
    "classes",
];

describe("PHASE 06 students live inside the class context", () => {
    it("drops the school-level students tab", () => {
        const tabKeys = schoolsSource.match(
            /const TAB_KEYS = \[([\s\S]*?)\] as const;/,
        )?.[1] ?? "";

        const keys = [...tabKeys.matchAll(/"([a-z]+)"/g)]
            .map((match) => match[1]);

        expect(keys).toStrictEqual(SCHOOL_TABS);
    });

    it("never renders a students tab inside the school hub", () => {
        expect(schoolsSource).not.toContain('key: "students"');

        expect(schoolsSource).not.toContain("<StudentList");

        expect(schoolsSource).not.toContain('label: "Học sinh"');
    });

    it("maps legacy ?tab=students bookmarks to the classes tab", () => {
        expect(schoolsSource).toContain("RETIRED_TAB_ALIASES");

        expect(schoolsSource).toMatch(
            /RETIRED_TAB_ALIASES[^=]*=\s*\{[^}]*students:\s*"classes"/s,
        );
    });

    it("redirects /operations/students to the classes tab but keeps the profile route", () => {
        expect(routerSource).toContain(
            '<Route path="/operations/students" element={<Navigate to="/operations/schools?tab=classes" replace />} />',
        );

        expect(routerSource).toContain(
            '<Route path="/operations/students/:studentId" element={<StudentDetail />} />',
        );

        expect(routerSource).not.toContain("tab=students");
    });

    it("keeps no students entry in any sidebar", () => {
        for (const source of [
            operationLayoutSource,
            appSidebarSource,
            dashboardSidebarSource,
        ]) {
            expect(source).not.toContain("Học sinh");
            expect(source).not.toContain("tab=students");
        }
    });

    it("repoints every students shortcut to the classes tab", () => {
        expect(classListSource).toContain(
            "/operations/classes/${item.id}?tab=students",
        );

        expect(classListSource).toContain(
            "/operations/classes/${classItem.id}?tab=students",
        );
    });

    it("scopes the class detail students tab to the opened class", () => {
        expect(classDetailSource).toContain('key: "students"');

        expect(classDetailSource).toMatch(
            /<StudentList[\s\S]*?compact[\s\S]*?schoolId=\{classItem\.schoolId\}[\s\S]*?classId=\{classItem\.id\}/,
        );
    });

    it("shows roster stats and needs KPIs in the class students tab", () => {
        expect(classDetailSource).toContain("rosterStats.total");

        expect(classDetailSource).toContain("rosterStats.male");

        expect(classDetailSource).toContain("rosterStats.female");

        expect(classDetailSource).toContain("rosterStats.remaining");

        expect(classDetailSource).toContain("needs.boarding");

        expect(classDetailSource).toContain("needs.twoSession");

        expect(classDetailSource).toContain("needs.meal");
    });

    it("filters the student list by class and year before rendering", () => {
        expect(studentListSource).toMatch(
            /row\.classId === classId\s*&&/,
        );

        expect(studentListSource).toContain("row.academicYear === scopedClass.academicYear");

        expect(studentListSource).not.toMatch(
            /const items = useMemo\(\s*\(\)\s*=>\s*studentsApi\.bySchool,\s*\[\s*studentsApi\.bySchool\s*\],\s*\)/,
        );
    });

    it("keeps only the studying students by default inside a class", () => {
        expect(studentListSource).toMatch(
            /\?\? \(classId \? "studying" : undefined\)/,
        );

        expect(studentListSource).toMatch(
            /setStatusFilter\(classId \? "studying" : undefined\)/,
        );
    });

    it("prefills the class context when creating a student", () => {
        expect(studentListSource).toContain(
            "classId: scopedClass?.id ?? classFilter",
        );

        expect(studentListSource).toContain(
            "const targetClassId = classId ?? formClassId ?? classFilter",
        );

        expect(studentListSource).toContain(
            "Học sinh đang học phải thuộc một lớp",
        );
    });

    it("reads class needs from boarding profiles instead of the student record", () => {
        expect(studentListSource).toContain("useBoardingProfiles");

        expect(studentListSource).toContain("profile.academicYearId === rosterYear");

        expect(studentListSource).not.toMatch(/student\.boarding\b/);

        expect(studentListSource).not.toMatch(/student\.twoSession\b/);

        expect(studentListSource).not.toMatch(/student\.meal\b/);
    });

    it("opens the student profile from the list and keeps the class context", () => {
        expect(studentListSource).toContain(
            "navigate(`/operations/students/${student.id}`)",
        );

        expect(studentDetailSource).toContain(
            "`/operations/classes/${classItem.id}?tab=students`",
        );

        expect(studentDetailSource).toContain('title: student.fullName');
    });

    it("drops every legacy school-level students link", () => {
        for (const source of [
            routerSource,
            schoolsSource,
            classListSource,
            classDetailSource,
            studentListSource,
            studentDetailSource,
        ]) {
            expect(source).not.toContain("/operations/schools?tab=students");
        }
    });

    it("keeps the student detail tabs and derives the timetable from the class", () => {
        const tabKeys = studentDetailSource.match(
            /const TAB_KEYS = \[([\s\S]*?)\] as const;/,
        )?.[1] ?? "";

        const keys = [...tabKeys.matchAll(/"([a-z]+)"/g)]
            .map((match) => match[1]);

        expect(keys).toStrictEqual([
            "overview",
            "profile",
            "progress",
            "transcript",
            "timetable",
            "movements",
            "boarding",
            "achievements",
            "history",
        ]);

        expect(studentDetailSource).toContain(
            "useTimetables({\n        classId: student ? student.classId : undefined,",
        );
    });

    it("renders the profile tab as a CV with the six agreed sections", () => {
        expect(studentDetailSource).toContain(
            "import StudentCv from \"@/pages/Students/StudentCv\"",
        );

        for (const anchor of [
            "ly-lich",
            "hoc-tap",
            "nguoi-giam-ho",
            "ban-tru",
            "thanh-tich",
            "lich-su",
        ]) {
            expect(studentCvSource).toContain(
                `id="student-cv-${anchor}"`,
            );
        }

        // CV chỉ tóm tắt và dẫn sang tab chi tiết, không lặp lại dữ liệu.
        expect(studentCvSource).toContain("onOpenTab");
        expect(studentCvSource).toContain("Xem tất cả");

        // Không dùng lại tên class của trang nhân sự trong trang học sinh.
        expect(studentDetailSource).not.toContain("personnel-detail__cv");

        expect(studentDetailSource).not.toContain("personnel-detail__identity");
    });

    it("keeps the timetable tab on the shared calendar plus the subject table", () => {
        expect(studentDetailSource).toContain("<TimetableCalendar");

        expect(studentDetailSource).toContain("mode=\"student\"");

        expect(studentDetailSource).toContain(
            "entityId={classItem.id}",
        );

        // Môn học lấy từ phân công giảng dạy của lớp, không hard-code.
        expect(studentDetailSource).toContain("assignmentsApi.byClass");

        expect(studentDetailSource).toContain("classSubjectColumns");

        expect(studentDetailSource).toContain("subjectToneColor(");

        // Bảng tiết cũ đã bị thay bằng TimetableCalendar.
        expect(studentDetailSource).not.toContain("timetableColumns");

        // Lớp chưa có TKB vẫn cần thông báo rõ ràng.
        expect(studentDetailSource).toContain(
            "Lớp chưa có thời khóa biểu.",
        );
    });

    it("validates class transfers before writing a movement", () => {
        expect(studentDetailSource).toContain(
            "toClass.schoolId !== student.schoolId",
        );

        expect(studentDetailSource).toContain(
            "toClass.academicYear !== student.academicYear",
        );

        expect(studentDetailSource).toContain("fromClassId: student.classId");

        expect(studentDetailSource).toContain("toClassId,");
    });
});