import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import react-router
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import FXRiskRoute from './routes/FXRiskRoute'; // Import FXRiskPage

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '260px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fx-risk" element={<FXRiskRoute />} />  {/* Add route for FXRiskPage */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
