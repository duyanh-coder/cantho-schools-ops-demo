import CrudManager from "@/components/dashboard/CrudManager";

import {
    ReadOutlined,
    SwapOutlined,
    TeamOutlined,
    WomanOutlined,
} from "@ant-design/icons";

import type {
    Student,
    Transcript,
    EnrolmentChange,
} from "@/mock/common/types";

import {
    canThoMockData,
} from "@/mock";

import {
    subjects,
} from "@/mock/common";

import type {
    CrudField,
    CrudKpi,
} from "@/components/dashboard/CrudManager";

import type {
    TabsProps,
} from "antd";

import {
    Tabs,
} from "antd";



const genderOptions = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
];

const studentStatusOptions = [
    { value: "studying", label: "Đang học" },
    { value: "suspended", label: "Tạm nghỉ" },
    { value: "graduated", label: "Đã tốt nghiệp" },
];

const campusOptions = canThoMockData.campuses.map((campus) => ({
    value: campus.id,
    label: campus.name,
}));

const classOptions = canThoMockData.classes.map((classItem) => ({
    value: classItem.id,
    label: classItem.name,
}));

const transcriptStudentOptions = canThoMockData.students.map((student) => ({
    value: student.id,
    label: student.fullName,
}));

const studentNameOptions = transcriptStudentOptions.map((option) => ({
    value: option.label,
    label: option.label,
}));

const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
}));

const semesterOptions = [
    { value: 1, label: "HK1" },
    { value: 2, label: "HK2" },
];

const conductOptions = [
    { value: "Tốt", label: "Tốt" },
    { value: "Khá", label: "Khá" },
    { value: "Đạt", label: "Đạt" },
];

const changeTypeOptions = [
    { value: "increase", label: "Nhập học / tăng" },
    { value: "decrease", label: "Thôi học / giảm" },
];

const changeStatusOptions = [
    { value: "pending", label: "Chờ duyệt" },
    { value: "approved", label: "Đã duyệt" },
];


const studentFields: CrudField<Student>[] = [
    {
        name: "fullName",
        label: "Họ và tên",
        required: true,
        tableWidth: 200,
    },
    {
        name: "code",
        label: "Mã học sinh",
        required: true,
        tableWidth: 120,
        hideInForm: true,
    },
    {
        name: "gender",
        label: "Giới tính",
        required: true,
        type: "select",
        options: genderOptions,
        tableWidth: 100,
    },
    {
        name: "dob",
        label: "Ngày sinh",
        required: true,
        type: "date",
        tableWidth: 120,
    },
    {
        name: "campusId",
        label: "Cơ sở",
        required: true,
        type: "select",
        options: campusOptions,
        tableWidth: 200,
    },
    {
        name: "classId",
        label: "Lớp",
        required: true,
        type: "select",
        options: classOptions,
        tableWidth: 120,
    },
    {
        name: "guardianPhone",
        label: "SĐT phụ huynh",
        required: true,
        tableWidth: 130,
    },
    {
        name: "address",
        label: "Địa chỉ cư trú",
        type: "textarea",
        span: 24,
        tableWidth: 200,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: studentStatusOptions,
        initialValue: "studying",
        tableWidth: 120,
    },
];

const transcriptFields: CrudField<Transcript>[] = [
    {
        name: "studentId",
        label: "Học sinh",
        required: true,
        type: "select",
        options: studentNameOptions,
        tableWidth: 190,
    },
    {
        name: "subjectId",
        label: "Môn học",
        required: true,
        type: "select",
        options: subjectOptions,
        tableWidth: 130,
    },
    {
        name: "semester",
        label: "Học kỳ",
        required: true,
        type: "select",
        options: semesterOptions,
        tableWidth: 100,
    },
    {
        name: "academicYear",
        label: "Năm học",
        required: true,
        tableWidth: 120,
        initialValue: "2026-2027",
    },
    {
        name: "score",
        label: "Điểm TB môn",
        required: true,
        type: "number",
        min: 0,
        max: 10,
        tableWidth: 120,
        sorter: true,
    },
    {
        name: "conduct",
        label: "Hạnh kiểm",
        required: true,
        type: "select",
        options: conductOptions,
        tableWidth: 110,
    },
];

const enrolmentChangeFields: CrudField<EnrolmentChange>[] = [
    {
        name: "studentName",
        label: "Học sinh",
        required: true,
        type: "select",
        options: studentNameOptions,
        tableWidth: 190,
    },
    {
        name: "campusId",
        label: "Cơ sở",
        required: true,
        type: "select",
        options: campusOptions,
        tableWidth: 200,
    },
    {
        name: "classId",
        label: "Lớp",
        required: true,
        type: "select",
        options: classOptions,
        tableWidth: 120,
    },
    {
        name: "changeType",
        label: "Loại biến động",
        required: true,
        type: "select",
        options: changeTypeOptions,
        tableWidth: 160,
    },
    {
        name: "effectiveDate",
        label: "Ngày hiệu lực",
        required: true,
        type: "date",
        tableWidth: 130,
    },
    {
        name: "reason",
        label: "Lý do",
        type: "textarea",
        span: 24,
        tableWidth: 220,
    },
    {
        name: "status",
        label: "Trạng thái",
        required: true,
        type: "select",
        options: changeStatusOptions,
        initialValue: "pending",
        tableWidth: 120,
    },
];


const studentKpis: CrudKpi[] = [
    {
        title: "Đang học",
        value: canThoMockData.students.filter(
            (item) => item.status === "studying",
        ).length,
        icon: <TeamOutlined />,
        tone: "blue",
        note: "toàn trường",
    },
    {
        title: "Học sinh nữ",
        value: canThoMockData.students.filter(
            (item) => item.gender === "female",
        ).length,
        icon: <WomanOutlined />,
        tone: "purple",
        note: "chiếm ~49%",
    },
    {
        title: "Điểm TB môn HK1",
        value: (
            canThoMockData.transcripts.reduce(
                (total, item) => total + item.score,
                0,
            ) / canThoMockData.transcripts.length
        ).toFixed(1),
        icon: <ReadOutlined />,
        tone: "green",
        note: "/10 toàn trường",
    },
    {
        title: "Biến động sỉ số",
        value: canThoMockData.enrolmentChanges.length,
        icon: <SwapOutlined />,
        tone: "orange",
        note: `+${canThoMockData.enrolmentChanges.filter((item) => item.changeType === "increase").length} / -${canThoMockData.enrolmentChanges.filter((item) => item.changeType === "decrease").length}`,
    },
];


const items: TabsProps["items"] = [
    {
        key: "students",
        label: "Danh sách học sinh",
        children: (
            <CrudManager<Student>
                eyebrow="TUYỂN SINH & HỒ SƠ HỌC SINH"
                title="Học sinh các khối lớp"
                description="Quản lý hồ sơ học sinh từ khối 6 đến khối 9 phân bổ tại 6 cơ sở của Trường THCS Ninh Kiều."
                storageKey="can-tho-students"
                seed={canThoMockData.students}
                fields={studentFields}
                kpis={studentKpis}
                entityName="học sinh"
                newLabel="Thêm học sinh"
            />
        ),
    },
    {
        key: "transcripts",
        label: "Học bạ số",
        children: (
            <CrudManager<Transcript>
                eyebrow="HỌC BẠ SỐ"
                title="Điểm học bạ theo môn & học kỳ"
                description="Nhập điểm trung bình môn, xếp loại hạnh kiểm cho từng học sinh theo học kỳ và năm học."
                storageKey="can-tho-transcripts"
                seed={canThoMockData.transcripts}
                fields={transcriptFields}
                entityName="học bạ"
                newLabel="Thêm học bạ"
            />
        ),
    },
    {
        key: "enrolment-changes",
        label: "Biến động sỉ số",
        children: (
            <CrudManager<EnrolmentChange>
                eyebrow="BIẾN ĐỘNG SỈ SỐ"
                title="Cập nhật sỉ số – nhập / thôi học"
                description="Theo dõi nhập học, chuyển đi/đến, thôi học ảnh hưởng đến sỉ số từng lớp, từng cơ sở."
                storageKey="can-tho-enrolment-changes"
                seed={canThoMockData.enrolmentChanges}
                fields={enrolmentChangeFields}
                entityName="biến động sỉ số"
                newLabel="Thêm biến động"
            />
        ),
    },
];


const StudentsPage = () => {
    return (
        <div className="students-page">
            <Tabs
                defaultActiveKey="students"
                items={items}
                tabBarStyle={{ margin: 0 }}
            />
        </div>
    );
};


export default StudentsPage;
