import React from 'react';
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  TableRow
} from './FXRiskTable.styles'; // Import the styled components

const FXRiskTable = ({ fxRates }) => {
  // Ensure fxRates is an array before using map()
  if (!Array.isArray(fxRates) || fxRates.length === 0) {
    return <p>No FX rates available</p>;  // Display a fallback message if fxRates isn't an array or is empty
  }

  // Extract only the most recent data for display
  const latestRates = fxRates.map((rate) => ({
    currency_pair: rate.currency_pair,
    close_price: rate.close_price,
    open_price: rate.open_price,
    high_price: rate.high_price,
    low_price: rate.low_price,
    date: new Date(rate.date).toLocaleDateString(), // Format the date for display
  }));

  // Get today's date for display
  const todayDate = new Date().toLocaleDateString();

  return (
    <div>
      {/* Display today's date on top of the table */}
      <h3>{`FX Rates for ${todayDate}`}</h3>

      <TableContainer> {/* Use the styled component here */}
        <StyledTable> {/* Use the styled component here */}
          <thead>
            <tr>
              <TableHeader>Currency Pair</TableHeader>
              <TableHeader>Open Price</TableHeader>
              <TableHeader>High Price</TableHeader>
              <TableHeader>Low Price</TableHeader>
              <TableHeader>Close Price</TableHeader>
            </tr>
          </thead>
          <tbody>
            {latestRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>{rate.currency_pair}</TableCell>
                <TableCell>{rate.open_price}</TableCell>
                <TableCell>{rate.high_price}</TableCell>
                <TableCell>{rate.low_price}</TableCell>
                <TableCell>{rate.close_price}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </div>
  );
};

export default FXRiskTable;
