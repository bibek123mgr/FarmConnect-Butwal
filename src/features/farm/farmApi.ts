import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance, axiosInstanceNoCredentials } from "../../lib/axiosInstance";

export const fetchFarms = createAsyncThunk(
    "farm/fetchFarms",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get("farmers/top-farms");
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const fetchAllFarm = createAsyncThunk(
    "farm/fetchAllFarm",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstanceNoCredentials.get(`farmers/farms`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)

export const getMyFarmDetails=createAsyncThunk(
    "farm/getMyFarmDetails",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("farmers/my-farm");
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Something went wrong"
            );
        }
    }
)