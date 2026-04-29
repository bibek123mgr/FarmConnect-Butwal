import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../config/config";


export const fetchCategories = createAsyncThunk(
    "categories/getCategoriesList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseUrl}categories`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);