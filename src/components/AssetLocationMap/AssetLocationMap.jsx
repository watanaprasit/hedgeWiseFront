import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Leaflet for custom marker icon
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS file

const AssetLocationMap = () => {
  const assetLocations = useSelector((state) => state.assetLocation.data); // Get asset locations from Redux
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.invalidateSize(); // To fix any rendering issue on resize or load
    }
  }, [map]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h2>Assets Map</h2>
      <MapContainer
        center={[51.505, -0.09]} // Default map center (can be dynamic based on assets)
        zoom={2} // Initial zoom level
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => setMap(mapInstance)} // Store map instance in state
      >
        {/* OpenStreetMap TileLayer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers for each asset location */}
        {assetLocations.map((asset) => (
          <Marker
            key={asset.id}
            position={[parseFloat(asset.latitude), parseFloat(asset.longitude)]}
            icon={L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default marker icon
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <div>
                <h3>{asset.assetName}</h3>
                <p>Region: {asset.region}</p>
                <p>Country: {asset.country}</p>
                <p>Latitude: {asset.latitude}</p>
                <p>Longitude: {asset.longitude}</p>
                <p>Status: {asset.status}</p>
                <p>Product Type: {asset.productType}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AssetLocationMap;
