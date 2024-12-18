import React, { useEffect, useState } from 'react';
import {
  ComputationContainer,
  ComputationHeader,
  SectionHeader,
  ComputationText,
} from './CommodityComputation.styles';

const CommodityComputation = ({ productionForecastData }) => {
  const [volatilityData, setVolatilityData] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);

  useEffect(() => {
    // Fetch volatility data
    fetch('https://brent-volatility-predictor.fly.dev/volatility?symbol=BZ=F')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        const volatilityMatch = data.match(/Next 7 Days Volatility:\s*([\d.]+)/);
        if (volatilityMatch) {
          setVolatilityData(volatilityMatch[1]);
        } else {
          setVolatilityData("Error fetching volatility data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching volatility data:", error);
        setVolatilityData("Error fetching volatility data.");
      });

    // Fetch latest market price data
    fetch('https://brent-volatility-predictor.fly.dev/api/brent-crude-data/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Get the most recent price from the data array
        if (data && data.data && data.data.length > 0) {
          const latestPriceData = data.data[data.data.length - 1];
          setLatestPrice(latestPriceData.price);
        } else {
          setLatestPrice("No price data available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching market price:", error);
        setLatestPrice("Error fetching market price.");
      });

  }, [productionForecastData]);

  return (
    <ComputationContainer>
      <ComputationHeader>Commodity Computation</ComputationHeader>

      {/* Volatility Data */}
      <div>
        <SectionHeader>Next 7 Day Volatility</SectionHeader>
        <ComputationText>{volatilityData ? `${(volatilityData * 100).toFixed(2)}%` : "Loading..."}</ComputationText>
      </div>

      {/* Latest Market Price */}
      <div>
        <SectionHeader>Latest Market Price</SectionHeader>
        <ComputationText>{latestPrice ? `$${parseFloat(latestPrice).toFixed(3)}` : "Loading..."}</ComputationText>
      </div>
    </ComputationContainer>
  );
};

export default CommodityComputation;













