"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateProfile, fetchProfile } from "@/lib/redux/features/authSlice";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

interface UpdateProfileData {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const {
        user,
        tokenUser,
        loading: fetchLoading,
        updateLoading,
        error,
    } = useSelector((state: RootState) => state.auth);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (tokenUser) {
            dispatch(fetchProfile());
        }
    }, [dispatch, tokenUser]);

    const formik = useFormik({
        initialValues: {
            name: user?.name || "",
            email: user?.email || "",
            currentPassword: "",
            newPassword: "",
        },
        enableReinitialize: true,

        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            currentPassword: Yup.string().test(
                "password-validation",
                "Current password is required when changing password",
                function (value) {
                    const { newPassword } = this.parent;
                    if (newPassword && !value) {
                        return false;
                    }
                    return true;
                }
            ),
            newPassword: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .test(
                    "password-validation",
                    "New password is required when current password is provided",
                    function (value) {
                        const { currentPassword } = this.parent;
                        if (currentPassword && !value) {
                            return false;
                        }
                        return true;
                    }
                ),
        }),
        onSubmit: async (values) => {
            setSuccessMessage("");

            const updateData: UpdateProfileData = {};
            if (values.name !== user?.name) updateData.name = values.name;
            if (values.email !== user?.email) updateData.email = values.email;
            if (values.newPassword) {
                updateData.currentPassword = values.currentPassword;
                updateData.newPassword = values.newPassword;
            }

            if (Object.keys(updateData).length === 0) {
                return;
            }

            const result = await dispatch(updateProfile(updateData));
            if (result.type !== "auth/updateProfile/rejected") {
                setSuccessMessage("Profile updated successfully");
                formik.setFieldValue("currentPassword", "");
                formik.setFieldValue("newPassword", "");
            }
        },
    });

    // Redirect to login if not authenticated
    if (!tokenUser) {
        router.push("/login");
    }

    return (
        <>
            <Header />
            {fetchLoading ? (
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6">
                        <LoadingSkeleton type="profile" />
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
                                Your Profile
                            </h2>
                            <p className="text-lg text-gray-600">
                                Manage your account settings and preferences
                            </p>
                        </div>

                        <form
                            className="space-y-8"
                            onSubmit={formik.handleSubmit}
                        >
                            {/* Profile Information Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Personal Information
                                </h3>
                                <div className="space-y-6">
                                    <Input
                                        label="Name"
                                        type="text"
                                        {...formik.getFieldProps("name")}
                                        error={
                                            formik.touched.name &&
                                            formik.errors.name
                                        }
                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                        disabled={updateLoading}
                                    />
                                    <Input
                                        label="Email address"
                                        type="email"
                                        {...formik.getFieldProps("email")}
                                        error={
                                            formik.touched.email &&
                                            formik.errors.email
                                        }
                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                        disabled={updateLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Change Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    Change Password
                                </h3>
                                <div className="space-y-6">
                                    <Input
                                        label="Current password"
                                        type="password"
                                        {...formik.getFieldProps(
                                            "currentPassword"
                                        )}
                                        error={
                                            formik.touched.currentPassword &&
                                            formik.errors.currentPassword
                                        }
                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                        disabled={updateLoading}
                                    />
                                    <Input
                                        label="New password"
                                        type="password"
                                        {...formik.getFieldProps("newPassword")}
                                        error={
                                            formik.touched.newPassword &&
                                            formik.errors.newPassword
                                        }
                                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                                        disabled={updateLoading}
                                    />
                                </div>
                            </div>

                            {/* Feedback Messages */}
                            <div className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-lg transition-all duration-200">
                                        <p className="text-center text-sm font-medium">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="bg-green-50 text-green-700 p-4 rounded-lg transition-all duration-200">
                                        <p className="text-center text-sm font-medium">
                                            {successMessage}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="mt-6"
                                    isLoading={updateLoading}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
