// client/src/features/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for managing search
const initialState = {
  query: '', // Current search term
  results: [], // Array of search results
  status: 'idle', // 'idle' 
  error: null, // Error message, if any
};

// Search products by query
export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/search?query=${query}`);
      return response.data; // Expecting an array of products
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not search products');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // Set the search query
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    // Clear search query and results
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle searching products
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions for use in components
export const { setSearchQuery, clearSearch } = searchSlice.actions;

// Export selectors for accessing state
export const selectSearchQuery = (state) => state.search.query;
export const selectSearchResults = (state) => state.search.results;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;

export default searchSlice.reducer;