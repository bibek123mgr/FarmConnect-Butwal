import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, axiosInstanceNoCredentials } from "../../lib/axiosInstance";

interface ICommentCreate {
    productId: number;
    rating: number;
    comment: string;
}

interface ICommentUpdate {
    id: number;
    rating: number;
    comment: string;
}


export const createComment = createAsyncThunk(
    "comment/createComment",
    async (payload: ICommentCreate, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`comments`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const getAllComments = createAsyncThunk(
    "comment/getAllComments",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`comments/product/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const deleteComment = createAsyncThunk(
    "comment/deleteComment",
    async (id: number, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`comments/${id}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const updateComment = createAsyncThunk(
    "comment/updateComment",
    async (payload: ICommentUpdate, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`comments/${payload.id}`, {
                rating: payload.rating,
                comment: payload.comment
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)