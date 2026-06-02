import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, axiosInstanceNoCredentials } from "../../lib/axiosInstance";

interface IProductFilter extends IProductFilterAdmin {
    pricerangeFrom: number;
    pricerangeTo: number | string;
}

interface IProductFilterAdmin {
    productname: string;
    category: string | number;
    page: number;
    limit: number;
}
interface IProductCreate {
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

export const fetchProductStats = createAsyncThunk(
    "products/fetchProductStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`products/stats`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const fetchProductForCombobox = createAsyncThunk(
    "products/fetchProductForCombobox",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`products/combobox`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);


export const fetchTopSellingProducts = createAsyncThunk(
    "products/getTopSellingProductsList",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`products/top-selling`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const fetchProductsForAdmin = createAsyncThunk(
    "products/getProductsList/my",
    async (payload: IProductFilterAdmin, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`products/my`, { params: payload });
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
            const { data } = await axiosInstance.post(`products`, payload,
                {
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
    async ({ payload, id }: { payload: any; id: number }, { rejectWithValue }) => {
        try {
            console.log(payload);
            const { data } = await axiosInstance.put(`products/${id}`, payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

export const getProductDetails = createAsyncThunk(
    "products/getProductDetails",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`products/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);