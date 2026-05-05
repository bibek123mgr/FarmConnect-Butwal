import { createSlice } from "@reduxjs/toolkit";
import { getUserProfile, LoginUser, LogoutUser, RegisterUser } from "./AuthApi";

interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    farmId: number;
    farmName: string;
}

interface IAuthState {
    user: IUser | null;
    loading: boolean;
    error: boolean;
    message: string;
    success: boolean;
    isInitialized: boolean;
}

const initialState: IAuthState = {
    user: null,
    loading: false,
    error: false,
    message: "",
    success: false,
    isInitialized: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message =
                    (action.payload as any)?.message ||
                    (action.payload as any)?.errors?.[0]?.toString() ||
                    action.error.message ||
                    "Something went wrong";
            })
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isInitialized = true;
            })
            .addCase(getUserProfile.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isInitialized = true;
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.user = null;
                state.isInitialized = true;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message =
                    (action.payload as any)?.message ||
                    (action.payload as any)?.errors?.[0]?.toString() ||
                    action.error.message ||
                    "Something went wrong";
            });
    },
});

export const { clearMessage } = authSlice.actions;
export default authSlice.reducer;
