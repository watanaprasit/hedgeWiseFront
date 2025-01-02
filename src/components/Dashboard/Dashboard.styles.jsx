import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e; /* Dark background */
  height: 100vh;
  color: #E1E1E1; /* Light text */
`;

export const DashboardHeader = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 40px;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start; /* Center the card blocks horizontally */
  justify-content: center; /* Center the card blocks vertically */
  width: 100%;
  max-width: 1200px; /* Limit the width of the container */
  margin: 0 auto; /* Center the container itself */
`;
export const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const RiskCard = styled.div`
  background: #2a2a2a;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
  flex: 1;
  min-width: 250px;
  max-width: 350px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

export const RiskTitle = styled.h3`
  font-size: 1.25rem;
  color: #8e8e8e;
  margin-bottom: 10px;
`;

export const RiskValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
`;

export const RiskCardHeader = styled.h3`
  font-size: 1.5rem;
  color: #3498db; /* Light blue accents */
  margin-bottom: 20px;
`;
