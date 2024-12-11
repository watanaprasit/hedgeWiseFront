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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rows = reader.result
          .split('\n')
          .map(row => row.split(',').map(cell => cell.trim())); // Trim all cells

        const fileHeaders = rows[0].map(header => header.trim()); // Trim headers
        const headerMapping = mapHeaders(fileHeaders);

        if (!headerMapping) {
          setErrorMessage(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
          return;
        }

        // Parse and dispatch data rows
        setErrorMessage('');
        rows.slice(1).forEach((row) => {
          const rowData = {};
          Object.keys(headerMapping).forEach((key) => {
            rowData[key] = row[headerMapping[key]] || ''; // Safely map values
          });
          dispatch(addDataUpload(rowData));
        });
      };
      reader.readAsText(file);
    }
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

  const csvHeaders = expectedHeaders.map(header => ({
    label: header,
    key: header.toLowerCase().replace(/ /g, ''), // Convert header to camelCase keys
  }));

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Button onClick={openPopup}>Add Row</Button>

      {isPopupOpen && <AddProductionRow closePopup={closePopup} />}

      <CSVLink data={productionData} headers={csvHeaders} filename="production_data.csv">
        <Button>Download Sample CSV</Button>
      </CSVLink>

      <Table>
        <thead>
          <TableRow>
            {expectedHeaders.map(header => (
              <TableHeader key={header}>{header}</TableHeader>
            ))}
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {productionData.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
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














