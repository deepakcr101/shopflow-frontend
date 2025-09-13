
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },
  reducers: {
    getProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    getProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getProductDetailStart(state) {
      state.loading = true;
      state.error = null;
    },
    getProductDetailSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
    },
    getProductDetailFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProductsStart,
  getProductsSuccess,
  getProductsFailure,
  getProductDetailStart,
  getProductDetailSuccess,
  getProductDetailFailure,
} = productSlice.actions;

export default productSlice.reducer;
