import { createSlice } from "@reduxjs/toolkit";
import { getNotifications, markNotificationAsRead } from "./NotificationApi";

interface INotification {
    id: number;
    message: string;
    isRead: boolean;
}

interface IinitialState {
    notifications: INotification[];
    loading: boolean;
    success: boolean;
    error: boolean;
    message: string;
}

const initialState: IinitialState = {
    notifications: [] as INotification[],
    loading: false,
    success: false,
    error: false,
    message: "",
}

const notificationSlice = createSlice({
    name: "notification",
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
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.notifications = action.payload.data;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(markNotificationAsRead.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(markNotificationAsRead.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    },
});

export const { clearMessage } = notificationSlice.actions;
export default notificationSlice.reducer;