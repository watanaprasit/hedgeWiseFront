import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addForwardContract, deleteForwardContract, resetForwardContracts } from '../../redux/ForwardContractSlice';
import { Table, TableHeader, TableRow, TableCell, Button, ScrollableTableContainer, RightAlignedContainer } from './ForwardContractTable.styles';
import AddForwardContractRow from '../AddForwardContractRow/AddForwardContractRow';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const expectedHeaders = [
  "Ccy Pair",
  "Hedged Amt",
  "Direction",
  "Forward Rate",
  "USD Amt",
  "Maturity Month",
  "Maturity Year"
];

const BASE_URL = process.env.REACT_APP_API_URL;

const ForwardContractTable = () => {
  const dispatch = useDispatch();
  const ForwardContracts = useSelector((state) => state.forwardContract.data);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-forward-contracts/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id, 
            ...item.data,
          }));
          mappedData.forEach((item) => dispatch(addForwardContract(item)));
        }
      })
      .catch((error) => {
        console.error("Error fetching Forward Contract data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteForwardContract(id));
  
    fetch(`${BASE_URL}/firebase-api/delete-forward-contract/${id}/`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Forward Contract deleted successfully") {
        console.log("Forward Contract deleted successfully");
      } else {
        console.error('Failed to delete the Forward Contract:', data);
      }
    })
    .catch(error => {
      console.error('Error deleting Forward Contract:', error);
      setErrorMessage('Error deleting Forward Contract');
    
    });
  };

  const handleClear = () => {
    dispatch(resetForwardContracts());

    fetch(`${BASE_URL}/firebase-api/delete-all-forward-contracts/`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "All Forward Contracts deleted successfully") {
        console.log("All Forward Contracts deleted successfully");
      } else {
        console.error('Failed to delete all Forward Contracts:', data);
      }
    })
    .catch(error => {
      console.error('Error deleting all Forward Contracts:', error);
      setErrorMessage('Error deleting all Forward Contracts');
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

          formattedData.forEach((item) => {
            dispatch(addForwardContract(item));
          });

          fetch(`${BASE_URL}/firebase-api/add-forward-contract/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),  
          })
          .then(response => response.json())
          .then(data => {
            console.log('Forward Contract added to Firestore:', data);
          })
          .catch(error => {
            console.error('Error posting Forward Contract to Firestore:', error);
            setErrorMessage("Error uploading Forward Contract");
          })
          .finally(() => setLoading(false));
        },
        header: false,
      });
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'string') {
      const parsedAmount = parseFloat(amount.replace(/,/g, ''));
  
      if (isNaN(parsedAmount)) return '-';
  
      const amountInThousands = parsedAmount / 1000;
      const roundedValue = Math.round(amountInThousands);
      const formattedValue = Math.abs(roundedValue).toLocaleString();
  
      return amountInThousands < 0
        ? `(${formattedValue})`
        : formattedValue;
    }
    return '-';
  };

  return (
    <div>
      <h2>Forward Contracts</h2>
      <RightAlignedContainer>
        <Button onClick={() => setIsPopupOpen(true)}>Add Row</Button>
        {isPopupOpen && <AddForwardContractRow closePopup={() => setIsPopupOpen(false)} />}
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        {loading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <CSVLink data={ForwardContracts} headers={expectedHeaders} filename="forward-contracts.csv">
          <Button>Download Sample CSV</Button>
        </CSVLink>

        {/* Clear Button */}
        <Button onClick={handleClear} style={{ marginTop: '10px', backgroundColor: 'red' }}>Clear All</Button>
      </RightAlignedContainer>

      <ScrollableTableContainer>
      <Table>
        <thead>
          <TableRow>
            {expectedHeaders.map((header) => (
              <TableHeader key={header}>
              {header === 'Hedged Amt' ? 'Hedged Amt (\'000)' :
               header === 'USD Amt' ? 'USD Amt (\'000)' :
               header}
              </TableHeader>
            ))}
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {ForwardContracts.map((row) => (
            <TableRow key={row.id}>
              {expectedHeaders.map((header) => {
                if (header === 'Hedged Amt' || header === 'USD Amt') {
                  return (
                    <TableCell key={header}>
                      {formatAmount(row[header])}
                    </TableCell>
                  );
                }
                return (
                  <TableCell key={header}>{row[header] || 'N/A'}</TableCell>
                );
              })}
              <TableCell>
                <Button onClick={() => handleDelete(row.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      </ScrollableTableContainer>
      
    </div>
  );
};

export default ForwardContractTable;
