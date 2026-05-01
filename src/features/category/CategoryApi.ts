import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceNoCredentials } from "../../lib/axiosInstance";


export const fetchCategories = createAsyncThunk(
    "categories/getCategoriesList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`categories`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);