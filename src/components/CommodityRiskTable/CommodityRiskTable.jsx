import React from 'react';
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  TableRow,
} from './CommodityRiskTable.styles'; // Adjusted import for CommodityRiskTable

const CommodityRiskTable = ({ commodityData }) => {
  if (!Array.isArray(commodityData) || commodityData.length === 0) {
    return <p>No commodity data available</p>; // Display a fallback message if commodityData isn't an array or is empty
  }

  // Sort the data by date in descending order and take the latest 10 entries
  const latestData = [...commodityData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <TableContainer>
      <h2>Latest Brent Crude Oil Prices</h2> {/* Add header */}
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Date</TableHeader>
            <TableHeader>Price</TableHeader>
          </tr>
        </thead>
        <tbody>
          {latestData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(data.date).toLocaleDateString()}</TableCell>
              <TableCell>{data.price.toFixed(2)}</TableCell> {/* Ensure price has 2 decimal places */}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default CommodityRiskTable;


