import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFXRatesThunk } from '../redux/FXRiskSlice'; // Action to fetch FX rates
import FXRiskTable from '../components/FXRiskTable/FXRiskTable'; 
import { PriceBoxContainer, PriceBox } from '../components/FXRiskTable/FXRiskTable.styles'; 
import CashflowProjectionTable from '../components/CashflowProjectionTable/CashflowProjectionTable';

const FXRiskRoute = () => {
  const dispatch = useDispatch();
  const fxRates = useSelector((state) => state.fxRisk.fxRates); // Access FX rates from state
  const status = useSelector((state) => state.fxRisk.status); // Fetch status from state
  const error = useSelector((state) => state.fxRisk.error); // Fetch error message if any

  useEffect(() => {
    dispatch(fetchFXRatesThunk()); // Dispatch the action to fetch FX rates
  }, [dispatch]);

  // Grouping FX rates by currency pair and picking the latest data
  const latestFXRates = fxRates.reduce((acc, rate) => {
    if (!acc[rate.currency_pair] || new Date(rate.date) > new Date(acc[rate.currency_pair].date)) {
      acc[rate.currency_pair] = rate;
    }
    return acc;
  }, {});

  // Convert the latest FX rates object to an array
  const latestFXRatesArray = Object.values(latestFXRates);

  return (
    <div>

      <CashflowProjectionTable />
      
      {status === 'loading' && <p>Loading FX Rates...</p>}
      
      {status === 'succeeded' && latestFXRatesArray.length > 0 ? (
        <div>
          {/* Display open and close prices in boxes for each currency pair */}
          {latestFXRatesArray.map((rate) => (
            <div key={rate.currency_pair}>
              <h3>{rate.currency_pair}</h3>
              <PriceBoxContainer>
                <PriceBox>
                  Open: {rate.open_price}
                </PriceBox>
                <PriceBox>
                  Close: {rate.close_price}
                </PriceBox>
              </PriceBoxContainer>
            </div>
          ))}
          
          <FXRiskTable fxRates={latestFXRatesArray} /> {/* Pass the latest FX rates to the table */}
        </div>
      ) : (
        <p>No FX rates available</p>
      )}

      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default FXRiskRoute;





