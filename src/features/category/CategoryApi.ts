import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, axiosInstanceNoCredentials } from "../../lib/axiosInstance";


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

export const fetchCategoryStats = createAsyncThunk(
    "categories/fetchCategoryStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`categories/stats`);
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
            const { data } = await axiosInstance.post(`categories`, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
            const { data } = await axiosInstance.patch(`categories/${payload.id}`, payload);
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
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`categories/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);