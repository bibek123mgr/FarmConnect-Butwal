import { createSlice } from "@reduxjs/toolkit";
import { fetchAllFarm, fetchFarms, getMyFarmDetails } from "./farmApi";

export interface ITopSellingFarm {
    id: number;
    image: string;
    farmName: string;
    description: string;
    address: string;
}

export interface IAllFarmForHeader{
    id: number;
    logo: string;
    farmName: string;
    productCount: number
}

const initialState = {
    topSellingFarms: [] as ITopSellingFarm[],
    allFarmsForHeader: [] as IAllFarmForHeader[],
    myFarmDetail:{} as any,
    loading: false,
    success: false,
    error: false,
    message: "",
}

const FarmSlice = createSlice({
    name: "farm",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFarms.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchFarms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.topSellingFarms = action.payload.data;
            })
            .addCase(fetchFarms.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload as string;
            })
             .addCase(fetchAllFarm.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchAllFarm.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allFarmsForHeader = action.payload.data;
            })
            .addCase(fetchAllFarm.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload as string;
            })
            .addCase(getMyFarmDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getMyFarmDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.myFarmDetail = action.payload.data;
            })
            .addCase(getMyFarmDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload as string;
            })
    },
})

export const { clearMessage } = FarmSlice.actions;

export default FarmSlice.reducer;