import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCommodityRiskThunk = createAsyncThunk(
    'commodityRisk/fetchCommodityRisk',
    async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/brent-crude-data/'); 
      return response.data;
    }
  );
  
  // Slice for commodity risk data
  const commodityRiskSlice = createSlice({
    name: 'commodityRisk',
    initialState: {
      commodityRiskData: [],
      status: 'idle',
      error: null,
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCommodityRiskThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCommodityRiskThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.commodityRiskData = action.payload;
        })
        .addCase(fetchCommodityRiskThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default commodityRiskSlice.reducer;
  