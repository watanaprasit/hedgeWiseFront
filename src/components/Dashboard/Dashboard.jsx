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
        
        {/* Placeholder for future cards (FX & Geopolitical) */}
        {/* You can add more RiskCard components for FX and Geopolitical risks here */}
      </CardContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
