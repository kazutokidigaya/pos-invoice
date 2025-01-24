import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array to store cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Add item with quantity 1
      }
    },
    removeItem: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload
      );
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1; // Decrease quantity
        } else {
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          ); // Remove item
        }
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload); // Completely remove item
    },
    clearCart: (state) => {
      state.items = []; // Clear all items
    },
  },
});

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
