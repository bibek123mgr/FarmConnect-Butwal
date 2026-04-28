import axios from "axios";
import { baseUrl } from "../../config/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
    "products/getProductsList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseUrl}products`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);