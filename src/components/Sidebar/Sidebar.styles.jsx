import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2a2a2a; /* Dark background to match the dashboard */
  padding-top: 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.2); /* Optional: to give it a subtle shadow */
`;

export const SidebarLink = styled.a`
  display: block;
  padding: 15px;
  color: #E1E1E1; /* Light text to match the dashboard */
  text-decoration: none;
  font-size: 1.2rem;
  border-bottom: 1px solid #555; /* Darker divider for a more subtle effect */

  &:hover {
    background-color: #3498db; /* Light blue accent from the dashboard */
    color: #fff; /* Text color change on hover */
  }
`;
