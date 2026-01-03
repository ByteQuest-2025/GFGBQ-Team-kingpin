import React from 'react';
import { useParams } from 'react-router-dom';

const HospitalDashboard = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🏥 Hospital Dashboard</h1>
        <p className="text-gray-500">Logged in as: <span className="font-mono text-blue-600">{id}</span></p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
          Stats Panel (Coming Soon)
        </div>
        <div className="bg-white p-6 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
          Incoming Alerts (Coming Soon)
        </div>
        <div className="bg-white p-6 rounded-lg shadow h-64 flex items-center justify-center text-gray-400">
          Bed Management (Coming Soon)
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;