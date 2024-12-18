import { createSlice } from '@reduxjs/toolkit';

export const assetLocationSlice = createSlice({
  name: 'assetLocation',
  initialState: {
    data: [],
  },
  reducers: {
    addAssetLocation: (state, action) => {
      const newAsset = action.payload;
      const exists = state.data.some(item => item.id === newAsset.id);
      if (!exists) {
        console.log("Adding new asset to Redux:", newAsset);  // Log to verify dispatch
        state.data.push(newAsset);  // Ensure the data is being added to the state
      }
    },
    deleteAssetLocation: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
    resetAssetLocations: (state) => {
      state.data = [];
    },
    bulkAddAssetLocations: (state, action) => {
      action.payload.forEach((newAsset) => {
        const exists = state.data.some(item => item.id === newAsset.id);
        if (!exists) {
          state.data.push(newAsset);
          console.log("State after adding asset:", state.data);
        }
      });
    },
  },
});


export const { addAssetLocation, deleteAssetLocation, resetAssetLocations, bulkAddAssetLocations } = assetLocationSlice.actions;

export default assetLocationSlice.reducer;

