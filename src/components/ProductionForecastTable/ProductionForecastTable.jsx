import React, { useState, useEffect } from 'react';
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
  const [volatilityData, setVolatilityData] = useState(null);

  // Fetch volatility data from the API
  useEffect(() => {
    fetch('https://brent-volatility-predictor.fly.dev/volatility?symbol=BZ=F')
      .then((response) => {
        // Check if the response is OK (status 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Read response as text (HTML content)
        return response.text();
      })
      .then((data) => {
        // You might want to extract the volatility figure from the HTML content
        // For example, if the HTML contains a specific element like an <h1> or <span>
        const volatilityMatch = data.match(/Next 7 Days Volatility:\s*([\d.]+)/);
  
        if (volatilityMatch) {
          // If found, set the volatility data
          setVolatilityData(volatilityMatch[1]);
        } else {
          // If no volatility value is found, handle the error
          setErrorMessage("Error fetching volatility data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching volatility data:", error);
        setErrorMessage("Error fetching volatility data");
      });
  }, []);
  

  useEffect(() => {
    // Fetch production forecast data from Firestore API
    fetch('http://127.0.0.1:8000/firebase-api/get-production-forecast/')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Map the data and dispatch only the 'data' field to Redux
          const mappedData = data.map((item) => ({
            id: item.id,  // Include the Firestore document id
            ...item.data,  // Spread the 'data' field into the object
          }));
          
          // Dispatch mapped data to Redux store
          mappedData.forEach((item) => {
            dispatch(addDataUpload(item));  // Add each item to Redux store
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching production forecast data:", error);
        setErrorMessage("Error fetching data");
      });
  }, [dispatch]);

  const handleDelete = (id) => {
    // Make DELETE request to Django API to delete from Firestore
    fetch(`http://127.0.0.1:8000/firebase-api/delete-production-forecast/${id}/`, {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Document deleted successfully') {
        // Successfully deleted from Firestore, now remove from Redux state
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
  
          // Dispatch to Redux store
          dispatch(addDataUpload(rowData));
  
          console.log("Posting data:", JSON.stringify(rowData));
  
          // POST data to Django backend
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
    key: header.toLowerCase().replace(/ /g, ''), // Convert header to camelCase keys
  }));

  return (
    <div style={{ position: 'relative' }}>
      {/* Volatility figure at the top-right */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}>
        {volatilityData ? `Next 7 Days Volatility: ${volatilityData}%` : 'Loading...'}
      </div>

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
            console.log(row);  // Log the full row data to inspect the structure

            return (
              <TableRow key={row.id}>
                {expectedHeaders.map((header) => (
                  <TableCell key={header}>
                    {row[header] || 'N/A'}  {/* Directly access row properties */}
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
    </div>
  );
};

export default ProductionForecastTable;





















