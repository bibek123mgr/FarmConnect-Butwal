import { createSlice } from "@reduxjs/toolkit"
import { createDamage, deleteDamages, fetchDamages, fetchDamageStats } from "./DamageApi";

interface IDamage{
    id: number,
    productId: number,
    productName: string,
    farmId: number,
    farmName: string,
    quantity: number,
    lossAmount: number,
    remarks: string,
    createdAt: string
}

export interface DamageStats {
    totalLossAmount: number;
    totalDamages: number;
    totalQuantity: number;
}

const initialState={
    damages: [] as IDamage[],
    damageStats: {} as DamageStats, 
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


const damageSlice=createSlice({
    name:"damage",
    initialState:initialState,
    reducers:{
        clearDamages:(state)=>{
            state.loading=false;
            state.success=false;
            state.error=false;
            state.message="";
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchDamages.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchDamages.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.damages = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchDamages.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(createDamage.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createDamage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createDamage.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
            .addCase(deleteDamages.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(deleteDamages.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deleteDamages.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
            .addCase(fetchDamageStats.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchDamageStats.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.damageStats = action.payload.data;
            })
            .addCase(fetchDamageStats.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    },
})

export const {clearDamages}=damageSlice.actions
export default damageSlice.reducer