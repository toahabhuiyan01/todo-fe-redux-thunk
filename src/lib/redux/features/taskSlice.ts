import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "pending" | "completed";
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("tasks");
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to fetch tasks";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (
        task: { title: string; description: string; dueDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("tasks", task);
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to add task";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async (
        { taskId, data }: { taskId: string; data: Partial<Task> },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(`tasks/${taskId}`, data);
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to update task";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (taskId: string, { rejectWithValue }) => {
        try {
            await axios.delete(`tasks/${taskId}`);
            return taskId;
        } catch (error) {
            let errorMessage = "Failed to delete task";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchTasks.fulfilled,
                (state, action: PayloadAction<Task[]>) => {
                    state.loading = false;
                    state.tasks = action.payload;
                }
            )
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add Task
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                addTask.fulfilled,
                (state, action: PayloadAction<Task>) => {
                    state.loading = false;
                    state.tasks.unshift(action.payload);
                }
            )
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateTask.fulfilled,
                (state, action: PayloadAction<Task>) => {
                    state.loading = false;
                    const index = state.tasks.findIndex(
                        (task) => task._id === action.payload._id
                    );
                    if (index !== -1) {
                        state.tasks[index] = action.payload;
                    }
                }
            )
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                deleteTask.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.loading = false;
                    state.tasks = state.tasks.filter(
                        (task) => task._id !== action.payload
                    );
                }
            )
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
