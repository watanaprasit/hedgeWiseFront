import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice'; 
import CommodityRiskSlice from './CommodityRiskSlice';
import GeopoliticalNewsSlice from './GeopoliticalNewsSlice';

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,
    commodityRisk : CommodityRiskSlice,  
    geopoliticalNews : GeopoliticalNewsSlice,
  },
});

export default store;

