import mongoose from "mongoose";

export interface ITask {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    dueDate: Date;
    status: "pending" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
