import React, { useEffect, useState } from 'react';
import {
  ComputationContainer,
  ComputationHeader,
  SectionHeader,
  ComputationText,
} from './CommodityComputation.styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CommodityComputation = ({ productionForecastData }) => {
  const [volatilityData, setVolatilityData] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const [pastWeekPrices, setPastWeekPrices] = useState([]);
  const [percentageChange, setPercentageChange] = useState(null);

  useEffect(() => {
    // Fetch volatility data
    fetch('http://127.0.0.1:8001/volatility?symbol=BZ=F')
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
    fetch('http://127.0.0.1:8001/api/brent-crude-data/')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data) {
          // Extract the latest price
          if (data.data.latest) {
            setLatestPrice(data.data.latest.price);
          } else {
            setLatestPrice("No latest price data available.");
          }

          // Extract the past 7 days' prices
          if (data.data.past_7_days && data.data.past_7_days.length > 0) {
            const pastWeek = data.data.past_7_days;
            setPastWeekPrices(pastWeek);

            // Calculate percentage change if the latest and oldest prices are available
            const lastWeekPrice = parseFloat(pastWeek[0].price);
            const currentPrice = parseFloat(data.data.latest.price);
            if (lastWeekPrice && currentPrice) {
              const change = ((currentPrice - lastWeekPrice) / lastWeekPrice) * 100;
              setPercentageChange(change.toFixed(2));
            }
          } else {
            setPastWeekPrices([]);
          }
        } else {
          setLatestPrice("No price data available.");
          setPastWeekPrices([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching market price:", error);
        setLatestPrice("Error fetching market price.");
        setPastWeekPrices([]);
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

      {/* Percentage Change */}
      <div>
        <SectionHeader>Percentage Change Since Last Week</SectionHeader>
        <ComputationText>
          {percentageChange !== null ? `${percentageChange}%` : "Calculating..."}
        </ComputationText>
      </div>

      {/* Past 7 Days Prices Line Chart */}
      <div>
        <SectionHeader>Past 7 Days Prices</SectionHeader>
        {pastWeekPrices.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={pastWeekPrices} margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[72, 75]} /> {/* Y-axis with fixed range */}
              <Tooltip
                formatter={(value) => `$${parseFloat(value).toFixed(3)}`} // Format price to 3 d.p.
                labelFormatter={(label) => `Date: ${label}`} // Format label to include the date
              />
              <Line type="monotone" dataKey="price" stroke="#8884d8" dot={true} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ComputationText>No data available for the past 7 days.</ComputationText>
        )}
      </div>
    </ComputationContainer>
  );
};

export default CommodityComputation;
