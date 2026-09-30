import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildCampusDetail,
    campusDetailFields,
    CAMPUS_STATUS_LABELS,
    CAMPUS_TYPE_LABELS,
    formatCoordinates,
    summarizeCampusPersonnel,
} from "@/utils/campusDetail";

import {
    canThoCampuses,
    canThoClasses,
    canThoMockData,
    canThoPersonnel,
    canThoRooms,
    canThoStudents,
} from "@/mock/canTho";


describe("formatCoordinates", () => {
    it("làm tròn 6 chữ số thập phân", () => {
        expect(formatCoordinates(10.03580839481783, 105.78470548758524))
            .toBe("10.035808, 105.784705");
    });

    it("trả về chuỗi rỗng khi toạ độ không hợp lệ", () => {
        expect(formatCoordinates(Number.NaN, 105)).toBe("Chưa có dữ liệu");

        expect(formatCoordinates(10, Number.POSITIVE_INFINITY))
            .toBe("Chưa có dữ liệu");
    });
});


describe("summarizeCampusPersonnel", () => {
    it("chỉ tính nhân sự được phân công cho cơ sở", () => {
        const summary = summarizeCampusPersonnel(canThoPersonnel, "campus-main");

        // Nhân sự phân công theo danh sách campusIds nên không vượt quá tổng.
        expect(summary).toContain("Tổng:");

        const total = Number(summary.split("Tổng: ")[1]);

        expect(total).toBeGreaterThan(0);

        expect(total).toBeLessThanOrEqual(canThoPersonnel.length);
    });

    it("trả chuỗi rỗng khi cơ sở không có nhân sự", () => {
        expect(summarizeCampusPersonnel(canThoPersonnel, "khong-co"))
            .toContain("Tổng: 0");
    });
});


describe("buildCampusDetail", () => {
    const mainCampus = canThoCampuses.find((item) => item.id === "campus-main");

    if (!mainCampus) {
        throw new Error("Thiếu cơ sở campus-main trong dữ liệu mock");
    }

    const detail = buildCampusDetail({
        campus: mainCampus,

        school: canThoMockData.schools.find(
            (school) => school.id === mainCampus.schoolId,
        ),

        ward: canThoMockData. wards.find(
            (ward) => ward.id === mainCampus.wardId,
        ),

        classes: canThoClasses.filter((item) =>
            item.campusId === mainCampus.id),

        rooms: canThoRooms.filter((room) => room.campusId === mainCampus.id),

        personnel: canThoPersonnel,

        students: canThoStudents,
    });

    it("lấy tên trường và phường nghiệp vụ theo hồ sơ", () => {
        expect(detail.schoolName).toBe("Trường THCS Ninh Kiều");

        expect(detail.wardName).toBe("Phường Ninh Kiều");
    });

    it("quy đổi loại và trạng thái sang nhãn tiếng Việt", () => {
        expect(detail.campusType)
            .toBe(CAMPUS_TYPE_LABELS.HEADQUARTERS);

        expect(detail.status).toBe(CAMPUS_STATUS_LABELS.ACTIVE);
    });

    it("chỉ đếm học sinh thuộc lớp của cơ sở", () => {
        const classIds = new Set(
            canThoClasses
                .filter((item) => item.campusId === mainCampus.id)
                .map((item) => item.id),
        );

        const expected = canThoStudents.filter((student) =>
            student.classId !== undefined && classIds.has(student.classId),
        ).length;

        expect(detail.studentCount).toBe(expected);
    });

    it("tách phòng học và phòng chức năng", () => {
        const rooms = canThoRooms.filter((room) =>
            room.campusId === mainCampus.id);

        expect(detail.classroomCount + detail.functionRoomCount)
            .toBe(detail.roomCount);

        expect(detail.roomCount).toBe(rooms.length);
    });

    it("bù thông tin thiếu bằng chuỗi rõ ràng", () => {
        const bare = buildCampusDetail({
            campus: { ...mainCampus, phone: undefined, email: undefined, managerId: undefined },
        });

        expect(bare.phone).toBe("Chưa có dữ liệu");

        expect(bare.email).toBe("Chưa có dữ liệu");

        expect(bare.schoolName).toBe("Chưa có dữ liệu");

        expect(bare.wardName).toBe("Chưa có dữ liệu");
    });
});


describe("campusDetailFields", () => {
    it("đúng 16 trường với nhãn không trùng lặp", () => {
        const campus = canThoCampuses[0];

        const fields = campusDetailFields(buildCampusDetail({ campus }));

        expect(fields).toHaveLength(16);

        expect(new Set(fields.map((field) => field.key)).size).toBe(16);

        expect(new Set(fields.map((field) => field.label)).size).toBe(16);
    });

    it("mọi trường đều có nhãn và giá trị", () => {
        const campus = canThoCampuses[0];

        const fields = campusDetailFields(buildCampusDetail({ campus }));

        fields.forEach((field) => {
            expect(field.label.length).toBeGreaterThan(0);

            expect(field.value.length).toBeGreaterThan(0);
        });
    });
});