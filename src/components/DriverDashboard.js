import React from 'react';

const DriverDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white shadow p-4 rounded-lg mb-6 border-l-4 border-red-500">
        <h1 className="text-2xl font-bold text-gray-800">🚑 Ambulance Driver Dashboard</h1>
        <p className="text-gray-500">Ready for new incidents</p>
      </header>

      <div className="bg-white p-10 rounded-lg shadow flex flex-col items-center justify-center min-h-[50vh]">
        <button className="bg-red-600 text-white text-xl font-bold py-6 px-12 rounded-full shadow-lg hover:bg-red-700 animate-pulse">
          Report New Patient
        </button>
        <p className="mt-4 text-gray-400">Click only when patient is onboarded</p>
      </div>
    </div>
  );
};

export default DriverDashboard;