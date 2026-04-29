import axios from "axios";
import { baseUrl } from "../../config/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const LoginUser = createAsyncThunk(
    "auth/login", 
    async (payload,{ rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${baseUrl}auth/login`, payload);
        return data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data || "Something went wrong"
        );
    }
});

export const RegisterUser = createAsyncThunk(
    "auth/register", 
    async (payload,{ rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${baseUrl}auth/register`, payload);
        return data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data || "Something went wrong"
        );
    }
});

export const LogoutUser = createAsyncThunk(
    "auth/logout", 
    async (payload,{ rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${baseUrl}auth/logout`, payload);
        return data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data || "Something went wrong"
        );
    }
});

export const refreshToken = createAsyncThunk(
    "auth/refreshToken", 
    async (payload,{ rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${baseUrl}auth/refreshToken`, payload);
        return data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data || "Something went wrong"
        );
    }
});