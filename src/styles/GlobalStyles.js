import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Resetting defaults */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Ensure full height */
  html, body {
    height: 100%;
    overflow-x: hidden;
  }

  /* Styling the body for a dark, professional theme */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #eaeaea;
    color: #333;
  }

  /* Ensure container elements stretch to full height */
  #root, #app {
    height: 100%;
  }

  /* Default link styles */
  a {
    color: #00d1b2;
    text-decoration: none;
  }

  a:hover {
    color: #00c4a7;
  }

  /* Remove focus outlines for mouse users */
  button, input, textarea {
    border: none;
    outline: none;
    font-family: inherit;
  }

  /* Add smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
`;

export default GlobalStyles;
