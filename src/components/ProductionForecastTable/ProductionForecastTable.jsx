import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDataUpload, deleteDataUpload } from '../../redux/ProductionDataUploadSlice';
import { setProductionData } from '../../redux/CommodityRiskSlice'; // Import setProductionData action
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

  // State for total volume calculation by month, year, and volume unit
  const [volumeBreakdown, setVolumeBreakdown] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:8000/firebase-api/get-production-forecast/')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,  
          }));

          // Dispatch the action to update productionData in commodityRiskSlice
          dispatch(setProductionData(mappedData));

          // Also add data to dataUpload slice (if needed for other purposes)
          mappedData.forEach((item) => {
            dispatch(addDataUpload(item));
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching production forecast data:", error);
        setErrorMessage("Error fetching data");
      });
  }, [dispatch]);

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/firebase-api/delete-production-forecast/${id}/`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Document deleted successfully') {
        dispatch(deleteDataUpload(id));
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rows = reader.result
          .split('\n')
          .map(row => row.split(',').map(cell => cell.trim())); 

        const fileHeaders = rows[0].map(header => header.trim()); 
        const headerMapping = mapHeaders(fileHeaders);

        if (!headerMapping) {
          setErrorMessage(`Invalid CSV format. Expected headers: ${expectedHeaders.join(', ')}`);
          return;
        }

        setErrorMessage('');
        rows.slice(1).forEach((row) => {
          const rowData = {};
          Object.keys(headerMapping).forEach((key) => {
            rowData[key] = row[headerMapping[key]] || ''; 
          });

          dispatch(addDataUpload(rowData));

          fetch('http://127.0.0.1:8000/firebase-api/add-production-row/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowData),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.message === "Data added successfully") {
              console.log('Data successfully posted to Firestore');
            }
          })
          .catch(error => {
            console.error("Error posting data:", error);
            setErrorMessage(`Error posting data: ${error.message}`);
          });
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
    key: header.toLowerCase().replace(/ /g, ''),
  }));

// Calculate the volume breakdown by year, month, and volume unit
  useEffect(() => {
    const breakdown = {};

    productionData.forEach((row) => {
      const year = row.Year;
      const month = row.DueMonth;
      const volumeUnit = row['Volume Units'];
      const volume = parseFloat(row.Volume);

      if (isNaN(volume)) return; // Skip rows with invalid volume

      if (!breakdown[year]) breakdown[year] = {};
      if (!breakdown[year][month]) breakdown[year][month] = {};
      if (!breakdown[year][month][volumeUnit]) breakdown[year][month][volumeUnit] = 0;

      breakdown[year][month][volumeUnit] += volume;
    });

    setVolumeBreakdown(breakdown);
  }, [productionData]);

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
          {productionData.map((row) => {
            return (
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
            );
          })}
        </tbody>
      </Table>

      {/* New Area for Volume Breakdown by Year, Month, and Volume Units */}
      <div style={{ marginTop: '20px' }}>
        <h3>Volume Breakdown</h3>
        {Object.keys(volumeBreakdown).map((year) => (
          <div key={year} style={{ marginBottom: '20px' }}>
            <h4>Year: {year}</h4>
            {Object.keys(volumeBreakdown[year]).map((month) => (
              <div key={month} style={{ marginLeft: '20px' }}>
                <h5>Month: {month}</h5>
                <ul>
                  {Object.keys(volumeBreakdown[year][month]).map((volumeUnit) => (
                    <li key={volumeUnit}>
                      {volumeUnit}: {volumeBreakdown[year][month][volumeUnit].toFixed(2)} units
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductionForecastTable;





