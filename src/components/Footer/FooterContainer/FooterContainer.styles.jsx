import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #1e1e2f;  /* Matches the header background */
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export const FooterText = styled.p`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const FooterLink = styled.a`
  color: #00d1b2;  /* Same accent color as in the header */
  text-decoration: none;
  margin-left: 8px;

  &:hover {
    text-decoration: underline;
  }
`;
