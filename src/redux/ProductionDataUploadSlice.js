import { createSlice } from '@reduxjs/toolkit';

const productionDataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState: {
    data: [],
  },
  reducers: {
    addDataUpload: (state, action) => {
      const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.data = [...state.data, ...newData];
    },
    deleteDataUpload: (state, action) => {
      state.data = state.data.filter((row) => row.id !== action.payload);
    },
    setDataFromBackend: (state, action) => {
      state.data = action.payload;
    },
    clearDataUpload: (state) => {
      state.data = [];
    },
  },
});

export const { addDataUpload, deleteDataUpload, setDataFromBackend, clearDataUpload } = productionDataUploadSlice.actions;
export default productionDataUploadSlice.reducer;




