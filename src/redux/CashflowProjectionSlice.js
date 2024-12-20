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
        console.log("Adding new CashflowProjection to Redux:", newCashflowProjection);  // Log to verify dispatch
        state.data.push(newCashflowProjection);  // Ensure the data is being added to the state
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
          console.log("State after adding CashflowProjection:", state.data);
        }
      });
    },
  },
});


export const { addCashflowProjection, deleteCashflowProjection, resetCashflowProjections, bulkAddCashflowProjections } = cashflowProjectionSlice.actions;

export default cashflowProjectionSlice.reducer;