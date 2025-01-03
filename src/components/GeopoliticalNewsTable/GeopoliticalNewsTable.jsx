import React, { useState, useEffect } from 'react';
import { TableContainer, StyledTable, TableHeader, TableCell, TableRow, LoadingSpinner } from './GeopoliticalNewsTable.styles'; // Import the spinner

const GeopoliticalNewsTable = ({ newsData }) => {
  const [loading, setLoading] = useState(true);

  // Simulate loading with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after the simulated loading time
    }, 1000); // Adjust this timeout to simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Show the loading spinner while data is loading
  }

  if (!Array.isArray(newsData) || newsData.length === 0) {
    return <p>No news available</p>;  // Fallback message if no news is available
  }

  return (
    <TableContainer>
      <h2>Geopolitical News</h2>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>Title</TableHeader>
            <TableHeader>Source</TableHeader>
            <TableHeader>Published At</TableHeader>
            <TableHeader>Link</TableHeader>
          </tr>
        </thead>
        <tbody>
          {newsData.map((article, index) => (
            <TableRow key={article.id || index}>
              <TableCell>{article.title || 'No Title'}</TableCell>
              <TableCell>{article.source?.name || 'Unknown Source'}</TableCell>
              <TableCell>{article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'No Date'}</TableCell>
              <TableCell>
                <a href={article.url || '#'} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default GeopoliticalNewsTable;
