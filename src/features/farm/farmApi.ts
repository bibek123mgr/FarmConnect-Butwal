import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceNoCredentials } from "../../lib/axiosInstance";

export const fetchFarms = createAsyncThunk(
    "farm/fetchFarms",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get("farmers/top-farms");
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)