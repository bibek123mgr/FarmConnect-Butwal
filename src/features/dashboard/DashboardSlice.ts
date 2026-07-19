import { createSlice } from "@reduxjs/toolkit"
import { getDashBoardData,getDemandForcast } from "./DashbaordApi"

export interface ProductForecast {

    productId: number;

    productName: string;

    image: string;

    currentStock: number;

    tomorrow: number;

    nextWeek: number;

    nextMonth: number;
}

const initialState = {
    dashboardStatic: {} as any,
    forcastProductList: [] as ProductForecast[],
    loading: false,
    success: false,
    error: false,
    message: ""
}

const DashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        clearMessage(state) {
            state.message = ""
            state.error = false
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashBoardData.pending, (state) => {
                state.loading = true
                state.error = false
                state.success = false
                state.message = ""
            })
            .addCase(getDashBoardData.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.dashboardStatic = action.payload.data
            })
            .addCase(getDashBoardData.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.success = false
                state.message = action.error.message || "Something went wrong"
            })
            .addCase(getDemandForcast.pending, (state) => {
                state.loading = true
                state.error = false
                state.success = false
                state.message = ""
            })
            .addCase(getDemandForcast.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.forcastProductList = action.payload.data
            })
            .addCase(getDemandForcast.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.success = false
                state.message = action.error.message || "Something went wrong"
            })
    }
})

export const { clearMessage } = DashboardSlice.actions
export default DashboardSlice.reducer