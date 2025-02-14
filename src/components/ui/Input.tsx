import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string | boolean;
    fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    className,
    fullWidth = true,
    type = "text",
    ...props
}) => {
    const inputId = React.useId();

    return (
        <div
            className={twMerge("flex flex-col gap-1.5", fullWidth && "w-full")}
        >
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={twMerge(
                    "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    error &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500",
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
