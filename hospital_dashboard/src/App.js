import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// --- MAIN COMPONENT ---
function App() {
  const [activeTab, setActiveTab] = useState('emergency');
  const [notifications, setNotifications] = useState([
    { id: 1, age: 45, gender: 'M', condition: 'Critical', issue: 'Cardiac Arrest', eta: '5 mins', hospital: 'Hospital A' },
    { id: 2, age: 22, gender: 'F', condition: 'Mild', issue: 'Fracture', eta: '12 mins', hospital: 'Hospital A' }
  ]);

  // UI DEMO: Simulate an incoming ambulance alert after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAlert = { 
        id: 3, age: 34, gender: 'M', condition: 'Critical', issue: 'Head Trauma (Accident)', eta: '2 mins', hospital: 'Hospital A' 
      };
      setNotifications(prev => [newAlert, ...prev]);
      // alert("⚠️ SIMULATION: New Emergency Alert Received!"); 
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {/* 1. SIDEBAR NAVIGATION */}
      <div className="sidebar">
        <div className="logo-area">
          <h2>🏥 MedCommand</h2>
          <p>Hospital A Intelligence</p>
        </div>
        
        <nav>
          <button onClick={() => setActiveTab('emergency')} className={activeTab === 'emergency' ? 'active' : ''}>
            🚨 Emergency Alerts <span className="badge">{notifications.length}</span>
          </button>
          <button onClick={() => setActiveTab('admission')} className={activeTab === 'admission' ? 'active' : ''}>
            📝 Patient Admission
          </button>
          <button onClick={() => setActiveTab('analysis')} className={activeTab === 'analysis' ? 'active' : ''}>
            📊 AI Prediction
          </button>
          <button onClick={() => setActiveTab('contact')} className={activeTab === 'contact' ? 'active' : ''}>
            📞 Directory
          </button>
        </nav>

        <div className="sidebar-footer">
          <p>System Status: <strong>Online</strong></p>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content">
        <header className="top-bar">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h1>
          <div className="user-profile">
            <span>👨‍⚕️ Dr. Admin</span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'emergency' && <EmergencyView alerts={notifications} />}
          {activeTab === 'admission' && <AdmissionForm />}
          {activeTab === 'analysis' && <AnalysisView />}
          {activeTab === 'contact' && <ContactView />}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (The "Pages") ---

// 1. EMERGENCY PAGE
function EmergencyView({ alerts }) {
  return (
    <div className="view-container">
      <div className="stats-row">
        <div className="stat-card critical">
          <h3>Active Emergencies</h3>
          <h1>{alerts.length}</h1>
        </div>
        <div className="stat-card">
          <h3>ICU Availability</h3>
          <h1>4/20</h1>
        </div>
      </div>

      <h2>🚑 Incoming Ambulance Feed</h2>
      <div className="alert-grid">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.condition.toLowerCase()}`}>
            <div className="card-header">
              <span className="eta-badge">⏱️ ETA: {alert.eta}</span>
              <span className={`status-tag ${alert.condition.toLowerCase()}`}>{alert.condition}</span>
            </div>
            <h3>{alert.issue}</h3>
            <div className="patient-details">
              <p><strong>Patient:</strong> {alert.gender}, {alert.age} yrs</p>
              <p><strong>Needs:</strong> {alert.issue.includes('Head') ? 'Neurosurgeon' : 'Trauma Team'}</p>
            </div>
            <button className="accept-btn">✅ Accept & Prep Bed</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. ADMISSION PAGE
function AdmissionForm() {
  return (
    <div className="view-container">
      <div className="form-card">
        <h2>📝 Patient Registration</h2>
        <form className="medical-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter patient name" className="input-field" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="00" className="input-field" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="input-field"><option>Male</option><option>Female</option></select>
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select className="input-field"><option>O+</option><option>A+</option><option>B+</option></select>
            </div>
          </div>
          <div className="form-group">
            <label>Medical Condition / Reason</label>
            <textarea placeholder="Describe symptoms..." className="input-field"></textarea>
          </div>
          <button className="save-btn">💾 Save Patient Record</button>
        </form>
      </div>
    </div>
  );
}

// 3. ANALYSIS PAGE (With Fake AI Simulation)
function AnalysisView() {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!date) return alert("Please select a date first.");
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/predict', { date: date });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="analysis-card">
        <h2>📊 Predictive Resource Planning</h2>
        <div className="search-bar">
          <input 
            type="date" 
            className="date-input" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          <button onClick={handlePredict} disabled={loading} className="predict-btn">
            {loading ? '🤖 AI is Thinking...' : '🔍 Run Prediction'}
          </button>
        </div>
      </div>

      {result && (
        <div className="results-container">
          {/* TOP ROW: CARDS */}
          <div className="results-dashboard">
            <div className={`result-card ${result.disease !== 'Normal' ? 'danger' : ''}`}>
              <h3>⚠️ Predicted Risk</h3>
              <p className="huge-text">{result.disease}</p>
            </div>
            <div className="result-card">
              <h3>🏥 Expected Patients</h3>
              <p className="huge-text">{result.cases}</p>
            </div>
            <div className="result-card info">
              <h3>📦 Recommended Stock</h3>
              <p className="med-text">{result.stock}</p>
              <small style={{display:'block', marginTop:'10px', color:'#666'}}>
                Context: {result.weather}
              </small>
            </div>
          </div>

          {/* BOTTOM ROW: THE GRAPH */}
          <div className="chart-card">
            <h3>📈 Historical Trends (Same Month - Last 3 Years)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={result.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p style={{textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666'}}>
              Comparison of case volumes for this month in previous years.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. CONTACT PAGE
function ContactView() {
  return (
    <div className="view-container">
      <div className="contact-grid">
        <div className="contact-box"><h3>🚑 Ambulance Dispatch</h3><p>Ext: 1001</p></div>
        <div className="contact-box"><h3>🩸 Blood Bank</h3><p>Ext: 1005</p></div>
        <div className="contact-box"><h3>👮 Police Liaison</h3><p>Ext: 1009</p></div>
      </div>
    </div>
  );
}

export default App;