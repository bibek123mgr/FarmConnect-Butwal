import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product/productSlice";
import categoryReducer from "./features/category/CategorySlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;