import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [], 
  status: 'idle', 
  error: null, 
};


export const fetchFavourites = createAsyncThunk(
  'favourites/fetchFavourites',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/favourites/${userId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not fetch favorites');
    }
  }
);


export const addFavourite = createAsyncThunk(
  'favourites/addFavourite',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/favourites', { userId, productId });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not add favorite');
    }
  }
);


export const removeFavourite = createAsyncThunk(
  'favourites/removeFavourite',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/favourites/${userId}/${productId}`);
      return { productId }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Could not remove favorite');
    }
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    
    clearFavourites(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchFavourites.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload.productId);
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export const { clearFavourites } = favouritesSlice.actions;


export const selectFavourites = (state) => state.favourites.items;
export const selectFavouritesStatus = (state) => state.favourites.status;
export const selectFavouritesError = (state) => state.favourites.error;

export default favouritesSlice.reducer;