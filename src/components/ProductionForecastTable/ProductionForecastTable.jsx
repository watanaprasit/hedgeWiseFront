import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDataUpload, deleteDataUpload, setDataFromBackend } from '../../redux/ProductionDataUploadSlice';
import { setProductionData } from '../../redux/CommodityRiskSlice'; 
import { Table, TableHeader, TableRow, TableCell, Button, ScrollableTableContainer, RightAlignedContainer } from './ProductionForecastTable.styles';
import AddProductionRow from '../AddProductionRow/AddProductionRow';
import { CSVLink } from 'react-csv';

const expectedHeaders = [
  "Region", "Country", "Asset", "Reservoir Status", "Product Type", 
  "CCY", "Breakeven Price", "Volume", "Volume Units", "Forecast Period", 
  "Due Month", "Year"
];

const API_BASE_URL = process.env.REACT_APP_API_URL

const ProductionForecastTable = () => {
  const dispatch = useDispatch();
  const productionData = useSelector((state) => state.dataUpload.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [volumeBreakdown, setVolumeBreakdown] = useState({});

  const calculateVolumeBreakdown = (data) => {
    const breakdown = data.reduce((acc, row) => {
      const { Volume, 'Volume Units': volumeUnits, 'Due Month': dueMonth, Year, 'Breakeven Price': breakevenPrice } = row;
  
      if (volumeUnits === 'BOE') {
        const monthYear = `${dueMonth}-${Year}`;
        if (!acc[monthYear]) {
          acc[monthYear] = { volume: 0, breakevenCost: 0 };
        }
        
        // Update volume breakdown
        acc[monthYear].volume += parseFloat(Volume || 0);
  
        // Update breakeven cost (Breakeven Price * Volume)
        acc[monthYear].breakevenCost += (parseFloat(breakevenPrice || 0) * parseFloat(Volume || 0));
      }
      return acc;
    }, {});
    return breakdown;
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/firebase-api/get-production-forecast/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,  
          }));

          // Update production data in Redux
          dispatch(setProductionData(mappedData));
          dispatch(setDataFromBackend(mappedData));

          // Calculate volume breakdown
          const breakdown = calculateVolumeBreakdown(mappedData);
          setVolumeBreakdown(breakdown);
        }
      })
      .catch((error) => {
        console.error("Error fetching production forecast data:", error);
        setErrorMessage("Error fetching data");
      });
  }, [dispatch]);

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/firebase-api/delete-production-forecast/${id}/`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Document deleted successfully') {
        dispatch(deleteDataUpload(id));
      } else {
        setErrorMessage("Error deleting document.");
      }
    })
    .catch(() => setErrorMessage("Error deleting document."));
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const rows = reader.result
        .split('\n')
        .filter(row => row.trim().length > 0)
        .map(row => row.split(',').map(cell => cell.trim()));

      const fileHeaders = rows[0].map(header => header.trim());
      const headerMapping = mapHeaders(fileHeaders);

      if (!headerMapping) {
        setErrorMessage(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
        return;
      }

      setErrorMessage('');
      const processedRows = [];
      for (const row of rows.slice(1)) {
        const rowData = {};
        Object.keys(headerMapping).forEach((key) => {
          rowData[key] = row[headerMapping[key]] || '';
        });

        try {
          const response = await fetch(`${API_BASE_URL}/firebase-api/add-production-row/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rowData),
          });
          const data = await response.json();
          if (data.message === "Data added successfully") {
            processedRows.push({ id: data.id, ...rowData });
          }
        } catch {
          setErrorMessage('Error processing one or more rows.');
        }
      }
      dispatch(addDataUpload(processedRows));
    };
    reader.readAsText(file);
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
    key: header.toLowerCase().replace(/ /g, ''),
  }));

  return (
    <div>
      <h2>Production Forecast Data</h2>
      <RightAlignedContainer>
        <Button onClick={openPopup}>Add Row</Button>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}


        {isPopupOpen && <AddProductionRow closePopup={closePopup} />}

        <CSVLink data={productionData} headers={csvHeaders} filename="production_data.csv">
          <Button>Download Sample CSV</Button>
        </CSVLink>
      </RightAlignedContainer>


    <ScrollableTableContainer>
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
          {productionData.map((row) => (
            <TableRow key={row.id}>
              {expectedHeaders.map((header) => (
                <TableCell key={header}>
                  {row[header] || 'N/A'}
                </TableCell>
              ))}
              <TableCell>
                <Button onClick={() => handleDelete(row.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ScrollableTableContainer>
 

    <h2>Production Volume Breakdown</h2>
      <Table>
        <thead>
          <TableRow>
            <TableHeader>Month-Year</TableHeader>
            <TableHeader>Volume (BOE)</TableHeader>
            <TableHeader>Breakeven Cost</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {Object.keys(volumeBreakdown)
            .sort((a, b) => {
              // Convert monthYear string (e.g., 'Dec-2025') into Date object for comparison
              const [monthA, yearA] = a.split('-');
              const [monthB, yearB] = b.split('-');

              const dateA = new Date(`${monthA} 1, ${yearA}`);
              const dateB = new Date(`${monthB} 1, ${yearB}`);

              return dateA - dateB; // Sort from earliest to latest
            })
            .map((monthYear) => (
              <TableRow key={monthYear}>
                <TableCell>{monthYear}</TableCell>
                <TableCell>{volumeBreakdown[monthYear].volume.toLocaleString()}</TableCell>
                <TableCell>{volumeBreakdown[monthYear].breakevenCost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>

    </div>
  );
};

export default ProductionForecastTable;
