import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPRIs, deletePRI, setPRIsFromBackend } from '../../redux/GeopoliticalNewsSlice';
import { Table, TableHeader, TableRow, TableCell, Button, ScrollableTableContainer, RightAlignedContainer } from './PRITable.styles';
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const BASE_URL = 'http://127.0.0.1:8000';

const expectedHeaders = [
  "Insurer",
  "Amt Coverage",
  "Premium%",
  "Annual Premium",
  "Policy Duration",
  "Risk Type Covered"
];

const PRITable = () => {
  const dispatch = useDispatch();
  const PRIs = useSelector((state) => state.geopoliticalNews.PRIs) || []; // Correct path to PRIs
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/get-PRIs/`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const mappedData = data.map((item) => ({
            id: item.id,
            amtCoverage: Number(item["Amt Coverage"]) || 0,  // Convert Amt Coverage to a number
            annualPremium: Number(item["Annual Premium"]) || 0,  // Convert Annual Premium to a number
            ...item.data,
          }));
          dispatch(setPRIsFromBackend(mappedData)); // Dispatch the action to update Redux state
        } else {
          console.log("No valid PRIs data received.");
        }
      })
      .catch((error) => {
        console.error("Error fetching PRIs data:", error);
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
          dispatch(addPRIs(formattedData));

          // Send the formatted data directly as an array to Firestore API
          fetch(`${BASE_URL}/firebase-api/add-PRI/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
          })
          .then(response => response.json())
          .then(data => {
            console.log('PRIs added to Firestore:', data);
          })
          .catch(error => {
            console.error('Error posting PRIs to Firestore:', error);
            setErrorMessage("Error uploading PRIs");
          })
          .finally(() => setLoading(false));
        },
        header: false,
      });
    }
  };

  const handleDelete = (id) => {
    setLoading(true);
    fetch(`${BASE_URL}/firebase-api/delete-PRI/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          dispatch(deletePRI(id));
        } else {
          throw new Error('Failed to delete the PRI');
        }
      })
      .catch((error) => {
        console.error('Error deleting PRI:', error);
        setErrorMessage("Error deleting PRI");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Political Risk Insurance (PRI) Policies</h2>  

      <RightAlignedContainer>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
        {loading && <p>Loading...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <CSVLink data={PRIs} headers={expectedHeaders} filename="PRIs.csv">
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
            {PRIs.length > 0 ? (
              PRIs.map((row) => (
                <TableRow key={row.id}>
                  {expectedHeaders.map((header) => (
                    <TableCell key={header}>{row[header] || 'N/A'}</TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleDelete(row.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={expectedHeaders.length + 1}>No PRIs available</TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      </ScrollableTableContainer>
    </div>
  );
};

export default PRITable;
