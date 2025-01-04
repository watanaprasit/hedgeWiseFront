import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_URL

// Define the API endpoint
const API_URL = `${API_BASE_URL}/api/brent-crude-data/`;

// Thunk to fetch Brent Crude closing price data
export const fetchBrentCrudePrices = createAsyncThunk(
  "commodityRisk/fetchBrentCrudePrices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch Brent Crude data: ${response.statusText}`);
      }

      const json = await response.json();

      // Check if the response is in the expected format
      if (json.status !== "success" || !Array.isArray(json.data)) {
        throw new Error("Unexpected response format");
      }

      // Map and extract only the date and price fields from `data`
      const prices = json.data.map((item) => ({
        date: item.date,
        price: parseFloat(item.price), // Ensure price is a float
      }));

      return prices;
    } catch (error) {
      // Return the error message for better debugging
      return rejectWithValue(error.message || "Something went wrong while fetching data");
    }
  }
);

// Create a slice for commodity risks
const commodityRiskSlice = createSlice({
  name: "commodityRisk",
  initialState: {
    brentCrudePrices: [], // Holds the fetched price data
    productionData: [],   // Holds the production data from the `ProductionForecastTable`
    status: "idle",       // Tracks the API call status (idle, loading, succeeded, failed)
    error: null,          // Tracks any error message from the API call
  },
  reducers: {
    // Action to set production data from the `ProductionForecastTable`
    setProductionData: (state, action) => {
      state.productionData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrentCrudePrices.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear any previous error
      })
      .addCase(fetchBrentCrudePrices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.brentCrudePrices = action.payload; // Store fetched prices
      })
      .addCase(fetchBrentCrudePrices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
      });
  },
});

// Export actions
export const { setProductionData } = commodityRiskSlice.actions;

export default commodityRiskSlice.reducer;




  