import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrentCrudePrices } from '../redux/CommodityRiskSlice';
import CommodityRiskTable from '../components/CommodityRiskTable/CommodityRiskTable'; 
import ProductionForecastTable from '../components/ProductionForecastTable/ProductionForecastTable'; // Add the new table
import CommodityComputation from '../components/CommodityComputation/CommodityComputation'; // Import the new component

const CommodityRiskRoute = () => {
  const dispatch = useDispatch();
  const commodityData = useSelector((state) => state.commodityRisk.brentCrudePrices); // Use the correct state field
  const status = useSelector((state) => state.commodityRisk.status);
  const error = useSelector((state) => state.commodityRisk.error);

  useEffect(() => {
    dispatch(fetchBrentCrudePrices());
  }, [dispatch]);

  return (
    <div>
      {/* Add new section for production forecast */}
      <ProductionForecastTable />
      
      {/* Add the new CommodityComputation component */}
      <CommodityComputation commodityData={commodityData} />
      
      {status === 'loading' && <p>Loading commodity data...</p>}

      {status === 'succeeded' && Array.isArray(commodityData) && commodityData.length > 0 ? (
        <div>
          <CommodityRiskTable commodityData={commodityData} /> {/* Pass commodity data to the table */}
        </div>
      ) : status === 'succeeded' ? (
        <p>No commodity data available</p>
      ) : null}

      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default CommodityRiskRoute;



