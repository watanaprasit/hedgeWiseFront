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

  return (
    <TableContainer> {/* Use the styled component here */}
      <StyledTable> {/* Use the styled component here */}
        <thead>
          <tr>
            <TableHeader>Currency Pair</TableHeader>
            <TableHeader>Open Price</TableHeader>
            <TableHeader>High Price</TableHeader>
            <TableHeader>Low Price</TableHeader>
            <TableHeader>Close Price</TableHeader>
            <TableHeader>Volume</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {fxRates.map((rate, index) => (
            <TableRow key={index}> {/* Use the styled component here */}
              <TableCell>{rate.currency_pair}</TableCell> {/* Use the styled component here */}
              <TableCell>{rate.open_price}</TableCell> {/* Use the styled component here */}
              <TableCell>{rate.high_price}</TableCell> {/* Use the styled component here */}
              <TableCell>{rate.low_price}</TableCell> {/* Use the styled component here */}
              <TableCell>{rate.close_price}</TableCell> {/* Use the styled component here */}
              <TableCell>{rate.volume}</TableCell> {/* Use the styled component here */}
              <TableCell>{new Date(rate.date).toLocaleDateString()}</TableCell> {/* Use the styled component here */}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer> 
  );
};

export default FXRiskTable;






