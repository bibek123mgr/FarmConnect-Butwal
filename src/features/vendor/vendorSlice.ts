import { createSlice } from "@reduxjs/toolkit";
import { fetchVendors } from "./vendorApi";

export interface VendorUser {
    name: string;
    email: string;
    createdAt: string;
}

export interface IVendor {
    id: number;
    userId: number;
    farmName: string;
    description: string;
    province: string;
    district: string;
    address: string;
    logo: string;
    panNo: string;
    vatNo: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    totalProducts: number;
    totalOrders: number;
    totalSalesRevenue: string;
    user: VendorUser;
}
const initialState = {
    vendors: [] as IVendor[],
    pagination: {
        page: 1,
        total: 0,
        totalPages: 0
    },
    loading: false,
    success: false,
    error: false,
    message: "",
}

const vendorSlice = createSlice({
    name: "vendor",
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
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchVendors.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.vendors = action.payload.data;
                state.pagination.total = action.payload.total;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.page = action.payload.page;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    },
});

export const { clearMessage } = vendorSlice.actions;
export default vendorSlice.reducer;