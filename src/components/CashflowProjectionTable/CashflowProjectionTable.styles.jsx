import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #f2f2f2;
  position: sticky; /* Makes the header stick */
  top: 0; /* Sticks to the top of the container */
  z-index: 1; /* Ensures the header is above the body rows */
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9; /* Alternating row colors */
  }
`;

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

  &:hover {
    background-color: #45a049;
  }
`;

export const ScrollableTableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto; /* Ensures vertical scrolling */
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