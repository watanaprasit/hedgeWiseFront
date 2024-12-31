import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFXRatesThunk } from '../../redux/FXRiskSlice'; // Import the correct thunk
import Dashboard from '../Dashboard/Dashboard'; 

const DashboardRoute = () => {
  const dispatch = useDispatch();
  const fxRates = useSelector((state) => state.fxRisk.fxRates);
  const status = useSelector((state) => state.fxRisk.status);
  const error = useSelector((state) => state.fxRisk.error);

  useEffect(() => {
    dispatch(fetchFXRatesThunk()); // Dispatch the thunk to fetch FX rates
  }, [dispatch]);

  return (
    <div>
      {status === 'loading' && <p>Loading FX rates...</p>}
      {status === 'succeeded' && fxRates && (
        <Dashboard fxRates={fxRates} /> // Pass fetched FX rates to Dashboard component
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default DashboardRoute;




