import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice';
import CommodityRiskSlice from './CommodityRiskSlice';
import GeopoliticalNewsSlice from './GeopoliticalNewsSlice';
import productionDataUploadReducer from './ProductionDataUploadSlice';
import assetLocationReducer from './AssetLocationSlice';
import cashflowProjectionReducer from './CashflowProjectionSlice';

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,
    commodityRisk: CommodityRiskSlice,
    geopoliticalNews: GeopoliticalNewsSlice,
    dataUpload: productionDataUploadReducer,
    assetLocation: assetLocationReducer,
    cashflowProjection: cashflowProjectionReducer, 
  },
});

export default store;



