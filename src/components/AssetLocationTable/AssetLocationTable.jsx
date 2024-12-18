import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAssetLocation, deleteAssetLocation } from '../../redux/AssetLocationSlice';
import { Table, TableHeader, TableRow, TableCell, Button } from './AssetLocationTable.styles';
import AddAssetLocationRow from '../AddAssetLocationRow/AddAssetLocationRow';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse'; // Import papaparse for CSV parsing

const expectedHeaders = [
  "assetName", "region", "country", "latitude", "longitude", "status", "productType"
];

const AssetLocationTable = () => {
  const dispatch = useDispatch();
  const assetLocations = useSelector((state) => state.assetLocation.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedData, setUploadedData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/firebase-api/get-asset-locations/')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,  
          }));

          mappedData.forEach((item) => {
            dispatch(addAssetLocation(item));
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching asset location data:", error);
        setErrorMessage("Error fetching data");
      });
  }, [dispatch]);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/firebase-api/delete-asset-location/${id}/`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Document deleted successfully') {
        dispatch(deleteAssetLocation(id));
      } else {
        console.error("Error deleting document:", data);
        setErrorMessage("Error deleting document.");
      }
    })
    .catch((error) => {
      console.error("Error deleting from Firestore:", error);
      setErrorMessage("Error deleting document.");
    });
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          console.log("Parsed CSV Data:", data); // Log the parsed data
  
          // Validate headers and map data
          const headers = data[0];
          const isValid = expectedHeaders.every(header => headers.includes(header));
          if (isValid) {
            const formattedData = data.slice(1).map((row, index) => {
              // Check for empty or invalid rows
              if (row.some(cell => cell === '' || cell === null)) {
                console.error(`Skipping row ${index + 1}: Invalid or empty data`);
                return null;  // Skip empty rows
              }
  
              return {
                id: `AL-${index + 1}`,
                assetName: row[0],
                region: row[1],
                country: row[2],
                latitude: row[3],
                longitude: row[4],
                status: row[5],
                productType: row[6],
              };
            }).filter(item => item); // Remove any null items (invalid rows)
  
            console.log("Formatted Data:", formattedData);
            setUploadedData(formattedData);
  
            // POST each formatted asset to Firestore
            const postRequests = formattedData.map((item) => {
              return fetch('http://127.0.0.1:8000/firebase-api/add-asset-location/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
              })
              .then((response) => response.json())
              .then((data) => {
                if (data.id) {
                  console.log(`Data added to Firestore: ${data.id}`);
                  dispatch(addAssetLocation(item));
                } else {
                  console.error(`Failed to add asset: ${JSON.stringify(data)}`); // Log full response
                }
              })
              .catch((error) => {
                console.error(`Error posting data for ${item.id}:`, error);
                setErrorMessage("Error adding asset location.");
              });              
            });
  
            // Wait for all POST requests to complete
            Promise.all(postRequests)
              .then(() => {
                console.log("All data successfully uploaded to Firestore");
              })
              .catch((error) => {
                console.error("Error uploading some data:", error);
              });
  
          } else {
            setErrorMessage("Invalid CSV headers. Please check the format.");
          }
        },
        header: false,
      });
    }
  };
  
  

  const csvHeaders = expectedHeaders.map(header => ({
    label: header,
    key: header.toLowerCase().replace(/ /g, ''),
  }));

  return (
    <div>
      <Button onClick={openPopup}>Add Row</Button>
      {isPopupOpen && <AddAssetLocationRow closePopup={closePopup} />}

      {/* File input for CSV upload */}
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleCSVUpload} 
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <CSVLink data={assetLocations} headers={csvHeaders} filename="asset_locations.csv">
        <Button>Download Sample CSV</Button>
      </CSVLink>

      <Table>
          <thead>
            <TableRow>
              <TableHeader>Asset Name</TableHeader>
              <TableHeader>Region</TableHeader>
              <TableHeader>Country</TableHeader>
              <TableHeader>Latitude</TableHeader>
              <TableHeader>Longitude</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Product Type</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {assetLocations.filter((row) => 
              row.assetName || row.region || row.country || row.latitude || row.longitude || row.status || row.productType
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.assetName || ''}</TableCell>
                <TableCell>{row.region || ''}</TableCell>
                <TableCell>{row.country || ''}</TableCell>
                <TableCell>{row.latitude || ''}</TableCell>
                <TableCell>{row.longitude || ''}</TableCell>
                <TableCell>{row.status || ''}</TableCell>
                <TableCell>{row.productType || ''}</TableCell>
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





