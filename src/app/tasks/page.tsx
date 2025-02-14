"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
} from "@/lib/redux/features/taskSlice";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import type { Task } from "@/types/task";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Header from "@/components/ui/Header";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { Check, Edit2, Trash } from "lucide-react";

const taskSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    dueDate: Yup.string().required("Due date is required"),
});

export default function TasksPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, loading, error } = useSelector(
        (state: RootState) => state.tasks
    );
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const addFormik = useFormik({
        initialValues: {
            title: "",
            description: "",
            dueDate: "",
        },
        validationSchema: taskSchema,
        onSubmit: async (values, { resetForm }) => {
            const result = await dispatch(addTask(values));
            if (result.type !== "tasks/addTask/rejected") {
                resetForm();
                setIsAddModalOpen(false);
            }
        },
    });

    const editFormik = useFormik({
        initialValues: {
            title: editingTask?.title || "",
            description: editingTask?.description || "",
            dueDate: editingTask?.dueDate?.split("T")[0] || "",
        },
        validationSchema: taskSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (editingTask) {
                const result = await dispatch(
                    updateTask({ taskId: editingTask._id, data: values })
                );
                if (result.type !== "tasks/updateTask/rejected") {
                    setEditingTask(null);
                }
            }
        },
    });

    const handleStatusUpdate = async (
        taskId: string,
        newStatus: "completed" | "pending"
    ) => {
        setUpdatingTaskId(taskId);
        await dispatch(
            updateTask({
                taskId,
                data: {
                    status: newStatus,
                },
            })
        );
        setUpdatingTaskId(null);
    };

    const handleDelete = async (taskId: string) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await dispatch(deleteTask(taskId));
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Tasks</h1>
                {loading && tasks.length === 0 ? (
                    <LoadingSkeleton type="task" count={3} />
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-12 text-center shadow-md">
                        <p className="text-xl text-gray-600">No tasks yet</p>
                        <Button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Create your first task
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] ${
                                    updatingTaskId === task._id
                                        ? "opacity-70"
                                        : ""
                                }`}
                            >
                                <div className="relative">
                                    <div className="mb-5 flex flex-col space-y-3">
                                        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                                            {task.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {task.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 mt-2">
                                            <p className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                                <span className="mr-1">📅</span>
                                                Due:{" "}
                                                {new Date(
                                                    task.dueDate
                                                ).toLocaleDateString()}
                                            </p>
                                            <p
                                                className={`inline-flex items-center text-sm px-3 py-1 rounded-full ${
                                                    task.status === "completed"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-blue-50 text-blue-600"
                                                }`}
                                            >
                                                <span className="mr-1">
                                                    {task.status === "completed"
                                                        ? "✓"
                                                        : "⧖"}
                                                </span>
                                                {task.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <Button
                                            className={`rounded-lg px-3 py-2 transition-all duration-200 ${
                                                task.status === "completed"
                                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                            }`}
                                            type="button"
                                            isLoading={
                                                updatingTaskId === task._id
                                            }
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    task._id,
                                                    task.status === "completed"
                                                        ? "pending"
                                                        : "completed"
                                                )
                                            }
                                        >
                                            <Check className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition-all duration-200 hover:bg-blue-100"
                                            type="button"
                                            onClick={() => setEditingTask(task)}
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="rounded-lg bg-red-50 px-3 py-2 text-red-600 transition-all duration-200 hover:bg-red-100"
                                            type="button"
                                            onClick={() =>
                                                handleDelete(task._id)
                                            }
                                        >
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(isAddModalOpen || editingTask) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    {editingTask ? "Edit Task" : "Add New Task"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingTask(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>
                            <form
                                onSubmit={
                                    editingTask
                                        ? editFormik.handleSubmit
                                        : addFormik.handleSubmit
                                }
                                className="space-y-4"
                            >
                                <Input
                                    label="Title"
                                    {...(editingTask
                                        ? editFormik.getFieldProps("title")
                                        : addFormik.getFieldProps("title"))}
                                    error={
                                        editingTask
                                            ? editFormik.touched.title &&
                                              editFormik.errors.title
                                            : addFormik.touched.title &&
                                              addFormik.errors.title
                                    }
                                />
                                <Input
                                    label="Description"
                                    type="textarea"
                                    {...(editingTask
                                        ? editFormik.getFieldProps(
                                              "description"
                                          )
                                        : addFormik.getFieldProps(
                                              "description"
                                          ))}
                                    error={
                                        editingTask
                                            ? editFormik.touched.description &&
                                              editFormik.errors.description
                                            : addFormik.touched.description &&
                                              addFormik.errors.description
                                    }
                                />
                                <Input
                                    type="date"
                                    label="Due Date"
                                    {...(editingTask
                                        ? editFormik.getFieldProps("dueDate")
                                        : addFormik.getFieldProps("dueDate"))}
                                    error={
                                        editingTask
                                            ? editFormik.touched.dueDate &&
                                              editFormik.errors.dueDate
                                            : addFormik.touched.dueDate &&
                                              addFormik.errors.dueDate
                                    }
                                />
                                <div className="flex space-x-2">
                                    <Button
                                        type="submit"
                                        isLoading={loading}
                                        fullWidth
                                    >
                                        {editingTask
                                            ? "Save Changes"
                                            : "Add Task"}
                                    </Button>
                                    {editingTask && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setEditingTask(null)}
                                            fullWidth
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Floating Action Button */}
                {tasks.length > 0 && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        +
                    </button>
                )}

                {error && (
                    <p className="mt-4 text-center text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </>
    );
}
