
import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    getOrdersStart(state) {
      state.loading = true;
      state.error = null;
    },
    getOrdersSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },
    getOrdersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createOrderStart(state) {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess(state, action) {
      state.loading = false;
      state.orders.push(action.payload);
    },
    createOrderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getOrdersStart,
  getOrdersSuccess,
  getOrdersFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
} = orderSlice.actions;

export default orderSlice.reducer;
