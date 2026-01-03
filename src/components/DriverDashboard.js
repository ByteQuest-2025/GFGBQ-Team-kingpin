import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { findBestHospital } from '../utils/selectionLogic';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Activity, Siren, Navigation, List, Map as MapIcon, Bed, Stethoscope } from 'lucide-react';

// --- ICONS SETUP ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 1. Ambulance Icon (Keep existing)
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/263/263142.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20], // Center it
});

// 2. RED PIN (Other Hospitals) - Standard Shape
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41], // Tip of the pin touches the map
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 3. GREEN PIN (Selected Hospital) - SAME SHAPE, Just Green
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], // Exact same size as red pin
  iconAnchor: [12, 41], // Exact same anchor
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  // Removed 'animate-bounce' so it doesn't float/jump
});

// Helper to auto-center map
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

const DriverDashboard = () => {
  const [step, setStep] = useState(1); 
  const [severity, setSeverity] = useState('Severe');
  const [injuryType, setInjuryType] = useState('General Trauma');
  
  // Data State
  const [allHospitals, setAllHospitals] = useState([]);
  const [assignedHospital, setAssignedHospital] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  
  // Constants
  const START_COORDS = [13.0827, 80.2707]; // Chennai Center

  const severityOptions = ['Very Severe', 'Severe', 'Moderate', 'Minor'];
  const injuryOptions = ['Head Injury', 'Heart Attack', 'Fracture', 'Burns', 'General Trauma'];

  // --- LOGIC ---
  const handleFindHospital = async () => {
    setStep(3);
    
    try {
      const snapshot = await getDocs(collection(db, "hospitals"));
      const rawHospitals = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // 1. Run Formula & Simulation
      const result = findBestHospital(rawHospitals, severity, injuryType);
      
      if (result.best) {
        const best = result.best;

        // 2. Reserve Bed
        const hospitalRef = doc(db, "hospitals", best.id);
        await updateDoc(hospitalRef, {
          availableBeds: increment(-1),
          incomingAmbulances: increment(1),
          alerts: arrayUnion({
            type: "INCOMING_PATIENT",
            severity,
            injury: injuryType,
            timestamp: new Date().toISOString(),
          })
        });

        // 3. Fetch Real Route (OSRM)
        fetchRoute(START_COORDS, [best.lat, best.lng]);

        setAllHospitals(result.all); // Store list for Sidebar
        setAssignedHospital(best);
        setTimeout(() => setStep(4), 1500);
      } else {
        alert("No hospitals found!");
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      setStep(2);
    }
  };

  const fetchRoute = async (start, end) => {
    // OSRM API (Free)
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      // Swap Coords for Leaflet [Lat, Lng]
      const path = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
      setRouteCoords(path);
    } catch (e) {
      console.error("Routing Error:", e);
      setRouteCoords([start, end]); // Fallback to straight line
    }
  };

  const reset = () => {
    setStep(1);
    setAssignedHospital(null);
    setRouteCoords([]);
  };

  // --- VIEW RENDERING ---

  // 1. IDLE
  if (step === 1) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <div className="animate-pulse bg-red-600 p-6 rounded-full mb-8 shadow-[0_0_50px_red]">
        <Siren size={64} />
      </div>
      <h1 className="text-4xl font-bold mb-8">AMBULANCE ACTIVE</h1>
      <button onClick={() => setStep(2)} className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 hover:scale-105 transition">
        <Activity className="text-red-600"/> REPORT INCIDENT
      </button>
    </div>
  );

  // 2. FORM
  if (step === 2) return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-blue-600"/> Patient Report
        </h2>
        
        {/* Criticality */}
        <div className="mb-6">
          <label className="block text-gray-500 font-bold mb-2">Severity</label>
          <div className="grid grid-cols-2 gap-3">
            {severityOptions.map(opt => (
              <button key={opt} onClick={() => setSeverity(opt)}
                className={`p-3 rounded-lg border font-medium ${severity===opt ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Injury */}
        <div className="mb-8">
          <label className="block text-gray-500 font-bold mb-2">Condition</label>
          <div className="grid grid-cols-2 gap-3">
            {injuryOptions.map(opt => (
              <button key={opt} onClick={() => setInjuryType(opt)}
                className={`p-3 rounded-lg border text-sm font-medium ${injuryType===opt ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200'}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleFindHospital} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg">
          FIND OPTIMAL HOSPITAL
        </button>
      </div>
    </div>
  );

  // 3. LOADING
  if (step === 3) return <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"/><p className="animate-pulse">Running Optimization Algorithms...</p></div>;

  // 4. MAP DASHBOARD
  return (
    <div className="h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-white p-4 shadow z-20 flex justify-between items-center px-6">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Navigation className="text-green-600"/> Routing to: {assignedHospital.name}
          </h1>
          <p className="text-gray-500 text-xs">
            Method: Formula H_s | Score: {assignedHospital.score.toFixed(2)} | Traffic: Normal
          </p>
        </div>
        <button onClick={reset} className="bg-red-100 text-red-700 px-4 py-2 rounded font-bold hover:bg-red-200">End Trip</button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: MAP (70%) */}
        <div className="w-2/3 relative">
          <MapContainer center={START_COORDS} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={[assignedHospital.lat, assignedHospital.lng]} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Markers */}
            <Marker position={START_COORDS} icon={ambulanceIcon}><Popup>Ambulance</Popup></Marker>
            
            {allHospitals.map(h => (
              <Marker key={h.id} position={[h.lat, h.lng]} icon={h.id === assignedHospital.id ? selectedIcon : hospitalIcon}>
                <Popup>
                  <b>{h.name}</b><br/>
                  Beds: {h.availableBeds}<br/>
                  Score: {h.score.toFixed(2)}
                </Popup>
              </Marker>
            ))}

            {/* Route Line */}
            {routeCoords.length > 0 && <Polyline positions={routeCoords} color="#2563eb" weight={5} opacity={0.8} />}
          </MapContainer>
        </div>

        {/* RIGHT: LIST (30%) */}
        <div className="w-1/3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 bg-white shadow sticky top-0 font-bold text-gray-700 flex items-center gap-2">
            <List size={18}/> Hospital Rankings
          </div>
          <div className="p-2 space-y-2">
            {allHospitals.map((h, i) => {
              const isSelected = h.id === assignedHospital.id;
              return (
                <div key={h.id} className={`p-4 rounded-lg border transition-all ${isSelected ? 'bg-blue-50 border-blue-500 shadow-md scale-102 ring-1 ring-blue-500' : 'bg-white border-gray-200 opacity-80'}`}>
                  <div className="flex justify-between">
                    <h3 className={`font-bold ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      #{i+1} {h.name}
                    </h3>
                    <span className="text-xs font-mono bg-gray-200 px-1 rounded">Score: {h.score.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <span className="flex items-center gap-1"><MapIcon size={12}/> {h.travelTime} min</span>
                    <span className={`flex items-center gap-1 font-bold ${h.availableBeds < 5 ? 'text-red-500' : 'text-green-600'}`}>
                      <Bed size={12}/> {h.availableBeds} Beds
                    </span>
                    <span className="flex items-center gap-1 col-span-2">
                      <Stethoscope size={12}/> {h.hasSpecialist ? 'Specialist Available' : 'No Specialist'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;