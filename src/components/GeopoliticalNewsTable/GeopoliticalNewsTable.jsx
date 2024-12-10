import React from 'react';
import { TableContainer, StyledTable, TableHeader, TableCell, TableRow } from './GeopoliticalNewsTable.styles';

const GeopoliticalNewsTable = ({ newsData }) => {
  if (!Array.isArray(newsData) || newsData.length === 0) {
    return <p>No news available</p>;
  }

  return (
    <TableContainer>
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
            <TableRow key={index}>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.source}</TableCell>
              <TableCell>{new Date(article.published_at).toLocaleString()}</TableCell>
              <TableCell><a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a></TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default GeopoliticalNewsTable;
