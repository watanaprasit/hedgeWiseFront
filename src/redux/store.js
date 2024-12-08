import { configureStore } from '@reduxjs/toolkit';
import FXRiskSlice from './FXRiskSlice'; // Import the FXRiskSlice

const store = configureStore({
  reducer: {
    fxRisk: FXRiskSlice,  // Make sure fxRisk is properly set up here
  },
});

export default store;

