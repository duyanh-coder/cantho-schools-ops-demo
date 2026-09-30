import type { Personnel } from "../common/types";

const SCHOOL_001 = "can-tho-school-001";

const SURNAMES = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ",
    "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Trương",
    "Võ", "Đinh", "Cao", "Châu", "Lâm", "Mai", "Phùng", "Tô", "Tăng",
];

const MIDDLE_FEMALE = [
    "Thị", "Thị Thanh", "Kim", "Ngọc", "Thu", "Thanh", "Hồng", "Thùy",
    "Cẩm", "Bích", "Quỳnh", "Phương", "Anh", "Mỹ",
];

const MIDDLE_MALE = [
    "Văn", "Hữu", "Quốc", "Đức", "Minh", "Thanh", "Công", "Xuân",
    "Đình", "Gia", "Trọng", "Bá", "Hoàng", "Ngọc",
];

const GIVEN_FEMALE = [
    "Lan", "Hoa", "Trang", "Ngân", "Yến", "Hương", "Thảo", "Nhung",
    "Tuyết", "Vân", "Linh", "Quỳnh", "Phượng", "Trúc", "Diễm", "Châu",
    "Hiền", "Mai", "Ngọc", "Thy", "Bình", "An", "Phúc", "Hòa", "Giang",
];

const GIVEN_MALE = [
    "Hùng", "Dũng", "Tuấn", "Minh", "Quân", "Khải", "Nam", "Sơn",
    "Phúc", "Bảo", "Đạt", "Long", "Hiếu", "Trung", "Thắng", "Cường",
    "Vinh", "Khoa", "Huy", "Thành", "Đại", "Tâm", "Nghĩa", "Tín", "Lộc",
];

const SCHOOL_001_CAMPUSES = [
    "campus-main",
    "campus-chu-van-an",
    "campus-thoi-binh",
    "campus-an-lac",
    "campus-tran-hung-dao",
    "campus-huynh-thuc-khang",
];

const CAMPUS_WARD: Record<string, string> = {
    "campus-main": "can-tho-ward-001",
    "campus-chu-van-an": "can-tho-ward-nk-an-cu",
    "campus-thoi-binh": "can-tho-ward-nk-thoi-binh",
    "campus-an-lac": "can-tho-ward-nk-an-lac",
    "campus-tran-hung-dao": "can-tho-ward-nk-an-hoa",
    "campus-huynh-thuc-khang": "can-tho-ward-nk-hung-loi",
};

const TEAM_BY_SUBJECT: Record<string, string> = {
    math: "can-tho-sector-ts01",
    physics: "can-tho-sector-ts01",
    chemistry: "can-tho-sector-ts01",
    biology: "can-tho-sector-ts01",
    literature: "can-tho-sector-ts02",
    history: "can-tho-sector-ts02",
    geography: "can-tho-sector-ts02",
    civics: "can-tho-sector-ts02",
    english: "can-tho-sector-ts03",
    informatics: "can-tho-sector-ts03",
    "physical-education": "can-tho-sector-ts04",
    music: "can-tho-sector-ts04",
    "fine-arts": "can-tho-sector-ts04",
};

const SUBJECT_NAME: Record<string, string> = {
    math: "Toán",
    physics: "Vật lý",
    chemistry: "Hóa học",
    biology: "Sinh học",
    literature: "Ngữ văn",
    history: "Lịch sử",
    geography: "Địa lý",
    civics: "Giáo dục công dân",
    english: "Tiếng Anh",
    informatics: "Tin học",
    "physical-education": "Thể dục",
    music: "Âm nhạc",
    "fine-arts": "Mỹ thuật",
};

const SUBJECT_SPREAD: Array<[string, number]> = [
    ["math", 34],
    ["literature", 32],
    ["english", 28],
    ["physics", 22],
    ["chemistry", 20],
    ["biology", 18],
    ["history", 12],
    ["geography", 12],
    ["civics", 8],
    ["informatics", 8],
    ["physical-education", 5],
    ["music", 3],
    ["fine-arts", 2],
];

const STAFF_ROLES: Array<{ title: string; degree: string }> = [
    { title: "Nhân viên kế toán", degree: "Cử nhân Kế toán" },
    { title: "Kế toán viên", degree: "Cử nhân Kế toán" },
    { title: "Thủ quỹ", degree: "Cử nhân Tài chính – Kế toán" },
    { title: "Nhân viên văn thư", degree: "Cử nhân Quản trị Văn phòng" },
    { title: "Văn thư – lưu trữ", degree: "Cử nhân Văn thư – Lưu trữ" },
    { title: "Nhân viên y tế học đường", degree: "Cử nhân Điều dưỡng" },
    { title: "Nhân viên thư viện", degree: "Cử nhân Thư viện" },
    { title: "Nhân viên thiết bị", degree: "Cử nhân Công nghệ thông tin" },
    { title: "Chuyên viên hành chính", degree: "Cử nhân Luật" },
    { title: "Chuyên viên tổ chức cán bộ", degree: "Cử nhân Quản trị nhân lực" },
    { title: "Nhân viên bảo vệ", degree: "Trung cấp An ninh" },
    { title: "Nhân viên phục vụ", degree: "Trung cấp Nội trú" },
];

const ACHIEVEMENTS = [
    "GVDG cấp quận 2025; SKKN đạt giải B cấp thành phố",
    "GVDG cấp trường 2024; Chiến sĩ thi đua cơ sở",
    "Tham gia Hội thi GVDG cấp thành phố 2025",
    "GV chủ nhiệm giỏi cấp trường; lớp chất lượng cao",
    "Chiến sĩ thi đua cấp quận 2025",
];

const TEACHER_CAMPUS_PATTERNS: string[][] = [
    ["campus-main"],
    ["campus-main", "campus-chu-van-an"],
    ["campus-main", "campus-thoi-binh"],
    ["campus-main", "campus-an-lac"],
    ["campus-thoi-binh", "campus-tran-hung-dao"],
    ["campus-an-lac", "campus-huynh-thuc-khang"],
];

const STAFF_CAMPUS_PATTERNS: string[][] = [
    ["campus-main"],
    ["campus-main", "campus-chu-van-an"],
    ["campus-main", "campus-thoi-binh"],
];

const MANAGER_ROLES: Array<{
    gender: Personnel["gender"];
    title: string;
    degree: string;
    subjectIds: string[];
}> = [
    { gender: "male", title: "Hiệu trưởng", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: [] },
    { gender: "female", title: "Phó hiệu trưởng – phụ trách chất lượng giáo dục", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: [] },
    { gender: "male", title: "Phó hiệu trưởng – phụ trách cơ sở vật chất", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: [] },
    { gender: "female", title: "Tổ trưởng chuyên môn Tổ Ngữ văn – Sử – Địa", degree: "Thạc sĩ Ngữ văn", subjectIds: ["literature"] },
    { gender: "male", title: "Tổ trưởng chuyên môn Tổ Toán – Lý – Hóa – Sinh", degree: "Thạc sĩ Toán học", subjectIds: ["math"] },
    { gender: "female", title: "Trưởng khối 7", degree: "Cử nhân Sư phạm Tiếng Anh", subjectIds: ["english"] },
];

const pad3 = (value: number): string => {
    return String(value).padStart(3, "0");
};

const pad2 = (value: number): string => {
    return String(value).padStart(2, "0");
};

const toAscii = (value: string): string => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/[^a-z]/g, "");
};

const fullNameOf = (index: number, gender: Personnel["gender"]): string => {
    const surnamePool = SURNAMES;
    const middlePool = gender === "male" ? MIDDLE_MALE : MIDDLE_FEMALE;
    const givenPool = gender === "male" ? GIVEN_MALE : GIVEN_FEMALE;
    const surname = surnamePool[(index * 3) % surnamePool.length];
    const middle = middlePool[(index * 3) % middlePool.length];
    const given = givenPool[(index * 11) % givenPool.length];
    return `${surname} ${middle} ${given}`;
};

export const canThoPersonnel: Personnel[] = [
    { id: "can-tho-personnel-001", schoolId: "can-tho-school-001", code: "CT-CBCS-001", fullName: "Trần Thị Lan", gender: "female", dob: "1980-05-12", roleTitle: "Phó hiệu trưởng – phụ trách chuyên môn", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: ["literature"], teamId: "can-tho-sector-ts02", campusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0907111222", email: "lan.tran@ninhkieu.edu.vn", address: "112 Đường 30 tháng 4, Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-hoa", careerStartDate: "2003-09-01", schoolStartDate: "2015-08-20", isExcellentTeacher: true, achievements: "CSTĐ cấp thành phố 2025; TPT chuyên môn giỏi cấp quận", status: "active" },

    { id: "can-tho-personnel-002", schoolId: "can-tho-school-001", code: "CT-CBCS-002", fullName: "Trần Văn Long", gender: "male", dob: "1984-09-03", roleTitle: "Giáo viên Ngữ văn", degree: "Cử nhân Sư phạm Ngữ văn", subjectIds: ["literature"], teamId: "can-tho-sector-ts02", campusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0912333444", email: "long.tran@ninhkieu.edu.vn", address: "58 Mậu Thân, Phường An Cư, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-cu", careerStartDate: "2007-09-01", schoolStartDate: "2012-08-15", isExcellentTeacher: true, achievements: "GVDG cấp thành phố 2025; SKKN đạt giải A cấp quận", status: "active" },

    { id: "can-tho-personnel-003", schoolId: "can-tho-school-001", code: "CT-CBCS-003", fullName: "Nguyễn Thị Hồng", gender: "female", dob: "1982-11-20", roleTitle: "Giáo viên Toán – Tổ trưởng chuyên môn", degree: "Thạc sĩ Toán học", subjectIds: ["math"], teamId: "can-tho-sector-ts01", campusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0908555666", email: "hong.nguyen@ninhkieu.edu.vn", address: "25 Trần Văn Ơn, Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-hoa", careerStartDate: "2005-09-01", schoolStartDate: "2010-08-25", isExcellentTeacher: true, achievements: "GVDG cấp quận 2024; Bằng khen Bộ GD&ĐT 2023", status: "active" },

    { id: "can-tho-personnel-004", schoolId: "can-tho-school-001", code: "CT-CBCS-004", fullName: "Lê Thị Mai", gender: "female", dob: "1988-02-14", roleTitle: "Giáo viên Tiếng Anh", degree: "Cử nhân Sư phạm Ngoại ngữ", subjectIds: ["english"], teamId: "can-tho-sector-ts03", campusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0933444555", email: "mai.le@ninhkieu.edu.vn", address: "71 Lý Tự Trọng, Phường Thới Bình, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-thoi-binh", careerStartDate: "2011-09-01", schoolStartDate: "2013-08-20", isExcellentTeacher: false, achievements: "GV cốt cán Tiếng Anh cấp quận", status: "active" },

    { id: "can-tho-personnel-005", schoolId: "can-tho-school-001", code: "CT-CBCS-005", fullName: "Phạm Văn Hùng", gender: "male", dob: "1985-07-08", roleTitle: "Giáo viên Vật lý", degree: "Thạc sĩ Vật lý học", subjectIds: ["physics"], teamId: "can-tho-sector-ts01", campusIds: ["campus-main", "campus-chu-van-an", "campus-thoi-binh", "campus-an-lac", "campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0977666888", email: "hung.pham@ninhkieu.edu.vn", address: "39 Nguyễn Văn Cừ, Phường Hưng Lợi, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-hung-loi", careerStartDate: "2008-09-01", schoolStartDate: "2014-08-25", isExcellentTeacher: true, achievements: "GVDG cấp quận 2025; Phụ trách đội tuyển Vật lý chuyên", status: "active" },

    { id: "can-tho-personnel-006", schoolId: "can-tho-school-001", code: "CT-CBCS-006", fullName: "Nguyễn Thanh Phương", gender: "female", dob: "1990-01-25", roleTitle: "Giáo viên Toán", degree: "Cử nhân Sư phạm Toán", subjectIds: ["math"], teamId: "can-tho-sector-ts01", campusIds: ["campus-main", "campus-chu-van-an"], phone: "0919222333", email: "phuong.nguyen@ninhkieu.edu.vn", address: "14 Nguyễn Trãi, Phường An Hòa, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-hoa", careerStartDate: "2013-09-01", schoolStartDate: "2016-08-20", isExcellentTeacher: false, achievements: "GV trẻ tiêu biểu cấp quận 2025", status: "active" },

    { id: "can-tho-personnel-007", schoolId: "can-tho-school-001", code: "CT-CBCS-007", fullName: "Huỳnh Thị Thu", gender: "female", dob: "1987-04-17", roleTitle: "Giáo viên Sinh học", degree: "Cử nhân Sư phạm Sinh học", subjectIds: ["biology"], teamId: "can-tho-sector-ts01", campusIds: ["campus-thoi-binh", "campus-an-lac"], phone: "0904111222", email: "thu.huynh@ninhkieu.edu.vn", address: "220 Trần Hưng Đạo, Phường An Lạc, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-lac", careerStartDate: "2010-09-01", schoolStartDate: "2015-08-18", isExcellentTeacher: false, achievements: "GV bộ môn tham gia Hội thi GVDG cấp trường", status: "active" },

    { id: "can-tho-personnel-008", schoolId: "can-tho-school-001", code: "CT-CBCS-008", fullName: "Đỗ Việt Anh", gender: "male", dob: "1983-10-30", roleTitle: "Giáo viên Lịch sử – Địa lý", degree: "Cử nhân Sư phạm Sử – Địa", subjectIds: ["literature"], teamId: "can-tho-sector-ts02", campusIds: ["campus-tran-hung-dao", "campus-huynh-thuc-khang"], phone: "0977444555", email: "anhdv@ninhkieu.edu.vn", address: "66 An Khánh, Phường An Khánh, quận Ninh Kiều, TP. Cần Thơ", wardId: "can-tho-ward-nk-an-khanh", careerStartDate: "2006-09-01", schoolStartDate: "2011-08-22", isExcellentTeacher: false, achievements: "Chủ nhiệm lớp chất lượng cao; GV chủ nhiệm giỏi cấp trường", status: "active" },

    { id: "can-tho-personnel-009", schoolId: "can-tho-school-002", code: "CT-CBCS-009", fullName: "Lê Quốc Bảo", gender: "male", dob: "1979-08-19", roleTitle: "Hiệu trưởng", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: ["math"], campusIds: ["can-tho-campus-007", "can-tho-campus-008"], phone: "0912444888", email: "bao.le@cairang.edu.vn", isExcellentTeacher: true, achievements: "CSTĐ cấp thành phố 2024; QLGD giỏi cấp quận", status: "active" },

    { id: "can-tho-personnel-010", schoolId: "can-tho-school-002", code: "CT-CBCS-010", fullName: "Nguyễn Thị Thanh", gender: "female", dob: "1986-03-07", roleTitle: "Giáo viên Ngữ văn", degree: "Cử nhân Sư phạm Ngữ văn", subjectIds: ["literature"], campusIds: ["can-tho-campus-007"], phone: "0906333777", email: "thanh.nguyen@cairang.edu.vn", isExcellentTeacher: false, achievements: "GV giỏi cấp trường 2025", status: "active" },

    { id: "can-tho-personnel-011", schoolId: "can-tho-school-002", code: "CT-CBCS-011", fullName: "Phan Minh Nhật", gender: "male", dob: "1990-12-01", roleTitle: "Giáo viên Toán", degree: "Cử nhân Sư phạm Toán", subjectIds: ["math"], campusIds: ["can-tho-campus-007", "can-tho-campus-008"], phone: "0938111222", email: "nhat.phan@cairang.edu.vn", isExcellentTeacher: false, achievements: "GV trẻ tiêu biểu cấp quận 2025", status: "active" },

    { id: "can-tho-personnel-012", schoolId: "can-tho-school-002", code: "CT-CBCS-012", fullName: "Trần Hoàng Yến", gender: "female", dob: "1988-06-23", roleTitle: "Giáo viên Tiếng Anh", degree: "Cử nhân Sư phạm Ngoại ngữ", subjectIds: ["english"], campusIds: ["can-tho-campus-008"], phone: "0965555444", email: "yen.tran@cairang.edu.vn", isExcellentTeacher: false, achievements: "GV cốt cán Tiếng Anh cấp quận", status: "active" },

    { id: "can-tho-personnel-013", schoolId: "can-tho-school-003", code: "CT-CBCS-013", fullName: "Võ Đình Kha", gender: "male", dob: "1981-01-15", roleTitle: "Hiệu trưởng", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: ["physics"], campusIds: ["can-tho-campus-009"], phone: "0908777999", email: "kha.vo@binhthuy.edu.vn", isExcellentTeacher: true, achievements: "CSTĐ cấp thành phố 2023", status: "active" },

    { id: "can-tho-personnel-014", schoolId: "can-tho-school-003", code: "CT-CBCS-014", fullName: "Đặng Thị Hà", gender: "female", dob: "1987-09-11", roleTitle: "Giáo viên Ngữ văn", degree: "Cử nhân Sư phạm Ngữ văn", subjectIds: ["literature"], campusIds: ["can-tho-campus-009"], phone: "0915333111", email: "ha.dang@binhthuy.edu.vn", isExcellentTeacher: false, achievements: "GVDG cấp quận 2025", status: "active" },

    { id: "can-tho-personnel-015", schoolId: "can-tho-school-004", code: "CT-CBCS-015", fullName: "Đinh Văn Phúc", gender: "male", dob: "1978-11-02", roleTitle: "Hiệu trưởng", degree: "Thạc sĩ Quản lý Giáo dục", subjectIds: ["math"], campusIds: ["can-tho-campus-010"], phone: "0912999888", email: "phuc.dinh@caikhe.edu.vn", isExcellentTeacher: true, achievements: "Chiến sĩ thi đua cấp thành phố 2024", status: "active" },

    { id: "can-tho-personnel-016", schoolId: "can-tho-school-004", code: "CT-CBCS-016", fullName: "Lâm Thị Quỳnh", gender: "female", dob: "1985-04-28", roleTitle: "Giáo viên Hóa học", degree: "Thạc sĩ Hóa học", subjectIds: ["chemistry"], campusIds: ["can-tho-campus-010"], phone: "0907222111", email: "quynh.lam@caikhe.edu.vn", isExcellentTeacher: false, achievements: "GV giỏi cấp trường 2024", status: "active" },

    { id: "can-tho-personnel-017", schoolId: "can-tho-school-004", code: "CT-CBCS-017", fullName: "Ngô Văn Hân", gender: "male", dob: "1989-07-06", roleTitle: "Giáo viên Tin học", degree: "Cử nhân Công nghệ thông tin", subjectIds: ["math"], campusIds: ["can-tho-campus-010"], phone: "0919666777", email: "han.ngo@caikhe.edu.vn", isExcellentTeacher: false, achievements: "Phụ trách CLB Tin học trẻ", status: "active" },
];

const teacherSubjects: string[][] = SUBJECT_SPREAD.flatMap(
    ([subjectId, count]) => Array.from(
        { length: count },
        () => [subjectId] as string[],
    ),
);

let nameIndexFemale = 0;
let nameIndexMale = 0;

const nextName = (gender: Personnel["gender"]): string => {
    if (gender === "male") {
        const fullName = fullNameOf(nameIndexMale, "male");
        nameIndexMale += 1;
        return fullName;
    }

    const fullName = fullNameOf(nameIndexFemale, "female");
    nameIndexFemale += 1;
    return fullName;
};

const generated: Personnel[] = [];

let recordIndex = 0;

for (const manager of MANAGER_ROLES) {
    const gender = manager.gender;
    const fullName = nextName(gender);
    const emailSlug = `${toAscii(fullName.split(" ").slice(1).join(""))}.${toAscii(fullName.split(" ")[0])}`;

    generated.push({
        id: `can-tho-personnel-${pad3(18 + recordIndex)}`,
        schoolId: SCHOOL_001,
        code: `CT-CBCS-${pad3(18 + recordIndex)}`,
        fullName,
        gender,
        dob: `${1980 + (nameIndexFemale + nameIndexMale) % 10}-${pad2(1 + ((nameIndexFemale + nameIndexMale) % 12))}-${pad2(1 + ((nameIndexFemale + nameIndexMale) % 28))}`,
        roleTitle: manager.title,
        degree: manager.degree,
        subjectIds: manager.subjectIds,
        teamId: manager.subjectIds.length > 0
            ? TEAM_BY_SUBJECT[manager.subjectIds[0]]
            : undefined,
        campusIds: SCHOOL_001_CAMPUSES,
        phone: `091${String(4000000 + recordIndex * 137).padStart(7, "0")}`,
        email: `${emailSlug}.${pad3(18 + recordIndex)}@ninhkieu.edu.vn`,
        address: `${90 + recordIndex * 3} ${"Trần Quốc Toản"}, quận Ninh Kiều, TP. Cần Thơ`,
        wardId: CAMPUS_WARD["campus-main"],
        careerStartDate: "2008-09-01",
        schoolStartDate: "2015-08-20",
        isExcellentTeacher: true,
        achievements: manager.subjectIds.length > 0 ? ACHIEVEMENTS[recordIndex % ACHIEVEMENTS.length] : "Cán bộ quản lý có nhiều đóng góp cho nhà trường",
        status: "active",
    });

    recordIndex += 1;
}

for (let staffIndex = 0; staffIndex < 22; staffIndex += 1) {
    const gender: Personnel["gender"] = (staffIndex % 11) < 4 ? "male" : "female";
    const fullName = nextName(gender);
    const role = STAFF_ROLES[staffIndex % STAFF_ROLES.length];
    const emailSlug = `${toAscii(fullName.split(" ").slice(1).join(""))}.${toAscii(fullName.split(" ")[0])}`;
    const campusIds = STAFF_CAMPUS_PATTERNS[staffIndex % STAFF_CAMPUS_PATTERNS.length];

    generated.push({
        id: `can-tho-personnel-${pad3(18 + recordIndex)}`,
        schoolId: SCHOOL_001,
        code: `CT-CBCS-${pad3(18 + recordIndex)}`,
        fullName,
        gender,
        dob: `${1978 + (staffIndex % 16)}-${pad2(1 + (staffIndex % 12))}-${pad2(1 + (staffIndex % 28))}`,
        roleTitle: role.title,
        degree: role.degree,
        subjectIds: [],
        campusIds,
        phone: `091${String(4000000 + recordIndex * 137).padStart(7, "0")}`,
        email: `${emailSlug}.${pad3(18 + recordIndex)}@ninhkieu.edu.vn`,
        address: `${30 + staffIndex * 2} ${"Hòa Bình"}, quận Ninh Kiều, TP. Cần Thơ`,
        wardId: CAMPUS_WARD[campusIds[0]],
        careerStartDate: "2008-09-01",
        schoolStartDate: "2014-08-20",
        isExcellentTeacher: false,
        achievements: "",
        status: staffIndex === 3 ? "inactive" : "active",
    });

    recordIndex += 1;
}

for (let teacherIndex = 0; teacherIndex < 204; teacherIndex += 1) {
    const gender: Personnel["gender"] = (teacherIndex % 34) < 13 ? "male" : "female";
    const fullName = nextName(gender);
    const subjectIds = teacherSubjects[teacherIndex];
    const subjectId = subjectIds[0];
    const campusIds = TEACHER_CAMPUS_PATTERNS[teacherIndex % TEACHER_CAMPUS_PATTERNS.length];
    const emailSlug = `${toAscii(fullName.split(" ").slice(1).join(""))}.${toAscii(fullName.split(" ")[0])}`;
    const isExcellent = teacherIndex % 9 === 0;
    const isMaster = teacherIndex % 6 === 0;

    generated.push({
        id: `can-tho-personnel-${pad3(18 + recordIndex)}`,
        schoolId: SCHOOL_001,
        code: `CT-CBCS-${pad3(18 + recordIndex)}`,
        fullName,
        gender,
        dob: `${1985 + (teacherIndex % 15)}-${pad2(1 + (teacherIndex % 12))}-${pad2(1 + (teacherIndex % 28))}`,
        roleTitle: `Giáo viên ${SUBJECT_NAME[subjectId]}`,
        degree: isMaster ? `Thạc sĩ ${SUBJECT_NAME[subjectId]}` : `Cử nhân Sư phạm ${SUBJECT_NAME[subjectId]}`,
        subjectIds,
        teamId: TEAM_BY_SUBJECT[subjectId],
        campusIds,
        phone: `091${String(4000000 + recordIndex * 137).padStart(7, "0")}`,
        email: `${emailSlug}.${pad3(18 + recordIndex)}@ninhkieu.edu.vn`,
        address: `${teacherIndex % 200 + 1} ${["Nguyễn Văn Cừ", "Trần Hưng Đạo", "Mậu Thân", "30 tháng 4", "Lý Tự Trọng", "Nguyễn Trãi"][teacherIndex % 6]}, quận Ninh Kiều, TP. Cần Thơ`,
        wardId: CAMPUS_WARD[campusIds[0]],
        careerStartDate: `${2009 + (teacherIndex % 12)}-09-01`,
        schoolStartDate: `${2012 + (teacherIndex % 10)}-08-20`,
        isExcellentTeacher: isExcellent,
        achievements: isExcellent ? ACHIEVEMENTS[teacherIndex % ACHIEVEMENTS.length] : "",
        status: teacherIndex % 41 === 0 ? "inactive" : "active",
    });

    recordIndex += 1;
}

canThoPersonnel.push(...generated);