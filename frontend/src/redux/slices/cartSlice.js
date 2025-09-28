import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper functions for localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : null;
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return null;
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Normalize backend response
const normalizeCartResponse = (data) => {
  if (data?.cart) return data.cart; // backend sends { success, cart }
  return data; // backend sends cart directly
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:9000/api/cart', {
        params: { userId, guestId },
      });
      const cart = normalizeCartResponse(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, size, color, userId, guestId, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        'http://localhost:9000/api/cart',
        { productId, quantity, size, color, userId, guestId },
        config
      );
      const cart = normalizeCartResponse(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);


export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.put('http://localhost:9000/api/cart', {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      const cart = normalizeCartResponse(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete('http://localhost:9000/api/cart', {
        data: { productId, size, color, userId, guestId },
      });
      const cart = normalizeCartResponse(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const mergeCarts = createAsyncThunk(
  'cart/mergeCarts',
  async ({ guestId }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      if (!user) throw new Error('User not authenticated');

      const response = await axios.post('http://localhost:9000/api/cart/merge', { guestId });
      const cart = normalizeCartResponse(response.data);
      saveCartToStorage(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge carts');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: getCartFromStorage(),
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      saveCartToStorage(null);
    },
    setGuestId: (state, action) => {
      if (state.cart) {
        state.cart.guestId = action.payload;
        saveCartToStorage(state.cart);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCart, setGuestId } = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart.cart;
export const selectCartItems = (state) => state.cart.cart?.products || [];
export const selectCartTotal = (state) => state.cart.cart?.totalPrice || 0;
export const selectCartItemCount = (state) =>
  state.cart.cart?.products?.reduce((count, item) => count + item.quantity, 0) || 0;
export const selectGuestId = (state) => state.cart.cart?.guestId;

export const cartReducer = cartSlice.reducer;
