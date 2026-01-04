import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

// --- MAIN DASHBOARD COMPONENT ---
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
          <button onClick={() => setActiveTab('yearly')} className={activeTab === 'yearly' ? 'active' : ''}>
            📅 Yearly Report
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
          <h1>{activeTab.toUpperCase()} Dashboard</h1>
          <div className="user-profile">
            <span>👨‍⚕️ Dr. Admin</span>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'emergency' && <EmergencyView alerts={notifications} />}
          {activeTab === 'admission' && <AdmissionForm />}
          {activeTab === 'analysis' && <AnalysisView />}
          {activeTab === 'yearly' && <YearlyAnalysisView />}
          {activeTab === 'contact' && <ContactView />}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

// 1. EMERGENCY PAGE
function EmergencyView({ alerts }) {
  // Triggers the Python Video Call Script via Flask
  const startVideoCall = async () => {
    try {
      await axios.post('http://localhost:5000/start_video');
    } catch (err) {
      console.error(err);
      alert("Video System Offline. Ensure server.py is running.");
    }
  };

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
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button className="accept-btn" style={{ flex: 2 }}>✅ Accept & Prep Bed</button>
              <button 
                className="video-btn" 
                onClick={startVideoCall}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: 'bold' 
                }}
              >
                📹 Live Video
              </button>
            </div>
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

// 3. ANALYSIS PAGE (AI Prediction)
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
      alert("Error connecting to AI Server.");
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

          <div className="chart-card">
            <h3>📈 Historical Trends (Same Month - Last 3 Years)</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={result.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cases" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. YEARLY ANALYSIS VIEW
function YearlyAnalysisView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/analyze_year', { year: 2025 });
      setData(res.data);
    } catch (err) { alert("Server Connection Failed"); }
    setLoading(false);
  };

  return (
    <div className="view-container">
      <div className="analysis-card">
        <h2>Annual Strategic Planning (2025 Forecast)</h2>
        <button onClick={runAnalysis} className="predict-btn" disabled={loading}>
          {loading ? "Processing Data..." : "Generate Annual Report"}
        </button>
      </div>

      {data && (
        <div className="results-container">
          <div className="stats-row">
            <div className="stat-card"><h3>Total Yearly Patients</h3><h1>{data.total.toLocaleString()}</h1></div>
            <div className="stat-card critical"><h3>Total Demand</h3><h1>Strategic Assessment</h1></div>
          </div>

          <div style={{display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap'}}>
            <div className="chart-card" style={{flex: 2, minWidth: '400px'}}>
              <h3>Monthly Patient Admission Load</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /><YAxis /><Tooltip />
                  <Bar dataKey="patients" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card" style={{flex: 1, minWidth: '300px'}}>
              <h3>Annual Disease Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.pie_data} dataKey="value" nameKey="name" outerRadius={80} innerRadius={50}>
                    {data.pie_data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card" style={{marginTop: '20px'}}>
            <h3>💊 Estimated Pharmacy & Tablet Usage</h3>
            <table style={{width: '100%', marginTop: '10px', textAlign: 'left', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #eee'}}>
                  <th style={{padding: '10px'}}>Medicine / Supply</th>
                  <th style={{padding: '10px'}}>Annual Quantity</th>
                  <th style={{padding: '10px'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.medicine).map(([item, qty]) => {
                  const isHighPriority = qty > 5000;
                  return (
                    <tr key={item} style={{borderBottom: '1px solid #eee'}}>
                      <td style={{padding: '10px'}}>{item}</td>
                      <td style={{padding: '10px', fontWeight: 'bold'}}>{qty.toLocaleString()}</td>
                      <td style={{padding: '10px'}}>
                        <span 
                          className="badge" 
                          style={{
                            background: isHighPriority ? '#dc3545' : '#28a745', 
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'inline-block'
                          }}
                        >
                          {isHighPriority ? 'HIGH PRIORITY' : 'LOW PRIORITY'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. CONTACT PAGE
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