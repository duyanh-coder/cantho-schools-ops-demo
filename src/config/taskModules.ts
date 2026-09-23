export interface TaskHint {
    module: string;

    color: string;

    iconKey: string;
}

const moduleByTitle:
    Record<string, string> = {
        "văn bản điện tử": "/operations/documents",
        "thời khóa biểu": "/operations/timetable",
        "trường & cơ sở": "/operations/schools",
        "nhân sự": "/operations/schools?tab=personnel",
        "khối & tổ": "/operations/schools?tab=sectors",
        "học sinh": "/operations/students",
        "báo cáo": "/operations/reports",
        "cảnh báo": "/operations/alerts",
        "trợ lý ai": "/operations/chatbot",
        "bản đồ gis": "/operations/gis",
        "danh mục": "/operations/catalogs",
    };

export const taskModuleHints:
    Array<{
        match: string[];

        module: string;

        color: string;

        iconKey: string;
    }> = [
        {
            match: ["thời khóa biểu"],
            module: "thời khóa biểu",
            color: "blue",
            iconKey: "timetable",
        },
        {
            match: ["điểm danh"],
            module: "học sinh",
            color: "purple",
            iconKey: "student",
        },
        {
            match: ["cơ sở vật chất", "cơ sở"],
            module: "trường & cơ sở",
            color: "green",
            iconKey: "school",
        },
        {
            match: ["phân công nhiệm vụ"],
            module: "nhân sự",
            color: "blue",
            iconKey: "personnel",
        },
        {
            match: ["văn bản"],
            module: "văn bản điện tử",
            color: "orange",
            iconKey: "document",
        },
        {
            match: ["danh sách lớp", "lớp"],
            module: "học sinh",
            color: "purple",
            iconKey: "student",
        },
        {
            match: ["báo cáo"],
            module: "báo cáo",
            color: "green",
            iconKey: "report",
        },
    ];

export const getTaskHint = (
    title: string,
): TaskHint => {
    const hint =
        taskModuleHints.find(
            (entry) =>
                entry.match.some(
                    (word) =>
                        title
                            .toLowerCase()
                            .includes(
                                word,
                            ),
                ),
        );

    if (hint) {
        return {
            module: hint.module,
            color: hint.color,
            iconKey: hint.iconKey,
        };
    }

    return {
        module: "cảnh báo",
        color: "red",
        iconKey: "alert",
    };
};

export const modulePathByHint = (
    hint: TaskHint,
): string => {
    return (
        moduleByTitle[
            hint.module.toLowerCase()
        ] ??
        "/operations/alerts"
    );
};