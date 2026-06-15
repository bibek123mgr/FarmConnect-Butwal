import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const getDashBoardData = createAsyncThunk(
    "dashboard/getDashBoardData",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`dashboard/stats`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)