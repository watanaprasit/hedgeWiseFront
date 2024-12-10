import styled from 'styled-components';

// Existing styles for the table
export const TableContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 14px;
  color: #333;
`;

export const TableHeader = styled.th`
  background-color: #f4f4f9;
  padding: 12px;
  font-weight: bold;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

export const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
  color: #555;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

// New styled components for the open and close price boxes
export const PriceBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const PriceBox = styled.div`
  width: 45%;
  padding: 20px;
  background-color: #f4f4f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;