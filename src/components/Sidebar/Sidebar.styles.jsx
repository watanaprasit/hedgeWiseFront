import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  background-color: #4a90e2;
  padding-top: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

export const SidebarLink = styled.a`
  display: block;
  padding: 15px;
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  border-bottom: 1px solid #f1f1f1;

  &:hover {
    background-color: #357ab7;
  }
`;

