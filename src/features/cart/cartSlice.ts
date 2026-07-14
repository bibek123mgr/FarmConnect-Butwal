import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createCart, getMyCart, removeAllCart } from "./cartApi";
import currency from "currency.js";

export interface ICart {
    id: number;
    productName: string;
    price: number;
    total: number;
    productId: number;
    quantity: number;
}

const initialState = {
    cart: [] as ICart[],
    loading: false,
    success: false,
    error: false,
    message: ""
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        IncreaseQuantity: (state, action: PayloadAction<number>) => {
            const item = state.cart.find((item) => item.id === action.payload);
            if (item) {
                let newQuantity = currency(item.quantity).add(1);
                item.quantity = newQuantity.value;
                const newTotal = currency(item.price).multiply(newQuantity).value;
                item.total = newTotal;

            }
        },
        DecreaseQuantity: (state, action: PayloadAction<number>) => {
            const item = state.cart.find((item) => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                item.total = item.quantity * item.price;
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        },
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCart.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                const newCart = action.payload.data;
                const index = state.cart.findIndex(i => i.id === newCart.id);
                if (index !== -1) {
                    state.cart[index] = newCart;
                } else {
                    state.cart.push(newCart);
                }
            })
            .addCase(createCart.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(getMyCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload.data;
            })
            .addCase(getMyCart.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(removeAllCart.fulfilled, (state, action) => {
                state.cart = [];
            })
    }
});

export const { removeFromCart, clearCart, IncreaseQuantity, DecreaseQuantity, clearMessage } = cartSlice.actions;
export default cartSlice.reducer;
