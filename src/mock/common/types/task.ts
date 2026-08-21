export interface TaskItem {
    id: string;

    campusId?: string;

    title: string;

    description?: string;

    assigneeId?: string;

    dueDate?: string;

    status: "todo" | "in_progress" | "completed";
}