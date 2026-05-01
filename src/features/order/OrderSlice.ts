import { createSlice } from "@reduxjs/toolkit";
import { createOrder } from "./OrderApi";

interface IOrder {
    id: number,
    userId: number,
    productId: number,
    quantity: number
}

interface IinitialState {
    orders: IOrder[],
    loading: boolean,
    success: boolean,
    error: boolean,
    message: string
}
const initialState: IinitialState = {
    orders: [] as IOrder[],
    loading: false,
    success: false,
    error: false,
    message: ""
}

const orderSlice = createSlice({
    name: "order",
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
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                if (action.payload.url) {
                    window.location.href = action.payload.url;
                }
                if (action.payload.esewaResponseForm) {
                    document.open();
                    document.write(action.payload.esewaResponseForm);
                    document.close();
                }
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    }
})

export const { clearMessage } = orderSlice.actions;
export default orderSlice.reducer;