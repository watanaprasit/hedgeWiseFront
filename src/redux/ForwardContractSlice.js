import { createSlice } from '@reduxjs/toolkit';

// Selector to calculate the total USD Amt without rounding
export const selectTotalUSD = (state) => {
  return state.forwardContract.data.reduce((total, contract) => {
    const usdAmount = String(contract['USD Amt']).replace(/,/g, ''); // Convert to string and remove commas
    const numericUSD = parseFloat(usdAmount); // Convert to a number
    if (!isNaN(numericUSD)) {
      return total + numericUSD;
    }
    return total;
  }, 0); 
};



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
        state.data.push(newforwardContract);  
      }
    },
    deleteForwardContract: (state, action) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },

    setForwardContractDataFromBackend: (state, action) => {
      state.data = action.payload.map(contract => ({
        ...contract,
        'USD Amt': parseFloat(contract['USD Amt']) || 0,  
      }));
    },

    resetForwardContracts: (state) => {
      state.data = [];
    },

    bulkAddForwardContracts: (state, action) => {
      action.payload.forEach((newforwardContract) => {
        const exists = state.data.some(item => item.id === newforwardContract.id);
        if (!exists) {
          state.data.push(newforwardContract);
        }
      });
    },
  },
});

export const { 
  addForwardContract, 
  deleteForwardContract, 
  resetForwardContracts, 
  bulkAddForwardContracts, 
  setForwardContractDataFromBackend 
} = forwardContractSlice.actions;

export default forwardContractSlice.reducer;
