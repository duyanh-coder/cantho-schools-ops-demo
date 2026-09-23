import type { Student } from "../common/types";

import { canThoClasses } from "./classes";

const SCHOOL_001 = "can-tho-school-001";

const CAMPUS_WARD: Record<string, string> = {
    "campus-main": "can-tho-ward-nk-an-hoa",
    "campus-chu-van-an": "can-tho-ward-nk-an-cu",
    "campus-thoi-binh": "can-tho-ward-nk-thoi-binh",
    "campus-an-lac": "can-tho-ward-nk-an-lac",
    "campus-tran-hung-dao": "can-tho-ward-nk-an-hoa",
    "campus-huynh-thuc-khang": "can-tho-ward-nk-hung-loi",
    "can-tho-campus-007": "can-tho-ward-005",
    "can-tho-campus-008": "can-tho-ward-006",
    "can-tho-campus-009": "can-tho-ward-004",
    "can-tho-campus-010": "can-tho-ward-002",
};

const CLASS_BY_ID = ((): Map<string, { grade: number; academicYear: string }> => {
    const map = new Map<string, { grade: number; academicYear: string }>();

    for (const classItem of canThoClasses) {
        map.set(classItem.id, { grade: classItem.grade, academicYear: classItem.academicYear });
    }

    return map;
})();

const SURNAMES = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng",
    "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Võ", "Trịnh", "Đinh", "Lâm",
];

const MALE_GIVEN_NAMES = [
    "Minh Anh", "Quang Huy", "Gia Bảo", "Trung Kiên", "Hoàng Nam", "Minh Khang",
    "Ngọc Đức", "Thanh Sơn", "Công Minh", "Hữu Phước", "Đức Huy", "Việt Anh",
    "Hải Long", "Trọng Nghĩa", "Tuấn Kiệt", "Quốc Bảo", "Khánh Duy", "Phúc Thịnh",
    "Minh Trí", "Nhật Minh",
];

const FEMALE_GIVEN_NAMES = [
    "Mai Linh", "Thu Hà", "Minh Anh", "Thùy Dương", "Kim Ngân", "Ngọc Ánh",
    "Thiên Hương", "Phương Anh", "Bảo Ngọc", "Như Quỳnh", "Thảo Vy", "Khánh Linh",
    "Hoài An", "Yến Nhi", "Thu Trang", "Minh Tâm", "Ngọc Trâm", "Quỳnh Anh",
    "Hồng Nhung", "Thanh Thảo",
];

const WARD_BY_CAMPUS: Record<string, string> = {
    "campus-main": "Phường An Hòa, quận Ninh Kiều",
    "campus-chu-van-an": "Phường An Khánh, quận Ninh Kiều",
    "campus-thoi-binh": "Phường Thới Bình, quận Ninh Kiều",
    "campus-an-lac": "Phường An Lạc, quận Ninh Kiều",
    "campus-tran-hung-dao": "Phường An Hòa, quận Ninh Kiều",
    "campus-huynh-thuc-khang": "Phường Hưng Lợi, quận Ninh Kiều",
};

const DOB_YEAR_BY_GRADE: Record<number, number> = {
    6: 2014,
    7: 2013,
    8: 2012,
    9: 2011,
};

const TARGET_STUDENTS_PER_CLASS = 12;

const existingSeed: Student[] = [
    { id: "can-tho-student-001", schoolId: "can-tho-school-001", campusId: "campus-main", classId: "can-tho-class-001", code: "CT-HS-001", fullName: "Lê Minh An", gender: "male", dob: "2014-03-12", address: "Phường An Hòa, quận Ninh Kiều", guardianPhone: "0901234567", status: "studying" },

    { id: "can-tho-student-002", schoolId: "can-tho-school-001", campusId: "campus-main", classId: "can-tho-class-002", code: "CT-HS-002", fullName: "Trần Mai Linh", gender: "female", dob: "2013-07-25", address: "Phường An Cư, quận Ninh Kiều", guardianPhone: "0913344556", status: "studying" },

    { id: "can-tho-student-003", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", classId: "can-tho-class-003", code: "CT-HS-003", fullName: "Nguyễn Gia Bảo", gender: "male", dob: "2014-11-08", address: "Phường An Khánh, quận Ninh Kiều", guardianPhone: "0934567890", status: "studying" },

    { id: "can-tho-student-004", schoolId: "can-tho-school-001", campusId: "campus-chu-van-an", classId: "can-tho-class-004", code: "CT-HS-004", fullName: "Phạm Thu Hà", gender: "female", dob: "2013-01-30", address: "Phường An Khánh, quận Ninh Kiều", guardianPhone: "0967777888", status: "studying" },

    { id: "can-tho-student-005", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", classId: "can-tho-class-005", code: "CT-HS-005", fullName: "Võ Minh Khang", gender: "male", dob: "2014-05-19", address: "Phường Thới Bình, quận Ninh Kiều", guardianPhone: "0988123456", status: "studying" },

    { id: "can-tho-student-006", schoolId: "can-tho-school-001", campusId: "campus-thoi-binh", classId: "can-tho-class-006", code: "CT-HS-006", fullName: "Đặng Thùy Dương", gender: "female", dob: "2013-09-02", address: "Phường Thới Bình, quận Ninh Kiều", guardianPhone: "0909988776", status: "studying" },

    { id: "can-tho-student-007", schoolId: "can-tho-school-001", campusId: "campus-an-lac", classId: "can-tho-class-007", code: "CT-HS-007", fullName: "Bùi Quang Huy", gender: "male", dob: "2014-08-16", address: "Phường An Lạc, quận Ninh Kiều", guardianPhone: "0912444666", status: "studying" },

    { id: "can-tho-student-008", schoolId: "can-tho-school-001", campusId: "campus-an-lac", classId: "can-tho-class-008", code: "CT-HS-008", fullName: "Ngô Thị Ngọc", gender: "female", dob: "2013-12-05", address: "Phường An Lạc, quận Ninh Kiều", guardianPhone: "0936789012", status: "studying" },

    { id: "can-tho-student-009", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", classId: "can-tho-class-009", code: "CT-HS-009", fullName: "Dương Hoàng Nam", gender: "male", dob: "2014-02-27", address: "Phường An Hòa, quận Ninh Kiều", guardianPhone: "0978567890", status: "studying" },

    { id: "can-tho-student-010", schoolId: "can-tho-school-001", campusId: "campus-tran-hung-dao", classId: "can-tho-class-010", code: "CT-HS-010", fullName: "Hồ Ngọc Ánh", gender: "female", dob: "2013-06-14", address: "Phường Hưng Lợi, quận Ninh Kiều", guardianPhone: "0911333222", status: "studying" },

    { id: "can-tho-student-011", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-011", code: "CT-HS-011", fullName: "Lý Minh Trí", gender: "male", dob: "2014-10-09", address: "Phường Hưng Lợi, quận Ninh Kiều", guardianPhone: "0904455667", status: "studying" },

    { id: "can-tho-student-012", schoolId: "can-tho-school-001", campusId: "campus-huynh-thuc-khang", classId: "can-tho-class-012", code: "CT-HS-012", fullName: "Đinh Kim Chi", gender: "female", dob: "2013-04-21", address: "Phường Hưng Lợi, quận Ninh Kiều", guardianPhone: "0939111222", status: "studying" },

    { id: "can-tho-student-013", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", classId: "can-tho-class-013", code: "CT-HS-013", fullName: "Lê Nhật Minh", gender: "male", dob: "2014-02-03", address: "Phường Cái Răng, quận Cái Răng", guardianPhone: "0903111333", status: "studying" },

    { id: "can-tho-student-014", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", classId: "can-tho-class-013", code: "CT-HS-014", fullName: "Trần Huyền Trang", gender: "female", dob: "2014-06-18", address: "Phường Cái Răng, quận Cái Răng", guardianPhone: "0914455666", status: "studying" },

    { id: "can-tho-student-015", schoolId: "can-tho-school-002", campusId: "can-tho-campus-007", classId: "can-tho-class-014", code: "CT-HS-015", fullName: "Nguyễn Văn Đức", gender: "male", dob: "2013-09-27", address: "Phường Cái Răng, quận Cái Răng", guardianPhone: "0935777888", status: "studying" },

    { id: "can-tho-student-016", schoolId: "can-tho-school-002", campusId: "can-tho-campus-008", classId: "can-tho-class-015", code: "CT-HS-016", fullName: "Phạm Kim Ngân", gender: "female", dob: "2012-11-09", address: "Phường Hưng Phú, quận Cái Răng", guardianPhone: "0966555444", status: "studying" },

    { id: "can-tho-student-017", schoolId: "can-tho-school-002", campusId: "can-tho-campus-008", classId: "can-tho-class-016", code: "CT-HS-017", fullName: "Võ Trung Kiên", gender: "male", dob: "2011-12-20", address: "Phường Hưng Phú, quận Cái Răng", guardianPhone: "0987444222", status: "studying" },

    { id: "can-tho-student-018", schoolId: "can-tho-school-003", campusId: "can-tho-campus-009", classId: "can-tho-class-017", code: "CT-HS-018", fullName: "Đặng Ánh Tuyết", gender: "female", dob: "2014-05-11", address: "Phường Bình Thủy, quận Bình Thủy", guardianPhone: "0902333222", status: "studying" },

    { id: "can-tho-student-019", schoolId: "can-tho-school-003", campusId: "can-tho-campus-009", classId: "can-tho-class-018", code: "CT-HS-019", fullName: "Bùi Minh Quân", gender: "male", dob: "2013-08-04", address: "Phường Bình Thủy, quận Bình Thủy", guardianPhone: "0915111333", status: "studying" },

    { id: "can-tho-student-020", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", classId: "can-tho-class-019", code: "CT-HS-020", fullName: "Lâm Khánh Hà", gender: "female", dob: "2011-03-22", address: "Phường Cái Khế, quận Ninh Kiều", guardianPhone: "0936888999", status: "studying" },

    { id: "can-tho-student-021", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", classId: "can-tho-class-020", code: "CT-HS-021", fullName: "Ngô Hoàng Long", gender: "male", dob: "2010-10-15", address: "Phường Cái Khế, quận Ninh Kiều", guardianPhone: "0967111222", status: "studying" },

    { id: "can-tho-student-022", schoolId: "can-tho-school-004", campusId: "can-tho-campus-010", classId: "can-tho-class-021", code: "CT-HS-022", fullName: "Hồ Thùy Trâm", gender: "female", dob: "2009-07-30", address: "Phường Cái Khế, quận Ninh Kiều", guardianPhone: "0919555666", status: "studying" },
];

const padIndex = (value: number): string => String(value).padStart(3, "0");

const toDob = (
    grade: number,
    offset: number,
): string => {
    const year = DOB_YEAR_BY_GRADE[grade] ?? 2014;

    const month = 1 + ((offset * 5) % 12);

    const day = 1 + ((offset * 7) % 26);

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const toPhone = (offset: number): string => {
    const base = 900000000 + ((offset * 7919) % 99999999);

    return `0${base}`;
};

const generatedStudents: Student[] = canThoClasses
    .filter((classItem) => classItem.schoolId === SCHOOL_001)
    .flatMap((classItem) => {
        const existingInClass = existingSeed.filter(
            (student) => student.classId === classItem.id,
        ).length;

        const roomLimit = TARGET_STUDENTS_PER_CLASS - existingInClass;

        const classIndex = Number.parseInt(
            classItem.id.slice("can-tho-class-".length),
            10,
        );

        return Array.from({ length: roomLimit }, (_, index) => {
            const studentIndex = classIndex * TARGET_STUDENTS_PER_CLASS + index + 1;

            const surname = SURNAMES[(studentIndex * 3 + 1) % SURNAMES.length];

            const isMale = studentIndex % 2 === 1;

            const givenName = isMale
                ? MALE_GIVEN_NAMES[(studentIndex * 5 + 3) % MALE_GIVEN_NAMES.length]
                : FEMALE_GIVEN_NAMES[(studentIndex * 7 + 5) % FEMALE_GIVEN_NAMES.length];

            return {
                id: `can-tho-student-${padIndex(existingSeed.length + studentIndex)}`,
                schoolId: SCHOOL_001,
                campusId: classItem.campusId,
                classId: classItem.id,
                code: `CT-HS-${padIndex(existingSeed.length + studentIndex)}`,
                fullName: `${surname} ${givenName}`,
                gender: isMale ? "male" as const : "female" as const,
                dob: toDob(classItem.grade, studentIndex),
                address: WARD_BY_CAMPUS[classItem.campusId]
                    ?? "Phường An Hòa, quận Ninh Kiều",
                guardianPhone: toPhone(studentIndex),
                status: "studying" as const,
            };
        });
    });

const specialStudents: Student[] = [
    {
        id: "can-tho-student-special-001",
        schoolId: SCHOOL_001,
        campusId: "campus-main",
        classId: "can-tho-class-026",
        code: "CT-HS-S001",
        fullName: "Nguyễn Quốc Bảo",
        gender: "male",
        dob: "2011-05-14",
        address: "Phường An Hòa, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-an-hoa",
        guardianName: "Nguyễn Văn Bình",
        guardianPhone: "0901112233",
        email: "quocbao.nk@email.com",
        ethnicity: "Kinh",
        status: "graduated",
    },

    {
        id: "can-tho-student-special-002",
        schoolId: SCHOOL_001,
        campusId: "campus-thoi-binh",
        classId: "can-tho-class-038",
        code: "CT-HS-S002",
        fullName: "Trần Thanh Thảo",
        gender: "female",
        dob: "2011-09-28",
        address: "Phường Thới Bình, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-thoi-binh",
        guardianName: "Trần Minh Châu",
        guardianPhone: "0902223344",
        email: "thanhthao.tb@email.com",
        ethnicity: "Kinh",
        status: "graduated",
    },

    {
        id: "can-tho-student-special-003",
        schoolId: SCHOOL_001,
        campusId: "campus-main",
        classId: "can-tho-class-001",
        code: "CT-HS-S003",
        fullName: "Lê Anh Tuấn",
        gender: "male",
        dob: "2014-02-10",
        address: "Phường An Hòa, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-an-hoa",
        guardianName: "Lê Quang Minh",
        guardianPhone: "0903334455",
        email: "anhtuan.nk@email.com",
        ethnicity: "Kinh",
        status: "transferred",
    },

    {
        id: "can-tho-student-special-004",
        schoolId: SCHOOL_001,
        campusId: "campus-chu-van-an",
        classId: "can-tho-class-003",
        code: "CT-HS-S004",
        fullName: "Phạm Hà My",
        gender: "female",
        dob: "2014-07-22",
        address: "Phường An Khánh, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-an-cu",
        guardianName: "Phạm Đức Hải",
        guardianPhone: "0904445566",
        email: "hamy.cva@email.com",
        ethnicity: "Kinh",
        status: "suspended",
    },

    {
        id: "can-tho-student-special-005",
        schoolId: SCHOOL_001,
        campusId: "campus-an-lac",
        classId: "can-tho-class-044",
        code: "CT-HS-S005",
        fullName: "Võ Đình Khôi",
        gender: "male",
        dob: "2011-04-05",
        address: "Phường An Lạc, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-an-lac",
        guardianName: "Võ Thanh Tùng",
        guardianPhone: "0905556677",
        email: "dinhkhoi.al@email.com",
        ethnicity: "Khmer",
        status: "dropped_out",
    },

    {
        id: "can-tho-student-special-006",
        schoolId: SCHOOL_001,
        campusId: "campus-tran-hung-dao",
        classId: "can-tho-class-046",
        code: "CT-HS-S006",
        fullName: "Đặng Thu Hà",
        gender: "female",
        dob: "2014-11-18",
        address: "Phường An Hòa, quận Ninh Kiều",
        wardId: "can-tho-ward-nk-an-hoa",
        guardianName: "Đặng Văn Sơn",
        guardianPhone: "0906667788",
        email: "thuha.thd@email.com",
        ethnicity: "Kinh",
        status: "dropped_out",
    },
];

const enrichStudent = (student: Student): Student => {
    const classMeta = student.classId
        ? CLASS_BY_ID.get(student.classId)
        : undefined;

    const academicYear = student.academicYear
        ?? classMeta?.academicYear
        ?? "2026-2027";

    const grade = student.grade ?? classMeta?.grade;

    const wardId = student.wardId
        ?? CAMPUS_WARD[student.campusId];

    const ethnicity = student.ethnicity ?? "Kinh";

    const birthPlace = student.birthPlace ?? student.address;

    return {
        ...student,
        academicYear,
        grade,
        wardId,
        ethnicity,
        birthPlace,
    };
};

export const canThoStudents: Student[] = [
    ...existingSeed,
    ...specialStudents,
    ...generatedStudents,
].map(enrichStudent);

export const canThoActiveStudents = (): Student[] =>
    canThoStudents.filter((student) => student.status === "studying");