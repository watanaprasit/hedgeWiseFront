import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFuturesContracts, deleteFuturesContract, setFuturesContractsFromBackend } from '../../redux/ProductionDataUploadSlice';
import { Table, TableHeader, TableRow, TableCell, Button, ScrollableTableContainer, RightAlignedContainer } from './FuturesContractTable.styles';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';


const API_BASE_URL = process.env.REACT_APP_API_URL

const expectedHeaders = [
  "SettlementPeriod",
  "Contract Size",
  "CCY",
  "Price",
  "Contract Value"
];

const FuturesContractTable = () => {
  const dispatch = useDispatch();
  const futuresContracts = useSelector((state) => state.dataUpload.futuresContracts);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/firebase-api/get-futures-contracts/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            ...item.data,
          }));
          dispatch(setFuturesContractsFromBackend(mappedData));
        }
      })
      .catch((error) => {
        console.error("Error fetching futures contracts data:", error);
        setErrorMessage("Error fetching data");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

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
          dispatch(addFuturesContracts(formattedData));

          // Send the formatted data directly as an array to Firestore API
          fetch(`${API_BASE_URL}/firebase-api/add-futures-contract/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
          })
          .then(response => response.json())
          .then(data => {
            console.log('Futures contracts added to Firestore:', data);
          })
          .catch(error => {
            console.error('Error posting futures contracts to Firestore:', error);
            setErrorMessage("Error uploading futures contracts");
          })
          .finally(() => setLoading(false));
        },
        header: false,
      });
    }
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/firebase-api/delete-futures-contract/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          dispatch(deleteFuturesContract(id));
        } else {
          throw new Error('Failed to delete the contract');
        }
      })
      .catch((error) => {
        console.error('Error deleting futures contract:', error);
        setErrorMessage("Error deleting futures contract");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>

    <h2> Futures Contracts </h2>  

    <RightAlignedContainer>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        {loading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <CSVLink data={futuresContracts} headers={expectedHeaders} filename="futures-contracts.csv">
            <Button>Download Sample CSV</Button>
        </CSVLink>     
    </RightAlignedContainer>  
     
      <ScrollableTableContainer>
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
            {futuresContracts.map((row) => (
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
      </ScrollableTableContainer>
    </div>
  );
};

export default FuturesContractTable;
