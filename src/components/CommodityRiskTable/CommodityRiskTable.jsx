import React from 'react';
import {
  TableContainer,
  StyledTable,
  TableHeader,
  TableCell,
  TableRow,
} from './CommodityRiskTable.styles'; 

const CommodityRiskTable = ({ commodityData }) => {
  if (!Array.isArray(commodityData) || commodityData.length === 0) {
    return <p>No commodity data available</p>; 
  }

  const latestData = [...commodityData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <TableContainer>
      <h2>Latest Brent Crude Oil Prices</h2> 
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
              <TableCell>{data.price.toFixed(2)}</TableCell> 
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default CommodityRiskTable;


