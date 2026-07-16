import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

interface IOrderIterms {
    productId: number,
    quantity: number,
    rate: number
}

export enum IPaymentMethod {
    COD = "cod",
    KHALTI = "khalti",
    ESEWA = "esewa",
}

interface IOrderCreate {
    paymentMethod: IPaymentMethod,
    address: string,
    items: IOrderIterms[],

}

interface IPaymentReference {
    paymentMethod: IPaymentMethod,
    amount: number,
    gatewayReferenceId: string
}

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (payload: IOrderCreate, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`orders`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const getAllOrders = createAsyncThunk(
    "order/getAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`orders`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)


export const getAllMyOrders = createAsyncThunk(
    "order/getAllMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`orders/my`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const getOrderDetails = createAsyncThunk(
    "order/my/getOrderDetails",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`orders/my/details/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const getVendorOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`orders/details/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)


export const cancelMyOrder = createAsyncThunk(
    "order/cancelMyOrder",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`orders/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const verifyOnlinePaymentStatus = createAsyncThunk(
    "order/verifyOnlinePaymentStatus",
    async (payload: IPaymentReference, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`orders/verify-payment`,payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

