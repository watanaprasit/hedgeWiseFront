import styled from 'styled-components';

export const ComputationContainer = styled.div`
  width: 50%; /* Half the screen width */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto; /* Centers the container horizontally */
`;


export const ComputationHeader = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

export const SectionHeader = styled.h4`
  font-size: 20px;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
`;

export const ComputationText = styled.p`
  font-size: 18px;
  color: #333;
  margin: 10px 0;
`;

export const TableContainer = styled.div`
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

export const TableHeader = styled.th`
  background-color: #0073e6;
  color: white;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
`;

export const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
`;

export const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;
