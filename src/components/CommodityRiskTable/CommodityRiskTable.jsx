import React from 'react';
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  TableRow
} from './CommodityRiskTable.styles'; // Adjusted import for CommodityRiskTable

const CommodityRiskTable = ({ commodityData }) => {
  if (!Array.isArray(commodityData) || commodityData.length === 0) {
    return <p>No commodity data available</p>;  // Display a fallback message if commodityData isn't an array or is empty
  }

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Date</TableHeader>
            <TableHeader>Price</TableHeader>
          </tr>
        </thead>
        <tbody>
          {commodityData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{new Date(data.date).toLocaleDateString()}</TableCell>
              <TableCell>{data.price}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default CommodityRiskTable;
