import { createSlice } from "@reduxjs/toolkit"
import { createPayment, deletePaymentPayment, getAllPaymentList, getPaymentDetails } from "./paymentApi";

const stats = {
    pending_amount: 0,
    paid_amount: 0,
    total_amount: 0,
    total_payment: 0
}

const initialState = {
    data: [] as any[],
    paymentDetails: {} as any,
    stats: stats,
    loading: false,
    message: "",
    error: false,
    success: false
}

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
            .addCase(getPaymentDetails.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getPaymentDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload.message;
                state.paymentDetails = action.payload.data;
            })
            .addCase(getPaymentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
            .addCase(getAllPaymentList.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getAllPaymentList.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload.message;
                state.data = action.payload.data;
            })
            .addCase(getAllPaymentList.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
            .addCase(deletePaymentPayment.pending, (state, action) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(deletePaymentPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(deletePaymentPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.payload as string || "Something went wrong";
            })
    }
})

export const { clearMessage } = paymentSlice.actions;
export default paymentSlice.reducer;