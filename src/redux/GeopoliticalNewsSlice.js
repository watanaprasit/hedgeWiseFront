import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGeopoliticalNews = createAsyncThunk(
  'geopoliticalNews/fetchGeopoliticalNews',
  async () => {
    const response = await fetch('http://127.0.0.1:8000/api/geopolitical-risk-data/');
    const text = await response.text();
    const data = JSON.parse(text);
    return data;
  }
);

// Add the selector to your slice
export const selectAmtCoverageSum = (state) => state.geopoliticalNews.amtCoverageSum;

const geopoliticalNewsSlice = createSlice({
  name: 'geopoliticalNews',
  initialState: {
    newsData: [],
    PRIs: [],  // Ensuring PRIs are part of the initial state
    amtCoverageSum: 0, // Initial sum for Amt Coverage
    status: 'idle',
    error: null,
  },
  reducers: {
    addPRIs: (state, action) => {
      const newPRIs = Array.isArray(action.payload) ? action.payload : [action.payload];
      console.log('Adding PRIs:', newPRIs);  // Log the incoming PRIs

      // Make sure amtCoverage is always treated as a number
      newPRIs.forEach(pri => {
        pri.amtCoverage = parseFloat(pri["Amt Coverage"].replace(/[^0-9.-]+/g, '')) || 0; // Remove non-numeric chars and convert to number
      });

      state.PRIs.push(...newPRIs);

      // Recalculate Amt Coverage Sum
      state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
      console.log('Updated Amt Coverage Sum:', state.amtCoverageSum);  // Log the updated sum
    },

    deletePRI: (state, action) => {
      // Removes a PRI by its id
      const deletedPRI = state.PRIs.find(pri => pri.id === action.payload.id);
      if (deletedPRI) {
        state.PRIs = state.PRIs.filter(pri => pri.id !== action.payload.id);

        // Recalculate Amt Coverage Sum after deletion
        state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
      }
    },
    setPRIsFromBackend: (state, action) => {
      // Replaces the PRIs list with data from backend
      state.PRIs = action.payload.map((pri) => {
        // Ensure amtCoverage is properly treated as a number (remove non-numeric chars)
        pri.amtCoverage = parseFloat(pri["Amt Coverage"].replace(/[^0-9.-]+/g, '')) || 0;
        return pri;
      });

      // Recalculate Amt Coverage Sum
      state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeopoliticalNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGeopoliticalNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newsData = action.payload;
      })
      .addCase(fetchGeopoliticalNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the action creators to dispatch in components
export const { addPRIs, deletePRI, setPRIsFromBackend } = geopoliticalNewsSlice.actions;

export default geopoliticalNewsSlice.reducer;
