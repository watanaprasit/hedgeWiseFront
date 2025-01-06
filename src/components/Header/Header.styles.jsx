import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1e1e2f;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

export const LogoutButton = styled.button`
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #d9363e;
  }
`;


export const TimezoneDisplay = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #00d1b2;
  display: flex;
  align-items: center;
  margin-left: ${({ leftMargin }) => leftMargin || "-120px"};

  strong {
    color: #ffffff;
  }

  &::before {
    content: '';
    margin-right: 8px;
    color: #ffdd57;
  }

  span {
    margin: 0 8px;
  }
`;

