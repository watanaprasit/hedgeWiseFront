import styled from 'styled-components';

// Container for the entire table
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
`;

// Table header row
export const TableHead = styled.thead`
  background-color: #f4f4f4;
`;

// Table header cell
export const TableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
`;

// Table body row
export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

// Table cell
export const TableCell = styled.td`
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
`;

// Optional styling for currency/amount cells
export const CurrencyCell = styled(TableCell)`
  text-align: center;
  font-weight: bold;
`;

// Optional responsive table adjustments for smaller screens
export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;

  @media (max-width: 768px) {
    table {
      width: 100%;
    }

    th, td {
      padding: 10px;
    }
  }
`;

export const ScrollableTableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto; /* Ensures vertical scrolling */
  border: 1px solid #ccc;
  margin-top: 10px;
`;

export const LeftAlignedContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

export const RightAlignedContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
`;
