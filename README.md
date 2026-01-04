# 🏥 MedLink Command – Predictive Hospital Resource & Emergency Load Intelligence

**Project Name:** MedLink Command
**Team Name:** Kingpin  
**Project Type:** AI-Driven Healthcare Operations Platform  

---
**Demo Video Link:**

**PPT Link:**
https://docs.google.com/presentation/d/1VXjkPHfQSFknkU9-Eiqx7vv4EXkB5Jzw/edit?usp=sharing&ouid=108680762471588122948&rtpof=true&sd=true
---

## 🚨 Problem Statement
Hospitals currently operate in a **reactive mode**, which leads to:

- ICU bed shortages during sudden patient surges  
- Medical supply stockouts in emergencies  
- Extreme staff burnout during seasonal outbreaks and disasters  

There is a critical lack of **real-time coordination and predictive intelligence** that would allow hospitals to prepare *before* a crisis arrives.

---

## 💡 Project Overview
**PreCare** is an advanced **AI-powered hospital command center** that transforms hospital operations from **reactive to proactive**.

By predicting disease outbreaks, patient influx, and medical resource demand in advance, PreCare enables hospitals to:
- Prevent ICU and ward overcrowding  
- Optimize annual medicine procurement  
- Reduce emergency response delays  
- Protect healthcare workers from burnout  

---

## ✨ Key Features

### 🧠 AI Forecasting Engine
- **Predictive Analytics:**  
  Utilizes a **Dual Random Forest model** to forecast:
  - Disease outbreaks (e.g., Dengue, Influenza)  
  - Expected patient counts for any selected date  

- **Environmental Context Analysis:**  
  Uses real-world environmental parameters:
  - Temperature  
  - Humidity  
  - Rainfall  
  - Air Quality Index (AQI)  

- **Historical Benchmarking:**  
  Displays **3-year historical disease trends** to compare current predictions against past data.

---

### 📅 Strategic Yearly Analysis
- **12-Month Patient Load Forecast:**  
  Interactive **Bar Charts** visualize projected patient volume for each month.

- **Disease Distribution Analysis:**  
  **Pie Charts** highlight which diseases will consume the most hospital resources annually.

- **Smart Procurement Engine:**  
  Automatically generates an **annual medicine requirement table** and flags items as:
  - 🔴 HIGH priority  
  - 🟢 LOW priority  
  based on predicted consumption volume.

---

### 🚑 Emergency Command Feed
- **Live Ambulance Tracking:**  
  Displays incoming emergency cases in real time, including:
  - Patient age and gender  
  - Medical severity (Critical / Mild)  
  - Estimated Time of Arrival (ETA)  

- **Specialist Matching System:**  
  Instantly identifies the required doctor specialization  
  *(e.g., Neurosurgeon for head trauma)* before patient arrival.

---

### 📹 Integrated Emergency Video Consultation
- **Pre-Hospital Care Support:**  
  OpenCV-powered live video communication between ambulance paramedics and hospital specialists.

- **Zero-Delay Decision Making:**  
  Doctors can visually assess patients in transit and provide immediate guidance to paramedics.

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React.js  
- **Styling:** CSS3 (Custom Glassmorphism + Fully Responsive Design)  
- **Charts:** Recharts (Line, Bar, Pie)  
- **API Client:** Axios  

### Backend
- **Framework:** Flask (Python)  
- **AI Models:** Scikit-Learn (Random Forest Regressor & Classifier)  
- **Video System:** OpenCV + Socket Programming  

### Core Technologies
- **Model Serialization:** Pickle  
- **Parallel Processing:** Python subprocess  

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js & npm  
- Python 3.9+  
- OpenCV and Flask dependencies  

---

## 🎨 Frontend Setup (Windows Terminal)

Open **Windows Terminal / Command Prompt / PowerShell** and navigate to the frontend directory:

```bash
cd hospital-dashboard
npm install axios recharts

cd hospital-dashboard
npm start
