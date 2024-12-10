import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommodityRiskThunk } from '../redux/CommodityRiskSlice'; // Action to fetch commodity data
import CommodityRiskTable from '../components/CommodityRiskTable/CommodityRiskTable'; 
import { PriceBoxContainer, PriceBox } from '../components/CommodityRiskTable/CommodityRiskTable.styles';

const CommodityRiskRoute = () => {
  const dispatch = useDispatch();
  const commodityData = useSelector((state) => state.commodityRisk.commodityRiskData);
  const status = useSelector((state) => state.commodityRisk.status);
  const error = useSelector((state) => state.commodityRisk.error);

  useEffect(() => {
    dispatch(fetchCommodityRiskThunk());
  }, [dispatch]);

  return (
    <div>
      {status === 'loading' && <p>Loading commodity data...</p>}
      
      {status === 'succeeded' && commodityData.length > 0 ? (
        <div>
          <CommodityRiskTable commodityData={commodityData} /> {/* Pass commodity data to the table */}
        </div>
      ) : (
        <p>No commodity data available</p>
      )}

      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default CommodityRiskRoute;
