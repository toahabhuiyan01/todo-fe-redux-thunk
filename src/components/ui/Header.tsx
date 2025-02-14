"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/redux/features/authSlice";
import type { AppDispatch, RootState } from "@/lib/redux/store";
import Button from "./Button";

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        router.push("/login");
    };

    if (!user) {
        return null;
    }

    return (
        <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                        >
                            Naria
                        </Link>
                        <nav className="hidden md:flex space-x-4">
                            <Link
                                href="/tasks"
                                className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                            >
                                Tasks
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-sm font-medium text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full">
                            {user.name}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLogout}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-medium"
                        >
                            Sign out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
