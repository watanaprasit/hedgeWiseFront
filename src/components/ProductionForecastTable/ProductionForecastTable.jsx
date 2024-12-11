import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDataUpload, deleteDataUpload } from '../../redux/ProductionDataUploadSlice';
import { Table, TableHeader, TableRow, TableCell, Button } from './ProductionForecastTable.styles';
import AddProductionRow from '../AddProductionRow/AddProductionRow';
import { CSVLink } from 'react-csv';

const expectedHeaders = [
  "Region", "Country", "Asset", "Reservoir Status", "Product Type", 
  "CCY", "Breakeven Price", "Volume", "Volume Units", "Forecast Period", 
  "Due Month", "Year"
];

const ProductionForecastTable = () => {
  const dispatch = useDispatch();
  const productionData = useSelector((state) => state.dataUpload.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleDelete = (index) => {
    dispatch(deleteDataUpload(index));
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Handle CSV file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result.split('\n').map(row => row.split(','));

        // Validate headers
        const headers = csvData[0]; // Get the first row (headers)
        if (!isValidCsv(headers)) {
          setErrorMessage('Invalid CSV format. Please ensure the file follows the correct structure.');
          return; // Reject the file if headers are invalid
        }

        setErrorMessage(''); // Reset error message if the file is valid

        // Process rows if the format is valid
        csvData.forEach((row, index) => {
          if (index !== 0) { // Skip header row
            const [
              forecastPeriod, region, country, asset, currentStatus, 
              productType, breakevenPrice, dueMonth, volume, year, currency, extraField
            ] = row;
            dispatch(addDataUpload({
              forecastPeriod, region, country, asset, currentStatus, 
              productType, breakevenPrice, dueMonth, volume, year, currency, extraField
            }));
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const isValidCsv = (headers) => {
    return headers.length === expectedHeaders.length && 
      headers.every((header, index) => header.trim() === expectedHeaders[index]);
  };

  // Prepare CSV data for download
  const headers = [
    { label: "Region", key: "region" },
    { label: "Country", key: "country" },
    { label: "Asset", key: "asset" },
    { label: "Reservoir Status", key: "currentStatus" },
    { label: "Product Type", key: "productType" },
    { label: "CCY", key: "currency" },
    { label: "Breakeven Price", key: "breakevenPrice" },
    { label: "Volume", key: "volumeField" },
    { label: "Volume Units", key: "volume" },
    { label: "Forecast Period", key: "forecastPeriod" },
    { label: "Due Month", key: "dueMonth" },
    { label: "Year", key: "year" },
  ];

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
      <Button onClick={openPopup}>Add Row</Button>
      
      {isPopupOpen && <AddProductionRow closePopup={closePopup} />}
      
      {/* CSV Download Link */}
      <CSVLink data={productionData} headers={headers} filename="production_data.csv">
        <Button>Download Sample CSV</Button>
      </CSVLink>
      
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Region</TableHeader>
            <TableHeader>Country</TableHeader>
            <TableHeader>Asset</TableHeader>
            <TableHeader>Reservoir Status</TableHeader>
            <TableHeader>Product Type</TableHeader>
            <TableHeader>CCY</TableHeader>
            <TableHeader>Breakeven Price</TableHeader>
            <TableHeader>Volume</TableHeader>
            <TableHeader>Volume Units</TableHeader>
            <TableHeader>Forecast Period</TableHeader>
            <TableHeader>Due Month</TableHeader>
            <TableHeader>Year</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {productionData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.region}</TableCell>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.asset}</TableCell>
              <TableCell>{row.currentStatus}</TableCell>
              <TableCell>{row.productType}</TableCell>
              <TableCell>{row.currency}</TableCell>
              <TableCell>{row.breakevenPrice}</TableCell>
              <TableCell>{row.volumeField}</TableCell>
              <TableCell>{row.volume}</TableCell>
              <TableCell>{row.forecastPeriod}</TableCell>
              <TableCell>{row.dueMonth}</TableCell>
              <TableCell>{row.year}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(index)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductionForecastTable;











