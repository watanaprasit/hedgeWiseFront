import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk to fetch FX rates from the correct API endpoint
export const fetchFXRatesThunk = createAsyncThunk(
  'fxRisk/fetchFXRates',
  async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/currency-data/'); // Correct endpoint
      return Array.isArray(response.data) ? response.data : []; // Ensure it returns an array
    } catch (error) {
      console.error('Error fetching FX rates:', error);
      throw error;
    }
  }
);

// Slice for FX risk data
const FXRiskSlice = createSlice({
  name: 'fxRisk',
  initialState: {
    fxRates: [], // Initialize as an empty array
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFXRatesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFXRatesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fxRates = action.payload; // Ensure fxRates is an array
      })
      .addCase(fetchFXRatesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default FXRiskSlice.reducer;








