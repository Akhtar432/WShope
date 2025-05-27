import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve the user info and token from localStorage if available
const userFromStorage = localStorage.getItem("user") 
  ? JSON.parse(localStorage.getItem("user"))
  : null;

// Check for an existing guest ID in localStorage or generate a new one
const initialGuestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;

// Initial state
const initialState = {
  user: userFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  "/api/users/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:9000/api/users/login", userData);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", JSON.stringify(response.data.token));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Async thunk for Register
export const register = createAsyncThunk(
  "/api/users/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:9000/api/users/register", userData);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", JSON.stringify(response.data.token));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    setGuestId: (state, action) => {
      state.guestId = action.payload;
      localStorage.setItem("guestId", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setGuestId } = authSlice.actions;
export default authSlice.reducer;