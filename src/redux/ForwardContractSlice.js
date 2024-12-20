import { createSlice } from '@reduxjs/toolkit';

export const forwardContractSlice = createSlice({
  name: 'forwardContract',
  initialState: {
    data: [],
  },
  reducers: {
    addForwardContract: (state, action) => {
      const newforwardContract = action.payload;
      const exists = state.data.some(item => item.id === newforwardContract.id);
      if (!exists) {
        console.log("Adding new forwardContract to Redux:", newforwardContract);  
        state.data.push(newforwardContract);  
      }
    },
    deleteForwardContract: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
    resetForwardContracts: (state) => {
      state.data = [];
    },
    bulkAddForwardContracts: (state, action) => {
      action.payload.forEach((newforwardContract) => {
        const exists = state.data.some(item => item.id === newforwardContract.id);
        if (!exists) {
          state.data.push(newforwardContract);
          console.log("State after adding forwardContract:", state.data);
        }
      });
    },
  },
});


export const { addForwardContract, deleteForwardContract, resetForwardContracts, bulkAddForwardContracts } = forwardContractSlice.actions;

export default forwardContractSlice.reducer;