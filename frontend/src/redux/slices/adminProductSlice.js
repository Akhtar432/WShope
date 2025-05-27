import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch all products (admin only)
export const fetchAdminProducts = createAsyncThunk("adminProduct/fetchAllProducts", async () => {
    const response = await axios.get("http://localhost:9000/api/admin/products", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
    });
    return response.data;
});

// Async thunk to create a new product
export const createProduct = createAsyncThunk("adminProduct/createProduct", async (productData, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:9000/api/admin/products", productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to create product"
        );
    }
});

// Async thunk to update a product
export const updateProduct = createAsyncThunk("adminProduct/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:9000/api/admin/products/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to update product"
        );
    }
});

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk("adminProduct/deleteProduct", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:9000/api/admin/products/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to delete product"
        );
    }
});
// Create admin product slice
const adminProductSlice = createSlice({
    name: "adminProduct",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(product => product._id === action.payload._id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(product => product._id !== action.payload._id);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const adminProductReducer = adminProductSlice.reducer;
