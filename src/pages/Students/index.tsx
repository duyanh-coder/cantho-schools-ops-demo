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

import {
    useCatalogOptions,
} from "@/store/useCatalog";

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


const buildStudentFields = (
    genderOptions: Array<{ value: string | number; label: string }>,
    studentStatusOptions: Array<{ value: string | number; label: string }>,
    campusOptionsArg: Array<{ value: string | number; label: string }>,
    classOptionsArg: Array<{ value: string | number; label: string }>,
): CrudField<Student>[] => [
    {
        name: "code",
        label: "Mã học sinh",
        required: true,
        tableWidth: 110,
        hideInForm: true,
    },
    {
        name: "fullName",
        label: "Họ và tên",
        required: true,
        tableWidth: 200,
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
        table: false,
    },
    {
        name: "campusId",
        label: "Cơ sở",
        required: true,
        type: "select",
        options: campusOptionsArg,
        tableWidth: 200,
    },
    {
        name: "classId",
        label: "Lớp",
        required: true,
        type: "select",
        options: classOptionsArg,
        tableWidth: 120,
    },
    {
        name: "guardianPhone",
        label: "SĐT phụ huynh",
        required: true,
        tableWidth: 130,
        table: false,
    },
    {
        name: "address",
        label: "Địa chỉ cư trú",
        type: "textarea",
        span: 24,
        tableWidth: 200,
        table: false,
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

const buildTranscriptFields = (
    semesterOptions: Array<{ value: string | number; label: string }>,
    conductOptions: Array<{ value: string | number; label: string }>,
): CrudField<Transcript>[] => [
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

const buildEnrolmentChangeFields = (
    changeTypeOptions: Array<{ value: string | number; label: string }>,
    changeStatusOptions: Array<{ value: string | number; label: string }>,
    campusOptionsArg: Array<{ value: string | number; label: string }>,
    classOptionsArg: Array<{ value: string | number; label: string }>,
): CrudField<EnrolmentChange>[] => [
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
        options: campusOptionsArg,
        tableWidth: 200,
    },
    {
        name: "classId",
        label: "Lớp",
        required: true,
        type: "select",
        options: classOptionsArg,
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
        table: false,
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


const buildScopedStudentKpis = (
    scopedStudents: Student[],
    scopedTranscripts: Transcript[],
    scopedEnrolments: EnrolmentChange[],
): CrudKpi[] => [
    {
        title: "Đang học",
        value: scopedStudents.filter(
            (item) => item.status === "studying",
        ).length,
        icon: <TeamOutlined />,
        tone: "blue",
        note: "toàn trường",
    },
    {
        title: "Học sinh nữ",
        value: scopedStudents.filter(
            (item) => item.gender === "female",
        ).length,
        icon: <WomanOutlined />,
        tone: "purple",
        note: "chiếm ~49%",
    },
    {
        title: "Điểm TB môn HK1",
        value: (
            scopedTranscripts.reduce(
                (total, item) => total + item.score,
                0,
            ) / (scopedTranscripts.length || 1)
        ).toFixed(1),
        icon: <ReadOutlined />,
        tone: "green",
        note: "/10 toàn trường",
    },
    {
        title: "Biến động sỉ số",
        value: scopedEnrolments.length,
        icon: <SwapOutlined />,
        tone: "orange",
        note: `+${scopedEnrolments.filter((item) => item.changeType === "increase").length} / -${scopedEnrolments.filter((item) => item.changeType === "decrease").length}`,
    },
];


const buildItems = (
    studentFields: CrudField<Student>[],
    transcriptFields: CrudField<Transcript>[],
    enrolmentChangeFields: CrudField<EnrolmentChange>[],
    scopedStudents: Student[],
    scopedTranscripts: Transcript[],
    scopedEnrolments: EnrolmentChange[],
    schoolId: string | undefined,
    schoolName: string | undefined,
): TabsProps["items"] => {

    const scopedStudentIds = new Set(
        scopedStudents.map((item) => item.id),
    );

    const scopedStudentKpis =
        buildScopedStudentKpis(
            scopedStudents,
            scopedTranscripts,
            scopedEnrolments,
        );

    return [
        {
            key: "students",
            label: "Danh sách học sinh",
            children: (
                <CrudManager<Student>
                    eyebrow="TUYỂN SINH & HỒ SƠ HỌC SINH"
                    title="Học sinh các khối lớp"
                    description={
                        schoolId
                            ? `Quản lý hồ sơ học sinh trong nhà trường ${schoolName ?? "đang chọn"}, phân bổ tại các cơ sở trực thuộc.`
                            : "Quản lý hồ sơ học sinh từ khối 6 đến khối 9 phân bổ tại 6 cơ sở của Trường THCS Ninh Kiều."
                    }
                    storageKey="can-tho-students"
                    seed={canThoMockData.students}
                    itemFilter={
                        schoolId
                            ? (item) => item.schoolId === schoolId
                            : undefined
                    }
                    createDefaults={
                        schoolId
                            ? { schoolId }
                            : undefined
                    }
                    fields={studentFields}
                    kpis={scopedStudentKpis}
                    filters={[
                        { field: "gender" },
                        { field: "campusId" },
                        { field: "classId" },
                        { field: "status" },
                    ]}
                    entityName="học sinh"
                    newLabel="Thêm học sinh"
                    detail
                    detailWidth={1000}
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
                    itemFilter={
                        schoolId
                            ? (item) => scopedStudentIds.has(item.studentId)
                            : undefined
                    }
                    fields={transcriptFields}
                    kpis={[
                        {
                            title: "Học bạ đang quản lý",
                            value: scopedTranscripts.length,
                            icon: <ReadOutlined />,
                            tone: "blue",
                            note: "bản ghi điểm",
                        },
                    ]}
                    filters={[
                        { field: "semester" },
                        { field: "subjectId" },
                        { field: "conduct" },
                    ]}
                    entityName="học bạ"
                    newLabel="Thêm học bạ"
                    detail
                    detailWidth={900}
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
                    itemFilter={
                        schoolId
                            ? (item) => item.schoolId === schoolId
                            : undefined
                    }
                    createDefaults={
                        schoolId
                            ? { schoolId }
                            : undefined
                    }
                    fields={enrolmentChangeFields}
                    kpis={[
                        {
                            title: "Biến động sỉ số",
                            value: scopedEnrolments.length,
                            icon: <SwapOutlined />,
                            tone: "orange",
                            note: `+${scopedEnrolments.filter((item) => item.changeType === "increase").length} / -${scopedEnrolments.filter((item) => item.changeType === "decrease").length}`,
                        },
                    ]}
                    filters={[
                        { field: "classId" },
                        { field: "campusId" },
                        { field: "changeType" },
                        { field: "status" },
                    ]}
                    entityName="biến động sỉ số"
                    newLabel="Thêm biến động"
                    detail
                    detailWidth={900}
                />
            ),
        },
    ];
};


const StudentsPage = ({
    schoolId,
}: {
    schoolId?: string;
}) => {
    const genderOptions =
        useCatalogOptions(
            "gender",
        );

    const studentStatusOptions =
        useCatalogOptions(
            "student-status",
        );

    const semesterOptions =
        useCatalogOptions(
            "semester",
        );

    const conductOptions =
        useCatalogOptions(
            "conduct",
        );

    const changeTypeOptions =
        useCatalogOptions(
            "enrolment-type",
        );

    const changeStatusOptions =
        useCatalogOptions(
            "enrolment-status",
        );

    const school =
        canThoMockData.schools.find(
            (candidate) => candidate.id === schoolId,
        );

    const scopedCampuses =
        schoolId
            ? canThoMockData.campuses.filter(
                (candidate) => candidate.schoolId === schoolId,
            )
            : canThoMockData.campuses;

    const scopedClasses =
        schoolId
            ? canThoMockData.classes.filter(
                (candidate) => candidate.schoolId === schoolId,
            )
            : canThoMockData.classes;

    const scopedStudents =
        schoolId
            ? canThoMockData.students.filter(
                (item) => item.schoolId === schoolId,
            )
            : canThoMockData.students;

    const scopedStudentIds = new Set(
        scopedStudents.map((item) => item.id),
    );

    const scopedTranscripts =
        schoolId
            ? canThoMockData.transcripts.filter(
                (item) => scopedStudentIds.has(item.studentId),
            )
            : canThoMockData.transcripts;

    const scopedEnrolments =
        schoolId
            ? canThoMockData.enrolmentChanges.filter(
                (item) => item.schoolId === schoolId,
            )
            : canThoMockData.enrolmentChanges;

    const scopedCampusOptions =
        scopedCampuses.map((campus) => ({
            value: campus.id,
            label: campus.name,
        }));

    const scopedClassOptions =
        scopedClasses.map((classItem) => ({
            value: classItem.id,
            label: classItem.name,
        }));

    const studentFields =
        buildStudentFields(
            genderOptions,
            studentStatusOptions,
            scopedCampusOptions,
            scopedClassOptions,
        );

    const transcriptFields =
        buildTranscriptFields(
            semesterOptions,
            conductOptions,
        );

    const enrolmentChangeFields =
        buildEnrolmentChangeFields(
            changeTypeOptions,
            changeStatusOptions,
            scopedCampusOptions,
            scopedClassOptions,
        );

    const items =
        buildItems(
            studentFields,
            transcriptFields,
            enrolmentChangeFields,
            scopedStudents,
            scopedTranscripts,
            scopedEnrolments,
            schoolId,
            school?.name,
        );

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
