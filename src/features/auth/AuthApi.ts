import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginPayload } from "../../pages/Login";
import { axiosInstance } from "../../lib/axiosInstance";

export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
}

export const LoginUser = createAsyncThunk(
    "auth/login",
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`auth/login`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });

export const LoginUserWithGoogle = createAsyncThunk(
    "auth/login-with-google",
    async (credentials: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`auth/login-with-google`, {credentials});
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });

export const RegisterUser = createAsyncThunk(
    "auth/register",
    async (payload: IRegisterPayload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`auth/register`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });

export const LogoutUser = createAsyncThunk(
    "auth/logout",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`auth/logout`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`auth/refreshToken`, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });


export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`auth/getme`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    });