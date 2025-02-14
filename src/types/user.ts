export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues extends LoginFormValues {
    name: string;
}

export interface UpdateProfileValues {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
}
