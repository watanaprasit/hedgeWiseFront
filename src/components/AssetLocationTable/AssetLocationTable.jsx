import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAssetLocation, deleteAssetLocation } from '../../redux/AssetLocationSlice';
import { Table, TableHeader, TableRow, TableCell, Button } from './AssetLocationTable.styles';
import AddAssetLocationRow from '../AddAssetLocationRow/AddAssetLocationRow';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const expectedHeaders = [
  "assetName", "region", "country", "latitude", "longitude", 
  "status", "productType"
];

const BASE_URL = process.env.REACT_APP_API_URL;

const AssetLocationTable = () => {
  const dispatch = useDispatch();
  const assetLocations = useSelector((state) => state.assetLocation.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-asset-locations/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,
          }));
          mappedData.forEach((item) => dispatch(addAssetLocation(item)));
        }
      })
      .catch((error) => {
        console.error("Error fetching asset location data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleDelete = (id) => {
    // Delete from Firestore API
    fetch(`${BASE_URL}/firebase-api/delete-asset-location/${id}/`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Asset location deleted successfully") {
        // Dispatch to delete from Redux store as well
        dispatch(deleteAssetLocation(id));
      }
    })
    .catch(error => {
      console.error('Error deleting asset location:', error);
      setErrorMessage('Error deleting asset location');
    });
  };

  const mapHeaders = (fileHeaders) => {
    const mapping = {};
    expectedHeaders.forEach((expectedHeader) => {
      const index = fileHeaders.findIndex(
        (header) => header.toLowerCase() === expectedHeader.toLowerCase()
      );
      if (index !== -1) {
        mapping[expectedHeader] = index;
      }
    });
    return Object.keys(mapping).length === expectedHeaders.length ? mapping : null;
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          const headers = data[0];
          const headerMapping = mapHeaders(headers);

          if (!headerMapping) {
            setErrorMessage(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
            setLoading(false);
            return;
          }

          const formattedData = data.slice(1).map((row) => {
            const rowData = {};
            Object.keys(headerMapping).forEach((key) => {
              rowData[key] = row[headerMapping[key]] || '';
            });
            return rowData;
          });

          // Update Redux with formatted data
          formattedData.forEach((item) => {
            dispatch(addAssetLocation(item));
          });

          // Send the formatted data directly as an array to Firestore API
          fetch(`${BASE_URL}/firebase-api/add-asset-location/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),  // Directly send as an array
          })
          .then(response => response.json())
          .then(data => {
            console.log('Assets added to Firestore:', data);
          })
          .catch(error => {
            console.error('Error posting assets to Firestore:', error);
            setErrorMessage("Error uploading assets");
          })
          .finally(() => setLoading(false));
        },
        header: false,
      });
    }
  };

  return (
    <div>
      <h2>Asset Locations</h2>
      <Button onClick={() => setIsPopupOpen(true)}>Add Row</Button>
      {isPopupOpen && <AddAssetLocationRow closePopup={() => setIsPopupOpen(false)} />}
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <CSVLink data={assetLocations} headers={expectedHeaders} filename="asset_locations.csv">
        <Button>Download Sample CSV</Button>
      </CSVLink>

      <Table>
        <thead>
          <TableRow>
            {expectedHeaders.map((header) => (
              <TableHeader key={header}>{header}</TableHeader>
            ))}
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {assetLocations.map((row) => (
            <TableRow key={row.id}>
              {expectedHeaders.map((header) => (
                <TableCell key={header}>{row[header] || 'N/A'}</TableCell>
              ))}
              <TableCell>
                <Button onClick={() => handleDelete(row.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AssetLocationTable;















