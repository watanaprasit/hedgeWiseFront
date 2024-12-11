// ProductionForecastTable.styles.js

import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
`;

export const TableRow = styled.tr`
  background-color: #f9f9f9;
`;

export const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

export const TableHeader = styled.th`
  padding: 12px;
  background-color: #f4f4f9;
  border: 1px solid #ddd;
  font-weight: bold;
`;

export const Button = styled.button`
  background-color: #4CAF50; /* Green */
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

