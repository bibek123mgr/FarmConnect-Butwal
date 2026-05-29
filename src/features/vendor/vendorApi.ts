import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

interface IFilter {
    page: number;
    limit: number;
    search: string | undefined;
    status: string | undefined;
}
export const fetchVendors = createAsyncThunk(
    "vendor/fetchVendors",
    async (filters: IFilter, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`vendors`, { params: filters });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)