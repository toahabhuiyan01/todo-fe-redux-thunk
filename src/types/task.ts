export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "pending" | "completed";
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskFormValues {
    title: string;
    description: string;
    dueDate: string;
}

export interface UpdateTaskValues extends TaskFormValues {
    status?: "pending" | "completed";
}

export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}
