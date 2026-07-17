import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/product/productSlice";
import categoryReducer from "./features/category/CategorySlice";
import authReducer from "./features/auth/AuthSlice";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/order/OrderSlice";
import commentReducer from "./features/comment/CommentSlice";
import userReducer from "./features/user/userSlice";
import storeReducer from "./features/farm/farmSlice";
import vendorReducer from "./features/vendor/vendorSlice";
import productionReducer from "./features/production/productionSlice";
import DashboardReducer from "./features/dashboard/DashboardSlice";
import PaymentReducer from "./features/payment/paymentSlice";
import DamageReducer from "./features/damage/DamageSlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        category: categoryReducer,
        auth: authReducer,
        cart: cartReducer,
        order:orderReducer,
        comment:commentReducer,
        user:userReducer,
        store: storeReducer,
        vendor: vendorReducer,
        production: productionReducer,
        dashboard: DashboardReducer,
        payment: PaymentReducer,
        damage:DamageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;