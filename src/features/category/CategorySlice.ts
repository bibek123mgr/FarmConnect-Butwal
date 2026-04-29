import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./CategoryApi";


export interface ICategory {
    id: number
    name: string,
    image: string
}
const initialState={
    categories: [] as ICategory[],
    loading: false,
    success: false,
    error: false,
    message: "",
}

const categorySlice = createSlice({
    name: "category",
    initialState: initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.categories = action.payload.data;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    }
})

export const { clearMessage } = categorySlice.actions;
export default categorySlice.reducer;