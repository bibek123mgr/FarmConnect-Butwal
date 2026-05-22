import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, fetchProductsForAdmin, fetchTopSellingProducts, getProductDetails, updateProduct } from "./productApi";


export interface IProduct {
    id: number;
    name: string;
    description: string;
    unit: string;
    rate: string;
    farmId: number;
    categoryId: number;
    farmName: string;
    categoryName: string;
    quantity: number;
    image: string;
}

export interface IProductAdmin extends IProduct {
    OpeningStock: number;
}

const initialValues = {
    products: [] as IProduct[],
    topSellingProducts: [] as IProduct[],
    productsAdmin: [] as IProductAdmin[],
    productDetails: {} as IProduct,
    loading: false,
    success: false,
    error: false,
    message: "",
    product: {} as IProduct,
    totalProducts: 0,
    totalPages: 0,
    pagination: {
        page: 1,
        limit: 20,
        total: 0
    },
    searchFilters: {
        title: "",
        category: "",
        minPrice: 0,
        maxPrice: 0
    },
    adminProductPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        totalProducts: 0
    }
}

const productSlice = createSlice({
    name: "product",
    initialState: initialValues,
    reducers: {
        setSearchFilters: (state, action) => {
            state.searchFilters = {
                ...state.searchFilters,
                [action.payload.key]: action.payload.value
            }
        },
        setPagination: (state, action) => {
            state.pagination = {
                ...state.pagination,
                [action.payload.key]: action.payload.value
            }
        },
        setSuccessMessage: (state, action) => {
            state.message = action.payload;
            state.error = false;
        },
        setError: (state, action) => {
            state.message = action.payload;
            state.error = true;
        },
        clearMessage: (state) => {
            state.message = "";
            state.error = false;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.products = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
             .addCase(fetchTopSellingProducts.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.topSellingProducts = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchTopSellingProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productDetails = action.payload.data;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(fetchProductsForAdmin.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(fetchProductsForAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.productsAdmin = action.payload.data.products;
                state.adminProductPagination.total = action.payload.data.productsCount;
                state.adminProductPagination.totalPages = action.payload.data.totalPages;
                state.adminProductPagination.totalProducts = action.payload.data.totalProducts;

            })
            .addCase(fetchProductsForAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.success = false;
                state.message = action.error.message || "Something went wrong";
            })
    }


});

export const { setSearchFilters, setPagination, setSuccessMessage, setError, clearMessage } = productSlice.actions;
export default productSlice.reducer;