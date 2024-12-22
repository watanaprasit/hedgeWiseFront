import { createSlice } from '@reduxjs/toolkit';

const productionDataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState: {
    data: [],
  },
  reducers: {
    addDataUpload: (state, action) => {
      // Normalize the action.payload into an array (if it's not already an array)
      const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
      console.log("New data being added to Redux:", newData);

      // Add the new data to the state
      state.data = [...state.data, ...newData];
    },

    deleteDataUpload: (state, action) => {
      // Remove the row based on its id
      state.data = state.data.filter((row) => row.id !== action.payload);
    },

    setDataFromBackend: (state, action) => {
      // Set the data from the backend
      state.data = action.payload;
    },

    clearDataUpload: (state) => {
      // Clear all data from the state
      state.data = [];
    },
  },
});

export const { addDataUpload, deleteDataUpload, setDataFromBackend, clearDataUpload } = productionDataUploadSlice.actions;
export default productionDataUploadSlice.reducer;
