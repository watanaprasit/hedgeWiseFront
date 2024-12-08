import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFXRatesThunk } from '../../redux/FXRiskSlice';  // Corrected import for the FX rates thunk
import { DashboardContainer, DashboardHeader, RiskSummary, RiskCard, RiskTitle, RiskValue } from './Dashboard.styles';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { fxRates, status, error } = useSelector((state) => state.fxRisk); // Corrected the selector to use fxRisk

  useEffect(() => {
    dispatch(fetchFXRatesThunk()); // Fetch FX rates when the component mounts
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <DashboardContainer>
      <DashboardHeader>Company Risk Dashboard</DashboardHeader>
      <RiskSummary>
        <RiskCard>
          <RiskTitle>Commodity Price Risk</RiskTitle>
          <RiskValue>{fxRates.commodityPriceRisk}</RiskValue>  {/* Adjust according to your state */}
        </RiskCard>
        <RiskCard>
          <RiskTitle>FX Risk</RiskTitle>
          <RiskValue>{fxRates.fxRisk}</RiskValue>  {/* Adjust according to your state */}
        </RiskCard>
        <RiskCard>
          <RiskTitle>Geopolitical Risk</RiskTitle>
          <RiskValue>{fxRates.geopoliticalRisk}</RiskValue>  {/* Adjust according to your state */}
        </RiskCard>
      </RiskSummary>
    </DashboardContainer>
  );
};

export default Dashboard;



