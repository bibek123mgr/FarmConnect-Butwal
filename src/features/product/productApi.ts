import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstanceNoCredentials } from "../../lib/axiosInstance";

interface IProductFilter {
    productname: string;
    category: string | number;
    pricerangeFrom: number;
    pricerangeTo: number | string;
    page: number;
    limit: number;
}

export const fetchProducts = createAsyncThunk(
    "products/getProductsList",
    async (payload: IProductFilter, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`products`, { params: payload });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.post(`products`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.delete(`products/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (payload: any, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.patch(`products/${payload.id}`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);