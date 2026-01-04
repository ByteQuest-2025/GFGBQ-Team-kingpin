PreCare – Predictive Hospital Resource & Emergency Load Intelligence
PreCare is an advanced AI-driven command center designed to transform hospital operations from reactive to proactive. By predicting patient influxes and resource needs before they happen, the system helps hospitals eliminate bed shortages and prevent staff burnout.

---

🎯 Core Objective
A proactive healthcare management platform that uses AI to forecast emergency surges, optimize medicine procurement, and provide real-time video coordination between ambulances and specialists.
---
✨ Key Features
🧠 AI Forecasting Engine
Predictive Analytics: Uses a Dual-Random Forest model to forecast specific disease outbreaks (e.g., Dengue, Influenza) and expected patient counts for any date.

Environmental Context: Analyzes seasonal date markers and environmental factors like Temperature, Humidity, Rainfall, and AQI to determine medical risks.

Historical Benchmarking: Visualizes 3-year historical trends to compare current predictions with past data.

📅 Strategic Yearly Analysis
12-Month Forecast: Provides a full annual patient load visualization using interactive Bar Charts.

Disease Distribution: A Pie Chart breakdown showing which diseases will consume the most resources annually.

Smart Procurement: Automatically generates an annual medicine requirement list with automated priority flagging (HIGH/LOW) based on predicted unit quantity.

🚨 Emergency Command Feed
Live Ambulance Tracking: Real-time display of incoming patient data, including age, gender, medical condition (Critical/Mild), and ETA.

Specialist Matching: Instantly identifies the specific doctor specialization needed (e.g., Neurosurgeon for head trauma) before the patient arrives.

📹 Integrated Emergency Video Call
Pre-Hospital Care: Enables a direct OpenCV-powered live video link between the ambulance and hospital specialists.

Zero-Delay Consultation: Allows doctors to visualize the patient's condition in real-time to provide immediate guidance to paramedics while the patient is in transit.

🏗️ Tech Stack
Frontend
Framework: React.js

Styling: CSS3 (Custom Glassmorphism & Responsive Design)

Charts: Recharts (Line, Bar, and Pie Charts)

API Client: Axios

Backend
Framework: Flask (Python)

AI Engine: Scikit-Learn (Random Forest Regressor & Classifier)

Video System: OpenCV + Socket Programming

Key Technologies
Model Storage: Pickle for AI serialization

Subprocessing: Python subprocess for launching parallel video feeds

🚀 Quick Start
Prerequisites
Node.js and npm

Python 3.9+

OpenCV and Flask dependencies

Installation
1. Setup Backend
Bash

cd Model
pip install flask flask-cors pandas numpy scikit-learn opencv-python
2. Setup Frontend
Bash

cd hospital-dashboard
npm install axios recharts
Running the Application
Terminal 1: Start Flask Backend
Bash

cd Model
python server.py
Backend runs on http://localhost:5000

Terminal 2: Start React Frontend
Bash

cd hospital-dashboard
npm start
Frontend runs on http://localhost:3000

🎬 Demo Flow for Judges
1. Live Emergency Feed
See simulated ambulance alerts arriving in real-time.

Click "📹 Live Video": Instantly launch the OpenCV window to consult with paramedics.

2. AI Prediction Engine
Select a future date (e.g., during Monsoon season).

Observe the AI predict specific risks and suggest necessary medicine restocks.

3. Yearly Strategic Planning
Generate the Annual Report.

Show the 12-month patient load and the automated medicine priority table where high-volume items are flagged in Red.

📊 Impact & Innovation
From Reactive to Proactive: Shifts hospital operations from reacting to crises to preparing for them weeks in advance.

Inventory Optimization: Reducing waste and preventing shortages by predicting medicine requirements based on local health trends.

Critical Time Savings: The video call system and specialist matching ensure the right team and equipment are ready the moment the ambulance doors open.

🏆 Built With ❤️ for the Hackathon
Team Victory

AI/ML Integration: Predictive modeling and data science.

Full-Stack Development: React dashboard and Flask API.

Communication Systems: Real-time video streaming logic.

Remember: Predictive analytics in healthcare saves lives by ensuring the right resources are in the right place at the right time.
