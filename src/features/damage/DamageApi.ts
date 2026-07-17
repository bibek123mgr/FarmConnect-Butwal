import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

interface ICreateDamage {
    productId: number;
    quantity: number;
    remarks: string;
}

interface IFilters {
    page: number;
    limit: number;
    search: string | undefined
}

export const createDamage = createAsyncThunk(
    "damage/createDamage",
    async (payload: ICreateDamage, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`damages`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const fetchDamageStats = createAsyncThunk(
    "damage/fetchDamageStats",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`damages/stats`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)


export const fetchDamages = createAsyncThunk(
    "damage/fetchDamages",
    async (params: IFilters, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`damages`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);


export const deleteDamages = createAsyncThunk(
    "damage/deleteDamage",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`damages/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

// export const updateDamage=createAsyncThunk(
//     "damage/updateDamage",
//     async ({payload,id}, { rejectWithValue }) => {
//         try {
//             const { data } = await axiosInstance.put(`damages/${id}`,payload);
//             return data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data || "Something went wrong"
//             );
//         }
//     }
// )