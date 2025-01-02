import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeopoliticalNews } from '../redux/GeopoliticalNewsSlice'; 
import GeopoliticalNewsTable from '../components/GeopoliticalNewsTable/GeopoliticalNewsTable';
import AssetLocationTable from '../components/AssetLocationTable/AssetLocationTable';
import AssetLocationMap from '../components/AssetLocationMap/AssetLocationMap';
import PRITable from '../components/PRITable/PRITable';

const GeopoliticalNewsRoute = () => {
  const dispatch = useDispatch();
  const newsData = useSelector((state) => state.geopoliticalNews.newsData);
  const status = useSelector((state) => state.geopoliticalNews.status);
  const error = useSelector((state) => state.geopoliticalNews.error);

  useEffect(() => {
    dispatch(fetchGeopoliticalNews());
  }, [dispatch]);

  return (
    <div>

      {status === 'loading' && <p>Loading geopolitical news...</p>}

      {status === 'succeeded' && newsData.length > 0 ? (
        <div>
          <GeopoliticalNewsTable newsData={newsData} /> 
        </div>
      ) : (
        <p>No geopolitical news available</p>
      )}

      {status === 'failed' && <p>Error: {error}</p>}

      <AssetLocationMap />
      
      <AssetLocationTable />

      <PRITable />


    </div>
  );
};

export default GeopoliticalNewsRoute;

