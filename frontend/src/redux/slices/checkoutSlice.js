import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a new checkout session
export const createCheckoutSession = createAsyncThunk(
    "checkout/createCheckoutSession",
    async ({ checkoutData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:9000/api/checkout",
                { checkoutData },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create checkout session"
            );
        }
    }
);

// Create checkout slice
const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        sessionId: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCheckoutSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckoutSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionId = action.payload.sessionId;
            })
            .addCase(createCheckoutSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const checkoutReducer = checkoutSlice.reducer;