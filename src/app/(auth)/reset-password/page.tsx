"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/lib/redux/features/authSlice";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [password, setPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            return;
        }
        const result = await dispatch(resetPassword({ token, password }));
        if (result.type !== "auth/resetPassword/rejected") {
            setIsSubmitted(true);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Invalid Reset Link
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        This password reset link is invalid or has expired.
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/forgot-password"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Password Reset Complete
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your password has been reset successfully.
                    </p>
                    <div className="mt-4">
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign in with your new password
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="New password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <Button type="submit" fullWidth isLoading={loading}>
                        Reset password
                    </Button>
                </form>
            </div>
        </div>
    );
}
