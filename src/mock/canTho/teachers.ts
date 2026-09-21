import type { Teacher } from "../common/types";

export const canThoTeachers: Teacher[] = [
    { id: "can-tho-teacher-001", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-002"], code: "CT-GV-001", fullName: "Nguyễn Thị Hồng", gender: "female", birthDate: "1982-05-14", qualification: "master", teacherRank: "II", subjectIds: ["math"], departmentId: "can-tho-dep-001", appointmentDate: "2014-08-20", hireDate: "2004-09-01", status: "active" },

    { id: "can-tho-teacher-002", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-002"], code: "CT-GV-002", fullName: "Trần Văn Long", gender: "male", birthDate: "1979-11-02", qualification: "university", teacherRank: "II", subjectIds: ["literature"], departmentId: "can-tho-dep-003", appointmentDate: "2015-09-01", hireDate: "2001-09-01", status: "active" },

    { id: "can-tho-teacher-003", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-003", "can-tho-campus-016"], code: "CT-GV-003", fullName: "Lê Thị Mai", gender: "female", birthDate: "1985-03-21", qualification: "university", teacherRank: "II", subjectIds: ["english"], departmentId: "can-tho-dep-004", appointmentDate: "2016-08-25", hireDate: "2007-09-01", status: "active" },

    { id: "can-tho-teacher-004", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-003", "can-tho-campus-015"], code: "CT-GV-004", fullName: "Phạm Văn Hùng", gender: "male", birthDate: "1980-07-09", qualification: "university", teacherRank: "II", subjectIds: ["physics"], departmentId: "can-tho-dep-001", appointmentDate: "2013-09-05", hireDate: "2003-09-01", status: "active" },

    { id: "can-tho-teacher-005", schoolId: "can-tho-school-003", campusIds: ["can-tho-campus-005", "can-tho-campus-006"], code: "CT-GV-005", fullName: "Võ Thị Thu", subjectIds: ["chemistry"], status: "active" },

    { id: "can-tho-teacher-006", schoolId: "can-tho-school-003", campusIds: ["can-tho-campus-005", "can-tho-campus-006"], code: "CT-GV-006", fullName: "Đặng Văn Khoa", subjectIds: ["biology"], status: "active" },

    { id: "can-tho-teacher-007", schoolId: "can-tho-school-004", campusIds: ["can-tho-campus-007"], code: "CT-GV-007", fullName: "Bùi Thị Ngọc", subjectIds: ["math"], status: "active" },

    { id: "can-tho-teacher-008", schoolId: "can-tho-school-004", campusIds: ["can-tho-campus-007"], code: "CT-GV-008", fullName: "Nguyễn Thanh Tùng", subjectIds: ["literature"], status: "active" },

    { id: "can-tho-teacher-009", schoolId: "can-tho-school-005", campusIds: ["can-tho-campus-008"], code: "CT-GV-009", fullName: "Trần Mỹ Duyên", subjectIds: ["english"], status: "active" },

    { id: "can-tho-teacher-010", schoolId: "can-tho-school-005", campusIds: ["can-tho-campus-008"], code: "CT-GV-010", fullName: "Lê Quốc Bảo", subjectIds: ["physics"], status: "active" },

    { id: "can-tho-teacher-011", schoolId: "can-tho-school-006", campusIds: ["can-tho-campus-009"], code: "CT-GV-011", fullName: "Phạm Ngọc Trâm", subjectIds: ["chemistry"], status: "active" },

    { id: "can-tho-teacher-012", schoolId: "can-tho-school-006", campusIds: ["can-tho-campus-009"], code: "CT-GV-012", fullName: "Võ Minh Đức", subjectIds: ["biology"], status: "active" },

    { id: "can-tho-teacher-013", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001"], code: "CT-GV-013", fullName: "Nguyễn Minh Châu", gender: "female", birthDate: "1988-01-25", qualification: "university", teacherRank: "II", subjectIds: ["math"], departmentId: "can-tho-dep-001", appointmentDate: "2018-09-03", hireDate: "2010-09-01", status: "active" },

    { id: "can-tho-teacher-014", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-002", "can-tho-campus-015"], code: "CT-GV-014", fullName: "Trần Thị Thanh Thảo", gender: "female", birthDate: "1990-09-17", qualification: "university", teacherRank: "II", subjectIds: ["math"], departmentId: "can-tho-dep-001", appointmentDate: "2019-09-05", hireDate: "2012-09-01", status: "active" },

    { id: "can-tho-teacher-015", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-002"], code: "CT-GV-015", fullName: "Lê Văn Đạt", gender: "male", birthDate: "1986-10-08", qualification: "master", teacherRank: "I", subjectIds: ["physics"], departmentId: "can-tho-dep-001", appointmentDate: "2017-08-28", hireDate: "2009-09-01", status: "active" },

    { id: "can-tho-teacher-016", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-016"], code: "CT-GV-016", fullName: "Phạm Thị Ngọc Mai", gender: "female", birthDate: "1984-04-30", qualification: "master", teacherRank: "II", subjectIds: ["chemistry"], departmentId: "can-tho-dep-002", appointmentDate: "2015-09-02", hireDate: "2006-09-01", status: "active" },

    { id: "can-tho-teacher-017", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-002", "can-tho-campus-004"], code: "CT-GV-017", fullName: "Võ Thành Trung", gender: "male", birthDate: "1987-12-11", qualification: "university", teacherRank: "II", subjectIds: ["biology"], departmentId: "can-tho-dep-002", appointmentDate: "2018-09-06", hireDate: "2011-09-01", status: "active" },

    { id: "can-tho-teacher-018", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-003", "can-tho-campus-016"], code: "CT-GV-018", fullName: "Đặng Thị Kim Oanh", gender: "female", birthDate: "1991-06-19", qualification: "university", teacherRank: "III", subjectIds: ["biology"], departmentId: "can-tho-dep-002", appointmentDate: "2020-09-01", hireDate: "2014-09-01", status: "active" },

    { id: "can-tho-teacher-019", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-003", "can-tho-campus-004"], code: "CT-GV-019", fullName: "Bùi Văn Huy", gender: "male", birthDate: "1983-02-27", qualification: "university", teacherRank: "II", subjectIds: ["literature"], departmentId: "can-tho-dep-003", appointmentDate: "2014-09-08", hireDate: "2005-09-01", status: "active" },

    { id: "can-tho-teacher-020", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-015"], code: "CT-GV-020", fullName: "Nguyễn Thị Ánh Tuyết", gender: "female", birthDate: "1989-08-03", qualification: "university", teacherRank: "II", subjectIds: ["literature"], departmentId: "can-tho-dep-003", appointmentDate: "2019-09-05", hireDate: "2012-09-01", status: "active" },

    { id: "can-tho-teacher-021", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001", "can-tho-campus-002", "can-tho-campus-003"], code: "CT-GV-021", fullName: "Trần Quốc Toản", gender: "male", birthDate: "1985-05-22", qualification: "master", teacherRank: "II", subjectIds: ["english"], departmentId: "can-tho-dep-004", appointmentDate: "2016-09-01", hireDate: "2008-09-01", status: "active" },

    { id: "can-tho-teacher-022", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-004", "can-tho-campus-016"], code: "CT-GV-022", fullName: "Lê Thị Bích Vân", gender: "female", birthDate: "1992-03-15", qualification: "university", teacherRank: "III", subjectIds: ["english"], departmentId: "can-tho-dep-004", appointmentDate: "2021-09-01", hireDate: "2015-09-01", status: "active" },

    { id: "can-tho-teacher-023", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-004"], code: "CT-GV-023", fullName: "Hồ Văn Đông", gender: "male", birthDate: "1981-09-30", qualification: "university", teacherRank: "II", subjectIds: ["math"], departmentId: "can-tho-dep-001", appointmentDate: "2013-09-09", hireDate: "2004-09-01", status: "active" },

    { id: "can-tho-teacher-024", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-004"], code: "CT-GV-024", fullName: "Dương Thị Cẩm Tú", gender: "female", birthDate: "1988-07-06", qualification: "university", teacherRank: "II", subjectIds: ["chemistry"], departmentId: "can-tho-dep-002", appointmentDate: "2018-09-04", hireDate: "2010-09-01", status: "active" },

    { id: "can-tho-teacher-025", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-015"], code: "CT-GV-025", fullName: "Phan Văn Khải", gender: "male", birthDate: "1986-11-18", qualification: "university", teacherRank: "II", subjectIds: ["physics"], departmentId: "can-tho-dep-001", appointmentDate: "2017-09-06", hireDate: "2009-09-01", status: "active" },

    { id: "can-tho-teacher-026", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-015"], code: "CT-GV-026", fullName: "Nguyễn Thị Hạnh", gender: "female", birthDate: "1990-12-05", qualification: "university", teacherRank: "III", subjectIds: ["literature"], departmentId: "can-tho-dep-003", appointmentDate: "2020-09-03", hireDate: "2013-09-01", status: "active" },

    { id: "can-tho-teacher-027", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-015"], code: "CT-GV-027", fullName: "Trần Văn Bảo", gender: "male", birthDate: "1989-04-02", qualification: "university", teacherRank: "II", subjectIds: ["english"], departmentId: "can-tho-dep-004", appointmentDate: "2019-09-09", hireDate: "2012-09-01", status: "active" },

    { id: "can-tho-teacher-028", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-016"], code: "CT-GV-028", fullName: "Lê Thị Diễm Kiều", gender: "female", birthDate: "1993-01-12", qualification: "university", teacherRank: "III", subjectIds: ["biology"], departmentId: "can-tho-dep-002", appointmentDate: "2021-09-06", hireDate: "2016-09-01", status: "active" },

    { id: "can-tho-teacher-029", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-016"], code: "CT-GV-029", fullName: "Hoàng Văn Phương", gender: "male", birthDate: "1984-06-08", qualification: "university", teacherRank: "II", subjectIds: ["math"], departmentId: "can-tho-dep-001", appointmentDate: "2015-09-07", hireDate: "2006-09-01", status: "active" },

    { id: "can-tho-teacher-030", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-016"], code: "CT-GV-030", fullName: "Đỗ Thị Thu Hà", gender: "female", birthDate: "1987-08-16", qualification: "university", teacherRank: "II", subjectIds: ["chemistry"], departmentId: "can-tho-dep-002", appointmentDate: "2016-09-08", hireDate: "2008-09-01", status: "active" },

    { id: "can-tho-teacher-031", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001"], code: "CT-NV-001", fullName: "Huỳnh Thị Cẩm Vân", gender: "female", birthDate: "1978-03-25", qualification: "master", teacherRank: "II", subjectIds: [], departmentId: "can-tho-dep-005", appointmentDate: "2010-09-01", hireDate: "1999-09-01", status: "active" },

    { id: "can-tho-teacher-032", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001"], code: "CT-NV-002", fullName: "Phan Thị Tuyết Nhung", gender: "female", birthDate: "1985-10-09", qualification: "university", teacherRank: "II", subjectIds: [], departmentId: "can-tho-dep-005", appointmentDate: "2014-09-03", hireDate: "2006-09-01", status: "active" },

    { id: "can-tho-teacher-033", schoolId: "can-tho-school-001", campusIds: ["can-tho-campus-001"], code: "CT-NV-003", fullName: "Trịnh Văn Tâm", gender: "male", birthDate: "1982-02-14", qualification: "university", teacherRank: "II", subjectIds: [], departmentId: "can-tho-dep-005", appointmentDate: "2013-09-02", hireDate: "2004-09-01", status: "active" },
];