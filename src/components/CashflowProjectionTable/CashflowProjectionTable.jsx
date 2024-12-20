import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCashflowProjection, deleteCashflowProjection } from '../../redux/CashflowProjectionSlice';
import { Table, TableHeader, TableRow, TableCell, Button } from './CashflowProjectionTable.styles';
import AddCashflowProjectionRow from '../AddCashflowProjectionRow/AddCashflowProjectionRow';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const expectedHeaders = [
  "RevenueCcy",
  "RevenueAmount",
  "RevenueDueMonth",
  "RevenueDueYear",
  "ExpenseCcy",
  "ExpenseAmount",
  "ExpenseDueMonth",
  "ExpenseDueYear",
  "Region",
  "Asset",
  "RiskProfile"
];

const CashflowProjectionTable = () => {
  const dispatch = useDispatch();
  const CashflowProjections = useSelector((state) => state.cashflowProjection.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/firebase-api/get-cashflow-projections/')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,
          }));
          mappedData.forEach((item) => dispatch(addCashflowProjection(item)));
        }
      })
      .catch((error) => {
        console.error("Error fetching Cashflow Projection data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCashflowProjection(id));
  
    fetch(`http://127.0.0.1:8000/firebase-api/delete-cashflow-projection/${id}/`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Cashflow Projection deleted successfully") {
        console.log("Cashflow Projection deleted successfully");
      } else {
        console.error('Failed to delete the cashflow projection:', data);
      }
    })
    .catch(error => {
      console.error('Error deleting Cashflow Projection:', error);
      setErrorMessage('Error deleting Cashflow Projection');
    
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
            dispatch(addCashflowProjection(item));
          });

          // Send the formatted data directly as an array to Firestore API
          fetch('http://127.0.0.1:8000/firebase-api/add-cashflow-projection/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),  // Directly send as an array
          })
          .then(response => response.json())
          .then(data => {
            console.log('Cashflow Projection added to Firestore:', data);
          })
          .catch(error => {
            console.error('Error posting Cashflow Projection to Firestore:', error);
            setErrorMessage("Error uploading Cashflow Projection");
          })
          .finally(() => setLoading(false));
        },
        header: false,
      });
    }
  };

  return (
    <div>
      <Button onClick={() => setIsPopupOpen(true)}>Add Row</Button>
      {isPopupOpen && <AddCashflowProjectionRow closePopup={() => setIsPopupOpen(false)} />}
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <CSVLink data={CashflowProjections} headers={expectedHeaders} filename="cashflow-projections.csv">
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
          {CashflowProjections.map((row) => (
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

export default CashflowProjectionTable;
