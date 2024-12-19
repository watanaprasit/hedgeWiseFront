import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeopoliticalNews } from '../redux/GeopoliticalNewsSlice'; // Action to fetch geopolitical news
import GeopoliticalNewsTable from '../components/GeopoliticalNewsTable/GeopoliticalNewsTable';
import AssetLocationTable from '../components/AssetLocationTable/AssetLocationTable';
import AssetLocationMap from '../components/AssetLocationMap/AssetLocationMap';

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

      {/* Add AssetsLocation component below */}
      <AssetLocationTable />

      <AssetLocationMap />
      
      {status === 'loading' && <p>Loading geopolitical news...</p>}

      {status === 'succeeded' && newsData.length > 0 ? (
        <div>
          <GeopoliticalNewsTable newsData={newsData} /> {/* Pass news data to the table */}
        </div>
      ) : (
        <p>No geopolitical news available</p>
      )}

      {status === 'failed' && <p>Error: {error}</p>}


    </div>
  );
};

export default GeopoliticalNewsRoute;

