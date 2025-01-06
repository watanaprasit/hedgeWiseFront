import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import FXRiskRoute from './routes/FXRiskRoute';
import CommodityRiskRoute from './routes/CommodityRiskRoute';
import GeopoliticalNewsRoute from './routes/GeopoliticalNewsRoute';
import LoginForm from './components/Auth/LoginForm/LoginForm';
import SignUpForm from './components/Auth/SignUpFrom/SignUpForm';
import PrivateRoute from './components/Auth/PrivateRoute/PrivateRoute';
import Header from './components/Header/Header';

const App = () => {
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation(); // Use useLocation to track the current route

  useEffect(() => {
    // Retrieve the user email (could be stored in localStorage or state)
    const storedEmail = localStorage.getItem('userEmail');
    console.log('Stored email:', storedEmail); // Debugging
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // List of routes where you want to show the Header and Sidebar
  const protectedRoutes = ['/dashboard', '/fx-risk', '/commodity-risk', '/geopolitical-risk'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Only render Header on protected routes */}
      {protectedRoutes.includes(location.pathname) && <Header userEmail={userEmail} />}
      
      <div style={{ display: 'flex' }}>
        {/* Render Sidebar only for protected routes */}
        {protectedRoutes.includes(location.pathname) && <Sidebar />}
        
        <div
          style={{
            marginLeft: protectedRoutes.includes(location.pathname) ? '260px' : '0', // Adjust layout based on whether sidebar is shown
            padding: '20px',
            paddingTop: protectedRoutes.includes(location.pathname) ? '100px' : '20px', // Ensure padding for header space
            width: '100%',
            boxSizing: 'border-box',  // Ensures padding is accounted for in width calculations
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />

            {/* Protect Routes with PrivateRoute */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/fx-risk"
              element={
                <PrivateRoute>
                  <FXRiskRoute />
                </PrivateRoute>
              }
            />
            <Route
              path="/commodity-risk"
              element={
                <PrivateRoute>
                  <CommodityRiskRoute />
                </PrivateRoute>
              }
            />
            <Route
              path="/geopolitical-risk"
              element={
                <PrivateRoute>
                  <GeopoliticalNewsRoute />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
