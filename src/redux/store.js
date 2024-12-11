import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice';
import CommodityRiskSlice from './CommodityRiskSlice';
import GeopoliticalNewsSlice from './GeopoliticalNewsSlice';
import productionDataUploadReducer from './ProductionDataUploadSlice';

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,
    commodityRisk: CommodityRiskSlice,
    geopoliticalNews: GeopoliticalNewsSlice,
    dataUpload: productionDataUploadReducer, // Updated slice name
  },
});

export default store;


