import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import FXRiskRoute from './routes/FXRiskRoute';
import CommodityRiskRoute from './routes/CommodityRiskRoute';
import GeopoliticalNewsRoute from './routes/GeopoliticalNewsRoute';
import LoginForm from './components/Auth/LoginForm/LoginForm';
import SignUpForm from './components/Auth/SignUpFrom/SignUpForm';
import PrivateRoute from './components/Auth/PrivateRoute/PrivateRoute';
import Header from './components/Header/Header';
import FooterContainer from './components/Footer/FooterContainer/FooterContainer';
import PrivacyPolicy from './components/Footer/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './components/Footer/TermsOfService/TermsOfService';

const App = () => {
  const [userEmail, setUserEmail] = useState('');
  const location = useLocation(); 

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    console.log('Stored email:', storedEmail); 
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const protectedRoutes = ['/dashboard', '/fx-risk', '/commodity-risk', '/geopolitical-risk'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {protectedRoutes.includes(location.pathname) && <Header userEmail={userEmail} />}
      
      {protectedRoutes.includes(location.pathname) && <Sidebar />}
      
      <div style={{ flex: 1, padding: '20px', boxSizing: 'border-box' }}>
        <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
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

          <Route path="/privacy" element={<PrivacyPolicy />} />  

          <Route path="/terms" element={<TermsOfService />} />  


        </Routes>
      </div>

      <FooterContainer />
    </div>
  );
};

export default App;
