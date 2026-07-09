import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

interface PaymentData {
    vendorId: number;
    amount: number;
    paymentMethod: string;
    remarks: string | "";
}

const createPayment = createAsyncThunk(
    'payment/createPayment',
    async (paymentData: PaymentData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`payments`, paymentData);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);

const getPaymentDetails = createAsyncThunk(
    'payment/getPaymentDetails',
    async (paymentId: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`payments/${paymentId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
);


const getAllPaymentList = createAsyncThunk(
    'payment/getAllPaymentList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`payments`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }

    }
)

const deletePaymentPayment = createAsyncThunk(
    'payment/deletePaymentPayment',
    async (paymentId: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`payments/${paymentId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export {
    createPayment,
    getPaymentDetails,
    getAllPaymentList,
    deletePaymentPayment
}