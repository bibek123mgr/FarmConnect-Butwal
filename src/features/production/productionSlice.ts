import { createSlice } from "@reduxjs/toolkit";
import { createProduction, fetchProductions, fetchProductionStats } from "./productionApi";

export interface IProduction {
    id: number
    productId: number
    productName: string
    farmId: number
    farmName: string
    quantity: number
    costPerUnit: number
    remarks: string
    createdAt: string
}

export interface IProductionStats {
    totalProductions: number
    totalQuantity: number
    totalCost: number
}

const initalState = {
    productions: [] as IProduction[],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    },
    loading: false,
    error: false,
    success: false,
    message: "",
    productionStats: {
        totalProductions: 0,
        totalQuantity: 0,
        totalCost: 0
    } as IProductionStats,
}

const productionSlice = createSlice({
    name: "production",
    initialState: initalState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductions.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchProductions.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productions = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProductions.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(fetchProductionStats.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchProductionStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productionStats = action.payload.data;
            })
            .addCase(fetchProductionStats.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(createProduction.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createProduction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createProduction.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    }
});

export const { clearMessage } = productionSlice.actions;
export default productionSlice.reducer;