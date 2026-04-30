import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";


export const fetchCategories = createAsyncThunk(
    "categories/getCategoriesList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`categories`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);