import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const fetchProducts = createAsyncThunk(
    "products/getProductsList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`products`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);