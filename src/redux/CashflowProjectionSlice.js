import { createSlice } from '@reduxjs/toolkit';

export const cashflowProjectionSlice = createSlice({
  name: 'cashflowProjection',
  initialState: {
    data: [],
  },
  reducers: {
    addCashflowProjection: (state, action) => {
      const newCashflowProjection = action.payload;
      const exists = state.data.some(item => item.id === newCashflowProjection.id);
      if (!exists) {
        state.data.push(newCashflowProjection);  
      }
    },
    deleteCashflowProjection: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
    resetCashflowProjections: (state) => {
      state.data = [];
    },
    bulkAddCashflowProjections: (state, action) => {
      action.payload.forEach((newCashflowProjection) => {
        const exists = state.data.some(item => item.id === newCashflowProjection.id);
        if (!exists) {
          state.data.push(newCashflowProjection);
        }
      });
    },
    updateCashflowProjection: (state, action) => {
      const updatedCashflowProjection = action.payload;
      const index = state.data.findIndex(item => item.id === updatedCashflowProjection.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updatedCashflowProjection };
      }
    },
  },
});

export const { 
  addCashflowProjection, 
  deleteCashflowProjection, 
  resetCashflowProjections, 
  bulkAddCashflowProjections, 
  updateCashflowProjection 
} = cashflowProjectionSlice.actions;

export default cashflowProjectionSlice.reducer;
