export interface Subject {
    id: string;
    code: string;
    name: string;
}

export const subjects: Subject[] = [
    {
        id: "math",
        code: "TOAN",
        name: "Toán",
    },
    {
        id: "literature",
        code: "VAN",
        name: "Ngữ văn",
    },
    {
        id: "english",
        code: "ANH",
        name: "Tiếng Anh",
    },
    {
        id: "physics",
        code: "LY",
        name: "Vật lý",
    },
    {
        id: "chemistry",
        code: "HOA",
        name: "Hóa học",
    },
    {
        id: "biology",
        code: "SINH",
        name: "Sinh học",
    },
];