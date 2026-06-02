import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export interface IProductionFilter {
    page: number;
    limit: number;
    search: string | undefined;
}

export interface IProductionStats {
    totalProductions: number;
    totalQuantity: number;
    totalProductsProduced: number;
    totalValueProduced: number;
}

export interface IProductionCreate {
    id?: number;
    productId: number;
    quantity: number;
    rate: number;
    remarks: string;
}

export const fetchProductions = createAsyncThunk(
    "production/getProductionsList",
    async (payload: IProductionFilter, { rejectWithValue }) => {
        try {
            console.log("Fetching productions with filters:", payload);
            const { data } = await axiosInstance.get(`productions`, { params: payload });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const fetchProductionStats = createAsyncThunk(
    "production/fetchProductionStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`productions/stats`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const createProduction = createAsyncThunk(
    "production/createProduction",
    async (payload: IProductionCreate, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`productions`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const updateProduction = createAsyncThunk(
    "production/updateProduction",
    async (
        {
            payload,
            id,
        }: {
            payload: IProductionCreate;
            id: number;
        },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await axiosInstance.put(
                `productions/${id}`,
                payload
            );
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const deleteProduction = createAsyncThunk(
    "production/deleteProduction",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`productions/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);