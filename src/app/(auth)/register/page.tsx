"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "@/lib/redux/features/authSlice";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {
            const result = await dispatch(register(values));
            if (result.type !== "auth/register/rejected") {
                router.push("/login");
            }
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            sign in to your account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Name"
                            type="text"
                            {...formik.getFieldProps("name")}
                            error={formik.touched.name && formik.errors.name}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            {...formik.getFieldProps("email")}
                            error={formik.touched.email && formik.errors.email}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...formik.getFieldProps("password")}
                            error={
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                    </div>

                    {error && (
                        <p className="text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <Button type="submit" fullWidth isLoading={loading}>
                        Register
                    </Button>
                </form>
            </div>
        </div>
    );
}
