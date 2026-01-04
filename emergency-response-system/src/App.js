import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import DriverAuth from './components/DriverAuth'; // <--- NEW IMPORT
import HospitalDashboard from './components/HospitalDashboard';
import DriverDashboard from './components/DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Step 1: Login Page */}
        <Route path="/driver-auth" element={<DriverAuth />} /> 
        
        {/* Step 2: Dashboard (Access after login) */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        
        <Route path="/hospital/:id" element={<HospitalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;