import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, axiosInstanceNoCredentials } from "../../lib/axiosInstance";
import type { AnyActionArg } from "react";

interface IProductFilter {
    productname: string;
    category: string | number;
    pricerangeFrom: number;
    pricerangeTo: number | string;
    page: number;
    limit: number;
}

interface IProductCreate{
    name: string;
    description: string;
    unit: string;
    rate: number;
    quantity: number;
    categoryId: number;
    image: string;
    id?: number
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
            const { data } = await axiosInstance.post(`products`, payload);
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