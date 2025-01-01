import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk to fetch FX rates from the correct API endpoint
export const fetchFXRatesThunk = createAsyncThunk(
  'fxRisk/fetchFXRates',
  async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/currency-data/'); // Correct endpoint
      // Ensure the data is an array and return only the latest close prices per currency pair
      if (Array.isArray(response.data)) {
        const latestRates = response.data.reduce((acc, current) => {
          const existingPair = acc.find(
            (item) => item.currency_pair === current.currency_pair
          );
          if (!existingPair) {
            acc.push(current);
          }
          return acc;
        }, []);
        return latestRates;
      }
      return [];
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
        state.fxRates = action.payload; // Ensure fxRates is an array of the most recent values
      })
      .addCase(fetchFXRatesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default FXRiskSlice.reducer;
