import { store } from "../store";
import axios from "@/lib/axios";
import { login } from "./authSlice";

export const restoreAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const response = await axios.get("users/profile");
            store.dispatch(
                login.fulfilled(
                    { user: response.data.user, token },
                    "auth/login",
                    { email: "", password: "" }
                )
            );
        } catch (error: unknown) {
            console.error("Failed to restore auth:", error);
            localStorage.removeItem("token");
        }
    }
};
