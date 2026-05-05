import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const getNotifications = createAsyncThunk(
    "notification/getNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`notifications`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notification/mark-as-read",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`notifications/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);