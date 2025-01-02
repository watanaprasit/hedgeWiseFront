import React from 'react';
import { TableContainer, StyledTable, TableHeader, TableCell, TableRow } from './GeopoliticalNewsTable.styles';

const GeopoliticalNewsTable = ({ newsData }) => {
  if (!Array.isArray(newsData) || newsData.length === 0) {
    return <p>No news available</p>;
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
              <TableCell>{article.source?.name || 'Unknown Source'}</TableCell> {/* Access the 'name' of source */}
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
