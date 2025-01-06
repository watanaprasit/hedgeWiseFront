import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice';
import CommodityRiskSlice from './CommodityRiskSlice';
import GeopoliticalNewsSlice from './GeopoliticalNewsSlice';
import productionDataUploadReducer from './ProductionDataUploadSlice';
import assetLocationReducer from './AssetLocationSlice';
import cashflowProjectionReducer from './CashflowProjectionSlice';
import forwardContractReducer from './ForwardContractSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,
    commodityRisk: CommodityRiskSlice,
    geopoliticalNews: GeopoliticalNewsSlice,
    dataUpload: productionDataUploadReducer,
    assetLocation: assetLocationReducer,
    cashflowProjection: cashflowProjectionReducer,
    forwardContract : forwardContractReducer, 
    auth: authReducer
  },
});

export default store;



