import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Ambulance, Building2, Activity } from 'lucide-react';

const Login = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const navigate = useNavigate();

  // Fetch hospitals from Firestore
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hospitals"));
        const hospitalList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setHospitals(hospitalList);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  const handleHospitalLogin = () => {
    if (selectedHospital) {
      navigate(`/hospital/${selectedHospital}`);
    } else {
      alert("Please select a hospital from the list.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Activity size={40} className="text-blue-600" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            MediLink <span className="text-blue-600">Response</span>
          </h1>
        </div>
        <p className="text-gray-500 text-lg">Intelligent Emergency Coordination System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* AMBULANCE DRIVER CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
          <div className="bg-red-50 p-4 rounded-full mb-6 group-hover:bg-red-100 transition-colors">
            <Ambulance size={48} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ambulance Driver</h2>
          <p className="text-gray-500 mb-8">Report new incidents and receive optimized hospital routing.</p>
          <button 
            onClick={() => navigate('/driver-auth')}
            className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
          >
            Login as Driver
          </button>
        </div>

        {/* HOSPITAL AUTHORITY CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
          <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
            <Building2 size={48} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hospital Authority</h2>
          <p className="text-gray-500 mb-6">Manage bed availability and view incoming emergency alerts.</p>
          
          <select 
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            <option value="">-- Select Your Hospital --</option>
            {hospitals.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <button 
            onClick={handleHospitalLogin}
            className={`w-full py-3 px-6 font-semibold rounded-lg shadow-md transition-all active:scale-95 ${
              selectedHospital 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedHospital}
          >
            Access Dashboard
          </button>
        </div>

      </div>
      
      <p className="mt-12 text-gray-400 text-sm">© 2026 Emergency Response Project</p>
    </div>
  );
};

export default Login;