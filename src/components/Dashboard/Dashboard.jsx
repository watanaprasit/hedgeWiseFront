import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFuturesContractsFromBackend } from '../../redux/ProductionDataUploadSlice';
import { setForwardContractDataFromBackend, selectTotalUSD } from '../../redux/ForwardContractSlice'; 
import { setPRIsFromBackend } from '../../redux/GeopoliticalNewsSlice';
import { selectAmtCoverageSum, selectAnnualPremiumSum } from '../../redux/GeopoliticalNewsSlice';  
import { DashboardContainer, DashboardHeader, RiskSummary, RiskCard, RiskTitle, RiskValue, CardContainer, ClockContainer, ClockCard } from './Dashboard.styles';  // Added ClockContainer and ClockCard

const BASE_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const dispatch = useDispatch();

  // Local state for loading and error messages
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // State for FX rates data
  const [fxRates, setFxRates] = useState([]);

  // State for Brent Crude closing price
  const [latestClosingPrice, setLatestClosingPrice] = useState(null);

  // Time states for clocks
  const [hagueTime, setHagueTime] = useState('');
  const [tokyoTime, setTokyoTime] = useState('');
  const [dubaiTime, setDubaiTime] = useState('');

  // Fetching data from the Redux store
  const { sumContractValues, weightedAveragePrice } = useSelector((state) => state.dataUpload);

  // Format the fetched values
  const formattedSumContractValues = sumContractValues > 0 ? sumContractValues.toLocaleString() : 'N/A';
  const formattedWeightedAveragePrice = weightedAveragePrice > 0 ? weightedAveragePrice.toFixed(2) : 'N/A';

  const totalUSD = useSelector(selectTotalUSD);  // Fetch the total USD amount
  const amtCoverageSum = useSelector(selectAmtCoverageSum); // Fetch amtCoverageSum from Redux store
  const annualPremiumSum = useSelector(selectAnnualPremiumSum);  // Access annualPremiumSum from Redux store


  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-PRIs/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            amtCoverage: Number(item["Amt Coverage"]) || 0,  // Access "Amt Coverage" instead of amtCoverage
            annualPremium: Number(item["Annual Premium"]) || 0,  // Convert Annual Premium to a number
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

  // Fetching Brent Crude latest closing price from backend API
  useEffect(() => {
    fetch(`${BASE_URL}/api/brent-crude-data/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.latest_closing_price) {
          setLatestClosingPrice(data.latest_closing_price);
        }
      })
      .catch((error) => {
        console.error("Error fetching Brent Crude data:", error);
        setErrorMessage("Error fetching Brent Crude data");
      });
  }, []);

  // Update time for each timezone
  useEffect(() => {
    const updateTimes = () => {
      const hagueTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Amsterdam',
        timeStyle: 'short',
        hourCycle: 'h23',
      }).format(new Date());

      const tokyoTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Tokyo',
        timeStyle: 'short',
        hourCycle: 'h23',
      }).format(new Date());

      const dubaiTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai',
        timeStyle: 'short',
        hourCycle: 'h23',
      }).format(new Date());

      setHagueTime(hagueTime);
      setTokyoTime(tokyoTime);
      setDubaiTime(dubaiTime);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute
    return () => clearInterval(interval); // Clear interval on component unmount
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

      {/* Time Clocks */}
      <ClockContainer>
        <ClockCard>
          <RiskTitle>The Hague</RiskTitle>
          <RiskValue>{hagueTime}</RiskValue>
        </ClockCard>
        <ClockCard>
          <RiskTitle>Tokyo</RiskTitle>
          <RiskValue>{tokyoTime}</RiskValue>
        </ClockCard>
        <ClockCard>
          <RiskTitle>Dubai</RiskTitle>
          <RiskValue>{dubaiTime}</RiskValue>
        </ClockCard>
      </ClockContainer>

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
            <RiskCard>
              <RiskTitle>Latest Closing Price</RiskTitle>
              <RiskValue>{latestClosingPrice ? latestClosingPrice.toFixed(2) : 'N/A'}</RiskValue>
            </RiskCard>
          </RiskSummary>
        </RiskCard>

        <RiskCard>
          <RiskTitle>Political Risk Insurance Policies</RiskTitle>

          <RiskSummary>
            <RiskCard>
              <RiskTitle>PRI Coverage</RiskTitle>
              <RiskValue>{amtCoverageSum > 0 ? amtCoverageSum.toLocaleString() : 'Loading or No Data'}</RiskValue>
            </RiskCard>
            <RiskCard>
              <RiskTitle>Annual Premium</RiskTitle>
              <RiskValue>{annualPremiumSum > 0 ? annualPremiumSum.toLocaleString() : 'Loading or No Data'}</RiskValue>
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
