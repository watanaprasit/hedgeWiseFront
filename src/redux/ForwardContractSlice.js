import { createSlice } from '@reduxjs/toolkit';

export const selectTotalUSD = (state) => {

  return state.forwardContract.data.reduce((total, contract) => {
    const usdAmount = String(contract['USD Amt']).replace(/,/g, ''); 
    const numericUSD = parseFloat(usdAmount); 
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
        'USD Amt': parseFloat(contract['USD Amt'].replace(/,/g, '')) || 0, // Remove commas and parse to number
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
