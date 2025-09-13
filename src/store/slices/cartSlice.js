
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCartStart(state) {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess(state, action) {
      state.loading = false;
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    addToCartFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCartStart, addToCartSuccess, addToCartFailure, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
