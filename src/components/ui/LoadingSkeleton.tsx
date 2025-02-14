"use client";

interface LoadingSkeletonProps {
    type?: "task" | "profile";
    count?: number;
}

export default function LoadingSkeleton({
    type = "task",
    count = 3,
}: LoadingSkeletonProps) {
    if (type === "profile") {
        return (
            <div className="space-y-8">
                <div className="text-center mb-12">
                    <div className="h-10 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
                        <div className="space-y-6">
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
                        <div className="space-y-6">
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-lg bg-white p-6 shadow-md animate-pulse"
                >
                    <div className="mb-4">
                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                        <div className="mt-4 h-4 w-full bg-gray-200 rounded"></div>
                        <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded"></div>
                        <div className="mt-2 h-4 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="h-10 w-32 bg-gray-200 rounded"></div>
                        <div className="h-10 w-20 bg-gray-200 rounded"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
