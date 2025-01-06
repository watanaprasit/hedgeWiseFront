import React from 'react';
import { Navigate } from 'react-router-dom';  

const PrivateRoute = ({ children }) => {
    const isAuthenticated = Boolean(localStorage.getItem('authToken'));
    console.log('Authenticated:', isAuthenticated);  // Debugging
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return children;
  };

export default PrivateRoute; 

