import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBrentCrudePrices } from '../redux/CommodityRiskSlice';
import ProductionForecastTable from '../components/ProductionForecastTable/ProductionForecastTable'; 
import CommodityComputation from '../components/CommodityComputation/CommodityComputation'; 
import FuturesContractTable from '../components/FuturesContractTable/FuturesContractTable';

const CommodityRiskRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBrentCrudePrices());
  }, [dispatch]);

  return (
    <div>
      <ProductionForecastTable />

      <FuturesContractTable />
      
      <CommodityComputation />
      
    </div>
  );
};

export default CommodityRiskRoute;
