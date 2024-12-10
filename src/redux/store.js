import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice'; 
import CommodityRiskSlice from './CommodityRiskSlice';

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,
    commodityRisk : CommodityRiskSlice,  
  },
});

export default store;

