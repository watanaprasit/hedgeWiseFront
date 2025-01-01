import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFuturesContractsFromBackend } from '../../redux/ProductionDataUploadSlice';
import { DashboardContainer, DashboardHeader, RiskSummary, RiskCard, RiskTitle, RiskValue, CardContainer } from './Dashboard.styles';

const BASE_URL = 'http://127.0.0.1:8000';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Local state for loading and error messages
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // State for FX rates data
  const [fxRates, setFxRates] = useState([]);

  // Fetching data from the Redux store
  const { sumContractValues, weightedAveragePrice } = useSelector((state) => state.dataUpload);

  // Format the fetched values
  const formattedSumContractValues = sumContractValues > 0 ? sumContractValues.toLocaleString() : 'N/A';
  const formattedWeightedAveragePrice = weightedAveragePrice > 0 ? weightedAveragePrice.toFixed(2) : 'N/A';

  // Fetch futures contracts from backend API
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-futures-contracts/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Map the data to match your required format
          const mappedData = data.map((item) => ({
            id: item.id,
            ...item.data,
          }));
          // Dispatch action to store the data in Redux
          dispatch(setFuturesContractsFromBackend(mappedData));
        }
      })
      .catch((error) => {
        console.error("Error fetching futures contracts data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Fetch FX rates from backend API
  useEffect(() => {
    fetch(`${BASE_URL}/api/currency-data/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setFxRates(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching FX data:", error);
        setErrorMessage("Error fetching FX data");
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>HedgeWise Risk Dashboard</DashboardHeader>
      
      <CardContainer>
        {/* Brent Crude Oil Risk Overview Card */}
        <RiskCard>
          <RiskTitle>Brent Crude Oil Risk Overview</RiskTitle>
          <RiskSummary>
            <RiskCard>
              <RiskTitle>Total Portfolio Value</RiskTitle>
              <RiskValue>{formattedSumContractValues}</RiskValue>
            </RiskCard>
            <RiskCard>
              <RiskTitle>Weighted Average Price</RiskTitle>
              <RiskValue>{formattedWeightedAveragePrice}</RiskValue>
            </RiskCard>
          </RiskSummary>
        </RiskCard>

        {/* FX Rates Overview Card */}
        <RiskCard>
          <RiskTitle>FX Rates Overview</RiskTitle>
          <RiskSummary>
            {fxRates.length > 0 ? (
              fxRates.map((rate, index) => (
                <RiskCard key={index}>
                  <RiskTitle>{rate.currency_pair}</RiskTitle>
                  <RiskValue>Closing Price: {rate.close_price}</RiskValue>
                </RiskCard>
              ))
            ) : (
              <RiskValue>No FX data available</RiskValue>
            )}
          </RiskSummary>
        </RiskCard>
      </CardContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
