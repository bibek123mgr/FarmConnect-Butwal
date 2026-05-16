import { createSlice } from "@reduxjs/toolkit";
import { createOrder, getAllMyOrders, getAllOrders, getOrderDetails, getVendorOrderDetails, verifyOnlinePaymentStatus } from "./OrderApi";

interface IOrder {
    id: number,
    totalAmount: number,
    address: string,
    paymentMethod: string,
    paymentStatus: string,
    status: string,
    createdAt: Date,
}

export interface IAdminFarmOrder {
    id: number;
    totalAmount: number;
    createdAt: string;
    address: string;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
}

export interface IVendorOrderProductDetails extends IAdminFarmOrder{
    products:[{
        id: number;
        productId: number;
        productName: string;
        productImage: string;
        quantity: number;
        price: number;
        subtotal: number;
    }]
}


export interface IOrderDetailsForUserResponse {
    id: number;
    totalAmount: string;
    address: string;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    vendorOrders: {
        id: number;
        totalAmount: string;
        farmId: number;

        farm: {
            farmName: string;
        };

        orderItems: {
            id: number;
            productId: number;
            quantity: string;
            price: string;
            subtotal: string;

            product: {
                name: string;
                image: string;
            };
        }[];
    }[];
}
interface IinitialState {
    orders: IOrder[],
    orderDetails: IOrderDetailsForUserResponse,
    storeOrders:IAdminFarmOrder[],
    storeOrderDetails:IVendorOrderProductDetails,
    loading: boolean,
    success: boolean,
    error: boolean,
    message: string
}
const initialState: IinitialState = {
    orders: [] as IOrder[],
    orderDetails: {} as IOrderDetailsForUserResponse,
    storeOrders: [] as IAdminFarmOrder[],
    storeOrderDetails: {} as IVendorOrderProductDetails,
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
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(getVendorOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getVendorOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.storeOrderDetails = action.payload.data;
            })
            .addCase(getVendorOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(getAllMyOrders.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getAllMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.orders = action.payload.data;
            })
            .addCase(getAllMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.storeOrders = action.payload.data;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(verifyOnlinePaymentStatus.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(verifyOnlinePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(verifyOnlinePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })

    }
})

export const { clearMessage } = orderSlice.actions;
export default orderSlice.reducer;