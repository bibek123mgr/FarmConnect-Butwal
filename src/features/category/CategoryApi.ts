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

export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.post(`categories`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.patch(`categories/${payload.id}`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id:number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.delete(`categories/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);