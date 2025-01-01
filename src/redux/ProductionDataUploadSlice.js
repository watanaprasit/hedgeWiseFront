import { createSlice } from '@reduxjs/toolkit';

const sanitizeNumber = (numString) => {
  return parseFloat(numString.replace(/,/g, '') || 0);
};

const calculateSumAndWeightedAverage = (contracts) => {
  if (!contracts || contracts.length === 0) {
    return { sumContractValues: 0, weightedAveragePrice: 0 };
  }

  const sumContractValues = contracts.reduce(
    (sum, contract) => sum + sanitizeNumber(contract["Contract Value"]),
    0
  );

  const totalWeightedValue = contracts.reduce(
    (sum, contract) =>
      sum + sanitizeNumber(contract["Price"]) * sanitizeNumber(contract["Contract Size"]),
    0
  );

  const totalContractSize = contracts.reduce(
    (sum, contract) => sum + sanitizeNumber(contract["Contract Size"]),
    0
  );

  const weightedAveragePrice =
    totalContractSize > 0 ? totalWeightedValue / totalContractSize : 0;

  return { sumContractValues, weightedAveragePrice };
};

const productionDataUploadSlice = createSlice({
  name: 'dataUpload',
  initialState: {
    data: [],
    futuresContracts: [],
    sumContractValues: 0, // Initial value for sum of contract values
    weightedAveragePrice: 0, // Initial value for weighted average price
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

    addFuturesContracts: (state, action) => {
      const newContracts = Array.isArray(action.payload) ? action.payload : [action.payload];
      state.futuresContracts = [...state.futuresContracts, ...newContracts];
      const { sumContractValues, weightedAveragePrice } = calculateSumAndWeightedAverage(
        state.futuresContracts
      );
      state.sumContractValues = sumContractValues;
      state.weightedAveragePrice = weightedAveragePrice;
    },

    deleteFuturesContract: (state, action) => {
      state.futuresContracts = state.futuresContracts.filter(
        (contract) => contract.id !== action.payload
      );

      const { sumContractValues, weightedAveragePrice } = calculateSumAndWeightedAverage(
        state.futuresContracts
      );

      state.sumContractValues = sumContractValues;
      state.weightedAveragePrice = weightedAveragePrice;
    },

    setFuturesContractsFromBackend: (state, action) => {
      state.futuresContracts = action.payload;

      const { sumContractValues, weightedAveragePrice } = calculateSumAndWeightedAverage(
        state.futuresContracts
      );

      state.sumContractValues = sumContractValues;
      state.weightedAveragePrice = weightedAveragePrice;
    },

    clearFuturesContracts: (state) => {
      state.futuresContracts = [];
      state.sumContractValues = 0;
      state.weightedAveragePrice = 0;
    },
  },
});

export const {
  addDataUpload,
  deleteDataUpload,
  setDataFromBackend,
  clearDataUpload,
  addFuturesContracts,
  deleteFuturesContract,
  setFuturesContractsFromBackend,
  clearFuturesContracts,
} = productionDataUploadSlice.actions;

export default productionDataUploadSlice.reducer;
