// Header.styles.jsx
import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f4f4;
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  margin-bottom: 20px;
`;

export const Title = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const LogoutButton = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
  
  &:hover {
    color: darkblue;
  }
`;
