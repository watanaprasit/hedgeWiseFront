import styled from 'styled-components';

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
