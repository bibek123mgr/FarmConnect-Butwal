import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product/productSlice";
import categoryReducer from "./features/category/CategorySlice";
import authReducer from "./features/auth/AuthSlice";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/order/OrderSlice";
import commentReducer from "./features/comment/CommentSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer,
        auth: authReducer,
        cart: cartReducer,
        order:orderReducer,
        comment:commentReducer,
        user:userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;