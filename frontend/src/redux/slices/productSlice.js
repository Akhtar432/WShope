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
export const fetchProductById = createAsyncThunk(
  "products/fetchProductsDetails",
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
      `http://localhost:9000/api/products/similar/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
      }
    );
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
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const product = action.payload;
        const existingProduct = state.products.find(p => p._id === product._id);
        if (existingProduct) {
          Object.assign(existingProduct, product);
        } else {
          state.products.push(product);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
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
        state.status = "succeeded";
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const productActions = productSlice.actions;
export const productsReducer = productSlice.reducer;