import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL

export const fetchGeopoliticalNews = createAsyncThunk(
  'geopoliticalNews/fetchGeopoliticalNews',
  async () => {
    const response = await fetch(`${API_BASE_URL}/api/geopolitical-risk-data/`);
    const text = await response.text();
    const data = JSON.parse(text);
    return data;
  }
);

// Add the selector to your slice
export const selectAmtCoverageSum = (state) => state.geopoliticalNews.amtCoverageSum;
export const selectAnnualPremiumSum = (state) => state.geopoliticalNews.annualPremiumSum;


const geopoliticalNewsSlice = createSlice({
  name: 'geopoliticalNews',
  initialState: {
    newsData: [],
    PRIs: [],  
    amtCoverageSum: 0, 
    annualPremiumSum: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    addPRIs: (state, action) => {
      const newPRIs = Array.isArray(action.payload) ? action.payload : [action.payload];
      console.log('Adding PRIs:', newPRIs);  // Log the incoming PRIs

      // Make sure amtCoverage is always treated as a number
      newPRIs.forEach(pri => {
        pri.amtCoverage = parseFloat(pri["Amt Coverage"].replace(/[^0-9.-]+/g, '')) || 0; 
        pri.annualPremium = parseFloat(pri["Annual Premium"].replace(/[^0-9.-]+/g, '')) || 0;  // Convert Annual Premium to a number
      });

      state.PRIs.push(...newPRIs);

      // Recalculate Amt Coverage Sum
      state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
    },

    deletePRI: (state, action) => {
      // Removes a PRI by its id
      const deletedPRI = state.PRIs.find(pri => pri.id === action.payload.id);
      if (deletedPRI) {
        state.PRIs = state.PRIs.filter(pri => pri.id !== action.payload.id);

        // Recalculate Amt Coverage Sum after deletion
        state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
        state.annualPremiumSum = state.PRIs.reduce((sum, pri) => sum + (pri.annualPremium || 0), 0);
      }
    },
    setPRIsFromBackend: (state, action) => {
      // Replaces the PRIs list with data from backend
      state.PRIs = action.payload.map((pri) => {
        pri.amtCoverage = parseFloat(pri["Amt Coverage"].replace(/[^0-9.-]+/g, '')) || 0;
        pri.annualPremium = parseFloat(pri["Annual Premium"].replace(/[^0-9.-]+/g, '')) || 0;
        return pri;
      });

     
      state.amtCoverageSum = state.PRIs.reduce((sum, pri) => sum + (pri.amtCoverage || 0), 0);
      state.annualPremiumSum = state.PRIs.reduce((sum, pri) => sum + (pri.annualPremium || 0), 0);
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
