import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchCategoryStats } from "./CategoryApi";


export interface ICategory {
    id: number
    name: string,
    image: string,
    description: string
}
export interface StatsResponse {
    categories: {
        total: number;
        active: number;
    };
    topProductCategory: {
        categoryId: number;
        name: string;
        productCount: number;
    } | null;
    topSellingCategory: {
        categoryId: number;
        name: string;
        totalSold: number;
    } | null;
}
const initialState = {
    categories: [] as ICategory[],
    stats: {} as StatsResponse,
    loading: false,
    success: false,
    error: false,
    message: "",
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    }
}

const categorySlice = createSlice({
    name: "category",
    initialState: initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = action.payload.data;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(fetchCategoryStats.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchCategoryStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.stats = action.payload.data;
            })
            .addCase(fetchCategoryStats.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    }
})

export const { clearMessage } = categorySlice.actions;
export default categorySlice.reducer;