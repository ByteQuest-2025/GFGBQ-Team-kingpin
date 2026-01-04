from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import subprocess

app = Flask(__name__)
CORS(app)

# --- 1. MODEL LOADING ---
try:
    with open('final_hospital_model.pkl', 'rb') as f:
        models = pickle.load(f)
        clf = models['classifier']
        reg = models['regressor']
    print("✅ Hospital Intelligence Brain loaded successfully!")
except FileNotFoundError:
    print("❌ Error: 'final_hospital_model.pkl' not found. Ensure you are in the 'Model' folder.")
    exit()

# --- 2. WEATHER ESTIMATION LOGIC ---
def get_weather_context(day_of_year, month):
    # Sinusoidal temperature curve (peaks in summer)
    temp = 25 + 12 * np.sin((day_of_year - 105) * 2 * np.pi / 365)
    # Seasonal humidity and rainfall patterns
    if 6 <= month <= 9: # Monsoon
        rain, hum = 100, 85
    else:
        rain, hum = 5, 40
    # Seasonal AQI patterns (peaks in winter)
    aqi = 250 if month in [11, 12, 1] else 100
    return temp, hum, rain, aqi

# --- 3. API ROUTES ---

@app.route('/predict', methods=['POST'])
def predict():
    """Predicts disease and load for a specific date."""
    try:
        data = request.json
        user_date = data.get('date')
        date_obj = datetime.strptime(user_date, "%Y-%m-%d")
        day_of_year = date_obj.timetuple().tm_yday
        month = date_obj.month
        
        t, h, r, a = get_weather_context(day_of_year, month)
        input_df = pd.DataFrame([[day_of_year, month, t, h, r, a]], 
                                columns=['Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI'])
        
        disease = clf.predict(input_df)[0]
        cases = int(reg.predict(input_df)[0])
        
        # Simulated 3-year history for graph
        history = [{"year": str(date_obj.year-i), "cases": max(0, cases + np.random.randint(-15, 15))} for i in range(1, 4)]
        
        stock_map = {
            "Dengue": "Platelets & IV Fluids",
            "Influenza (Flu)": "Antivirals & Paracetamol",
            "Asthma/Respiratory": "Inhalers & Oxygen",
            "Heat Stroke": "Saline & ORS",
            "Normal": "Standard Medical Kits"
        }

        return jsonify({
            "disease": disease,
            "cases": cases,
            "history": history[::-1],
            "weather": f"{int(t)}°C | Humidity: {h}%",
            "stock": stock_map.get(disease, "General Supplies")
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_year', methods=['POST'])
def analyze_year():
    """Generates a full 12-month strategic forecast."""
    try:
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        monthly_report = []
        disease_stats = {}
        meds = {"Paracetamol": 0, "IV Fluids": 0, "Antibiotics": 0, "Inhalers": 0}

        for i, m_name in enumerate(months):
            m_num = i + 1
            day_of_year = (m_num * 30) - 15 
            t, h, r, a = get_weather_context(day_of_year, m_num)
            
            input_df = pd.DataFrame([[day_of_year, m_num, t, h, r, a]], 
                                     columns=['Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI'])
            
            d_pred = clf.predict(input_df)[0]
            daily_c = int(reg.predict(input_df)[0])
            monthly_total = daily_c * 30 
            
            disease_stats[d_pred] = disease_stats.get(d_pred, 0) + monthly_total
            meds["Paracetamol"] += monthly_total * 2
            if d_pred == "Dengue": meds["IV Fluids"] += int(monthly_total * 0.7)
            if "Asthma" in d_pred: meds["Inhalers"] += int(monthly_total * 0.5)

            monthly_report.append({"name": m_name, "patients": monthly_total, "disease": d_pred})

        return jsonify({
            "monthly_data": monthly_report,
            "pie_data": [{"name": k, "value": v} for k, v in disease_stats.items()],
            "medicine": meds,
            "total": sum(d['patients'] for d in monthly_report)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/start_video', methods=['POST'])
def start_video():
    """Triggers the Python OpenCV video system."""
    try:
        subprocess.Popen(['python', 'video_call.py'], shell=True)
        return jsonify({"status": "Video receiver started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 MedCommand Server running on http://localhost:5000")
    app.run(port=5000, debug=True)