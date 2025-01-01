import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

export const DashboardHeader = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RiskSummary = styled.div`
  display: flex;
  flex-direction: column;
`;

export const RiskCard = styled.div`
  background: #fff;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
`;

export const RiskTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 10px;
`;

export const RiskValue = styled.p`
  font-size: 1.125rem;
  font-weight: bold;
`;
