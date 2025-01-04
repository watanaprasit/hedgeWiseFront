import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const fetchFXRatesThunk = createAsyncThunk(
  'fxRisk/fetchFXRates',
  async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/currency-data/`); 
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

const FXRiskSlice = createSlice({
  name: 'fxRisk',
  initialState: {
    fxRates: [], 
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
