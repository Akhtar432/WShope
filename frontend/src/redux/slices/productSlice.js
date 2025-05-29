import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    material,
    brand,
    category,
    minPrice,
    maxPrice,
    sortBy,
    search,
    limit
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (limit) query.append("limit", limit);

    const response = await axios.get(`http://localhost:9000/api/products/?${query.toString()}`);
    return response.data;
  }
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(`http://localhost:9000/api/products/${id}`);
    return response.data;
  }
);

// Async thunk to update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `http://localhost:9000/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
      }
    );
    return response.data;
  }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id) => {
    const response = await axios.get(
      `http://localhost:9000/api/products/similar/${id}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    status: "idle",
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      material: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      limit: ""
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        material: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        limit: ""
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const product = action.payload;
        const existingProduct = state.products.find(p => p._id === product._id);
        if (existingProduct) {
          Object.assign(existingProduct, product);
        } else {
          state.products.push(product);
        }
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload;
        const existingProductIndex = state.products.findIndex(p => p._id === updatedProduct._id);
        if (existingProductIndex !== -1) {
          state.products[existingProductIndex] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload; 
        state.loading = false;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const productActions = productSlice.actions;
export const productsReducer = productSlice.reducer;