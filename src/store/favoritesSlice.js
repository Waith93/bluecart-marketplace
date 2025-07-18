// src/store/favoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: [],
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      const exists = state.find((item) => item.id === product.id);
      if (!exists) {
        state.push(product);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      return state.filter((item) => item.id !== productId);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
