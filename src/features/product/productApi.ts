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