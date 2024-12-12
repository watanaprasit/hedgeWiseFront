import { createSlice } from '@reduxjs/toolkit';

const productionDataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState: {
    data: [],
  },
  reducers: {
    // Action to add new data to the store
    addDataUpload: (state, action) => {
      state.data.push(action.payload);
    },
    // Action to delete data by index
    deleteDataUpload: (state, action) => {
      // Remove the row at the specified index
      state.data.splice(action.payload, 1);
    },
    // Action to set data from the backend (overwrite the existing data)
    setDataFromBackend: (state, action) => {
      state.data = action.payload; // Set state from backend data
    },
    // Action to clear all data (for handling new uploads)
    clearDataUpload: (state) => {
      state.data = []; // Clear all data from the store
    },
  },
});

// Export actions
export const { addDataUpload, deleteDataUpload, setDataFromBackend, clearDataUpload } = productionDataUploadSlice.actions;

export default productionDataUploadSlice.reducer;



