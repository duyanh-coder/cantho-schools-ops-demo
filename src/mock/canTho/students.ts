import type { Guardian, Student } from "../common/types";

const SCHOOL_ID = "can-tho-school-001";

const CLASS_ROWS: {
    classId: string;
    campusId: string;
    grade: number;
    label: string;
}[] = [
    { classId: "can-tho-class-001", campusId: "can-tho-campus-001", grade: 6, label: "6A1" },
    { classId: "can-tho-class-002", campusId: "can-tho-campus-002", grade: 7, label: "7A1" },
    { classId: "can-tho-class-003", campusId: "can-tho-campus-003", grade: 6, label: "6A2" },
    { classId: "can-tho-class-004", campusId: "can-tho-campus-003", grade: 8, label: "8A1" },
    { classId: "can-tho-class-013", campusId: "can-tho-campus-001", grade: 9, label: "9A1" },
    { classId: "can-tho-class-014", campusId: "can-tho-campus-004", grade: 7, label: "7A2" },
    { classId: "can-tho-class-015", campusId: "can-tho-campus-015", grade: 8, label: "8A2" },
    { classId: "can-tho-class-016", campusId: "can-tho-campus-016", grade: 9, label: "9A2" },
];

const SURNAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Vũ", "Huỳnh"];

const FEMALE_NAMES = ["An", "Anh", "Ánh", "Bích", "Cẩm", "Diễm", "Duyên", "Giang", "Hà", "Hạnh", "Hoa", "Hồng", "Huệ", "Kim", "Lan", "Liên", "Loan", "Mai", "My", "Ngân", "Ngọc", "Nhi", "Như", "Oanh", "Phương", "Quỳnh", "Thảo", "Thi", "Trang", "Tuyết", "Uyên", "Vân"];

const MALE_NAMES = ["An", "Bảo", "Công", "Cường", "Đạt", "Đức", "Dũng", "Hải", "Hiếu", "Hùng", "Khang", "Kiên", "Long", "Minh", "Nam", "Phát", "Phong", "Phúc", "Quân", "Sơn", "Tài", "Thành", "Thiện", "Thịnh", "Toàn", "Trí", "Tuấn", "Vinh", "Vũ"];

const FEMALE_MIDDLE = ["Thị", "Ngọc", "Thu", "Thanh", "Kim", "Bích", "Mỹ", "Cẩm", "Hồng", "Lan"];

const MALE_MIDDLE = ["Văn", "Quốc", "Minh", "Đức", "Hữu", "Công", "Thanh", "Đình", "Hoàng", "Anh"];

const STREETS = ["Hòa Bình", "Nguyễn Trãi", "Trần Hưng Đạo", "Cách Mạng Tháng 8", "Hai Bà Trưng", "Phan Đình Phùng", "Mậu Thân", "Trần Văn Hoài"];

const WARD_IDS = ["can-tho-ward-001", "can-tho-ward-001", "can-tho-ward-001", "can-tho-ward-001", "can-tho-ward-002", "can-tho-ward-001", "can-tho-ward-001", "can-tho-ward-001", "can-tho-ward-003", "can-tho-ward-001"];

const SPECIAL_STATUS: Record<number, Student["status"]> = {
    90: "transferred",
    150: "transferred",
    235: "transferred",
    120: "dropped",
    240: "dropped",
};

const STUDENTS_PER_CLASS = 32;

export const canThoStudents: Student[] = [];

export const canThoGuardians: Guardian[] = [];

let guardianCounter = 0;

CLASS_ROWS.forEach((row) => {
    const birthYear = 2015 - (row.grade - 6);

    const enrolledDate = `${2026 - (row.grade - 6)}-09-01`;

    for (let index = 0; index < STUDENTS_PER_CLASS; index += 1) {
        const globalId = canThoStudents.length + 1;

        const surname = SURNAMES[(globalId * 3) % SURNAMES.length];

        const isMale = globalId % 5 !== 0;

        const first = isMale
            ? MALE_NAMES[(globalId * 7) % MALE_NAMES.length]
            : FEMALE_NAMES[(globalId * 11) % FEMALE_NAMES.length];

        const middle = isMale
            ? MALE_MIDDLE[(globalId * 5) % MALE_MIDDLE.length]
            : FEMALE_MIDDLE[(globalId * 9) % FEMALE_MIDDLE.length];

        const id = `can-tho-stu-${String(globalId).padStart(4, "0")}`;

        const policyGroupIds =
            globalId % 21 === 0
                ? ["can-tho-policy-001"]
                : globalId % 37 === 0
                    ? ["can-tho-policy-002"]
                    : globalId % 53 === 0
                        ? ["can-tho-policy-003"]
                        : [];

        canThoStudents.push({
            id,
            schoolId: SCHOOL_ID,
            campusId: row.campusId,
            classId: row.classId,
            wardId: WARD_IDS[globalId % WARD_IDS.length],
            code: `CT-HS-${String(globalId).padStart(4, "0")}`,
            fullName: `${surname} ${middle} ${first}`,
            gender: isMale ? "male" : "female",
            birthDate: `${birthYear}-${String((globalId % 12) + 1).padStart(2, "0")}-${String((globalId % 27) + 1).padStart(2, "0")}`,
            ethnicGroup: globalId % 23 === 0 ? "Hoa" : globalId % 31 === 0 ? "Khmer" : "Kinh",
            religion: undefined,
            address: `${STREETS[globalId % STREETS.length]}, Phường Ninh Kiều, TP. Cần Thơ`,
            guardianIds: [],
            policyGroupIds,
            status: SPECIAL_STATUS[globalId] ?? "studying",
            enrolledDate,
        });

        const guardianId = `can-tho-gua-${String(guardianCounter + 1).padStart(4, "0")}`;

        guardianCounter += 1;

        const guardianFullName = isMale
            ? `${surname} Thị ${FEMALE_NAMES[(globalId * 13) % FEMALE_NAMES.length]}`
            : `${surname} Văn ${MALE_NAMES[(globalId * 17) % MALE_NAMES.length]}`;

        canThoGuardians.push({
            id: guardianId,
            studentId: id,
            relation: isMale ? "mother" : "father",
            fullName: guardianFullName,
            phone: `09${String((700000000 + globalId * 1379) % 100000000).padStart(8, "0")}`,
            isPrimary: true,
        });

        canThoStudents[canThoStudents.length - 1].guardianIds = [guardianId];
    }
});