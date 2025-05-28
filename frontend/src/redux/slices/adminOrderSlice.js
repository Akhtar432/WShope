import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk All orders
export const fetchAllOrders = createAsyncThunk("adminOrder/fetchAllOrders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:9000/api/admin/orders", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch orders"
        );
    }
});
// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk("adminOrder/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:9000/api/admin/orders/${id}`, { status }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to update order status"
        );
    }
});
// Async thunk to delete an order
export const deleteOrder = createAsyncThunk("adminOrder/deleteOrder", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:9000/api/admin/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to delete order"
        );
    }
});

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order._id !== action.payload._id);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const adminOrderReducer = adminOrderSlice.reducer;
