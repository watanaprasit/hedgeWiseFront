// ProductionDataUploadSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productionDataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState: {
    data: [],
  },
  reducers: {
    addDataUpload: (state, action) => {
      state.data.push(action.payload);
    },
    deleteDataUpload: (state, action) => {
      state.data.splice(action.payload, 1); // Remove the row at the specified index
    },
  },
});

export const { addDataUpload, deleteDataUpload } = productionDataUploadSlice.actions;

export default productionDataUploadSlice.reducer;

