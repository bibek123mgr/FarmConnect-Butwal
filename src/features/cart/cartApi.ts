import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export interface IAddToCart {
    productId: number;
    quantity: number;
    price: number;
}

export const createCart = createAsyncThunk(
    "cart/createCart",
    async (payload : IAddToCart, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                post(`carts`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })

export const getMyCart = createAsyncThunk(
    "cart/getMyCart",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                get(`carts/my`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })

export const deleteCart = createAsyncThunk(
    "cart/deleteCart",
    async (id : number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                delete(`carts/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })

export const decrementCart = createAsyncThunk(
    "cart/decrementCart",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                patch(`carts/decrement/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })


export const increnmentCart = createAsyncThunk(
    "cart/increnmentCart",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                patch(`carts/increment/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })

export const removeAllCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.
                delete(`carts/clearall`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    })

