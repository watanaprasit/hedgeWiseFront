import styled from 'styled-components';

export const SidebarContainer = styled.nav`
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: #1e1e2f;  /* Match the background color of the header */
  padding: 10px 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  color: #ffffff;  /* Ensure text is white like the header */
  font-family: 'Arial', sans-serif;  /* Match the font to the header */
`;

export const SidebarLink = styled.a`
  color: #e1e1e1;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 10px 20px;
  border-radius: 5px;
  font-family: 'Arial', sans-serif;  /* Match the font to the header */
  
  &:hover {
    background-color: #3498db;
    color: #fff;
  }
`;
