import styled from 'styled-components';

export const TermsWrapper = styled.div`
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

export const TermsTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const TermsContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #333;
`;

export const TermsSection = styled.section`
  margin-bottom: 20px;
`;

export const TermsLink = styled.a`
  color: #3498db;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
