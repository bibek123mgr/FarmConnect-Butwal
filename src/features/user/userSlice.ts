import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../auth/AuthSlice";
import { getAllUsers } from "./userApi";

const initialState = {
    users: [] as IUser[],
    loading: false,
    success: false,
    error: false,
    message: "",
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    }
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.users = action.payload.users;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message =
                    (action.payload as any)?.message ||
                    (action.payload as any)?.errors?.[0]?.toString() ||
                    action.error.message ||
                    "Something went wrong";
            })
    }
})

export const { clearMessage } = userSlice.actions;
export default userSlice.reducer;