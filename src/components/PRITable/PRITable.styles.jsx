import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f2f2f2;
`;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

export const Button = styled.button`
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: #67d967; /* Lighter green hover color */
  }
`;


export const ScrollableTableContainer = styled.div`
  max-height: 400px;
  overflow: auto;
  border: 1px solid #ccc;
  margin-top: 10px;
`;


export const RightAlignedContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

