import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import HospitalDashboard from './components/HospitalDashboard';
import DriverDashboard from './components/DriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/hospital/:id" element={<HospitalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;