import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFuturesContractsFromBackend } from '../../redux/ProductionDataUploadSlice';
import { setForwardContractDataFromBackend, selectTotalUSD } from '../../redux/ForwardContractSlice'; 
import { setPRIsFromBackend } from '../../redux/GeopoliticalNewsSlice';
import { selectAmtCoverageSum } from '../../redux/GeopoliticalNewsSlice';  // Import the selector
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

  const totalUSD = useSelector(selectTotalUSD);  // Fetch the total USD amount
  const amtCoverageSum = useSelector(selectAmtCoverageSum); // Fetch amtCoverageSum from Redux store

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-PRIs/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            amtCoverage: Number(item["Amt Coverage"]) || 0,  // Access "Amt Coverage" instead of amtCoverage
            ...item.data,
          }));
          dispatch(setPRIsFromBackend(mappedData));
        } else {
          console.log("No valid PRIs data received.");
        }
      })
      .catch((error) => {
        console.error("Error fetching PRIs data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Fetching forward contracts from backend API
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-forward-contracts/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            ...item.data,
          }));
          dispatch(setForwardContractDataFromBackend(mappedData));
        }
      })
      .catch((error) => {
        console.error("Error fetching forward contracts data:", error);
        setErrorMessage("Error fetching forward contracts data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Fetching futures contracts from backend API
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-futures-contracts/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            ...item.data,
          }));
          dispatch(setFuturesContractsFromBackend(mappedData));
        }
      })
      .catch((error) => {
        console.error("Error fetching futures contracts data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Fetching FX rates from backend API
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

        <RiskCard>
          <RiskTitle>PRI Policies</RiskTitle>
          <RiskSummary>
            <RiskCard>
              <RiskTitle>PRI Coverage</RiskTitle>
              <RiskValue>{amtCoverageSum > 0 ? amtCoverageSum.toLocaleString() : 'Loading or No Data'}</RiskValue>
            </RiskCard>
          </RiskSummary>
        </RiskCard>

        <RiskCard>
          <RiskTitle>FX Hedging Overview</RiskTitle>
          <RiskSummary>
            <RiskCard>
              <RiskTitle>FX Portfolio</RiskTitle>
              <RiskValue>{totalUSD > 0 ? totalUSD.toLocaleString() : 'N/A'}</RiskValue>
            </RiskCard>
            
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
