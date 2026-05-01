import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceNoCredentials } from "../../lib/axiosInstance";

export const fetchProducts = createAsyncThunk(
    "products/getProductsList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`products`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);