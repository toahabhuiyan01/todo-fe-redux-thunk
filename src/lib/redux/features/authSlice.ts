import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { decode } from "jsonwebtoken";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

interface User {
    id: string;
    name: string;
    email: string;
}

interface TokenUser {
    userId: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    tokenUser?: TokenUser;
    isAuthenticated: boolean;
    loading: boolean;
    updateLoading: boolean;
    error: string | null;
}

const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

const initialState: AuthState = {
    user: null,
    token,
    tokenUser: token ? (decode(token) as TokenUser) : undefined,
    isAuthenticated: false,
    loading: false,
    updateLoading: false,
    error: null,
};

export const register = createAsyncThunk(
    "auth/register",
    async (
        credentials: { name: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("auth/register", credentials);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            let errorMessage = "Registration failed";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post("auth/login", credentials);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            let errorMessage = "Login failed";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await axios.post("auth/forgot-password", {
                email,
            });
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to send reset email";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (data: { token: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post("auth/reset-password", data);
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to reset password";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchProfile = createAsyncThunk(
    "auth/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("users/profile");
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to fetch profile";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (
        data: {
            name?: string;
            email?: string;
            currentPassword?: string;
            newPassword?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put("users/profile", data);
            return response.data;
        } catch (error) {
            let errorMessage = "Failed to update profile";
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.error || errorMessage;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token");
    return null;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                register.fulfilled,
                (
                    state,
                    action: PayloadAction<{ user: User; token: string }>
                ) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                }
            )
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (
                    state,
                    action: PayloadAction<{ user: User; token: string }>
                ) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    state.tokenUser = decode(action.payload.token) as TokenUser;
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(
                updateProfile.fulfilled,
                (state, action: PayloadAction<{ user: User }>) => {
                    state.updateLoading = false;
                    state.user = action.payload.user;
                }
            )
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchProfile.fulfilled,
                (state, action: PayloadAction<{ user: User }>) => {
                    state.loading = false;
                    state.user = action.payload.user;
                }
            )
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
